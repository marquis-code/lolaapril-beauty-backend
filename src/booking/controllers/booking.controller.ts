// src/modules/booking/controllers/booking.controller.ts
// REFACTORED VERSION - Clean & Simple
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
import { RescheduleBookingDto } from '../dto/reschedule-booking.dto'

// 🔥 NEW: Import decorators (no more guards!)
import {
  Public,
  ValidateBusiness,
  BusinessContext,
  BusinessId,
  CurrentUser
} from '../../auth'
import type {
  BusinessContext as BusinessCtx,
  RequestWithUser
} from '../../auth'
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
  ) { }

  // ==========================================================================
  // CREATE BOOKING - Public (Anyone can create a booking)
  // ==========================================================================

  @Public() // ✅ Mark as public
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
    return this.bookingOrchestrator.createBookingWithValidation(createBookingDto)
  }

  // ==========================================================================
  // GET ALL BOOKINGS - Authenticated (No validation needed - READ operation)
  // ==========================================================================

  @Get() // ✅ Authenticated by default, no decorator needed
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
    return this.bookingService.getBookings({
      ...query,
      businessId
    })
  }

  // ==========================================================================
  // GET SINGLE BOOKING - Authenticated
  // ==========================================================================

  @Get(':id') // ✅ Authenticated by default
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get booking by ID',
    description: 'Returns booking details. Clients can only view their own bookings.'
  })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBookingById(
    @Param('id') id: string,
    @CurrentUser() user: RequestWithUser['user']
  ) {
    const booking = await this.bookingService.getBookingById(id)

    // Access control
    if (user.role === 'client') {
      if (booking.clientId.toString() !== user.sub) {
        return { success: false, message: 'Access denied' }
      }
    } else if (user.businessId) {
      if (booking.businessId.toString() !== user.businessId) {
        return { success: false, message: 'Access denied' }
      }
    }

    return { success: true, data: booking }
  }

  // ==========================================================================
  // GET MY BOOKINGS - For Clients
  // ==========================================================================

  @Get('my/bookings') // ✅ Authenticated by default
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
    console.log('========== GET MY BOOKINGS CONTROLLER ==========')
    console.log('🔍 [CONTROLLER] Full user object from JWT:', JSON.stringify(user, null, 2))
    console.log('🔍 [CONTROLLER] User ID (user.sub):', user.sub)
    console.log('🔍 [CONTROLLER] User ID (user.userId):', user.userId)
    console.log('🔍 [CONTROLLER] User email:', user.email)
    console.log('🔍 [CONTROLLER] User role:', user.role)
    console.log('🔍 [CONTROLLER] Status filter:', status)

    // Use EITHER user.sub OR user.userId, whichever exists
    const userId = user.sub || user.userId

    if (!userId) {
      console.error('❌ [CONTROLLER] NO USER ID FOUND IN TOKEN!')
      return {
        success: false,
        data: [],
        message: 'User ID not found in authentication token'
      }
    }

    console.log('🔍 [CONTROLLER] Using userId for query:', userId)
    console.log('==================================================')

    const bookings = await this.bookingService.getClientBookings(userId, status)

    return {
      success: true,
      data: bookings,
      message: `Found ${bookings.length} booking(s) for user`
    }
  }

  // ==========================================================================
  // GET TODAY'S BOOKINGS - Business Filtered
  // ==========================================================================

  @Get('today/bookings') // ✅ Authenticated by default
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

  @Get('pending/bookings') // ✅ Authenticated by default
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

  @Get('upcoming/bookings') // ✅ Authenticated by default
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
  // CONFIRM BOOKING - Business Only (WRITE OPERATION - VALIDATE)
  // ==========================================================================

  @ValidateBusiness() // ✅ Validate business access
  @Post(':id/confirm')
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
  // PROCESS PAYMENT - Public (webhook)
  // ==========================================================================

  @Public() // ✅ Public for payment webhooks
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
  // UPDATE BOOKING STATUS - Business Only (WRITE OPERATION - VALIDATE)
  // ==========================================================================

  @ValidateBusiness() // ✅ Validate business access
  @Patch(':id/status')
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
      return { success: false, message: 'Access denied' }
    }

    return this.bookingService.updateBookingStatus(
      bookingId,
      statusDto.status,
      context.userId,
      statusDto.reason
    )
  }

  // ==========================================================================
  // COMPLETE BOOKING - Business Only (WRITE OPERATION - VALIDATE)
  // ==========================================================================

  @ValidateBusiness() // ✅ Validate business access
  @Post(':id/complete')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mark booking as completed',
    description: 'Marks a confirmed booking as completed and triggers sale creation'
  })
  @ApiResponse({ status: 200, description: 'Booking completed successfully' })
  async completeBooking(
    @Param('id') bookingId: string,
    @BusinessContext() context: BusinessCtx
  ) {
    // Verify booking belongs to this business
    const booking = await this.bookingService.getBookingById(bookingId)
    if (booking.businessId.toString() !== context.businessId) {
      return { success: false, message: 'Access denied' }
    }

    const completedBooking = await this.bookingService.completeBooking(
      bookingId,
      context.userId
    )

    return {
      success: true,
      message: 'Booking completed successfully',
      data: completedBooking
    }
  }

  // ==========================================================================
  // REJECT BOOKING - Business Only (WRITE OPERATION - VALIDATE)
  // ==========================================================================

  @ValidateBusiness() // ✅ Validate business access
  @Post(':id/reject')
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
    const booking = await this.bookingService.getBookingById(bookingId)
    if (booking.businessId.toString() !== context.businessId) {
      return { success: false, message: 'Access denied' }
    }

    await this.bookingService.rejectBooking(
      bookingId,
      body.reason,
      context.userId
    )

    return { success: true, message: 'Booking rejected successfully' }
  }

  // ==========================================================================
  // CANCEL BOOKING - Client or Business (Both can access)
  // ==========================================================================

  @Post(':id/cancel') // ✅ No @ValidateBusiness - clients need access too
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
    const booking = await this.bookingService.getBookingById(bookingId)

    if (user.role === 'client') {
      if (booking.clientId.toString() !== user.sub) {
        return { success: false, message: 'Access denied' }
      }
    } else if (user.businessId) {
      if (booking.businessId.toString() !== user.businessId) {
        return { success: false, message: 'Access denied' }
      }
    }

    await this.bookingService.cancelBooking(
      bookingId,
      body.reason,
      user.sub
    )

    return { success: true, message: 'Booking cancelled successfully' }
  }

  // ==========================================================================
  // RESCHEDULE BOOKING - Client or Business (Both can access)
  // ==========================================================================

  @Post(':id/reschedule') // ✅ No @ValidateBusiness - clients need access too
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reschedule booking',
    description: 'Reschedules a booking to a new date/time. Clients can reschedule their own bookings, business users can reschedule any booking in their business.'
  })
  @ApiResponse({ status: 200, description: 'Booking rescheduled successfully' })
  @ApiResponse({ status: 400, description: 'Cannot reschedule this booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async rescheduleBooking(
    @Param('id') bookingId: string,
    @CurrentUser() user: RequestWithUser['user'],
    @Body() rescheduleDto: RescheduleBookingDto
  ) {
    const booking = await this.bookingService.getBookingById(bookingId)

    // Access control - check if user can reschedule this booking
    if (user.role === 'client') {
      if (booking.clientId.toString() !== user.sub) {
        return { success: false, message: 'Access denied' }
      }
    } else if (user.businessId) {
      if (booking.businessId.toString() !== user.businessId) {
        return { success: false, message: 'Access denied' }
      }
    }

    // Parse the new date
    const newPreferredDate = new Date(rescheduleDto.newPreferredDate)

    // Reschedule the booking
    const rescheduledBooking = await this.bookingService.rescheduleBooking(
      bookingId,
      newPreferredDate,
      rescheduleDto.newPreferredStartTime,
      rescheduleDto.reason,
      user.sub
    )

    return {
      success: true,
      message: 'Booking rescheduled successfully',
      data: rescheduledBooking
    }
  }

  // ==========================================================================
  // EXTEND BOOKING EXPIRY - Business Only (WRITE OPERATION - VALIDATE)
  // ==========================================================================

  @ValidateBusiness() // ✅ Validate business access
  @Post(':id/extend')
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
    const booking = await this.bookingService.getBookingById(bookingId)
    if (booking.businessId.toString() !== context.businessId) {
      return { success: false, message: 'Access denied' }
    }

    return this.bookingService.extendBookingExpiry(
      bookingId,
      body.additionalMinutes || 30
    )
  }

  // ==========================================================================
  // GET BOOKING STATS - Business Only (READ - No validation needed)
  // ==========================================================================

  @Get('stats/overview') // ✅ Authenticated by default
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
  // RESET BOOKING FOR RETRY - Business Only (WRITE OPERATION - VALIDATE)
  // ==========================================================================

  @ValidateBusiness() // ✅ Validate business access
  @Post(':id/reset-for-retry')
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
    const booking = await this.bookingService.getBookingById(bookingId)
    if (booking.businessId.toString() !== context.businessId) {
      return { success: false, message: 'Access denied' }
    }

    await this.bookingOrchestrator.resetBookingForPaymentRetry(bookingId)

    return { success: true, message: 'Booking reset for payment retry' }
  }
}


// ==========================================================================
// SUMMARY OF CHANGES:
// ==========================================================================
// ✅ REMOVED: All @UseGuards() declarations
// ✅ REMOVED: BusinessRolesGuard, RequireBusinessRoles imports
// ✅ REMOVED: OptionalAuthGuard usage
// 
// ✅ ADDED: @Public() decorator for public endpoints
// ✅ ADDED: @ValidateBusiness() decorator for write operations
// 
// ✅ RESULT: 
// - 15 lines of guard declarations removed
// - 2 decorators added where needed
// - Much cleaner and more readable
// - Same functionality, better maintainability