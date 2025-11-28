

// src/modules/booking/services/booking-orchestrator.service.ts
import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common'
import { BookingService } from './booking.service'
import { AppointmentService } from '../../appointment/appointment.service'
import { PaymentService } from '../../payment/payment.service'
import { AvailabilityService } from  '../../availability/availability.service'
import { NotificationService } from '../../notification/notification.service'
import { StaffService } from '../../staff/staff.service'
import { TenantService } from '../../tenant/tenant.service'
import { ServiceService } from '../../service/service.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ServiceBookingDto, CreateBookingDto } from "../dto/create-booking.dto"
import { AppointmentResult } from "../types/booking.types"
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

import { Types } from 'mongoose'

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

// interface AppointmentResult {
//   appointmentId: string
//   appointmentNumber: string
//   scheduledDate: Date
//   scheduledTime: string
//   status: string
//   clientId: string
//   businessId: string
//   booking: any
//   message: string
//   appointment: any
//   assignment: any
// }

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

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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

// NEW HELPER METHOD: Calculate total buffer time
private calculateTotalBufferTime(services: ServiceBookingDto[]): number {
  return services.reduce((total, service) => {
    return total + (service.bufferTime || 0)
  }, 0)
}

  async handlePaymentAndComplete(
  bookingId: string,
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
    console.log('💳 Processing payment...')
    console.log('  - Booking ID:', bookingId)
    console.log('  - Transaction Reference:', transactionReference)
    console.log('  - Amount:', paymentData.amount)
    console.log('  - Method:', paymentData.method)
    console.log('  - Gateway:', paymentData.gateway)

    // 1. Get booking details
    const booking = await this.bookingService.getBookingById(bookingId)
    
    if (!booking) {
      throw new NotFoundException('Booking not found')
    }

    if (booking.status !== 'pending') {
      throw new BadRequestException(
        `Booking is not in pending status. Current status: ${booking.status}`
      )
    }

    // 2. Verify payment amount matches booking total
    if (paymentData.amount !== booking.estimatedTotal) {
      throw new BadRequestException(
        `Payment amount (${paymentData.amount}) does not match booking total (${booking.estimatedTotal})`
      )
    }

    // 3. Re-check availability before confirming (prevent double booking)
    const bookingDate = this.parseDate(booking.preferredDate)
    
    const isStillAvailable = await this.checkAvailabilityForAllServices(
      booking.businessId.toString(),
      booking.services.map(s => s.serviceId.toString()),
      bookingDate,
      booking.preferredStartTime,
      booking.totalDuration
    )

    if (!isStillAvailable) {
      console.warn('⚠️ Time slot is no longer available')
      // Handle unavailable slot with refund
      await this.handleUnavailableSlot(booking, transactionReference)
      throw new BadRequestException(
        'Time slot is no longer available. Payment will be refunded.'
      )
    }

    // 4. AUTOMATED FLOW: Payment successful → Create appointment automatically
    console.log('📅 Creating appointment from booking...')
    const appointmentResult = await this.confirmBookingAndCreateAppointment(bookingId)

    // 5. Create payment record with proper method mapping
    console.log('💾 Creating payment record...')
    const payment = await this.paymentService.createPaymentFromBooking(
      booking,
      transactionReference,
      {
        paymentMethod: paymentData.method, // 'card', 'bank_transfer', etc
        gateway: paymentData.gateway,      // 'paystack', 'stripe', etc
        status: 'completed'
      }
    )

    // 6. Update payment status
    console.log('✅ Updating payment status...')
    await this.paymentService.updatePaymentStatus(
      payment._id.toString(),
      'completed',
      transactionReference
    )

    // 7. Link appointment to booking
    await this.bookingService.linkAppointment(bookingId, appointmentResult.appointment._id.toString())

    // 8. Send payment confirmation
    const appointmentDate = this.parseDate(appointmentResult.appointment.scheduledDate)
    
    try {
      await this.notificationService.notifyPaymentConfirmation(
        payment._id.toString(),
        paymentData.clientId,
        paymentData.businessId,
        {
          clientName: booking.clientName,
          amount: paymentData.amount,
          method: paymentData.method,
          gateway: paymentData.gateway,
          transactionId: transactionReference,
          serviceName: booking.services.map(s => s.serviceName).join(', '),
          appointmentDate: appointmentDate.toDateString(),
          businessName: booking.businessName,
          receiptUrl: `${process.env.APP_URL}/receipts/${payment._id}`,
          clientEmail: booking.clientEmail,
          clientPhone: booking.clientPhone
        }
      )
      console.log('✅ Payment confirmation notification sent')
    } catch (notificationError) {
      console.warn('⚠️ Notification failed (continuing):', notificationError.message)
      // Don't fail payment if notification fails
    }

    // 9. Emit completion event
    this.eventEmitter.emit('payment.completed', { 
      payment, 
      booking, 
      appointment: appointmentResult.appointment 
    })

    console.log('✅ PAYMENT PROCESSING COMPLETE')

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
    console.error('❌ Payment processing failed:', error.message)
    
    // Handle payment failure
    try {
      await this.handlePaymentFailure(bookingId, transactionReference, error.message)
    } catch (failureError) {
      console.error('❌ Failed to handle payment failure:', failureError.message)
    }
    
    throw error
  }
}

  private async sendConfirmationNotifications(
  booking: any, 
  appointment: any, 
  staffAssignments: any[]
): Promise<void> {
  const bookingDate = this.parseDate(booking.preferredDate)
  
  // Notify client about booking confirmation
  await this.notificationService.notifyBookingConfirmation(
    booking._id.toString(),
    booking.clientId.toString(),
    booking.businessId.toString(),
    {
      clientName: booking.clientName,
      serviceName: booking.services.map(s => s.serviceName).join(', '),
      date: bookingDate.toDateString(),
      time: booking.preferredStartTime,
      businessName: booking.businessName,
      businessAddress: booking.businessAddress || 'N/A',
      appointmentNumber: appointment.appointmentNumber,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      staffCount: staffAssignments.length
    }
  )

  // Notify each assigned staff member
  for (const assignment of staffAssignments) {
    if (assignment.status === 'assigned' && assignment.staffId) {
      try {
        // Find the service this staff is assigned to
        const assignedService = booking.services.find(
          s => s.serviceId.toString() === assignment.serviceId
        )

        await this.notificationService.notifyStaffAssignment(
          appointment._id.toString(),
          assignment.staffId,
          booking.businessId.toString(),
          {
            staffName: assignment.staffName || 'Staff Member',
            clientName: booking.clientName,
            serviceName: assignedService?.serviceName || 'Service',
            date: bookingDate.toDateString(),
            time: booking.preferredStartTime,
            businessName: booking.businessName,
            appointmentNumber: appointment.appointmentNumber,
            staffEmail: assignment.email || 'staff@email.com',
            staffPhone: assignment.phone || '+1234567890'
          }
        )
        
        // this.logger.log(`✅ Notification sent to staff ${assignment.staffId}`)
      } catch (error) {
        this.logger.error(`Failed to notify staff ${assignment.staffId}: ${error.message}`)
      }
    }
  }
}

// UPDATED: Remove preferred staff logic from booking creation
async createBookingWithValidation(createBookingDto: CreateBookingDto): Promise<BookingResult> {
  try {
    console.log(`🚀 Creating booking for client: ${createBookingDto.clientId}`)

    const preferredDate = this.parseDate(createBookingDto.preferredDate)
    const dateString = this.formatDateForAvailability(preferredDate)

    // 1. Check tenant limits
    const limitsCheck = await this.tenantService.checkSubscriptionLimits(
      createBookingDto.businessId,
      'booking'
    )

    if (!limitsCheck.isValid) {
      throw new BadRequestException(`Subscription limits exceeded: ${limitsCheck.warnings.join(', ')}`)
    }

    // 2. Get service details
    const serviceIds = createBookingDto.services.map(s => s.serviceId)
    
    let services: any[] = []
    try {
      services = await this.getServicesDetails(serviceIds)
      console.log(`✅ Fetched ${services.length} services`)
    } catch (error) {
      console.error(`❌ Service fetch error: ${error.message}`)
      throw new BadRequestException(`Failed to fetch service details: ${error.message}`)
    }

    if (!services || services.length === 0) {
      throw new BadRequestException('No services found for the provided service IDs')
    }
    
    // 3. Create buffer time map
    const bufferTimeMap = new Map<string, number>()
    createBookingDto.services.forEach(s => {
      bufferTimeMap.set(s.serviceId, s.bufferTime || 0)
    })
    
    // 4. Calculate totals
    const totalDuration = this.calculateTotalDuration(services)
    const totalBufferTime = this.calculateTotalBufferTime(createBookingDto.services)
    const totalDurationWithBuffer = totalDuration + totalBufferTime
    
    console.log(`⏱️ Duration: ${totalDuration}min, Buffer: ${totalBufferTime}min, Total: ${totalDurationWithBuffer}min`)
    
    const estimatedEndTime = this.addMinutesToTime(
      createBookingDto.preferredStartTime,
      totalDurationWithBuffer
    )

    // 5. Check availability (NO staff assignment at this stage)
    console.log(`🔍 Checking availability for ${dateString} at ${createBookingDto.preferredStartTime}`)
    
    const fullyBookedCheck = await this.availabilityService.isFullyBooked({
      businessId: createBookingDto.businessId,
      date: dateString,
      startTime: createBookingDto.preferredStartTime,
      duration: totalDuration,
      bufferTime: totalBufferTime
    })

    console.log(`📊 Availability check result:`, fullyBookedCheck)

    if (fullyBookedCheck.isFullyBooked) {
      const availableSlots = await this.availabilityService.getAvailableSlots({
        businessId: createBookingDto.businessId,
        serviceId: '',
        date: dateString,
        duration: totalDuration,
        bufferTime: totalBufferTime
      })

      return {
        bookingId: '',
        bookingNumber: '',
        estimatedTotal: this.calculateTotalPrice(services),
        expiresAt: new Date(),
        status: 'fully_booked',
        clientId: createBookingDto.clientId,
        businessId: createBookingDto.businessId,
        booking: null,
        availableSlots,
        message: fullyBookedCheck.message + '. Please choose from alternative slots.'
      }
    }

    // 6. Map services WITHOUT preferred staff (removed)
    const mappedServices = services.map((service, index) => {
      const serviceIdStr = service._id.toString()
      const bufferTime = bufferTimeMap.get(serviceIdStr) || 0
      
      return {
        serviceId: service._id,
        serviceName: service.basicDetails.serviceName,
        duration: this.getServiceDurationInMinutes(service),
        bufferTime: bufferTime,
        price: service.pricingAndDuration.price.amount
        // REMOVED: preferredStaffId - staff is assigned later
      }
    })

    // 7. Create booking data
    const bookingData = {
      clientId: createBookingDto.clientId,
      businessId: createBookingDto.businessId,
      preferredDate: preferredDate,
      preferredStartTime: createBookingDto.preferredStartTime,
      clientName: createBookingDto.clientName,
      clientEmail: createBookingDto.clientEmail,
      clientPhone: createBookingDto.clientPhone,
      specialRequests: createBookingDto.specialRequests,
      services: mappedServices,
      estimatedEndTime,
      totalDuration,
      totalBufferTime,
      estimatedTotal: this.calculateTotalPrice(services),
      status: 'pending',
      bookingSource: 'online',
      metadata: { platform: 'web' }
    }

    console.log(`💾 Creating booking with ${bookingData.services.length} services`)

    const booking = await this.bookingService.createBooking(bookingData)

    await this.notificationService.notifyStaffNewBooking(booking)
    this.eventEmitter.emit('booking.created', booking)

    console.log(`✅ Booking created: ${booking.bookingNumber}`)

    return {
      bookingId: booking._id.toString(),
      bookingNumber: booking.bookingNumber,
      estimatedTotal: booking.estimatedTotal,
      expiresAt: booking.expiresAt,
      status: booking.status,
      clientId: booking.clientId.toString(),
      businessId: booking.businessId.toString(),
      booking,
      message: 'Booking created successfully. Awaiting staff assignment and confirmation.',
      requiresPayment: true
    }

  } catch (error) {
    console.error(`❌ Booking creation failed: ${error.message}`)
    throw error
  }
}


private parseDate(date: Date | string): Date {
  if (date instanceof Date) {
    return date
  }
  const parsedDate = new Date(date + 'T00:00:00.000Z')
  if (isNaN(parsedDate.getTime())) {
    throw new BadRequestException(`Invalid date format: ${date}`)
  }
  return parsedDate
}

private formatDateForAvailability(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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
      date: this.formatDateForAvailability(date), // Convert Date to string
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

    // Parse booking date
    const bookingDate = this.parseDate(booking.preferredDate)

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
        appointmentDate: bookingDate.toDateString(),
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

    // Parse booking date
    const bookingDate = this.parseDate(booking.preferredDate)

    // Notify client
    await this.notificationService.notifySlotUnavailableRefund(
      booking._id.toString(),
      booking.clientId.toString(),
      booking.businessId.toString(),
      {
        clientName: booking.clientName,
        serviceName: booking.services.map(s => s.serviceName).join(', '),
        date: bookingDate.toDateString(),
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

  //Added newly
  // src/modules/booking/services/booking-orchestrator.service.ts
// CRITICAL UPDATES TO FIX ALL ISSUES

// ISSUE 1: Booking status is 'confirmed' on second attempt
// FIX: Check status BEFORE updating
async confirmBookingAndCreateAppointment(
  bookingId: string,
  staffId?: string,
  staffAssignments?: Array<{ staffId: string; serviceId: string; staffName?: string }>
): Promise<AppointmentResult> {
  console.log('=== ORCHESTRATOR: CONFIRM BOOKING START ===')
  console.log('BookingId:', bookingId)
  console.log('Single StaffId:', staffId)
  console.log('Staff Assignments:', staffAssignments?.length || 0)
  
  try {
    // STEP 1: Get booking
    const booking = await this.bookingService.getBookingById(bookingId)
    console.log('✅ Booking found:', booking.bookingNumber)
    console.log('Current status:', booking.status)
    
    // FIX: Better status validation with specific error message
    if (booking.status !== 'pending') {
      throw new BadRequestException(
        `Cannot confirm booking. Current status is '${booking.status}'. Only 'pending' bookings can be confirmed. ` +
        `This booking may have already been confirmed or expired.`
      )
    }
    
    // STEP 2: Validate that we have staff assignments (either single or multiple)
    if (!staffId && (!staffAssignments || staffAssignments.length === 0)) {
      throw new BadRequestException(
        'Staff assignment is required. Provide either staffId or staffAssignments.'
      )
    }
    
    // STEP 3: Validate staff availability for each service
    const bookingDate = this.parseDate(booking.preferredDate)
    const dateString = this.formatDateForAvailability(bookingDate)
    
    let staffToValidate: Array<{ staffId: string; serviceId: string }> = []
    
    if (staffAssignments && staffAssignments.length > 0) {
      staffToValidate = staffAssignments.map(a => ({
        staffId: a.staffId,
        serviceId: a.serviceId
      }))
    } else if (staffId) {
      // Legacy single staff for all services
      staffToValidate = booking.services.map(s => ({
        staffId: staffId,
        serviceId: s.serviceId.toString()
      }))
    }
    
    // Validate each staff member's availability
    console.log(`🔍 Validating ${staffToValidate.length} staff assignments`)
    
    const unavailableStaff: Array<{ staffId: string; serviceName: string; reason: string }> = []
    
    for (const assignment of staffToValidate) {
      const service = booking.services.find(s => s.serviceId.toString() === assignment.serviceId)
      
      if (!service) {
        throw new BadRequestException(`Service ${assignment.serviceId} not found in booking`)
      }
      
      const duration = service.duration + (service.bufferTime || 0)
      const endTime = this.addMinutesToTime(booking.preferredStartTime, duration)
      
      const isAvailable = await this.availabilityService.checkSlotAvailability({
        businessId: booking.businessId.toString(),
        serviceId: assignment.serviceId,
        date: dateString,
        startTime: booking.preferredStartTime,
        duration: duration
      })
      
      if (!isAvailable) {
        unavailableStaff.push({
          staffId: assignment.staffId,
          serviceName: service.serviceName,
          reason: `Not available on ${dateString} from ${booking.preferredStartTime} to ${endTime}`
        })
        console.warn(`⚠️ Staff ${assignment.staffId} NOT available for service ${service.serviceName}`)
      } else {
        console.log(`✅ Staff ${assignment.staffId} available for service ${assignment.serviceId}`)
      }
    }
    
    // FIX: Return detailed error if any staff is unavailable
    if (unavailableStaff.length > 0) {
      const errorDetails = unavailableStaff
        .map(s => `${s.staffId}: ${s.serviceName} (${s.reason})`)
        .join('; ')
      
      throw new BadRequestException(
        `The following staff members are not available for the requested time slot: ${errorDetails}. ` +
        `Please try different staff or time slots.`
      )
    }
    
    // STEP 4: Update booking status to confirmed (DO THIS FIRST before any other operations)
    console.log('📝 Updating booking status to confirmed...')
    await this.bookingService.updateBookingStatus(bookingId, 'confirmed', staffId)
    console.log('✅ Booking status updated to confirmed')
    
    // STEP 5: Create appointment
    console.log('📅 Creating appointment from booking...')
    const appointment = await this.appointmentService.createFromBooking(booking)
    console.log('✅ Appointment created:', appointment.appointmentNumber)
    
    // STEP 6: Create staff assignments
    let staffAssignmentResults: any[] = []
    
    if (staffAssignments && staffAssignments.length > 0) {
      // Multiple staff assignments
      console.log(`📋 Creating ${staffAssignments.length} staff assignments`)
      
      for (const assignment of staffAssignments) {
        try {
          const service = booking.services.find(
            s => s.serviceId.toString() === assignment.serviceId
          )
          
          if (!service) {
            console.warn(`⚠️ Service ${assignment.serviceId} not found`)
            continue
          }
          
          const duration = service.duration
          const endTime = this.addMinutesToTime(booking.preferredStartTime, duration)
          
          console.log(`📌 Assigning staff ${assignment.staffId} to service ${service.serviceName}`)
          console.log(`   Time: ${booking.preferredStartTime} - ${endTime} (${duration} mins)`)
          
          const result = await this.staffService.assignStaffToAppointment({
            staffId: assignment.staffId,
            businessId: booking.businessId.toString(),
            appointmentId: appointment._id.toString(),
            clientId: booking.clientId.toString(),
            assignmentDate: bookingDate,
            assignmentDetails: {
              startTime: booking.preferredStartTime,
              endTime: endTime,
              assignmentType: 'primary',
              estimatedDuration: duration,
              serviceId: assignment.serviceId,
              serviceName: service.serviceName,
              specialInstructions: booking.specialRequests || '',
              roomNumber: '',
              requiredEquipment: [],
              clientPreferences: '',
              setupTimeMinutes: 0,
              cleanupTimeMinutes: 0
            },
            assignedBy: staffId || assignment.staffId,
            assignmentMethod: 'manual'
          })
          
          staffAssignmentResults.push({
            staffId: assignment.staffId,
            serviceId: assignment.serviceId,
            staffName: assignment.staffName,
            status: 'assigned',
            ...result
          })
          
          console.log(`✅ Successfully assigned staff ${assignment.staffId}`)
        } catch (error) {
          console.error(`❌ Failed to assign staff ${assignment.staffId}:`, error.message)
          
          // Log the error but continue with other staff
          staffAssignmentResults.push({
            staffId: assignment.staffId,
            serviceId: assignment.serviceId,
            staffName: assignment.staffName,
            error: error.message,
            status: 'failed'
          })
        }
      }
    } else if (staffId) {
      // Single staff assignment (legacy)
      console.log(`📋 Single staff assignment: ${staffId}`)
      
      try {
        const result = await this.staffService.autoAssignStaff(
          booking.businessId.toString(),
          appointment._id.toString(),
          booking.clientId.toString(),
          booking.services[0].serviceId.toString(),
          bookingDate,
          booking.preferredStartTime,
          booking.estimatedEndTime
        )
        
        staffAssignmentResults.push(result)
        console.log(`✅ Single staff assignment completed`)
      } catch (error) {
        console.error(`❌ Single staff assignment failed:`, error.message)
        staffAssignmentResults.push({
          staffId: staffId,
          error: error.message,
          status: 'failed'
        })
      }
    }
    
    // STEP 7: Send notifications (wrap in try-catch to not fail the whole operation)
    console.log('📧 Sending confirmation notifications')
    try {
      await this.sendConfirmationNotifications(booking, appointment, staffAssignmentResults)
      console.log('✅ Notifications sent successfully')
    } catch (notificationError) {
      console.warn('⚠️ Notification sending failed (continuing):', notificationError.message)
      // Don't throw - notifications failing shouldn't fail the booking
    }
    
    // STEP 8: Emit events
    console.log('📡 Emitting booking events')
    this.eventEmitter.emit('booking.confirmed', { 
      booking, 
      staffId, 
      staffAssignments: staffAssignmentResults,
      appointment 
    })
    
    this.eventEmitter.emit('appointment.created', { 
      appointment, 
      booking, 
      staffAssignments: staffAssignmentResults 
    })
    
    console.log('✅ BOOKING CONFIRMATION COMPLETE')
    
    // STEP 9: Return success response
    return {
      appointmentId: appointment._id.toString(),
      appointmentNumber: appointment.appointmentNumber,
      scheduledDate: appointment.selectedDate,
      scheduledTime: appointment.selectedTime,
      status: appointment.status,
      clientId: appointment.clientId.toString(),
      businessId: appointment.businessInfo.businessId,
      booking: booking,
      message: `Booking confirmed with ${staffAssignmentResults.filter(s => s.status === 'assigned').length} staff member(s) assigned`,
      appointment,
      assignment: staffAssignmentResults.length === 1 ? staffAssignmentResults[0] : null,
      assignments: staffAssignmentResults
    }
  } catch (error) {
    console.error('❌ BOOKING CONFIRMATION FAILED:', error.message)
    console.error('Stack:', error.stack)
    throw error
  }
}

// NEW: Add comprehensive staff availability setup when a staff member is added to a business
async setupDefaultStaffAvailability(
  businessId: string,
  staffId: string,
  createdBy: string
): Promise<void> {
  console.log(`🌐 Setting up 24/7 availability for staff ${staffId}`)
  
  try {
    // Create 24/7 availability for next 365 days
    const today = new Date()
    const endDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000) // 365 days ahead
    
    await this.availabilityService.setupStaffAvailability24x7(
      businessId,
      staffId,
      today,
      endDate,
      createdBy
    )
    
    console.log(`✅ Successfully setup 24/7 availability for staff`)
  } catch (error) {
    console.error(`❌ Failed to setup staff availability:`, error.message)
    throw error
  }
}

// NEW: Enhanced error messages for staff availability
private async validateAndReportStaffAvailability(
  staffAssignments: Array<{ staffId: string; serviceId: string; staffName?: string }>,
  booking: any,
  availabilityService: any
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = []
  
  for (const assignment of staffAssignments) {
    const service = booking.services.find(
      s => s.serviceId.toString() === assignment.serviceId
    )
    
    if (!service) {
      errors.push(`Service not found: ${assignment.serviceId}`)
      continue
    }
    
    const duration = service.duration + (service.bufferTime || 0)
    const endTime = this.addMinutesToTime(booking.preferredStartTime, duration)
    const dateString = this.formatDateForAvailability(this.parseDate(booking.preferredDate))
    
    // Check staff availability
    const isAvailable = await availabilityService.checkSlotAvailability({
      businessId: booking.businessId.toString(),
      serviceId: assignment.serviceId,
      date: dateString,
      startTime: booking.preferredStartTime,
      duration: duration
    })
    
    if (!isAvailable) {
      errors.push(
        `${assignment.staffName || 'Staff'} (${assignment.staffId}) is not available for ${service.serviceName} ` +
        `on ${booking.preferredDate} from ${booking.preferredStartTime} to ${endTime}`
      )
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
}