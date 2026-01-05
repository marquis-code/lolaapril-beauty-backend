// // src/modules/booking/controllers/booking-flow.controller.ts
// import { 
//   Controller, 
//   Post, 
//   Body, 
//   Param, 
//   UseGuards, 
//   Request, 
//   BadRequestException, 
//   ValidationPipe, 
//   UsePipes 
// } from '@nestjs/common'
// import { BookingOrchestrator } from '../services/booking-orchestrator.service'
// import { CreateBookingDto } from '../dto/create-booking.dto'
// import { ConfirmBookingDto } from '../dto/confirm-booking.dto'
// import { BookingSourceType } from '../dto/create-booking-with-source.dto'
// import { 
//   BookingResult, 
//   PaymentResult, 
//   AppointmentResult, 
//   BookingResponse 
// } from '../types/booking.types'
// import { Public } from '../../auth'

// @Controller('booking-flow')
// export class BookingFlowController {
//   constructor(private readonly bookingOrchestrator: BookingOrchestrator) {}

//   /**
//    * Create a new booking
//    * POST /booking-flow/create
//    */
//   @Post('create')
//   async createBooking(
//     @Body() createBookingDto: any, 
//     @Request() req: any
//   ): Promise<BookingResponse<BookingResult>> {
//     try {
//       // Get business ID from tenant middleware
//       const businessId = req.tenant.businessId
      
//       if (!businessId) {
//         throw new BadRequestException('Business ID is required')
//       }

//       // Prepare booking data
//       const bookingData: any = {
//         ...createBookingDto,
//         businessId
//       }

//       // Add minimal bookingSource if missing
//       if (!bookingData.bookingSource) {
//         bookingData.bookingSource = {
//           sourceType: BookingSourceType.DIRECT_LINK
//         }
//       }

//       // Create booking through orchestrator
//       const result = await this.bookingOrchestrator.createBookingWithValidation(bookingData)
      
//       return { 
//         success: true, 
//         data: result,
//         message: result.message || 'Booking created successfully'
//       }
//     } catch (error) {
//       console.error('❌ Booking creation failed:', error.message)
      
//       return {
//         success: false,
//         error: error.message,
//         code: 'BOOKING_CREATION_FAILED',
//         message: 'Failed to create booking'
//       }
//     }
//   }

//   /**
//    * Confirm a booking and create appointment with staff assignment
//    * POST /booking-flow/confirm/:bookingId
//    */
//   @Post('confirm/:bookingId')
//   @UsePipes(new ValidationPipe({ 
//     whitelist: true, 
//     forbidNonWhitelisted: false,
//     transform: true 
//   }))
//   async confirmBooking(
//     @Param('bookingId') bookingId: string,
//     @Body() confirmDto: ConfirmBookingDto,
//     @Request() req: TenantRequest
//   ): Promise<BookingResponse<AppointmentResult>> {
//     try {
//       console.log('🎯 CONTROLLER: CONFIRM BOOKING')
//       console.log('BookingId:', bookingId)
//       console.log('DTO Received:', JSON.stringify(confirmDto, null, 2))
      
//       // Validate bookingId format
//       if (!this.isValidObjectId(bookingId)) {
//         throw new BadRequestException('Invalid booking ID format')
//       }
      
//       // Validate that we have either staffId or staffAssignments
//       if (!confirmDto.staffId && (!confirmDto.staffAssignments || confirmDto.staffAssignments.length === 0)) {
//         throw new BadRequestException('Either staffId or staffAssignments must be provided')
//       }
      
//       // Validate staffAssignments if provided
//       if (confirmDto.staffAssignments && confirmDto.staffAssignments.length > 0) {
//         for (const assignment of confirmDto.staffAssignments) {
//           // Validate staffId
//           if (!assignment.staffId) {
//             throw new BadRequestException('staffId is required in staffAssignments')
//           }
//           if (!this.isValidObjectId(assignment.staffId)) {
//             throw new BadRequestException(`Invalid staffId format: ${assignment.staffId}`)
//           }
          
//           // Validate serviceId
//           if (!assignment.serviceId) {
//             throw new BadRequestException('serviceId is required in staffAssignments')
//           }
//           if (!this.isValidObjectId(assignment.serviceId)) {
//             throw new BadRequestException(`Invalid serviceId format: ${assignment.serviceId}`)
//           }
//         }
        
//         console.log(`✅ Validated ${confirmDto.staffAssignments.length} staff assignments`)
//       }
      
//       // Confirm booking and create appointment
//       const result = await this.bookingOrchestrator.confirmBookingAndCreateAppointment(
//         bookingId,
//         confirmDto.staffId,
//         confirmDto.staffAssignments
//       )

//       console.log('✅ Booking confirmed successfully')
      
//       return {
//         success: true,
//         data: result,
//         message: result.message || 'Booking confirmed and appointment created successfully'
//       }
//     } catch (error) {
//       console.error('❌ CONTROLLER ERROR:', error.message)
//       console.error('Error stack:', error.stack)
      
//       return {
//         success: false,
//         error: error.message,
//         code: 'BOOKING_CONFIRMATION_FAILED',
//         message: 'Failed to confirm booking'
//       }
//     }
//   }

//   /**
//    * Process payment and create appointment
//    * POST /booking-flow/payment/:bookingId
//    */
//   @Post('payment/:bookingId')
//   async handlePayment(
//     @Param('bookingId') bookingId: string,
//     @Body() paymentDto: {
//       transactionReference: string
//       amount: number
//       method: string
//       gateway: string
//       clientId: string
//       businessId: string
//       paymentType?: 'full' | 'deposit' | 'remaining'
//     }
//   ): Promise<BookingResponse<PaymentResult>> {
//     try {
//       console.log('💳 CONTROLLER: HANDLE PAYMENT')
//       console.log('BookingId:', bookingId)
//       console.log('Payment amount:', paymentDto.amount)
//       console.log('Payment type:', paymentDto.paymentType || 'full')
      
//       // Validate bookingId format
//       if (!this.isValidObjectId(bookingId)) {
//         throw new BadRequestException('Invalid booking ID format')
//       }

//       // Validate payment amount
//       if (!paymentDto.amount || paymentDto.amount <= 0) {
//         throw new BadRequestException('Invalid payment amount')
//       }

//       // Validate transaction reference
//       if (!paymentDto.transactionReference) {
//         throw new BadRequestException('Transaction reference is required')
//       }

//       // Process payment through orchestrator
//       const result = await this.bookingOrchestrator.handlePaymentAndComplete(
//         bookingId,
//         paymentDto.transactionReference,
//         {
//           amount: paymentDto.amount,
//           method: paymentDto.method,
//           gateway: paymentDto.gateway,
//           clientId: paymentDto.clientId,
//           businessId: paymentDto.businessId,
//           paymentType: paymentDto.paymentType
//         }
//       )

//       console.log('✅ Payment processed successfully')

//       return {
//         success: true,
//         data: result,
//         message: result.message || 'Payment processed and appointment created successfully'
//       }
//     } catch (error) {
//       console.error('❌ Payment processing failed:', error.message)
      
//       return {
//         success: false,
//         error: error.message,
//         code: 'PAYMENT_PROCESSING_FAILED',
//         message: 'Payment processing failed'
//       }
//     }
//   }

//   /**
//    * Helper method to validate MongoDB ObjectId format
//    * @param id - The ID string to validate
//    * @returns true if valid ObjectId format, false otherwise
//    */
//   private isValidObjectId(id: string): boolean {
//     return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)
//   }
// }

// src/modules/booking/controllers/booking-flow.controller.ts
import { 
  Controller, 
  Post, 
  Body, 
  Param,
  BadRequestException, 
  ValidationPipe, 
  UsePipes 
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { BookingOrchestrator } from '../services/booking-orchestrator.service'
import { CreateBookingDto } from '../dto/create-booking.dto'
import { ConfirmBookingDto } from '../dto/confirm-booking.dto'
import { BookingSourceType } from '../dto/create-booking-with-source.dto'
import { 
  BookingResult, 
  PaymentResult, 
  AppointmentResult, 
  BookingResponse 
} from '../types/booking.types'
import { Public } from '../../auth' // ✅ ADDED: Import auth decorators

@ApiTags('Booking Flow')
@Controller('booking-flow')
export class BookingFlowController {
  constructor(private readonly bookingOrchestrator: BookingOrchestrator) {}

  /**
   * Create a new booking
   * POST /booking-flow/create
   */
  @Public() // ✅ ADDED: Mark as public
  @Post('create')
  @ApiOperation({ summary: 'Create a new booking (Public)' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  async createBooking(
    @Body() createBookingDto: any
  ): Promise<BookingResponse<BookingResult>> {
    try {
      // ✅ CHANGED: BusinessId must be provided in the request body
      if (!createBookingDto.businessId) {
        throw new BadRequestException('Business ID is required')
      }

      // Add minimal bookingSource if missing
      if (!createBookingDto.bookingSource) {
        createBookingDto.bookingSource = {
          sourceType: BookingSourceType.DIRECT_LINK
        }
      }

      // Create booking through orchestrator
      const result = await this.bookingOrchestrator.createBookingWithValidation(createBookingDto)
      
      return { 
        success: true, 
        data: result,
        message: result.message || 'Booking created successfully'
      }
    } catch (error) {
      console.error('❌ Booking creation failed:', error.message)
      
      return {
        success: false,
        error: error.message,
        code: 'BOOKING_CREATION_FAILED',
        message: 'Failed to create booking'
      }
    }
  }

  /**
   * Confirm a booking and create appointment with staff assignment
   * POST /booking-flow/confirm/:bookingId
   */
  @Post('confirm/:bookingId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm booking and create appointment' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
  @UsePipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: false,
    transform: true 
  }))
  async confirmBooking(
    @Param('bookingId') bookingId: string,
    @Body() confirmDto: ConfirmBookingDto
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
      
      // Confirm booking and create appointment
      const result = await this.bookingOrchestrator.confirmBookingAndCreateAppointment(
        bookingId,
        confirmDto.staffId,
        confirmDto.staffAssignments
      )

      console.log('✅ Booking confirmed successfully')
      
      return {
        success: true,
        data: result,
        message: result.message || 'Booking confirmed and appointment created successfully'
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

  /**
   * Process payment and create appointment
   * POST /booking-flow/payment/:bookingId
   */
  @Public() // ✅ ADDED: Public for payment webhooks
  @Post('payment/:bookingId')
  @ApiOperation({ summary: 'Process payment for booking (Public)' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  async handlePayment(
    @Param('bookingId') bookingId: string,
    @Body() paymentDto: {
      transactionReference: string
      amount: number
      method: string
      gateway: string
      clientId: string
      businessId: string
      paymentType?: 'full' | 'deposit' | 'remaining'
    }
  ): Promise<BookingResponse<PaymentResult>> {
    try {
      console.log('💳 CONTROLLER: HANDLE PAYMENT')
      console.log('BookingId:', bookingId)
      console.log('Payment amount:', paymentDto.amount)
      console.log('Payment type:', paymentDto.paymentType || 'full')
      
      // Validate bookingId format
      if (!this.isValidObjectId(bookingId)) {
        throw new BadRequestException('Invalid booking ID format')
      }

      // Validate payment amount
      if (!paymentDto.amount || paymentDto.amount <= 0) {
        throw new BadRequestException('Invalid payment amount')
      }

      // Validate transaction reference
      if (!paymentDto.transactionReference) {
        throw new BadRequestException('Transaction reference is required')
      }

      // Process payment through orchestrator
      const result = await this.bookingOrchestrator.handlePaymentAndComplete(
        bookingId,
        paymentDto.transactionReference,
        {
          amount: paymentDto.amount,
          method: paymentDto.method,
          gateway: paymentDto.gateway,
          clientId: paymentDto.clientId,
          businessId: paymentDto.businessId,
          paymentType: paymentDto.paymentType
        }
      )

      console.log('✅ Payment processed successfully')

      return {
        success: true,
        data: result,
        message: result.message || 'Payment processed and appointment created successfully'
      }
    } catch (error) {
      console.error('❌ Payment processing failed:', error.message)
      
      return {
        success: false,
        error: error.message,
        code: 'PAYMENT_PROCESSING_FAILED',
        message: 'Payment processing failed'
      }
    }
  }

  /**
   * Helper method to validate MongoDB ObjectId format
   * @param id - The ID string to validate
   * @returns true if valid ObjectId format, false otherwise
   */
  private isValidObjectId(id: string): boolean {
    return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)
  }
}