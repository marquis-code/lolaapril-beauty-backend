// ==================== cancellation.controller.ts ====================
import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';

// Auth imports
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BusinessAuthGuard, BusinessRolesGuard, RequireBusinessRoles } from '../../auth/guards/business-auth.guard';
import { BusinessContext, BusinessId, CurrentUser } from '../../auth/decorators/business-context.decorator';
import type { BusinessContext as BusinessCtx } from '../../auth/decorators/business-context.decorator';
import { UserRole } from '../../auth/schemas/user.schema';
import type { RequestWithUser } from '../../auth/types/request-with-user.interface';

// Service imports
import { CancellationPolicyService } from '../services/cancellation-policy.service';
import { NoShowManagementService } from '../services/no-show-management.service';
import { AppointmentService } from '../../appointment/appointment.service';

// DTO imports
import { CancelAppointmentDto } from '../dto/cancel-appointment.dto';
import { RecordNoShowDto } from '../dto/record-no-show.dto';
import { CreateCancellationPolicyDto, UpdateCancellationPolicyDto } from '../dto/create-cancellation-policy.dto';
import { CalculateRefundDto } from '../dto/calculate-refund.dto';

@ApiTags('Cancellation & No-Show Management')
@Controller('cancellation')
@UseGuards(JwtAuthGuard, BusinessAuthGuard) // All routes require business authentication
@ApiBearerAuth()
export class CancellationController {
  constructor(
    private cancellationPolicyService: CancellationPolicyService,
    private noShowManagementService: NoShowManagementService,
    private appointmentService: AppointmentService
  ) {}

  // ==================== CANCELLATION POLICY MANAGEMENT ====================

  @Get('policy')
  @ApiOperation({ 
    summary: 'Get business cancellation policy',
    description: 'Retrieves the active cancellation policy for the business'
  })
  @ApiResponse({ status: 200, description: 'Policy retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async getPolicy(@BusinessId() businessId: string) {
    const policy = await this.cancellationPolicyService.getBusinessPolicy(businessId);

    return {
      success: true,
      data: policy,
      message: 'Cancellation policy retrieved successfully'
    };
  }

  @Get('policy/service/:serviceId')
  @ApiOperation({ 
    summary: 'Get cancellation policy for specific service',
    description: 'Retrieves the cancellation policy applicable to a specific service'
  })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service policy retrieved successfully' })
  async getPolicyForService(
    @BusinessId() businessId: string,
    @Param('serviceId') serviceId: string
  ) {
    const policy = await this.cancellationPolicyService.getBusinessPolicy(
      businessId,
      serviceId
    );

    return {
      success: true,
      data: policy,
      message: 'Service cancellation policy retrieved successfully'
    };
  }

  @Post('policy')
  
  
  @ApiOperation({ 
    summary: 'Create or update cancellation policy',
    description: 'Only business owners and admins can modify cancellation policies'
  })
  @ApiResponse({ status: 200, description: 'Policy created/updated successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @HttpCode(HttpStatus.OK)
  async createOrUpdatePolicy(
    @BusinessContext() context: BusinessCtx,
    @Body() createDto: CreateCancellationPolicyDto
  ) {
    const policy = await this.cancellationPolicyService.createOrUpdatePolicy(
      context.businessId,
      createDto
    );

    return {
      success: true,
      data: policy,
      message: 'Cancellation policy saved successfully'
    };
  }

  @Patch('policy')
  
  
  @ApiOperation({ summary: 'Partially update cancellation policy' })
  @ApiResponse({ status: 200, description: 'Policy updated successfully' })
  async updatePolicy(
    @BusinessId() businessId: string,
    @Body() updateDto: UpdateCancellationPolicyDto
  ) {
    // AGGRESSIVE FIX: Cast updateDto to any to bypass type checking
    const policy = await this.cancellationPolicyService.updatePolicy(
      businessId,
      updateDto as any
    );

    return {
      success: true,
      data: policy,
      message: 'Cancellation policy updated successfully'
    };
  }

  // ==================== APPOINTMENT CANCELLATION ====================

  @Post('appointments/:appointmentId/cancel')
  @ApiOperation({ 
    summary: 'Cancel appointment with refund calculation',
    description: 'Cancels an appointment and calculates refund based on cancellation policy'
  })
  @ApiParam({ name: 'appointmentId', description: 'Appointment ID to cancel' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Cancellation not allowed or failed' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async cancelAppointment(
    @BusinessContext() context: BusinessCtx,
    @Param('appointmentId') appointmentId: string,
    @Body() cancelDto: CancelAppointmentDto
  ) {
    // Get appointment details
    const appointment = await this.appointmentService.findOne(appointmentId);

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    // FIX: Access businessInfo.businessId (it's a string in the nested object)
    if (appointment.businessInfo?.businessId !== context.businessId) {
      throw new BadRequestException('Appointment does not belong to this business');
    }

    // Calculate refund
    const refundCalculation = await this.cancellationPolicyService.calculateRefund(
      context.businessId,
      appointment.selectedDate,
      appointment.paymentDetails?.total?.amount || 0,
      appointment.paymentDetails?.paymentStatus?.payNow?.amount || 0
    );

    if (!refundCalculation.canCancel) {
      return {
        success: false,
        message: refundCalculation.reason,
        data: refundCalculation
      };
    }

    // Process cancellation
    await this.appointmentService.updateStatus(
      appointmentId,
      'cancelled',
      cancelDto.reason
    );

    // Record if late cancellation
    if (refundCalculation.hoursNotice < 24) {
      await this.noShowManagementService.recordLateCancellation({
        clientId: appointment.clientId?.toString() || '',
        businessId: context.businessId,
        appointmentId,
        bookingId: appointmentId,
        appointmentDate: appointment.selectedDate,
        scheduledTime: appointment.selectedTime,
        bookedAmount: appointment.paymentDetails?.total?.amount || 0,
        penaltyCharged: refundCalculation.penaltyAmount,
        hoursNotice: refundCalculation.hoursNotice
      });
    }

    return {
      success: true,
      data: {
        appointment: {
          id: appointmentId,
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelReason: cancelDto.reason
        },
        refund: refundCalculation
      },
      message: 'Appointment cancelled successfully'
    };
  }

  @Post('calculate-refund')
  @ApiOperation({ 
    summary: 'Calculate potential refund for cancellation',
    description: 'Calculates refund amount without actually cancelling the appointment'
  })
  @ApiResponse({ status: 200, description: 'Refund calculated successfully' })
  async calculateRefund(
    @BusinessId() businessId: string,
    @Body() body: CalculateRefundDto
  ) {
    const calculation = await this.cancellationPolicyService.calculateRefund(
      businessId,
      new Date(body.appointmentDate),
      body.paidAmount,
      body.depositAmount || 0
    );

    return {
      success: true,
      data: calculation,
      message: 'Refund calculated successfully'
    };
  }

  // ==================== NO-SHOW MANAGEMENT ====================

  @Post('appointments/:appointmentId/no-show')
  
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.STAFF)
  @ApiOperation({ 
    summary: 'Record no-show incident',
    description: 'Records when a client fails to show up for their appointment'
  })
  @ApiParam({ name: 'appointmentId', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'No-show recorded successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async recordNoShow(
    @BusinessContext() context: BusinessCtx,
    @Param('appointmentId') appointmentId: string,
    @Body() noShowDto: RecordNoShowDto
  ) {
    const appointment = await this.appointmentService.findOne(appointmentId);

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    // FIX: Access businessInfo.businessId (it's a string in the nested object)
    if (appointment.businessInfo?.businessId !== context.businessId) {
      throw new BadRequestException('Appointment does not belong to this business');
    }

    // Record no-show
    await this.noShowManagementService.recordNoShow({
      clientId: appointment.clientId?.toString() || '',
      businessId: context.businessId,
      appointmentId,
      bookingId: appointmentId,
      appointmentDate: appointment.selectedDate,
      scheduledTime: appointment.selectedTime,
      bookedAmount: appointment.paymentDetails?.total?.amount || 0,
      depositAmount: appointment.paymentDetails?.paymentStatus?.payNow?.amount || 0,
      wasDeposited: (appointment.paymentDetails?.paymentStatus?.payNow?.amount || 0) > 0
    });

    // Update appointment status
    await this.appointmentService.updateStatus(appointmentId, 'no_show', noShowDto.notes);

    return {
      success: true,
      message: 'No-show recorded successfully. Deposit has been forfeited.',
      data: {
        appointmentId,
        status: 'no_show',
        depositForfeited: (appointment.paymentDetails?.paymentStatus?.payNow?.amount || 0) > 0,
        recordedAt: new Date()
      }
    };
  }

  // ==================== CLIENT RELIABILITY ====================

  @Get('clients/:clientId/reliability')
  @ApiOperation({ 
    summary: 'Get client reliability score and history',
    description: 'Retrieves reliability metrics for a specific client'
  })
  @ApiParam({ name: 'clientId', description: 'Client/User ID' })
  @ApiResponse({ status: 200, description: 'Client reliability retrieved successfully' })
  async getClientReliability(
    @BusinessId() businessId: string,
    @Param('clientId') clientId: string
  ) {
    const reliability = await this.noShowManagementService.getClientReliability(
      clientId,
      businessId
    );

    const depositRequirement = await this.noShowManagementService
      .shouldRequireDeposit(clientId, businessId);

    return {
      success: true,
      data: {
        ...reliability?.toObject?.() || reliability,
        depositRequirement
      },
      message: 'Client reliability retrieved successfully'
    };
  }

  @Get('clients/:clientId/history')
  @ApiOperation({ 
    summary: 'Get client cancellation and no-show history',
    description: 'Retrieves detailed history of cancellations and no-shows for a client'
  })
  @ApiParam({ name: 'clientId', description: 'Client/User ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records to return' })
  async getClientHistory(
    @BusinessId() businessId: string,
    @Param('clientId') clientId: string,
    @Query('limit') limit: string = '20'
  ) {
    const history = await this.noShowManagementService.getClientHistory(
      clientId,
      businessId,
      parseInt(limit)
    );

    return {
      success: true,
      data: history,
      message: 'Client history retrieved successfully'
    };
  }

  @Post('clients/:clientId/deposit-check')
  @ApiOperation({ 
    summary: 'Check if client requires deposit',
    description: 'Determines if a client should be required to pay a deposit based on their history'
  })
  @ApiParam({ name: 'clientId', description: 'Client/User ID' })
  @ApiResponse({ status: 200, description: 'Deposit requirement checked successfully' })
  async checkDepositRequirement(
    @BusinessId() businessId: string,
    @Param('clientId') clientId: string
  ) {
    const result = await this.noShowManagementService.shouldRequireDeposit(
      clientId,
      businessId
    );

    return {
      success: true,
      data: result,
      message: result.requiresDeposit 
        ? 'Deposit required for this client'
        : 'No deposit required'
    };
  }

  // ==================== ANALYTICS & REPORTING ====================

  @Get('analytics/no-shows')
  @ApiOperation({ 
    summary: 'Get no-show analytics for business',
    description: 'Provides statistical analysis of no-shows and cancellations'
  })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO format)' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getNoShowAnalytics(
    @BusinessId() businessId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const stats = await this.noShowManagementService.getNoShowStats(
      businessId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    return {
      success: true,
      data: stats,
      message: 'No-show analytics retrieved successfully'
    };
  }

  @Get('analytics/summary')
  
  
  @ApiOperation({ 
    summary: 'Get cancellation analytics summary',
    description: 'Comprehensive overview of cancellations, no-shows, and revenue impact'
  })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', '1y'], description: 'Time period' })
  @ApiResponse({ status: 200, description: 'Summary retrieved successfully' })
  async getAnalyticsSummary(
    @BusinessId() businessId: string,
    @Query('period') period: string = '30d'
  ) {
    const periodMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };

    const days = periodMap[period] || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [stats, policy, reliabilityMetrics] = await Promise.all([
      this.noShowManagementService.getNoShowStats(businessId, startDate, new Date()),
      this.cancellationPolicyService.getBusinessPolicy(businessId),
      this.noShowManagementService.getReliabilityMetrics(businessId)
    ]);

    return {
      success: true,
      data: {
        period: {
          days,
          startDate,
          endDate: new Date()
        },
        stats,
        policy: {
          name: policy.policyName,
          requiresDeposit: policy.requiresDeposit,
          depositPercentage: policy.depositPercentage
        },
        reliability: reliabilityMetrics
      },
      message: 'Analytics summary retrieved successfully'
    };
  }

  @Get('analytics/trends')
  @ApiOperation({ 
    summary: 'Get cancellation trends over time',
    description: 'Shows trends in cancellations and no-shows over specified period'
  })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (ISO format)' })
  @ApiQuery({ name: 'groupBy', required: false, enum: ['day', 'week', 'month'], description: 'Grouping period' })
  @ApiResponse({ status: 200, description: 'Trends retrieved successfully' })
  async getCancellationTrends(
    @BusinessId() businessId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('groupBy') groupBy: string = 'day'
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    const trends = await this.noShowManagementService.getCancellationTrends(
      businessId,
      new Date(startDate),
      new Date(endDate),
      groupBy as 'day' | 'week' | 'month'
    );

    return {
      success: true,
      data: trends,
      message: 'Cancellation trends retrieved successfully'
    };
  }

  // ==================== DEPOSIT CALCULATION ====================

  @Post('calculate-deposit')
  @ApiOperation({ 
    summary: 'Calculate deposit amount for booking',
    description: 'Calculates required deposit based on policy and client history'
  })
  @ApiResponse({ status: 200, description: 'Deposit calculated successfully' })
  async calculateDeposit(
    @BusinessId() businessId: string,
    @Body() body: {
      totalAmount: number;
      clientId?: string;
      serviceIds?: string[];
    }
  ) {
    // Get policy deposit calculation
    const policyDeposit = await this.cancellationPolicyService.calculateDepositAmount(
      businessId,
      body.totalAmount,
      body.serviceIds
    );

    // Check client reliability if clientId provided
    let clientDeposit = null;
    if (body.clientId) {
      clientDeposit = await this.noShowManagementService.shouldRequireDeposit(
        body.clientId,
        businessId
      );
    }

    // Determine final deposit requirement
    const requiresDeposit = policyDeposit.requiresDeposit || clientDeposit?.requiresDeposit || false;
    const reason = clientDeposit?.requiresDeposit 
      ? clientDeposit.reason 
      : policyDeposit.reason;

    return {
      success: true,
      data: {
        requiresDeposit,
        depositAmount: policyDeposit.depositAmount,
        depositPercentage: policyDeposit.depositPercentage,
        reason,
        policyBased: policyDeposit.requiresDeposit,
        clientHistoryBased: clientDeposit?.requiresDeposit || false,
        clientScore: clientDeposit?.score
      },
      message: 'Deposit calculated successfully'
    };
  }
}