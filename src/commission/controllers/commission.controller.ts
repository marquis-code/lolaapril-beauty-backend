// // ============================================================================
// // 6. COMMISSION CONTROLLER
// // src/commission/controllers/commission.controller.ts
// // ============================================================================

// import { 
//   Controller, 
//   Post, 
//   Get, 
//   Put, 
//   Body, 
//   Param, 
//   Query, 
//   UseGuards,
//   Request,
//   HttpStatus,
//   HttpCode
// } from '@nestjs/common'
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
// import { TenantGuard } from '../../tenant/guards/tenant.guard'
// import { CommissionCalculatorService } from '../services/commission-calculator.service'
// import { SourceTrackingService } from '../services/source-tracking.service'
// import { CreateTrackingCodeDto } from '../dto/create-tracking-code.dto'
// import { DisputeCommissionDto } from '../dto/dispute-commission.dto'
// import { GetCommissionsDto } from '../dto/get-commissions.dto'

// @ApiTags('Commission')
// @Controller('commission')
// @UseGuards(TenantGuard)
// export class CommissionController {
//   constructor(
//     private commissionCalculatorService: CommissionCalculatorService,
//     private sourceTrackingService: SourceTrackingService
//   ) {}

//   @Post('tracking-codes')
//   @UseGuards(JwtAuthGuard)
//   @ApiOperation({ summary: 'Generate tracking code for marketing channel' })
//   @HttpCode(HttpStatus.CREATED)
//   async createTrackingCode(
//     @Body() createDto: CreateTrackingCodeDto,
//     @Request() req: any
//   ) {
//     try {
//       const businessId = req.tenant.businessId

//       const code = await this.sourceTrackingService.generateTrackingCode(
//         businessId,
//         createDto.codeType,
//         createDto.name,
//         {
//           description: createDto.description,
//           expiresAt: createDto.expiresAt
//         }
//       )

//       const trackingUrl = `${process.env.APP_URL}/book/${businessId}?track=${code}`
//       const qrCodeUrl = createDto.codeType === 'qr_code' 
//         ? `${process.env.APP_URL}/api/qr/${code}`
//         : null

//       return {
//         success: true,
//         data: {
//           code,
//           trackingUrl,
//           qrCodeUrl,
//           name: createDto.name,
//           codeType: createDto.codeType
//         },
//         message: 'Tracking code generated successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to generate tracking code'
//       }
//     }
//   }

//   @Get('tracking-codes')
//   @UseGuards(JwtAuthGuard)
//   @ApiOperation({ summary: 'Get all tracking codes for business' })
//   async getTrackingCodes(@Request() req: any) {
//     try {
//       const businessId = req.tenant.businessId

//       const analytics = await this.sourceTrackingService.getTrackingAnalytics(
//         businessId
//       )

//       return {
//         success: true,
//         data: analytics,
//         message: 'Tracking codes retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to retrieve tracking codes'
//       }
//     }
//   }

//   @Get('tracking-codes/:code/validate')
//   @ApiOperation({ summary: 'Validate tracking code' })
//   async validateTrackingCode(@Param('code') code: string) {
//     try {
//       const result = await this.sourceTrackingService.resolveTrackingCode(code)

//       return {
//         success: result.isValid,
//         data: result,
//         message: result.isValid 
//           ? 'Tracking code is valid' 
//           : 'Invalid or expired tracking code'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to validate tracking code'
//       }
//     }
//   }

//   @Get('bookings/:bookingId')
//   @UseGuards(JwtAuthGuard)
//   @ApiOperation({ summary: 'Get commission details for booking' })
//   async getBookingCommission(
//     @Param('bookingId') bookingId: string,
//     @Request() req: any
//   ) {
//     try {
//       const commission = await this.commissionCalculatorService
//         .getCommissionByBooking(bookingId)

//       if (!commission) {
//         return {
//           success: false,
//           message: 'Commission record not found for this booking'
//         }
//       }

//       return {
//         success: true,
//         data: commission,
//         message: 'Commission details retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to retrieve commission details'
//       }
//     }
//   }

//   @Get('business/summary')
//   @UseGuards(JwtAuthGuard)
//   @ApiOperation({ summary: 'Get commission summary for business' })
//   async getCommissionSummary(
//     @Query() query: GetCommissionsDto,
//     @Request() req: any
//   ) {
//     try {
//       const businessId = req.tenant.businessId

//       const summary = await this.commissionCalculatorService
//         .getBusinessCommissionSummary(
//           businessId,
//           query.startDate ? new Date(query.startDate) : undefined,
//           query.endDate ? new Date(query.endDate) : undefined
//         )

//       return {
//         success: true,
//         data: summary,
//         message: 'Commission summary retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to retrieve commission summary'
//       }
//     }
//   }

//   @Post(':commissionId/dispute')
//   @UseGuards(JwtAuthGuard)
//   @ApiOperation({ summary: 'Dispute a commission charge' })
//   async disputeCommission(
//     @Param('commissionId') commissionId: string,
//     @Body() disputeDto: DisputeCommissionDto
//   ) {
//     try {
//       await this.commissionCalculatorService.disputeCommission(
//         commissionId,
//         disputeDto.reason,
//         disputeDto.disputedBy
//       )

//       return {
//         success: true,
//         message: 'Commission dispute submitted successfully. Our team will review it.'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to submit commission dispute'
//       }
//     }
//   }

//   @Get('analytics/source-breakdown')
//   @UseGuards(JwtAuthGuard)
//   @ApiOperation({ summary: 'Get booking source breakdown with commission impact' })
//   async getSourceBreakdown(
//     @Query('startDate') startDate: string,
//     @Query('endDate') endDate: string,
//     @Request() req: any
//   ) {
//     try {
//       const businessId = req.tenant.businessId

//       const breakdown = await this.commissionCalculatorService
//         .getSourceBreakdown(
//           businessId,
//           new Date(startDate),
//           new Date(endDate)
//         )

//       return {
//         success: true,
//         data: breakdown,
//         message: 'Source breakdown retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to retrieve source breakdown'
//       }
//     }
//   }
// }


// src/modules/commission/controllers/commission.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  HttpStatus,
  HttpCode
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard, BusinessId } from '../../auth'
import { CommissionCalculatorService } from '../services/commission-calculator.service'
import { SourceTrackingService } from '../services/source-tracking.service'
import { CreateTrackingCodeDto } from '../dto/create-tracking-code.dto'
import { DisputeCommissionDto } from '../dto/dispute-commission.dto'
import { GetCommissionsDto } from '../dto/get-commissions.dto'

@ApiTags('Commission')
@Controller('commission')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommissionController {
  constructor(
    private commissionCalculatorService: CommissionCalculatorService,
    private sourceTrackingService: SourceTrackingService
  ) {}

  @Post('tracking-codes')
  @ApiOperation({ summary: 'Generate tracking code for marketing channel' })
  @HttpCode(HttpStatus.CREATED)
  async createTrackingCode(
    @Body() createDto: CreateTrackingCodeDto,
    @BusinessId() businessId: string
  ) {
    try {
      const code = await this.sourceTrackingService.generateTrackingCode(
        businessId,
        createDto.codeType,
        createDto.name,
        {
          description: createDto.description,
          expiresAt: createDto.expiresAt
        }
      )

      const trackingUrl = `${process.env.APP_URL}/book/${businessId}?track=${code}`
      const qrCodeUrl = createDto.codeType === 'qr_code' 
        ? `${process.env.APP_URL}/api/qr/${code}`
        : null

      return {
        success: true,
        data: {
          code,
          trackingUrl,
          qrCodeUrl,
          name: createDto.name,
          codeType: createDto.codeType
        },
        message: 'Tracking code generated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to generate tracking code'
      }
    }
  }

  @Get('tracking-codes')
  @ApiOperation({ summary: 'Get all tracking codes for business' })
  async getTrackingCodes(@BusinessId() businessId: string) {
    try {
      const analytics = await this.sourceTrackingService.getTrackingAnalytics(
        businessId
      )

      return {
        success: true,
        data: analytics,
        message: 'Tracking codes retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve tracking codes'
      }
    }
  }

  @Get('tracking-codes/:code/validate')
  @ApiOperation({ summary: 'Validate tracking code' })
  async validateTrackingCode(@Param('code') code: string) {
    try {
      const result = await this.sourceTrackingService.resolveTrackingCode(code)

      return {
        success: result.isValid,
        data: result,
        message: result.isValid 
          ? 'Tracking code is valid' 
          : 'Invalid or expired tracking code'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to validate tracking code'
      }
    }
  }

  @Get('bookings/:bookingId')
  @ApiOperation({ summary: 'Get commission details for booking' })
  async getBookingCommission(
    @Param('bookingId') bookingId: string,
    @BusinessId() businessId: string
  ) {
    try {
      const commission = await this.commissionCalculatorService
        .getCommissionByBooking(bookingId)

      if (!commission) {
        return {
          success: false,
          message: 'Commission record not found for this booking'
        }
      }

      // Verify commission belongs to the business
      if (commission.businessId.toString() !== businessId) {
        return {
          success: false,
          message: 'Unauthorized access to commission record'
        }
      }

      return {
        success: true,
        data: commission,
        message: 'Commission details retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve commission details'
      }
    }
  }

  @Get('business/summary')
  @ApiOperation({ summary: 'Get commission summary for business' })
  async getCommissionSummary(
    @Query() query: GetCommissionsDto,
    @BusinessId() businessId: string
  ) {
    try {
      const summary = await this.commissionCalculatorService
        .getBusinessCommissionSummary(
          businessId,
          query.startDate ? new Date(query.startDate) : undefined,
          query.endDate ? new Date(query.endDate) : undefined
        )

      return {
        success: true,
        data: summary,
        message: 'Commission summary retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve commission summary'
      }
    }
  }

  @Post(':commissionId/dispute')
  @ApiOperation({ summary: 'Dispute a commission charge' })
  async disputeCommission(
    @Param('commissionId') commissionId: string,
    @Body() disputeDto: DisputeCommissionDto,
    @BusinessId() businessId: string
  ) {
    try {
      // Verify commission belongs to the business
      const commission = await this.commissionCalculatorService
        .getCommissionByBooking(commissionId)

      if (commission && commission.businessId.toString() !== businessId) {
        return {
          success: false,
          message: 'Unauthorized access to commission record'
        }
      }

      await this.commissionCalculatorService.disputeCommission(
        commissionId,
        disputeDto.reason,
        disputeDto.disputedBy
      )

      return {
        success: true,
        message: 'Commission dispute submitted successfully. Our team will review it.'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to submit commission dispute'
      }
    }
  }

  @Get('analytics/source-breakdown')
  @ApiOperation({ summary: 'Get booking source breakdown with commission impact' })
  async getSourceBreakdown(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @BusinessId() businessId: string
  ) {
    try {
      const breakdown = await this.commissionCalculatorService
        .getSourceBreakdown(
          businessId,
          new Date(startDate),
          new Date(endDate)
        )

      return {
        success: true,
        data: breakdown,
        message: 'Source breakdown retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve source breakdown'
      }
    }
  }
}