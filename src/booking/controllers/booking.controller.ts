// // src/modules/booking/controllers/booking.controller.ts
// import { 
//   Controller, 
//   Post, 
//   Get, 
//   Put, 
//   Body, 
//   Param, 
//   Query, 
//   UseGuards, 
//   ValidationPipe,
//   Request,
//   HttpStatus,
//   HttpCode
// } from '@nestjs/common'
// import { BookingOrchestrator } from '../services/booking-orchestrator.service'
// import { BookingService } from '../services/booking.service'
// import { CreateBookingDto } from '../dto/create-booking.dto'
// import { ProcessPaymentDto } from '../dto/process-payment.dto'
// import { UpdateBookingStatusDto } from '../dto/update-booking.dto'
// import { GetBookingsDto } from '../dto/get-bookings.dto'
// import { TenantGuard } from '../../tenant/guards/tenant.guard'
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
// import { 
//   BookingResult, 
//   PaymentResult, 
//   AppointmentResult, 
//   BookingResponse 
// } from '../types/booking.types'
// import { BookingSourceType } from '../dto/create-booking-with-source.dto'

// @Controller('bookings')
// @UseGuards(TenantGuard)
// export class BookingController {
//   constructor(
//     private readonly bookingOrchestrator: BookingOrchestrator,
//     private readonly bookingService: BookingService,
//   ) {}

//   // MAIN AUTOMATED BOOKING ENDPOINT
//   @Post('create')
//   @UseGuards(JwtAuthGuard)
//   @HttpCode(HttpStatus.CREATED)
//   async createAutomatedBooking(
//     @Body(ValidationPipe) createBookingDto: CreateBookingDto,
//     @Request() req: any
//   ): Promise<BookingResponse<BookingResult>> {
//     try {
//       // Get business ID from tenant middleware
//       const businessId = req.tenant.businessId
      
//       // FIX: Simply pass the DTO with businessId - orchestrator will normalize bookingSource
//       const bookingData: any = {
//         ...createBookingDto,
//         businessId
//       }

//       // If no bookingSource exists at all, create a minimal one
//       if (!bookingData.bookingSource) {
//         bookingData.bookingSource = {
//           sourceType: BookingSourceType.DIRECT_LINK
//         }
//       }

//       const result = await this.bookingOrchestrator.createBookingWithValidation(bookingData)

//       return {
//         success: true,
//         data: result,
//         message: result.message || 'Booking created successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         code: 'BOOKING_CREATION_FAILED',
//         message: 'Failed to create booking'
//       }
//     }
//   }

//   // MAIN AUTOMATED PAYMENT PROCESSING ENDPOINT
//   @Post('process-payment')
//   @HttpCode(HttpStatus.OK)
//   async processPaymentAndCreateAppointment(
//     @Body(ValidationPipe) processPaymentDto: ProcessPaymentDto
//   ): Promise<BookingResponse<PaymentResult>> {
//     try {
//       // This is the key automation endpoint - payment triggers appointment creation
//       const result = await this.bookingOrchestrator.handlePaymentAndComplete(
//         processPaymentDto.bookingId, // Note: using bookingId, not appointmentId
//         processPaymentDto.transactionReference,
//         {
//           amount: processPaymentDto.amount,
//           method: processPaymentDto.paymentMethod,
//           gateway: processPaymentDto.gateway,
//           clientId: processPaymentDto.clientId,
//           businessId: processPaymentDto.businessId
//         }
//       )

//       return {
//         success: true,
//         data: result,
//         message: 'Payment successful! Your appointment has been confirmed automatically.'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         code: 'PAYMENT_PROCESSING_FAILED',
//         message: 'Payment processing failed'
//       }
//     }
//   }

//   // MANUAL CONFIRMATION (for staff use)
//   @Post(':bookingId/confirm')
//   @UseGuards(JwtAuthGuard)
//   async confirmBookingManually(
//     @Param('bookingId') bookingId: string,
//     @Body('staffId') staffId: string,
//     @Request() req: any
//   ): Promise<BookingResponse<AppointmentResult>> {
//     try {
//       const confirmedBy = req.user.id
      
//       const result = await this.bookingOrchestrator.confirmBookingAndCreateAppointment(
//         bookingId,
//         confirmedBy
//       )

//       return {
//         success: true,
//         data: result,
//         message: 'Booking confirmed and appointment created successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         code: 'BOOKING_CONFIRMATION_FAILED',
//         message: 'Failed to confirm booking'
//       }
//     }
//   }

//   @Get()
//   @UseGuards(JwtAuthGuard)
//   async getBookings(
//     @Query(ValidationPipe) getBookingsDto: GetBookingsDto,
//     @Request() req: any
//   ): Promise<BookingResponse<any>> {
//     try {
//       const businessId = req.tenant.businessId
      
//       const bookings = await this.bookingService.getBookings({
//         ...getBookingsDto,
//         businessId
//       })

//       return {
//         success: true,
//         data: bookings,
//         message: 'Bookings retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         code: 'BOOKINGS_RETRIEVAL_FAILED',
//         message: 'Failed to retrieve bookings'
//       }
//     }
//   }

//   @Get(':bookingId')
//   async getBookingById(@Param('bookingId') bookingId: string): Promise<BookingResponse<any>> {
//     try {
//       const booking = await this.bookingService.getBookingById(bookingId)

//       return {
//         success: true,
//         data: booking,
//         message: 'Booking retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         code: 'BOOKING_NOT_FOUND',
//         message: 'Booking not found'
//       }
//     }
//   }

//   @Put(':bookingId/status')
//   @UseGuards(JwtAuthGuard)
//   async updateBookingStatus(
//     @Param('bookingId') bookingId: string,
//     @Body(ValidationPipe) updateStatusDto: UpdateBookingStatusDto
//   ): Promise<BookingResponse<any>> {
//     try {
//       const booking = await this.bookingService.updateBookingStatus(
//         bookingId,
//         updateStatusDto.status,
//         updateStatusDto.updatedBy,
//         updateStatusDto.reason
//       )

//       return {
//         success: true,
//         data: booking,
//         message: 'Booking status updated successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         code: 'STATUS_UPDATE_FAILED',
//         message: 'Failed to update booking status'
//       }
//     }
//   }

//   @Post(':bookingId/cancel')
//   @UseGuards(JwtAuthGuard)
//   async cancelBooking(
//     @Param('bookingId') bookingId: string,
//     @Body('reason') reason: string,
//     @Request() req: any
//   ): Promise<BookingResponse<void>> {
//     try {
//       const userId = req.user.id
      
//       await this.bookingService.cancelBooking(bookingId, reason, userId)

//       return {
//         success: true,
//         message: 'Booking cancelled successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         code: 'BOOKING_CANCELLATION_FAILED',
//         message: 'Failed to cancel booking'
//       }
//     }
//   }

//   @Get('client/:clientId')
//   @UseGuards(JwtAuthGuard)
//   async getClientBookings(
//     @Param('clientId') clientId: string,
//     @Query('status') status?: string
//   ): Promise<BookingResponse<any>> {
//     try {
//       const bookings = await this.bookingService.getClientBookings(clientId, status)

//       return {
//         success: true,
//         data: bookings,
//         message: 'Client bookings retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         code: 'CLIENT_BOOKINGS_RETRIEVAL_FAILED',
//         message: 'Failed to retrieve client bookings'
//       }
//     }
//   }

//   @Get('business/today')
//   @UseGuards(JwtAuthGuard)
//   async getTodayBookings(@Request() req: any): Promise<BookingResponse<any>> {
//     try {
//       const businessId = req.tenant.businessId
//       const bookings = await this.bookingService.getTodayBookings(businessId)

//       return {
//         success: true,
//         data: bookings,
//         message: 'Today\'s bookings retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         code: 'TODAY_BOOKINGS_RETRIEVAL_FAILED',
//         message: 'Failed to retrieve today\'s bookings'
//       }
//     }
//   }

//   @Post(':bookingId/reject')
//   @UseGuards(JwtAuthGuard)
//   async rejectBooking(
//     @Param('bookingId') bookingId: string,
//     @Body('reason') reason: string,
//     @Request() req: any
//   ): Promise<BookingResponse<void>> {
//     try {
//       const rejectedBy = req.user.id
      
//       await this.bookingService.rejectBooking(bookingId, reason, rejectedBy)

//       return {
//         success: true,
//         message: 'Booking rejected successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         code: 'BOOKING_REJECTION_FAILED',
//         message: 'Failed to reject booking'
//       }
//     }
//   }
// }
// src/modules/booking/controllers/booking.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { BookingService } from '../services/booking.service'
import { BookingOrchestrator } from '../services/booking-orchestrator.service'
import { CreateBookingWithSourceDto } from '../dto/create-booking-with-source.dto'
import { GetBookingsDto } from '../dto/get-bookings.dto'
import { ConfirmBookingDto } from '../dto/confirm-booking.dto'
import { ProcessPaymentDto } from '../dto/process-payment.dto'
import { UpdateBookingStatusDto } from '../dto/update-booking.dto'

// Import from auth module
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { BusinessRolesGuard, RequireBusinessRoles } from '../../auth/guards/business-auth.guard'
import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard'
import { BusinessContext, BusinessId, CurrentUser } from '../../auth/decorators/business-context.decorator'
import { UserRole } from '../../auth/schemas/user.schema'
import type { BusinessContext as BusinessCtx } from '../../auth/decorators/business-context.decorator'
import type { RequestWithUser } from '../../auth/types/request-with-user.interface'

// FIX: Import the result types from orchestrator
import type { 
  BookingResult, 
  PaymentResult, 
  AppointmentResult 
} from '../types/booking.types'

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingOrchestrator: BookingOrchestrator
  ) {}

  // ==========================================================================
  // CREATE BOOKING - Public (Anyone can create a booking)
  // ==========================================================================

  @Post()
  @ApiOperation({ 
    summary: 'Create a new booking (Public)',
    description: 'Creates a booking for any business. businessId must be provided in the request body.'
  })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid booking data' })
  async createBooking(
    @Body(ValidationPipe) createBookingDto: CreateBookingWithSourceDto
  ): Promise<BookingResult> {
    // For public booking creation, businessId comes from the request body
    return this.bookingOrchestrator.createBookingWithValidation(createBookingDto)
  }

  // ==========================================================================
  // GET ALL BOOKINGS - Business Filtered
  // ==========================================================================

  @Get()
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get all bookings for authenticated business',
    description: 'Returns bookings filtered by the business in the JWT token'
  })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async getBookings(
    @BusinessId() businessId: string,
    @Query() query: GetBookingsDto
  ) {
    // businessId automatically from JWT
    return this.bookingService.getBookings({
      ...query,
      businessId
    })
  }

  // ==========================================================================
  // GET SINGLE BOOKING - With Access Control
  // ==========================================================================

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get booking by ID',
    description: 'Returns booking details. Clients can only view their own bookings.'
  })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBookingById(
    @Param('id') id: string,
    @CurrentUser() user: RequestWithUser['user'] | undefined
  ) {
    const booking = await this.bookingService.getBookingById(id)

    // Access control
    if (user) {
      if (user.role === 'client') {
        // Clients can only view their own bookings
        if (booking.clientId.toString() !== user.sub) {
          return {
            success: false,
            message: 'Access denied'
          }
        }
      } else if (user.businessId) {
        // Business users can only view bookings for their business
        if (booking.businessId.toString() !== user.businessId) {
          return {
            success: false,
            message: 'Access denied'
          }
        }
      }
    }

    return {
      success: true,
      data: booking
    }
  }

  // ==========================================================================
  // GET MY BOOKINGS - For Clients
  // ==========================================================================

  @Get('my/bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get my bookings as a client',
    description: 'Returns all bookings for the authenticated client'
  })
  @ApiResponse({ status: 200, description: 'Client bookings retrieved successfully' })
  async getMyBookings(
    @CurrentUser() user: RequestWithUser['user'],
    @Query('status') status?: string
  ) {
    return this.bookingService.getClientBookings(user.sub, status)
  }

  // ==========================================================================
  // GET TODAY'S BOOKINGS - Business Filtered
  // ==========================================================================

  @Get('today/bookings')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: "Get today's bookings for authenticated business"
  })
  @ApiResponse({ status: 200, description: "Today's bookings retrieved successfully" })
  async getTodayBookings(@BusinessId() businessId: string) {
    return this.bookingService.getTodayBookings(businessId)
  }

  // ==========================================================================
  // GET PENDING BOOKINGS - Business Filtered
  // ==========================================================================

  @Get('pending/bookings')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get pending bookings for authenticated business'
  })
  @ApiResponse({ status: 200, description: 'Pending bookings retrieved successfully' })
  async getPendingBookings(@BusinessId() businessId: string) {
    return this.bookingService.getPendingBookings(businessId)
  }

  // ==========================================================================
  // GET UPCOMING BOOKINGS - Business Filtered
  // ==========================================================================

  @Get('upcoming/bookings')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get upcoming bookings for authenticated business'
  })
  @ApiResponse({ status: 200, description: 'Upcoming bookings retrieved successfully' })
  async getUpcomingBookings(
    @BusinessId() businessId: string,
    @Query('days') days?: number
  ) {
    return this.bookingService.getUpcomingBookings(
      businessId,
      days ? parseInt(days.toString()) : 7
    )
  }

  // ==========================================================================
  // CONFIRM BOOKING - Business Only
  // ==========================================================================

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Confirm booking and create appointment',
    description: 'Confirms a pending booking and creates an appointment with staff assignment'
  })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async confirmBooking(
    @Param('id') bookingId: string,
    @BusinessContext() context: BusinessCtx,
    @Body() confirmDto: ConfirmBookingDto
  ): Promise<AppointmentResult> {
    // Verify booking belongs to this business
    const booking = await this.bookingService.getBookingById(bookingId)
    if (booking.businessId.toString() !== context.businessId) {
      throw new Error('Access denied')
    }

    return this.bookingOrchestrator.confirmBookingAndCreateAppointment(
      bookingId,
      confirmDto.staffId,
      confirmDto.staffAssignments
    )
  }

  // ==========================================================================
  // PROCESS PAYMENT - Can be called by payment webhook or client
  // ==========================================================================

  @Post(':id/payment')
  @ApiOperation({ 
    summary: 'Process payment for booking',
    description: 'Processes payment and completes the booking flow'
  })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Payment processing failed' })
  async processPayment(
    @Param('id') bookingId: string,
    @Body() paymentDto: ProcessPaymentDto
  ): Promise<PaymentResult> {
    return this.bookingOrchestrator.handlePaymentAndComplete(
      bookingId,
      paymentDto.transactionReference,
      {
        amount: paymentDto.amount,
        method: paymentDto.paymentMethod,
        gateway: paymentDto.gateway,
        clientId: paymentDto.clientId,
        businessId: paymentDto.businessId,
        paymentType: paymentDto.paymentType
      }
    )
  }

  // ==========================================================================
  // UPDATE BOOKING STATUS - Business Only
  // ==========================================================================

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update booking status',
    description: 'Updates the status of a booking (confirm, reject, cancel)'
  })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateBookingStatus(
    @Param('id') bookingId: string,
    @BusinessContext() context: BusinessCtx,
    @Body() statusDto: UpdateBookingStatusDto
  ) {
    // Verify booking belongs to this business
    const booking = await this.bookingService.getBookingById(bookingId)
    if (booking.businessId.toString() !== context.businessId) {
      return {
        success: false,
        message: 'Access denied'
      }
    }

    return this.bookingService.updateBookingStatus(
      bookingId,
      statusDto.status,
      context.userId,
      statusDto.reason
    )
  }

  // ==========================================================================
  // REJECT BOOKING - Business Only
  // ==========================================================================

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Reject booking',
    description: 'Rejects a pending booking with reason'
  })
  @ApiResponse({ status: 200, description: 'Booking rejected successfully' })
  async rejectBooking(
    @Param('id') bookingId: string,
    @BusinessContext() context: BusinessCtx,
    @Body() body: { reason: string }
  ) {
    // Verify booking belongs to this business
    const booking = await this.bookingService.getBookingById(bookingId)
    if (booking.businessId.toString() !== context.businessId) {
      return {
        success: false,
        message: 'Access denied'
      }
    }

    await this.bookingService.rejectBooking(
      bookingId,
      body.reason,
      context.userId
    )

    return {
      success: true,
      message: 'Booking rejected successfully'
    }
  }

  // ==========================================================================
  // CANCEL BOOKING - Client or Business
  // ==========================================================================

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Cancel booking',
    description: 'Cancels a booking. Clients can cancel their own bookings, business users can cancel any booking in their business.'
  })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  async cancelBooking(
    @Param('id') bookingId: string,
    @CurrentUser() user: RequestWithUser['user'],
    @Body() body: { reason: string }
  ) {
    // Access control
    const booking = await this.bookingService.getBookingById(bookingId)
    
    if (user.role === 'client') {
      // Clients can only cancel their own bookings
      if (booking.clientId.toString() !== user.sub) {
        return {
          success: false,
          message: 'Access denied'
        }
      }
    } else if (user.businessId) {
      // Business users can only cancel bookings for their business
      if (booking.businessId.toString() !== user.businessId) {
        return {
          success: false,
          message: 'Access denied'
        }
      }
    }

    await this.bookingService.cancelBooking(
      bookingId,
      body.reason,
      user.sub
    )

    return {
      success: true,
      message: 'Booking cancelled successfully'
    }
  }

  // ==========================================================================
  // EXTEND BOOKING EXPIRY - Business Only
  // ==========================================================================

  @Post(':id/extend')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Extend booking expiry time',
    description: 'Extends the expiry time for pending bookings'
  })
  @ApiResponse({ status: 200, description: 'Booking expiry extended' })
  async extendBooking(
    @Param('id') bookingId: string,
    @BusinessContext() context: BusinessCtx,
    @Body() body: { additionalMinutes?: number }
  ) {
    // Verify booking belongs to this business
    const booking = await this.bookingService.getBookingById(bookingId)
    if (booking.businessId.toString() !== context.businessId) {
      return {
        success: false,
        message: 'Access denied'
      }
    }

    return this.bookingService.extendBookingExpiry(
      bookingId,
      body.additionalMinutes || 30
    )
  }

  // ==========================================================================
  // GET BOOKING STATS - Business Only
  // ==========================================================================

  @Get('stats/overview')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get booking statistics',
    description: 'Returns booking statistics for the authenticated business'
  })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getBookingStats(
    @BusinessId() businessId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.bookingService.getBookingStats(
      businessId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    )
  }

  // ==========================================================================
  // RESET BOOKING FOR RETRY - Internal/Admin Use
  // ==========================================================================

  @Post(':id/reset-for-retry')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Reset failed booking for payment retry',
    description: 'Resets a payment_failed booking to pending status'
  })
  @ApiResponse({ status: 200, description: 'Booking reset successfully' })
  async resetBookingForRetry(
    @Param('id') bookingId: string,
    @BusinessContext() context: BusinessCtx
  ) {
    // Verify booking belongs to this business
    const booking = await this.bookingService.getBookingById(bookingId)
    if (booking.businessId.toString() !== context.businessId) {
      return {
        success: false,
        message: 'Access denied'
      }
    }

    await this.bookingOrchestrator.resetBookingForPaymentRetry(bookingId)

    return {
      success: true,
      message: 'Booking reset for payment retry'
    }
  }
}