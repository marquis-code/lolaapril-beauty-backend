import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { TenantGuard } from '../../tenant/guards/tenant.guard'
import { CancellationPolicyService } from '../services/cancellation-policy.service'
import { NoShowManagementService } from '../services/no-show-management.service'
import { AppointmentService } from '../../appointment/appointment.service'
import { CancelAppointmentDto } from '../dto/cancel-appointment.dto'
import { RecordNoShowDto } from '../dto/record-no-show.dto'
import { CreateCancellationPolicyDto } from '../dto/create-cancellation-policy.dto'

@ApiTags('Cancellation')
@Controller('cancellation')
@UseGuards(TenantGuard)
export class CancellationController {
  constructor(
    private cancellationPolicyService: CancellationPolicyService,
    private noShowManagementService: NoShowManagementService,
    private appointmentService: AppointmentService
  ) {}

  @Get('policy')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get business cancellation policy' })
  async getPolicy(@Request() req: any) {
    try {
      const businessId = req.tenant.businessId
      const policy = await this.cancellationPolicyService.getBusinessPolicy(businessId)

      return {
        success: true,
        data: policy,
        message: 'Cancellation policy retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve cancellation policy'
      }
    }
  }

  @Post('policy')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create or update cancellation policy' })
  async createOrUpdatePolicy(
    @Body() createDto: CreateCancellationPolicyDto,
    @Request() req: any
  ) {
    try {
      const businessId = req.tenant.businessId
      
      const policy = await this.cancellationPolicyService.createOrUpdatePolicy(
        businessId,
        createDto
      )

      return {
        success: true,
        data: policy,
        message: 'Cancellation policy created/updated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create/update cancellation policy'
      }
    }
  }

  @Post('appointments/:appointmentId/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel appointment with refund calculation' })
  async cancelAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() cancelDto: CancelAppointmentDto,
    @Request() req: any
  ) {
    try {
      const businessId = req.tenant.businessId
      const userId = req.user.id

      // Get appointment details
      const appointment = await this.appointmentService.findOne(appointmentId)

      // Calculate refund
      const refundCalculation = await this.cancellationPolicyService.calculateRefund(
        businessId,
        appointment.selectedDate,
        appointment.paymentDetails.total.amount,
        appointment.paymentDetails.paymentStatus?.payNow?.amount || 0
      )

      if (!refundCalculation.canCancel) {
        return {
          success: false,
          message: refundCalculation.reason,
          data: refundCalculation
        }
      }

      // Process cancellation
      await this.appointmentService.updateStatus(
        appointmentId,
        'cancelled',
        cancelDto.reason
      )

      // Record if late cancellation
      if (refundCalculation.hoursNotice < 24) {
        await this.noShowManagementService.recordLateCancellation({
          clientId: appointment.clientId.toString(), // FIX 1: Convert ObjectId to string
          businessId,
          appointmentId,
          bookingId: appointmentId, // FIX 2: Use appointmentId directly
          appointmentDate: appointment.selectedDate,
          scheduledTime: appointment.selectedTime,
          bookedAmount: appointment.paymentDetails.total.amount,
          penaltyCharged: refundCalculation.penaltyAmount,
          hoursNotice: refundCalculation.hoursNotice
        })
      }

      return {
        success: true,
        data: {
          appointment,
          refund: refundCalculation
        },
        message: 'Appointment cancelled successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to cancel appointment'
      }
    }
  }

  @Post('appointments/:appointmentId/no-show')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Record no-show incident' })
  async recordNoShow(
    @Param('appointmentId') appointmentId: string,
    @Body() noShowDto: RecordNoShowDto,
    @Request() req: any
  ) {
    try {
      const businessId = req.tenant.businessId

      const appointment = await this.appointmentService.findOne(appointmentId)

      // Record no-show
      await this.noShowManagementService.recordNoShow({
        clientId: appointment.clientId.toString(), // FIX 1: Convert ObjectId to string
        businessId,
        appointmentId,
        bookingId: appointmentId, // FIX 2: Use appointmentId directly
        appointmentDate: appointment.selectedDate,
        scheduledTime: appointment.selectedTime,
        bookedAmount: appointment.paymentDetails.total.amount,
        depositAmount: appointment.paymentDetails.paymentStatus?.payNow?.amount || 0,
        wasDeposited: (appointment.paymentDetails.paymentStatus?.payNow?.amount || 0) > 0
      })

      // Update appointment status
      await this.appointmentService.updateStatus(appointmentId, 'no_show')

      return {
        success: true,
        message: 'No-show recorded successfully. Deposit has been forfeited.'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to record no-show'
      }
    }
  }

  @Get('clients/:clientId/reliability')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get client reliability score' })
  async getClientReliability(
    @Param('clientId') clientId: string,
    @Request() req: any
  ): Promise<any> {
    try {
      const businessId = req.tenant.businessId

      const reliability = await this.noShowManagementService.getClientReliability(
        clientId,
        businessId
      )

      const depositRequirement = await this.noShowManagementService
        .shouldRequireDeposit(clientId, businessId)

      return {
        success: true,
        data: {
          ...reliability,
          depositRequirement
        },
        message: 'Client reliability retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve client reliability'
      }
    }
  }

  @Get('analytics/no-shows')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get no-show analytics for business' })
  async getNoShowAnalytics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req: any
  ) {
    try {
      const businessId = req.tenant.businessId

      const stats = await this.noShowManagementService.getNoShowStats(
        businessId,
        new Date(startDate),
        new Date(endDate)
      )

      return {
        success: true,
        data: stats,
        message: 'No-show analytics retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve no-show analytics'
      }
    }
  }

  @Post('calculate-refund')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Calculate potential refund for cancellation' })
  async calculateRefund(
    @Body() body: {
      appointmentDate: string
      paidAmount: number
      depositAmount?: number
    },
    @Request() req: any
  ) {
    try {
      const businessId = req.tenant.businessId

      const calculation = await this.cancellationPolicyService.calculateRefund(
        businessId,
        new Date(body.appointmentDate),
        body.paidAmount,
        body.depositAmount || 0
      )

      return {
        success: true,
        data: calculation,
        message: 'Refund calculated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to calculate refund'
      }
    }
  }
}