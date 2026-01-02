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
      
//       const result = await this.bookingOrchestrator.createBookingWithValidation({
//         ...createBookingDto,
//         businessId
//       })

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
  Post, 
  Get, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  ValidationPipe,
  Request,
  HttpStatus,
  HttpCode
} from '@nestjs/common'
import { BookingOrchestrator } from '../services/booking-orchestrator.service'
import { BookingService } from '../services/booking.service'
import { CreateBookingDto } from '../dto/create-booking.dto'
import { ProcessPaymentDto } from '../dto/process-payment.dto'
import { UpdateBookingStatusDto } from '../dto/update-booking.dto'
import { GetBookingsDto } from '../dto/get-bookings.dto'
import { TenantGuard } from '../../tenant/guards/tenant.guard'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { 
  BookingResult, 
  PaymentResult, 
  AppointmentResult, 
  BookingResponse 
} from '../types/booking.types'
import { BookingSourceType } from '../dto/create-booking-with-source.dto'

@Controller('bookings')
@UseGuards(TenantGuard)
export class BookingController {
  constructor(
    private readonly bookingOrchestrator: BookingOrchestrator,
    private readonly bookingService: BookingService,
  ) {}

  // MAIN AUTOMATED BOOKING ENDPOINT
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createAutomatedBooking(
    @Body(ValidationPipe) createBookingDto: CreateBookingDto,
    @Request() req: any
  ): Promise<BookingResponse<BookingResult>> {
    try {
      // Get business ID from tenant middleware
      const businessId = req.tenant.businessId
      
      // FIX: Simply pass the DTO with businessId - orchestrator will normalize bookingSource
      const bookingData: any = {
        ...createBookingDto,
        businessId
      }

      // If no bookingSource exists at all, create a minimal one
      if (!bookingData.bookingSource) {
        bookingData.bookingSource = {
          sourceType: BookingSourceType.DIRECT_LINK
        }
      }

      const result = await this.bookingOrchestrator.createBookingWithValidation(bookingData)

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

  // MAIN AUTOMATED PAYMENT PROCESSING ENDPOINT
  @Post('process-payment')
  @HttpCode(HttpStatus.OK)
  async processPaymentAndCreateAppointment(
    @Body(ValidationPipe) processPaymentDto: ProcessPaymentDto
  ): Promise<BookingResponse<PaymentResult>> {
    try {
      // This is the key automation endpoint - payment triggers appointment creation
      const result = await this.bookingOrchestrator.handlePaymentAndComplete(
        processPaymentDto.bookingId, // Note: using bookingId, not appointmentId
        processPaymentDto.transactionReference,
        {
          amount: processPaymentDto.amount,
          method: processPaymentDto.paymentMethod,
          gateway: processPaymentDto.gateway,
          clientId: processPaymentDto.clientId,
          businessId: processPaymentDto.businessId
        }
      )

      return {
        success: true,
        data: result,
        message: 'Payment successful! Your appointment has been confirmed automatically.'
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

  // MANUAL CONFIRMATION (for staff use)
  @Post(':bookingId/confirm')
  @UseGuards(JwtAuthGuard)
  async confirmBookingManually(
    @Param('bookingId') bookingId: string,
    @Body('staffId') staffId: string,
    @Request() req: any
  ): Promise<BookingResponse<AppointmentResult>> {
    try {
      const confirmedBy = req.user.id
      
      const result = await this.bookingOrchestrator.confirmBookingAndCreateAppointment(
        bookingId,
        confirmedBy
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

  @Get()
  @UseGuards(JwtAuthGuard)
  async getBookings(
    @Query(ValidationPipe) getBookingsDto: GetBookingsDto,
    @Request() req: any
  ): Promise<BookingResponse<any>> {
    try {
      const businessId = req.tenant.businessId
      
      const bookings = await this.bookingService.getBookings({
        ...getBookingsDto,
        businessId
      })

      return {
        success: true,
        data: bookings,
        message: 'Bookings retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'BOOKINGS_RETRIEVAL_FAILED',
        message: 'Failed to retrieve bookings'
      }
    }
  }

  @Get(':bookingId')
  async getBookingById(@Param('bookingId') bookingId: string): Promise<BookingResponse<any>> {
    try {
      const booking = await this.bookingService.getBookingById(bookingId)

      return {
        success: true,
        data: booking,
        message: 'Booking retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'BOOKING_NOT_FOUND',
        message: 'Booking not found'
      }
    }
  }

  @Put(':bookingId/status')
  @UseGuards(JwtAuthGuard)
  async updateBookingStatus(
    @Param('bookingId') bookingId: string,
    @Body(ValidationPipe) updateStatusDto: UpdateBookingStatusDto
  ): Promise<BookingResponse<any>> {
    try {
      const booking = await this.bookingService.updateBookingStatus(
        bookingId,
        updateStatusDto.status,
        updateStatusDto.updatedBy,
        updateStatusDto.reason
      )

      return {
        success: true,
        data: booking,
        message: 'Booking status updated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'STATUS_UPDATE_FAILED',
        message: 'Failed to update booking status'
      }
    }
  }

  @Post(':bookingId/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(
    @Param('bookingId') bookingId: string,
    @Body('reason') reason: string,
    @Request() req: any
  ): Promise<BookingResponse<void>> {
    try {
      const userId = req.user.id
      
      await this.bookingService.cancelBooking(bookingId, reason, userId)

      return {
        success: true,
        message: 'Booking cancelled successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'BOOKING_CANCELLATION_FAILED',
        message: 'Failed to cancel booking'
      }
    }
  }

  @Get('client/:clientId')
  @UseGuards(JwtAuthGuard)
  async getClientBookings(
    @Param('clientId') clientId: string,
    @Query('status') status?: string
  ): Promise<BookingResponse<any>> {
    try {
      const bookings = await this.bookingService.getClientBookings(clientId, status)

      return {
        success: true,
        data: bookings,
        message: 'Client bookings retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'CLIENT_BOOKINGS_RETRIEVAL_FAILED',
        message: 'Failed to retrieve client bookings'
      }
    }
  }

  @Get('business/today')
  @UseGuards(JwtAuthGuard)
  async getTodayBookings(@Request() req: any): Promise<BookingResponse<any>> {
    try {
      const businessId = req.tenant.businessId
      const bookings = await this.bookingService.getTodayBookings(businessId)

      return {
        success: true,
        data: bookings,
        message: 'Today\'s bookings retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'TODAY_BOOKINGS_RETRIEVAL_FAILED',
        message: 'Failed to retrieve today\'s bookings'
      }
    }
  }

  @Post(':bookingId/reject')
  @UseGuards(JwtAuthGuard)
  async rejectBooking(
    @Param('bookingId') bookingId: string,
    @Body('reason') reason: string,
    @Request() req: any
  ): Promise<BookingResponse<void>> {
    try {
      const rejectedBy = req.user.id
      
      await this.bookingService.rejectBooking(bookingId, reason, rejectedBy)

      return {
        success: true,
        message: 'Booking rejected successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'BOOKING_REJECTION_FAILED',
        message: 'Failed to reject booking'
      }
    }
  }
}