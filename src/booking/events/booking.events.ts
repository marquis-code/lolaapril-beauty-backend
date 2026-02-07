// src/modules/booking/events/booking.events.ts
import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { NotificationService } from '../../notification/notification.service'
import { ChatService } from '../../notification/services/chat.service'

@Injectable()
export class BookingEventHandler {
  private readonly logger = new Logger(BookingEventHandler.name)

  constructor(
    private readonly notificationService: NotificationService,
    private readonly chatService: ChatService,
  ) {}

  @OnEvent('booking.created')
  async handleBookingCreated(payload: any) {
    const booking = payload?.booking || payload

    this.logger.log(`Handling booking created event for: ${booking.bookingNumber}`)

    // Send notification to business staff
    await this.notificationService.notifyStaffNewBooking(booking)

    // Start customer chat with a helpful message
    await this.sendAutomatedChatMessage(booking, {
      senderName: 'Booking Assistant',
      content: `Hi ${booking.clientName || 'there'}! We noticed you started a booking${booking.bookingNumber ? ` (${booking.bookingNumber})` : ''}. If you need help completing your booking or have any questions, just reply here and we’ll assist you.`
    })
  }

  @OnEvent('booking.confirmed')
  async handleBookingConfirmed(data: { booking: any; staffId: string; confirmedBy: string }) {
    const booking = data.booking

    this.logger.log(`Handling booking confirmed event for: ${booking.bookingNumber}`)
    
    // Send confirmation notification to client
    await this.notificationService.notifyBookingConfirmation(
      booking._id,
      booking.clientId,
      booking.businessId,
      {
        clientName: booking.clientName,
        serviceName: booking.services.map(s => s.serviceName).join(', '),
        date: booking.preferredDate.toDateString(),
        time: booking.preferredStartTime,
        businessName: booking.businessName,
        businessAddress: booking.businessAddress || '',
        appointmentNumber: booking.bookingNumber,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone
      }
    )

    // Send confirmation chat message
    await this.sendAutomatedChatMessage(booking, {
      senderName: 'Booking Assistant',
      content: `🎉 Congratulations ${booking.clientName || ''}! Your booking${booking.bookingNumber ? ` (${booking.bookingNumber})` : ''} is confirmed. If you need anything else, just reply here and we’ll help you.`
    })
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

    // Optional: send expiration notification via chat
    await this.sendAutomatedChatMessage(booking, {
      senderName: 'Booking Assistant',
      content: `Hi ${booking.clientName || 'there'}, it looks like your booking${booking.bookingNumber ? ` (${booking.bookingNumber})` : ''} wasn’t completed in time. Do you need help finishing it? I’m here to assist you.`
    })
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

    // Send chat reminder
    await this.sendAutomatedChatMessage(booking, {
      senderName: 'Booking Assistant',
      content: `Hi ${booking.clientName || 'there'}! Your booking${booking.bookingNumber ? ` (${booking.bookingNumber})` : ''} is waiting for payment to be confirmed. If you need help, just reply here and we’ll assist you.`
    })
  }

  private async sendAutomatedChatMessage(
    booking: any,
    message: { senderName: string; content: string }
  ) {
    try {
      if (!booking?.businessId) return

      // Use client ID if available, otherwise use a consistent guest identifier
      const clientId = booking.clientId?._id?.toString() || booking.clientId?.toString()
      const userId = clientId || booking.clientEmail || `guest_${booking._id}`

      const isGuest = !clientId

      // Skip if no way to identify the customer
      if (isGuest && !booking.clientEmail) {
        this.logger.warn(`Skipping chat message - no client ID or email for booking ${booking.bookingNumber}`)
        return
      }

      // Find existing room first to avoid duplicates
      const room = await this.chatService.createOrGetCustomerChatRoom(
        booking.businessId.toString(),
        userId,
        {
          name: booking.clientName || 'Customer',
          email: booking.clientEmail,
          phone: booking.clientPhone,
          isGuest,
          guestInfo: isGuest ? { 
            bookingId: booking._id?.toString(),
            email: booking.clientEmail 
          } : undefined,
        }
      )

      // Check if we've already sent this exact message recently (prevent duplicates)
      const recentMessages = await this.chatService.getRoomMessages(room._id.toString(), { limit: 5 })
      const isDuplicate = recentMessages.messages?.some((msg: any) => 
        msg.isAutomated && 
        msg.content === message.content &&
        new Date().getTime() - new Date(msg.createdAt).getTime() < 60000 // Within last minute
      )

      if (isDuplicate) {
        this.logger.log(`Skipping duplicate automated message for room ${room._id}`)
        return
      }

      await this.chatService.sendMessage(
        room._id.toString(),
        'system',
        'system',
        message.content,
        {
          senderName: message.senderName,
          isAutomated: true,
        }
      )

      this.logger.log(`✅ Sent automated chat message to room ${room._id}`)
    } catch (error) {
      this.logger.error(`Failed to send automated chat message: ${error.message}`)
    }
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