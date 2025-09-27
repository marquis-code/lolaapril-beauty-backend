// src/modules/booking/controllers/booking-flow.controller.ts
import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common'
import { BookingOrchestrator } from '../services/booking-orchestrator.service'
import { TenantGuard } from '../../tenant/guards/tenant.guard'
import { 
  BookingResult, 
  PaymentResult, 
  AppointmentResult, 
  BookingResponse 
} from '../types/booking.types'

@Controller('booking-flow')
@UseGuards(TenantGuard)
export class BookingFlowController {
  constructor(private bookingOrchestrator: BookingOrchestrator) {}

  @Post('create')
  async createBooking(
    @Body() createBookingDto: any,
    @Request() req: any
  ): Promise<BookingResponse<BookingResult>> {
    try {
      // Tenant info available from middleware
      const businessId = req.tenant.businessId
      
      const result = await this.bookingOrchestrator.createBookingWithValidation({
        ...createBookingDto,
        businessId
      })

      return {
        success: true,
        data: result,
        message: result.message || 'Booking created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'BOOKING_CREATION_FAILED',
        message: 'Failed to create booking'
      }
    }
  }

  @Post('confirm/:bookingId')
  async confirmBooking(
    @Param('bookingId') bookingId: string,
    @Body('staffId') staffId: string
  ): Promise<BookingResponse<AppointmentResult>> {
    try {
      const result = await this.bookingOrchestrator.confirmBookingAndCreateAppointment(
        bookingId,
        staffId
      )

      return {
        success: true,
        data: result,
        message: 'Booking confirmed and appointment created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'BOOKING_CONFIRMATION_FAILED',
        message: 'Failed to confirm booking'
      }
    }
  }

  @Post('payment/:bookingId') // Note: using bookingId for automation
  async handlePayment(
    @Param('bookingId') bookingId: string,
    @Body() paymentDto: {
      transactionReference: string
      amount: number
      method: string
      gateway: string
      clientId: string
      businessId: string
    }
  ): Promise<BookingResponse<PaymentResult>> {
    try {
      const result = await this.bookingOrchestrator.handlePaymentAndComplete(
        bookingId, // Changed to bookingId for automation flow
        paymentDto.transactionReference,
        {
          amount: paymentDto.amount,
          method: paymentDto.method,
          gateway: paymentDto.gateway,
          clientId: paymentDto.clientId,
          businessId: paymentDto.businessId
        }
      )

      return {
        success: true,
        data: result,
        message: 'Payment processed and appointment created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'PAYMENT_PROCESSING_FAILED',
        message: 'Payment processing failed'
      }
    }
  }
}