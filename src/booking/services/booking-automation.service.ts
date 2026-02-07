
// src/modules/booking/services/booking-automation.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common'
import { BookingService } from './booking.service'
import { AppointmentService } from '../../appointment/appointment.service'
import { PaymentService } from '../../payment/payment.service'
import { NotificationService } from '../../notification/notification.service'
import { StaffService } from '../../staff/staff.service'
import { AvailabilityService } from '../../availability/availability.service'
import { BusinessService } from '../../business/business.service' // ✅ CHANGED: TenantService -> BusinessService
import { SubscriptionService } from '../../subscription/subscription.service' // ✅ ADDED
import { EventEmitter2 } from '@nestjs/event-emitter'

interface AutomatedBookingResult {
  booking: any
  appointment?: any
  payment?: any
  staffAssignment?: any
  message: string
  requiresPayment: boolean
}

@Injectable()
export class BookingAutomationService {
  private readonly logger = new Logger(BookingAutomationService.name)

  constructor(
    private readonly bookingService: BookingService,
    private readonly appointmentService: AppointmentService,
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService,
    private readonly staffService: StaffService,
    private readonly availabilityService: AvailabilityService,
    private readonly businessService: BusinessService, // ✅ CHANGED: tenantService -> businessService
    private readonly subscriptionService: SubscriptionService, // ✅ ADDED
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // async createAutomatedBooking(bookingData: {
  //   businessId: string
  //   clientId: string
  //   serviceIds: string[]
  //   preferredDate: Date | string
  //   preferredStartTime: string
  //   clientName: string
  //   clientEmail: string
  //   clientPhone: string
  //   specialRequests?: string
  //   autoConfirm?: boolean
  // }): Promise<AutomatedBookingResult> {
  //   try {
  //     this.logger.log(`Creating automated booking for client: ${bookingData.clientId}`)

  //     const preferredDate = this.parseDate(bookingData.preferredDate)

  //     await this.validateTenantLimits(bookingData.businessId)

  //     const services = await this.getServicesDetails(bookingData.serviceIds)
  //     const { totalDuration, totalAmount } = this.calculateBookingTotals(services)
      
  //     const estimatedEndTime = this.addMinutesToTime(
  //       bookingData.preferredStartTime,
  //       totalDuration
  //     )

  //     const isAvailable = await this.checkAvailabilityForAllServices(
  //       bookingData.businessId,
  //       bookingData.serviceIds,
  //       preferredDate,
  //       bookingData.preferredStartTime,
  //       totalDuration
  //     )

  //     if (!isAvailable) {
  //       throw new BadRequestException('Selected time slot is no longer available')
  //     }

  //     const booking = await this.bookingService.createBooking({
  //       businessId: bookingData.businessId,
  //       clientId: bookingData.clientId,
  //       services: services.map(service => ({
  //         serviceId: service._id,
  //         serviceName: service.basicDetails.serviceName,
  //         duration: this.getServiceDurationInMinutes(service),
  //         price: service.pricingAndDuration.price.amount,
  //       })),
  //       preferredDate: preferredDate,
  //       preferredStartTime: bookingData.preferredStartTime,
  //       estimatedEndTime,
  //       totalDuration,
  //       estimatedTotal: totalAmount,
  //       specialRequests: bookingData.specialRequests,
  //       status: bookingData.autoConfirm ? 'confirmed' : 'pending'
  //     })

  //     this.logger.log(`Booking created with ID: ${booking._id}`)

  //     if (bookingData.autoConfirm) {
  //       return await this.processAutoConfirmedBooking(booking, services)
  //     }

  //     await this.notificationService.notifyStaffNewBooking(booking)
      
  //     return {
  //       booking,
  //       message: 'Booking created successfully. Payment required to confirm appointment.',
  //       requiresPayment: true
  //     }

  //   } catch (error) {
  //     this.logger.error(`Failed to create automated booking: ${error.message}`)
  //     throw error
  //   }
  // }

    async createAutomatedBooking(bookingData: {
    businessId: string
    clientId: string
    serviceIds: string[]
    preferredDate: Date | string
    preferredStartTime: string
    clientName: string
    clientEmail: string
    clientPhone?: string
    specialRequests?: string
    autoConfirm?: boolean
  }): Promise<AutomatedBookingResult> {
    try {
      this.logger.log(`Creating automated booking for client: ${bookingData.clientId}`)

      const preferredDate = this.parseDate(bookingData.preferredDate)

      // ✅ CHANGED: Use subscriptionService to validate limits
      await this.validateBusinessLimits(bookingData.businessId)

      const services = await this.getServicesDetails(bookingData.serviceIds)
      const { totalDuration, totalAmount } = this.calculateBookingTotals(services)
      
      const estimatedEndTime = this.addMinutesToTime(
        bookingData.preferredStartTime,
        totalDuration
      )

      const isAvailable = await this.checkAvailabilityForAllServices(
        bookingData.businessId,
        bookingData.serviceIds,
        preferredDate,
        bookingData.preferredStartTime,
        totalDuration
      )

      if (!isAvailable) {
        throw new BadRequestException('Selected time slot is no longer available')
      }

      const booking = await this.bookingService.createBooking({
        businessId: bookingData.businessId,
        clientId: bookingData.clientId,
        services: services.map(service => ({
          serviceId: service._id,
          serviceName: service.basicDetails.serviceName,
          duration: this.getServiceDurationInMinutes(service),
          price: service.pricingAndDuration.price.amount,
        })),
        preferredDate: preferredDate,
        preferredStartTime: bookingData.preferredStartTime,
        estimatedEndTime,
        totalDuration,
        estimatedTotal: totalAmount,
        specialRequests: bookingData.specialRequests,
        status: bookingData.autoConfirm ? 'confirmed' : 'pending'
      })

      this.logger.log(`Booking created with ID: ${booking._id}`)

      if (bookingData.autoConfirm) {
        return await this.processAutoConfirmedBooking(booking, services)
      }

      await this.notificationService.notifyStaffNewBooking(booking)
      
      return {
        booking,
        message: 'Booking created successfully. Payment required to confirm appointment.',
        requiresPayment: true
      }

    } catch (error) {
      this.logger.error(`Failed to create automated booking: ${error.message}`)
      throw error
    }
  }

  async processPaymentAndCreateAppointment(
    bookingId: string,
    paymentData: {
      transactionReference: string
      amount: number
      paymentMethod: string
      gateway: string
      status: 'successful' | 'failed'
    }
  ): Promise<AutomatedBookingResult> {
    try {
      this.logger.log(`Processing payment for booking: ${bookingId}`)

      const booking = await this.bookingService.getBookingById(bookingId)
      
      if (!booking) {
        throw new BadRequestException('Booking not found')
      }

      if (booking.status !== 'pending') {
        throw new BadRequestException('Booking is not in pending status')
      }

      if (paymentData.amount !== booking.estimatedTotal) {
        throw new BadRequestException('Payment amount does not match booking total')
      }

      if (paymentData.status === 'failed') {
        return await this.handlePaymentFailure(booking, paymentData.transactionReference)
      }

      const bookingDate = this.parseDate(booking.preferredDate)

      const isStillAvailable = await this.checkAvailabilityForAllServices(
        booking.businessId.toString(),
        booking.services.map(s => s.serviceId.toString()),
        bookingDate,
        booking.preferredStartTime,
        booking.totalDuration
      )

      if (!isStillAvailable) {
        await this.handleUnavailableSlot(booking, paymentData.transactionReference)
        throw new BadRequestException('Time slot is no longer available. Payment will be refunded.')
      }

      await this.bookingService.updateBookingStatus(bookingId, 'confirmed')

      // FIX: Added the missing 'amount' property
      const payment = await this.paymentService.createPaymentFromBooking(
        booking,
        paymentData.transactionReference,
        {
          paymentMethod: paymentData.paymentMethod,
          gateway: paymentData.gateway,
          status: 'completed',
          amount: paymentData.amount,
          paymentType: 'full'
        }
      )

      const appointment = await this.appointmentService.createFromBooking(booking)

      const staffAssignment = await this.autoAssignStaffToAppointment(
        appointment,
        booking.services
      )

      await this.sendAppointmentConfirmationNotifications(
        appointment,
        payment,
        staffAssignment
      )

      this.eventEmitter.emit('appointment.created', {
        appointment,
        booking,
        payment,
        staffAssignment
      })

      this.logger.log(`Successfully created appointment: ${appointment._id}`)

      return {
        booking,
        appointment,
        payment,
        staffAssignment,
        message: 'Payment successful! Your appointment has been confirmed.',
        requiresPayment: false
      }

    } catch (error) {
      this.logger.error(`Failed to process payment and create appointment: ${error.message}`)
      throw error
    }
  }

  private parseDate(date: Date | string): Date {
    if (date instanceof Date) {
      return date
    }
    
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid date format')
    }
    
    return parsedDate
  }

  private async processAutoConfirmedBooking(booking: any, services: any[]): Promise<AutomatedBookingResult> {
    const appointment = await this.appointmentService.createFromBooking(booking)
    
    const staffAssignment = await this.autoAssignStaffToAppointment(appointment, services)
    
    await this.sendAppointmentConfirmationNotifications(appointment, null, staffAssignment)
    
    return {
      booking,
      appointment,
      staffAssignment,
      message: 'Booking confirmed and appointment created successfully!',
      requiresPayment: false
    }
  }

  private async validateBusinessLimits(businessId: string): Promise<void> {
    const limitsCheck = await this.subscriptionService.checkLimits(businessId, 'booking')
    
    if (!limitsCheck.isValid) {
      throw new BadRequestException(`Subscription limits exceeded: ${limitsCheck.warnings.join(', ')}`)
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
      serviceId: serviceIds[0],
      date: date.toISOString().split('T')[0],
      startTime,
      duration: totalDuration
    })
  }

  private async autoAssignStaffToAppointment(appointment: any, services: any[]): Promise<any> {
    try {
      const primaryService = services[0]
      
      const scheduledDate = this.parseDate(appointment.scheduledDate)
      
      return await this.staffService.autoAssignStaff(
        appointment.businessId.toString(),
        appointment._id.toString(),
        appointment.clientId.toString(),
        primaryService._id.toString(),
        scheduledDate,
        appointment.scheduledStartTime,
        appointment.scheduledEndTime
      )
    } catch (error) {
      this.logger.warn(`Staff auto-assignment failed: ${error.message}. Manual assignment required.`)
      return null
    }
  }

  private async sendAppointmentConfirmationNotifications(
    appointment: any,
    payment: any,
    staffAssignment: any
  ): Promise<void> {
    const appointmentDate = this.parseDate(appointment.scheduledDate)
    const dateString = appointmentDate.toDateString()
    
    await this.notificationService.notifyBookingConfirmation(
      appointment.bookingId.toString(),
      appointment.clientId.toString(),
      appointment.businessId.toString(),
      {
        clientName: appointment.clientName,
        serviceName: appointment.services.map(s => s.serviceName).join(', '),
        date: dateString,
        time: appointment.scheduledStartTime,
        businessName: appointment.businessName,
        appointmentNumber: appointment.appointmentNumber,
        clientEmail: appointment.clientEmail,
        clientPhone: appointment.clientPhone
      }
    )

    if (payment) {
      await this.notificationService.notifyPaymentConfirmation(
        payment._id.toString(),
        appointment.clientId.toString(),
        appointment.businessId.toString(),
        {
          clientName: appointment.clientName,
          amount: payment.totalAmount,
          method: payment.paymentMethod,
          transactionId: payment.transactionId,
          serviceName: appointment.services.map(s => s.serviceName).join(', '),
          appointmentDate: dateString,
          businessName: appointment.businessName,
          clientEmail: appointment.clientEmail,
          clientPhone: appointment.clientPhone
        }
      )
    }

    if (staffAssignment) {
      await this.notificationService.notifyStaffAssignment(
        appointment._id.toString(),
        staffAssignment.staffId.toString(),
        appointment.businessId.toString(),
        {
          staffName: staffAssignment.staffName,
          clientName: appointment.clientName,
          serviceName: appointment.services.map(s => s.serviceName).join(', '),
          date: dateString,
          time: appointment.scheduledStartTime,
          businessName: appointment.businessName,
          appointmentNumber: appointment.appointmentNumber
        }
      )
    }
  }

  private async handlePaymentFailure(booking: any, transactionReference: string): Promise<AutomatedBookingResult> {
    await this.bookingService.updateBookingStatus(booking._id.toString(), 'payment_failed')

    await this.paymentService.createFailedPayment({
      bookingId: booking._id.toString(),
      transactionReference,
      clientId: booking.clientId.toString(),
      businessId: booking.businessId.toString(),
      amount: booking.estimatedTotal,
      errorMessage: 'Payment failed'
    })

    await this.notificationService.notifyPaymentFailed(
      booking._id.toString(),
      booking.clientId.toString(),
      booking.businessId.toString(),
      {
        clientName: booking.clientName,
        amount: booking.estimatedTotal,
        failureReason: 'Payment processing failed',
        serviceName: booking.services.map(s => s.serviceName).join(', '),
        businessName: booking.businessName,
        retryPaymentUrl: `${process.env.APP_URL}/retry-payment/${booking._id}`,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone
      }
    )

    return {
      booking,
      message: 'Payment failed. Please try again or contact support.',
      requiresPayment: true
    }
  }

  private async handleUnavailableSlot(booking: any, transactionReference: string): Promise<void> {
    await this.bookingService.updateBookingStatus(booking._id.toString(), 'slot_unavailable')

    await this.paymentService.initiateRefund(booking.businessId.toString(), transactionReference, booking.estimatedTotal)

    await this.notificationService.notifySlotUnavailableRefund(
      booking._id.toString(),
      booking.clientId.toString(),
      booking.businessId.toString(),
      {
        clientName: booking.clientName,
        amount: booking.estimatedTotal,
        serviceName: booking.services.map(s => s.serviceName).join(', '),
        businessName: booking.businessName,
        rebookUrl: `${process.env.APP_URL}/book-again`,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone
      }
    )
  }

  private async getServicesDetails(serviceIds: string[]): Promise<any[]> {
    return serviceIds.map(id => ({
      _id: id,
      basicDetails: {
        serviceName: 'Sample Service',
      },
      pricingAndDuration: {
        price: { amount: 5000 },
        duration: {
          servicingTime: { value: 60, unit: 'min' }
        }
      }
    }))
  }

  private calculateBookingTotals(services: any[]): { totalDuration: number; totalAmount: number } {
    const totalDuration = services.reduce((total, service) => {
      const duration = service.pricingAndDuration.duration.servicingTime
      const minutes = duration.unit === 'h' ? duration.value * 60 : duration.value
      return total + minutes
    }, 0)

    const totalAmount = services.reduce((total, service) => {
      return total + service.pricingAndDuration.price.amount
    }, 0)

    return { totalDuration, totalAmount }
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
}