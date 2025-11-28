// src/modules/booking/controllers/booking-flow.controller.ts
import { Controller, Post, Body, Param, UseGuards, Request, BadRequestException, ValidationPipe, UsePipes } from '@nestjs/common'
import { BookingOrchestrator } from '../services/booking-orchestrator.service'
import { TenantGuard } from '../../tenant/guards/tenant.guard'
import { TenantRequest } from '../../tenant/middleware/tenant.middleware'
import { CreateBookingDto } from '../dto/create-booking.dto'
import { ConfirmBookingDto } from "../dto/confirm-booking.dto"
import { 
  BookingResult, 
  PaymentResult, 
  AppointmentResult, 
  BookingResponse 
} from '../types/booking.types'

@Controller('booking-flow')
export class BookingFlowController {
  constructor(private bookingOrchestrator: BookingOrchestrator) {}

  @Post('create')
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: TenantRequest
  ): Promise<BookingResponse<BookingResult>> {
    try {
      const businessId = createBookingDto.businessId || req.tenant?.businessId
      
      if (!businessId) {
        throw new BadRequestException('Business ID is required')
      }
      
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
  @UsePipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: false,
    transform: true 
  }))
  async confirmBooking(
    @Param('bookingId') bookingId: string,
    @Body() confirmDto: ConfirmBookingDto,
    @Request() req: TenantRequest
  ): Promise<BookingResponse<AppointmentResult>> {
    try {
      console.log('🎯 CONTROLLER: CONFIRM BOOKING')
      console.log('BookingId:', bookingId)
      console.log('DTO Received:', JSON.stringify(confirmDto, null, 2))
      
      // Validate bookingId format
      if (!this.isValidObjectId(bookingId)) {
        throw new BadRequestException('Invalid booking ID format')
      }
      
      // Validate that we have either staffId or staffAssignments
      if (!confirmDto.staffId && (!confirmDto.staffAssignments || confirmDto.staffAssignments.length === 0)) {
        throw new BadRequestException('Either staffId or staffAssignments must be provided')
      }
      
      // Validate staffAssignments if provided
      if (confirmDto.staffAssignments && confirmDto.staffAssignments.length > 0) {
        for (const assignment of confirmDto.staffAssignments) {
          // Validate staffId
          if (!assignment.staffId) {
            throw new BadRequestException('staffId is required in staffAssignments')
          }
          if (!this.isValidObjectId(assignment.staffId)) {
            throw new BadRequestException(`Invalid staffId format: ${assignment.staffId}`)
          }
          
          // Validate serviceId
          if (!assignment.serviceId) {
            throw new BadRequestException('serviceId is required in staffAssignments')
          }
          if (!this.isValidObjectId(assignment.serviceId)) {
            throw new BadRequestException(`Invalid serviceId format: ${assignment.serviceId}`)
          }
        }
        
        console.log(`✅ Validated ${confirmDto.staffAssignments.length} staff assignments`)
      }
      
      const result = await this.bookingOrchestrator.confirmBookingAndCreateAppointment(
        bookingId,
        confirmDto.staffId,
        confirmDto.staffAssignments
      )

      return {
        success: true,
        data: result,
        message: 'Booking confirmed and appointment created successfully'
      }
    } catch (error) {
      console.error('❌ CONTROLLER ERROR:', error.message)
      console.error('Error stack:', error.stack)
      
      return {
        success: false,
        error: error.message,
        code: 'BOOKING_CONFIRMATION_FAILED',
        message: 'Failed to confirm booking'
      }
    }
  }

  @Post('payment/:bookingId')
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
      if (!this.isValidObjectId(bookingId)) {
        throw new BadRequestException('Invalid booking ID format')
      }

      const result = await this.bookingOrchestrator.handlePaymentAndComplete(
        bookingId,
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

  // Helper method to validate MongoDB ObjectId format
  private isValidObjectId(id: string): boolean {
    return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)
  }
}