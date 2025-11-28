// src/modules/booking/events/booking.events.ts
import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { NotificationService } from '../../notification/notification.service'

@Injectable()
export class BookingEventHandler {
  private readonly logger = new Logger(BookingEventHandler.name)

  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('booking.created')
  async handleBookingCreated(booking: any) {
    this.logger.log(`Handling booking created event for: ${booking.bookingNumber}`)
    
    // Send notification to business staff
    await this.notificationService.notifyStaffNewBooking(booking)
  }

  @OnEvent('booking.confirmed')
  async handleBookingConfirmed(data: { booking: any; staffId: string; confirmedBy: string }) {
    this.logger.log(`Handling booking confirmed event for: ${data.booking.bookingNumber}`)
    
    // Send confirmation notification to client
    await this.notificationService.notifyBookingConfirmation(
      data.booking._id,
      data.booking.clientId,
      data.booking.businessId,
      {
        clientName: data.booking.clientName,
        serviceName: data.booking.services.map(s => s.serviceName).join(', '),
        date: data.booking.preferredDate.toDateString(),
        time: data.booking.preferredStartTime,
        businessName: data.booking.businessName,
        businessAddress: data.booking.businessAddress || '',
        appointmentNumber: data.booking.bookingNumber,
        clientEmail: data.booking.clientEmail,
        clientPhone: data.booking.clientPhone
      }
    )
  }

  @OnEvent('booking.cancelled')
  async handleBookingCancelled(data: { booking: any; reason: string; cancelledBy: string }) {
    this.logger.log(`Handling booking cancelled event for: ${data.booking.bookingNumber}`)
    
    // Send cancellation notification
    await this.notificationService.notifyAppointmentCancellation(
      data.booking._id,
      data.booking.clientId,
      data.booking.businessId,
      {
        clientName: data.booking.clientName,
        serviceName: data.booking.services.map(s => s.serviceName).join(', '),
        appointmentDate: data.booking.preferredDate.toDateString(),
        appointmentTime: data.booking.preferredStartTime,
        businessName: data.booking.businessName,
        appointmentNumber: data.booking.bookingNumber,
        businessPhone: data.booking.businessPhone || '',
        clientEmail: data.booking.clientEmail,
        clientPhone: data.booking.clientPhone
      },
      data.reason
    )
  }

  @OnEvent('booking.expired')
  async handleBookingExpired(booking: any) {
    this.logger.log(`Handling booking expired event for: ${booking.bookingNumber}`)
    
    // Optionally send expiration notification
    // await this.notificationService.notifyBookingExpired(booking)
  }

  @OnEvent('booking.payment.reminder')
  async handlePaymentReminder(booking: any) {
    this.logger.log(`Sending payment reminder for booking: ${booking.bookingNumber}`)
    
    // Send payment reminder
    await this.notificationService.notifyPaymentReminder(
      booking._id,
      booking.clientId,
      booking.businessId,
      {
        clientName: booking.clientName,
        serviceName: booking.services.map(s => s.serviceName).join(', '),
        amount: booking.estimatedTotal,
        paymentUrl: `${process.env.APP_URL}/pay/${booking._id}`,
        expiryTime: booking.expiresAt,
        appointmentDate: booking.preferredDate?.toDateString() || '',
        businessName: booking.businessName,
        businessPhone: booking.businessPhone || '',
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone
      }
    )
  }

  @OnEvent('appointment.created')
  async handleAppointmentCreated(data: { appointment: any; booking: any; payment: any; staffAssignment: any }) {
    this.logger.log(`Handling appointment created event for: ${data.appointment.appointmentNumber}`)
    
    // Link booking to appointment
    if (data.booking) {
      // This would be handled by the booking service
      // await this.bookingService.linkAppointment(data.booking._id, data.appointment._id)
    }

    // Send appointment confirmation - Fixed to pass all 4 required parameters
    await this.notificationService.notifyAppointmentConfirmation(
      data.appointment._id,
      data.appointment.clientId,
      data.appointment.businessId,
      {
        clientName: data.appointment.clientName,
        serviceName: data.appointment.services.map(s => s.serviceName).join(', '),
        appointmentDate: data.appointment.scheduledDate.toDateString(),
        appointmentTime: data.appointment.scheduledStartTime,
        businessName: data.appointment.businessName,
        businessAddress: data.appointment.businessAddress || '',
        appointmentNumber: data.appointment.appointmentNumber,
        clientEmail: data.appointment.clientEmail,
        clientPhone: data.appointment.clientPhone
      }
    )

    // If staff assigned, notify them
    if (data.staffAssignment) {
      await this.notificationService.notifyStaffAssignment(
        data.appointment._id,
        data.staffAssignment.staffId,
        data.appointment.businessId,
        {
          staffName: data.staffAssignment.staffName,
          staffEmail: data.staffAssignment.staffEmail,
          staffPhone: data.staffAssignment.staffPhone,
          clientName: data.appointment.clientName,
          serviceName: data.appointment.services.map(s => s.serviceName).join(', '),
          date: data.appointment.scheduledDate.toDateString(),
          time: data.appointment.scheduledStartTime,
          businessName: data.appointment.businessName,
          appointmentNumber: data.appointment.appointmentNumber,
          serviceNotes: data.appointment.notes || 'None'
        }
      )
    }
  }
}