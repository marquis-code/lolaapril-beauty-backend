// src/modules/booking/services/booking-orchestrator.service.ts
import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common'
import { BookingService } from './booking.service'
import { AppointmentService } from '../../appointment/appointment.service'
import { PaymentService } from '../../payment/payment.service'
import { AvailabilityService } from  '../../availability/availability.service'
import { NotificationService } from '../../notification/notification.service'
import { StaffService } from '../../staff/staff.service'
import { TenantService } from '../../tenant/tenant.service'
import { ServiceService } from '../../service/service.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Types } from 'mongoose'

interface CreateBookingDto {
  businessId: string
  clientId: string
  serviceIds: string[]
  preferredDate: Date
  preferredStartTime: string
  clientName: string
  clientEmail: string
  clientPhone: string
  specialRequests?: string
}

// Updated interfaces to match controller expectations
interface BookingResult {
  bookingId: string
  bookingNumber: string
  estimatedTotal: number
  expiresAt: Date
  status: string
  clientId: string
  businessId: string
  booking: any
  availableSlots?: any[]
  message: string
  requiresPayment?: boolean
}

interface AppointmentResult {
  appointmentId: string
  appointmentNumber: string
  scheduledDate: Date
  scheduledTime: string
  status: string
  clientId: string
  businessId: string
  booking: any
  message: string
  appointment: any
  assignment: any
}

interface PaymentResult {
  paymentId: string
  success: boolean
  message: string
  transactionReference: string
  amount: number
  method: string
  gateway: string
  status: string
  payment: any
  appointment: any
}

@Injectable()
export class BookingOrchestrator {
  private readonly logger = new Logger(BookingOrchestrator.name)

  constructor(
    private readonly bookingService: BookingService,
    private readonly appointmentService: AppointmentService,
    private readonly paymentService: PaymentService,
    private readonly availabilityService: AvailabilityService,
    private readonly notificationService: NotificationService,
    private readonly staffService: StaffService,
    private readonly tenantService: TenantService,
    private readonly serviceService: ServiceService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createBookingWithValidation(createBookingDto: CreateBookingDto): Promise<BookingResult> {
    try {
      this.logger.log(`Creating booking for client: ${createBookingDto.clientId}`)

      // 1. Check tenant limits
      const limitsCheck = await this.tenantService.checkSubscriptionLimits(
        createBookingDto.businessId
      )

      if (!limitsCheck.isValid) {
        throw new BadRequestException(`Subscription limits exceeded: ${limitsCheck.warnings.join(', ')}`)
      }

      // 2. Get service details and calculate total duration
      const services = await this.getServicesDetails(createBookingDto.serviceIds)
      const totalDuration = this.calculateTotalDuration(services)
      const estimatedEndTime = this.addMinutesToTime(
        createBookingDto.preferredStartTime,
        totalDuration
      )

      // 3. Check availability
      const isAvailable = await this.availabilityService.checkSlotAvailability({
        businessId: createBookingDto.businessId,
        serviceId: createBookingDto.serviceIds[0], // Primary service for availability check
        date: createBookingDto.preferredDate,
        startTime: createBookingDto.preferredStartTime,
        duration: totalDuration
      })

      if (!isAvailable) {
        // Get alternative available slots
        const availableSlots = await this.availabilityService.getAvailableSlots({
          businessId: createBookingDto.businessId,
          serviceId: createBookingDto.serviceIds[0],
          date: createBookingDto.preferredDate,
          duration: totalDuration
        })

        // Return properly formatted result for unavailable slots
        return {
          bookingId: '',
          bookingNumber: '',
          estimatedTotal: this.calculateTotalPrice(services),
          expiresAt: new Date(),
          status: 'slot_unavailable',
          clientId: createBookingDto.clientId,
          businessId: createBookingDto.businessId,
          booking: null,
          availableSlots,
          message: 'Requested time slot is not available. Please choose from alternative slots.'
        }
      }

      // 4. Create booking
      const bookingData = {
        ...createBookingDto,
        services: services.map(service => ({
          serviceId: service._id,
          serviceName: service.basicDetails.serviceName,
          duration: this.getServiceDurationInMinutes(service),
          price: service.pricingAndDuration.price.amount,
          preferredStaffId: this.getPreferredStaff(service)
        })),
        estimatedEndTime,
        totalDuration,
        estimatedTotal: this.calculateTotalPrice(services),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes to confirm
      }

      const booking = await this.bookingService.createBooking(bookingData)

      // 5. Send notification
      await this.notificationService.notifyStaffNewBooking(booking)

      // 6. Emit event
      this.eventEmitter.emit('booking.created', booking)

      this.logger.log(`Booking created successfully: ${booking.bookingNumber}`)

      // Return properly formatted BookingResult
      return {
        bookingId: booking._id.toString(),
        bookingNumber: booking.bookingNumber,
        estimatedTotal: booking.estimatedTotal,
        expiresAt: booking.expiresAt,
        status: booking.status,
        clientId: booking.clientId.toString(),
        businessId: booking.businessId.toString(),
        booking,
        message: 'Booking created successfully. Please proceed with payment to confirm.',
        requiresPayment: true
      }

    } catch (error) {
      this.logger.error(`Failed to create booking: ${error.message}`)
      throw error
    }
  }

  async confirmBookingAndCreateAppointment(
    bookingId: string,
    staffId?: string
  ): Promise<AppointmentResult> {
    try {
      this.logger.log(`Confirming booking: ${bookingId}`)

      // 1. Get booking details
      const booking = await this.bookingService.getBookingById(bookingId)
      
      if (!booking || booking.status !== 'pending') {
        throw new BadRequestException('Invalid booking for confirmation')
      }

      // 2. Confirm booking
      await this.bookingService.updateBookingStatus(bookingId, 'confirmed', staffId)

      // 3. Create appointment
      const appointment = await this.appointmentService.createFromBooking(booking)

      // 4. Auto-assign staff or use preferred staff
      let staffAssignment = null

      try {
        staffAssignment = await this.staffService.autoAssignStaff(
          booking.businessId.toString(),
          appointment._id.toString(),
          booking.clientId.toString(),
          booking.services[0].serviceId.toString(),
          booking.preferredDate,
          booking.preferredStartTime,
          booking.estimatedEndTime
        )
      } catch (error) {
        this.logger.warn(`Auto-assignment failed: ${error.message}. Manual assignment required.`)
      }

      // 5. Send confirmation notifications
      await this.sendConfirmationNotifications(booking, appointment, staffAssignment)

      // 6. Emit events
      this.eventEmitter.emit('booking.confirmed', { booking, staffId, appointment })
      this.eventEmitter.emit('appointment.created', { appointment, booking, staffAssignment })

      this.logger.log(`Appointment created successfully: ${appointment.appointmentNumber}`)

      // Return properly formatted AppointmentResult
      return {
        appointmentId: appointment._id.toString(),
        appointmentNumber: appointment.appointmentNumber,
        scheduledDate: appointment.scheduledDate,
        scheduledTime: appointment.scheduledStartTime,
        status: appointment.status,
        clientId: appointment.clientId.toString(),
        businessId: appointment.businessId.toString(),
        booking: booking,
        message: 'Booking confirmed and appointment created successfully',
        appointment,
        assignment: staffAssignment
      }

    } catch (error) {
      this.logger.error(`Failed to confirm booking and create appointment: ${error.message}`)
      throw error
    }
  }

  async handlePaymentAndComplete(
    bookingId: string, // Changed from appointmentId to bookingId for automation flow
    transactionReference: string,
    paymentData: {
      amount: number
      method: string
      gateway: string
      clientId: string
      businessId: string
    }
  ): Promise<PaymentResult> {
    try {
      this.logger.log(`Processing payment for booking: ${bookingId}`)

      // 1. Get booking details
      const booking = await this.bookingService.getBookingById(bookingId)
      
      if (!booking) {
        throw new NotFoundException('Booking not found')
      }

      if (booking.status !== 'pending') {
        throw new BadRequestException('Booking is not in pending status')
      }

      // 2. Verify payment amount matches booking total
      if (paymentData.amount !== booking.estimatedTotal) {
        throw new BadRequestException('Payment amount does not match booking total')
      }

      // 3. Re-check availability before confirming (prevent double booking)
      const isStillAvailable = await this.checkAvailabilityForAllServices(
        booking.businessId.toString(),
        booking.services.map(s => s.serviceId.toString()),
        booking.preferredDate,
        booking.preferredStartTime,
        booking.totalDuration
      )

      if (!isStillAvailable) {
        // Handle unavailable slot with refund
        await this.handleUnavailableSlot(booking, transactionReference)
        throw new BadRequestException('Time slot is no longer available. Payment will be refunded.')
      }

      // 4. AUTOMATED FLOW: Payment successful → Create appointment automatically
      const appointmentResult = await this.confirmBookingAndCreateAppointment(bookingId)

      // 5. Create payment record
      const payment = await this.paymentService.createPaymentFromBooking(
        booking,
        transactionReference,
        {
          paymentMethod: paymentData.method,
          gateway: paymentData.gateway,
          status: 'completed'
        }
      )

      // 6. Update payment status
      await this.paymentService.updatePaymentStatus(
        payment._id.toString(),
        'completed',
        transactionReference
      )

      // 7. Link appointment to booking
      await this.bookingService.linkAppointment(bookingId, appointmentResult.appointment._id.toString())

      // 8. Send payment confirmation
      await this.notificationService.notifyPaymentConfirmation(
        payment._id.toString(),
        paymentData.clientId,
        paymentData.businessId,
        {
          clientName: booking.clientName,
          amount: paymentData.amount,
          method: paymentData.method,
          transactionId: transactionReference,
          serviceName: booking.services.map(s => s.serviceName).join(', '),
          appointmentDate: appointmentResult.appointment.scheduledDate.toDateString(),
          businessName: booking.businessName,
          receiptUrl: `${process.env.APP_URL}/receipts/${payment._id}`,
          clientEmail: booking.clientEmail,
          clientPhone: booking.clientPhone
        }
      )

      // 9. Emit completion event
      this.eventEmitter.emit('payment.completed', { payment, booking, appointment: appointmentResult.appointment })

      this.logger.log(`Payment processed and appointment created successfully`)

      // Return properly formatted PaymentResult
      return {
        paymentId: payment._id.toString(),
        success: true,
        message: 'Payment successful! Your appointment has been confirmed automatically.',
        transactionReference,
        amount: paymentData.amount,
        method: paymentData.method,
        gateway: paymentData.gateway,
        status: 'completed',
        payment, 
        appointment: appointmentResult.appointment
      }

    } catch (error) {
      this.logger.error(`Failed to process payment: ${error.message}`)
      // Handle payment failure
      await this.handlePaymentFailure(bookingId, transactionReference, error.message)
      throw error
    }
  }

  // Private helper methods
  private async sendConfirmationNotifications(booking: any, appointment: any, staffAssignment: any): Promise<void> {
    // Notify client about booking confirmation
    await this.notificationService.notifyBookingConfirmation(
      booking._id.toString(),
      booking.clientId.toString(),
      booking.businessId.toString(),
      {
        clientName: booking.clientName,
        serviceName: booking.services.map(s => s.serviceName).join(', '),
        date: booking.preferredDate.toDateString(),
        time: booking.preferredStartTime,
        businessName: booking.businessName,
        businessAddress: booking.businessAddress || 'N/A',
        appointmentNumber: appointment.appointmentNumber,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone
      }
    )

    // If staff assigned, notify them
    if (staffAssignment) {
      await this.notificationService.notifyStaffAssignment(
        appointment._id.toString(),
        staffAssignment.staffId.toString(),
        booking.businessId.toString(),
        {
          staffName: staffAssignment.staffName || 'Staff Member',
          clientName: booking.clientName,
          serviceName: booking.services.map(s => s.serviceName).join(', '),
          date: booking.preferredDate.toDateString(),
          time: booking.preferredStartTime,
          businessName: booking.businessName,
          appointmentNumber: appointment.appointmentNumber,
          staffEmail: 'staff@email.com', // Get from staff service
          staffPhone: '+1234567890' // Get from staff service
        }
      )
    }
  }

  private async checkAvailabilityForAllServices(
    businessId: string,
    serviceIds: string[],
    date: Date,
    startTime: string,
    totalDuration: number
  ): Promise<boolean> {
    return await this.availabilityService.checkSlotAvailability({
      businessId,
      serviceId: serviceIds[0], // Primary service
      date,
      startTime,
      duration: totalDuration
    })
  }

  private async handlePaymentFailure(
    bookingId: string,
    transactionReference: string,
    errorMessage: string
  ): Promise<void> {
    // 1. Update booking status
    await this.bookingService.updateBookingStatus(bookingId, 'payment_failed')

    // 2. Create failed payment record
    const booking = await this.bookingService.getBookingById(bookingId)
    
    const payment = await this.paymentService.createFailedPayment({
      bookingId,
      transactionReference,
      errorMessage,
      clientId: booking.clientId.toString(),
      businessId: booking.businessId.toString(),
      amount: booking.estimatedTotal
    })

    // 3. Send failure notification
    await this.notificationService.notifyPaymentFailed(
      payment._id.toString(),
      booking.clientId.toString(),
      booking.businessId.toString(),
      {
        clientName: booking.clientName,
        amount: booking.estimatedTotal,
        failureReason: errorMessage,
        serviceName: booking.services.map(s => s.serviceName).join(', '),
        appointmentDate: booking.preferredDate.toDateString(),
        businessName: booking.businessName,
        businessPhone: booking.businessPhone || 'N/A',
        retryPaymentUrl: `${process.env.APP_URL}/retry-payment/${bookingId}`,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone
      }
    )
  }

  private async handleUnavailableSlot(booking: any, transactionReference: string): Promise<void> {
    // Update booking status
    await this.bookingService.updateBookingStatus(booking._id.toString(), 'slot_unavailable')

    // Initiate refund (integrate with your payment provider's refund API)
    await this.paymentService.initiateRefund(transactionReference, booking.estimatedTotal)

    // Notify client
    await this.notificationService.notifySlotUnavailableRefund(
      booking._id.toString(),
      booking.clientId.toString(),
      booking.businessId.toString(),
      {
        clientName: booking.clientName,
        serviceName: booking.services.map(s => s.serviceName).join(', '),
        date: booking.preferredDate.toDateString(),
        time: booking.preferredStartTime,
        businessName: booking.businessName,
        businessPhone: booking.businessPhone || 'N/A',
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone
      }
    )
  }

  private async getServicesDetails(serviceIds: string[]): Promise<any[]> {
    return await this.serviceService.getServicesByIds(serviceIds)
  }

  private calculateTotalDuration(services: any[]): number {
    return services.reduce((total, service) => {
      const duration = service.pricingAndDuration.duration.servicingTime
      const minutes = duration.unit === 'h' ? duration.value * 60 : duration.value
      return total + minutes
    }, 0)
  }

  private calculateTotalPrice(services: any[]): number {
    return services.reduce((total, service) => {
      return total + service.pricingAndDuration.price.amount
    }, 0)
  }

  private getServiceDurationInMinutes(service: any): number {
    const duration = service.pricingAndDuration.duration.servicingTime
    return duration.unit === 'h' ? duration.value * 60 : duration.value
  }

  private addMinutesToTime(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60)
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
  }

  private getPreferredStaff(service: any): Types.ObjectId | undefined {
    if (service.teamMembers.allTeamMembers) return undefined
    
    const availableMembers = service.teamMembers.selectedMembers.filter(m => m.selected)
    return availableMembers.length > 0 ? availableMembers[0].id : undefined
  }
}