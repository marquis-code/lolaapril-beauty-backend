import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Cron, CronExpression } from '@nestjs/schedule'
import {
  NotificationTemplate,
  NotificationTemplateDocument,
  NotificationLog,
  NotificationLogDocument,
  NotificationPreference,
  NotificationPreferenceDocument
} from '../notification/schemas/notification.schema'
import { EmailService } from './email.service'
import { SMSService } from './sms.service'
import { EmailTemplatesService } from './templates/email-templates.service'

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationTemplate.name)
    private notificationTemplateModel: Model<NotificationTemplateDocument>,
    @InjectModel(NotificationLog.name)
    private notificationLogModel: Model<NotificationLogDocument>,
    @InjectModel(NotificationPreference.name)
    private notificationPreferenceModel: Model<NotificationPreferenceDocument>,
    private emailService: EmailService,
    private smsService: SMSService,
    private emailTemplatesService: EmailTemplatesService,
  ) { }

  // ================== BOOKING NOTIFICATIONS ==================
  async notifyBookingConfirmation(
    bookingId: string,
    clientId: string,
    businessId: string,
    bookingDetails: any
  ): Promise<void> {
    const template = await this.getTemplate(businessId, 'booking_confirmation')
    const preferences = await this.getUserPreferences(clientId, businessId)

    const variables = {
      clientName: bookingDetails.clientName,
      serviceName: bookingDetails.serviceName,
      appointmentDate: bookingDetails.date,
      appointmentTime: bookingDetails.time,
      businessName: bookingDetails.businessName,
      businessAddress: bookingDetails.businessAddress,
      appointmentNumber: bookingDetails.appointmentNumber,
    }

    const content = this.replaceTemplateVariables(template.content, variables)
    const subject = this.replaceTemplateVariables(template.subject, variables)

    await this.sendNotification({
      businessId,
      recipientId: clientId,
      recipientType: 'client',
      recipient: bookingDetails.clientEmail,
      recipientPhone: bookingDetails.clientPhone,
      subject,
      content,
      channel: template.channel,
      preferences: preferences.booking_confirmation,
      templateId: template._id.toString(),
      relatedEntityId: bookingId,
      relatedEntityType: 'booking'
    })
  }

  async notifyBookingRejection(
    bookingId: string,
    clientId: string,
    businessId: string,
    bookingDetails: any,
    rejectionReason: string
  ): Promise<void> {
    const template = await this.getTemplate(businessId, 'booking_rejection')
    const preferences = await this.getUserPreferences(clientId, businessId)

    const variables = {
      clientName: bookingDetails.clientName,
      serviceName: bookingDetails.serviceName,
      requestedDate: bookingDetails.date,
      requestedTime: bookingDetails.time,
      businessName: bookingDetails.businessName,
      rejectionReason,
      businessPhone: bookingDetails.businessPhone,
    }

    const content = this.replaceTemplateVariables(template.content, variables)
    const subject = this.replaceTemplateVariables(template.subject, variables)

    await this.sendNotification({
      businessId,
      recipientId: clientId,
      recipientType: 'client',
      recipient: bookingDetails.clientEmail,
      recipientPhone: bookingDetails.clientPhone,
      subject,
      content,
      channel: template.channel,
      preferences: preferences.booking_rejection,
      templateId: template._id.toString(),
      relatedEntityId: bookingId,
      relatedEntityType: 'booking'
    })
  }

  // ================== APPOINTMENT NOTIFICATIONS ==================
  async notifyAppointmentReminder(
    appointmentId: string,
    clientId: string,
    businessId: string,
    appointmentDetails: any
  ): Promise<void> {
    const template = await this.getTemplate(businessId, 'appointment_reminder')
    const preferences = await this.getUserPreferences(clientId, businessId)

    const variables = {
      clientName: appointmentDetails.clientName,
      serviceName: appointmentDetails.serviceName,
      appointmentDate: appointmentDetails.date,
      appointmentTime: appointmentDetails.time,
      businessName: appointmentDetails.businessName,
      businessAddress: appointmentDetails.businessAddress,
      businessPhone: appointmentDetails.businessPhone,
      staffName: appointmentDetails.staffName,
      appointmentNumber: appointmentDetails.appointmentNumber,
    }

    const content = this.replaceTemplateVariables(template.content, variables)
    const subject = this.replaceTemplateVariables(template.subject, variables)

    await this.sendNotification({
      businessId,
      recipientId: clientId,
      recipientType: 'client',
      recipient: appointmentDetails.clientEmail,
      recipientPhone: appointmentDetails.clientPhone,
      subject,
      content,
      channel: template.channel,
      preferences: preferences.appointment_reminder,
      templateId: template._id.toString(),
      relatedEntityId: appointmentId,
      relatedEntityType: 'appointment'
    })
  }

  // async notifyStaffNewBooking(booking: any): Promise<void> {
  //   const template = await this.getTemplate(booking.businessId, 'staff_assignment')

  //   const variables = {
  //     staffName: booking.staffName || 'Team',
  //     clientName: booking.clientName,
  //     serviceName: booking.serviceName,
  //     appointmentDate: booking.date,
  //     appointmentTime: booking.time,
  //     businessName: booking.businessName,
  //     appointmentNumber: booking.bookingNumber,
  //     serviceNotes: booking.notes || 'None',
  //   }

  //   const content = this.replaceTemplateVariables(template.content, variables)
  //   const subject = this.replaceTemplateVariables(template.subject, variables)

  //   // Send to all staff members or specific staff
  //   if (booking.staffId) {
  //     await this.sendNotification({
  //       businessId: booking.businessId,
  //       recipientId: booking.staffId,
  //       recipientType: 'staff',
  //       recipient: booking.staffEmail,
  //       recipientPhone: booking.staffPhone,
  //       subject,
  //       content,
  //       channel: template.channel,
  //       preferences: { email: true, sms: true },
  //       templateId: template._id.toString(),
  //       relatedEntityId: booking._id,
  //       relatedEntityType: 'booking'
  //     })
  //   }
  // }

  async notifyStaffNewBooking(booking: any): Promise<void> {
    try {
      // Validate booking object
      if (!booking) {
        console.error('notifyStaffNewBooking: booking is undefined or null')
        return
      }

      if (!booking.businessId) {
        console.error('notifyStaffNewBooking: booking.businessId is undefined', booking)
        return
      }

      const businessId = booking.businessId.toString ? booking.businessId.toString() : String(booking.businessId)
      const template = await this.getTemplate(businessId, 'new_booking')

      // Safely handle services array
      const services = Array.isArray(booking.services) ? booking.services : []
      const serviceName = services.length > 0
        ? services.map(s => s.serviceName || 'Service').join(', ')
        : 'N/A'

      const variables = {
        staffName: 'Team', // Generic since we don't know who will handle it yet
        clientName: booking.clientName || 'Customer',
        serviceName,
        appointmentDate: booking.preferredDate
          ? new Date(booking.preferredDate).toLocaleDateString()
          : 'N/A',
        appointmentTime: booking.preferredStartTime || 'N/A',
        businessName: booking.businessName || 'Your Business',
        bookingNumber: booking.bookingNumber || 'N/A',
        specialRequests: booking.specialRequests || 'None',
        estimatedTotal: booking.estimatedTotal || 0,
        estimatedDuration: booking.totalDuration || 0,
      }

      const content = this.replaceTemplateVariables(template.content, variables)
      const subject = this.replaceTemplateVariables(template.subject, variables)

      // For now, send to a generic staff notification email
      // You can modify this to send to all staff members or specific staff
      const staffEmail = process.env.STAFF_NOTIFICATION_EMAIL || 'staff@business.com'
      const staffPhone = process.env.STAFF_NOTIFICATION_PHONE || ''

      const bookingId = booking._id ? (booking._id.toString ? booking._id.toString() : String(booking._id)) : 'unknown'
      const templateId = template._id ? (template._id.toString ? template._id.toString() : String(template._id)) : 'unknown'

      await this.sendNotification({
        businessId,
        recipientId: businessId, // Use business ID as recipient for now
        recipientType: 'staff',
        recipient: staffEmail,
        recipientPhone: staffPhone,
        subject,
        content,
        channel: template.channel,
        preferences: { email: true, sms: false },
        templateId,
        relatedEntityId: bookingId,
        relatedEntityType: 'booking'
      })
    } catch (error) {
      console.error(`Failed to send new booking notification: ${error.message}`)
      console.error('Booking object:', JSON.stringify(booking, null, 2))
      // Don't throw - notification failure shouldn't break booking
    }
  }

  async notifySlotUnavailableRefund(
    bookingId: string,
    clientId: string,
    businessId: string,
    details: any
  ): Promise<void> {
    const template = await this.getTemplate(businessId, 'booking_rejection')
    const preferences = await this.getUserPreferences(clientId, businessId)

    const variables = {
      clientName: details.clientName,
      serviceName: details.serviceName,
      requestedDate: details.date,
      requestedTime: details.time,
      businessName: details.businessName,
      rejectionReason: 'Slot no longer available - full refund processed',
      businessPhone: details.businessPhone,
    }

    const content = this.replaceTemplateVariables(template.content, variables)
    const subject = this.replaceTemplateVariables(template.subject, variables)

    await this.sendNotification({
      businessId,
      recipientId: clientId,
      recipientType: 'client',
      recipient: details.clientEmail,
      recipientPhone: details.clientPhone,
      subject,
      content,
      channel: template.channel,
      preferences: preferences.booking_rejection,
      templateId: template._id.toString(),
      relatedEntityId: bookingId,
      relatedEntityType: 'booking'
    })
  }

  async notifyPaymentReminder(
    bookingId: string,
    clientId: string,
    businessId: string,
    details: any
  ): Promise<void> {
    const template = await this.getTemplate(businessId, 'payment_failed')
    const preferences = await this.getUserPreferences(clientId, businessId)

    const variables = {
      clientName: details.clientName,
      paymentAmount: details.amount,
      failureReason: 'Payment reminder - please complete payment',
      serviceName: details.serviceName,
      appointmentDate: details.appointmentDate,
      businessName: details.businessName,
      businessPhone: details.businessPhone,
      retryPaymentUrl: details.paymentUrl,
    }

    const content = this.replaceTemplateVariables(template.content, variables)
    const subject = this.replaceTemplateVariables(template.subject, variables)

    await this.sendNotification({
      businessId,
      recipientId: clientId,
      recipientType: 'client',
      recipient: details.clientEmail,
      recipientPhone: details.clientPhone,
      subject,
      content,
      channel: template.channel,
      preferences: preferences.payment_failed,
      templateId: template._id.toString(),
      relatedEntityId: bookingId,
      relatedEntityType: 'booking'
    })
  }

  async notifyAppointmentCancellation(
    appointmentId: string,
    clientId: string,
    businessId: string,
    appointmentDetails: any,
    cancellationReason: string
  ): Promise<void> {
    const template = await this.getTemplate(businessId, 'appointment_cancelled')
    const preferences = await this.getUserPreferences(clientId, businessId)

    const variables = {
      clientName: appointmentDetails.clientName,
      serviceName: appointmentDetails.serviceName,
      appointmentDate: appointmentDetails.date,
      appointmentTime: appointmentDetails.time,
      businessName: appointmentDetails.businessName,
      cancellationReason,
      businessPhone: appointmentDetails.businessPhone,
      appointmentNumber: appointmentDetails.appointmentNumber,
    }

    const content = this.replaceTemplateVariables(template.content, variables)
    const subject = this.replaceTemplateVariables(template.subject, variables)

    await this.sendNotification({
      businessId,
      recipientId: clientId,
      recipientType: 'client',
      recipient: appointmentDetails.clientEmail,
      recipientPhone: appointmentDetails.clientPhone,
      subject,
      content,
      channel: template.channel,
      preferences: preferences.appointment_cancelled,
      templateId: template._id.toString(),
      relatedEntityId: appointmentId,
      relatedEntityType: 'appointment'
    })
  }

  // ================== PAYMENT NOTIFICATIONS ==================
  async notifyPaymentConfirmation(
    paymentId: string,
    clientId: string,
    businessId: string,
    paymentDetails: any
  ): Promise<void> {
    const template = await this.getTemplate(businessId, 'payment_confirmation')
    const preferences = await this.getUserPreferences(clientId, businessId)

    const variables = {
      clientName: paymentDetails.clientName,
      paymentAmount: paymentDetails.amount,
      paymentMethod: paymentDetails.method,
      transactionId: paymentDetails.transactionId,
      serviceName: paymentDetails.serviceName,
      appointmentDate: paymentDetails.appointmentDate,
      businessName: paymentDetails.businessName,
      receiptUrl: paymentDetails.receiptUrl,
    }

    const content = this.replaceTemplateVariables(template.content, variables)
    const subject = this.replaceTemplateVariables(template.subject, variables)

    await this.sendNotification({
      businessId,
      recipientId: clientId,
      recipientType: 'client',
      recipient: paymentDetails.clientEmail,
      recipientPhone: paymentDetails.clientPhone,
      subject,
      content,
      channel: template.channel,
      preferences: preferences.payment_confirmation,
      templateId: template._id.toString(),
      relatedEntityId: paymentId,
      relatedEntityType: 'payment'
    })
  }

  async notifyPaymentFailed(
    paymentId: string,
    clientId: string,
    businessId: string,
    paymentDetails: any
  ): Promise<void> {
    const template = await this.getTemplate(businessId, 'payment_failed')
    const preferences = await this.getUserPreferences(clientId, businessId)

    const variables = {
      clientName: paymentDetails.clientName,
      paymentAmount: paymentDetails.amount,
      failureReason: paymentDetails.failureReason,
      serviceName: paymentDetails.serviceName,
      appointmentDate: paymentDetails.appointmentDate,
      businessName: paymentDetails.businessName,
      businessPhone: paymentDetails.businessPhone,
      retryPaymentUrl: paymentDetails.retryPaymentUrl,
    }

    const content = this.replaceTemplateVariables(template.content, variables)
    const subject = this.replaceTemplateVariables(template.subject, variables)

    await this.sendNotification({
      businessId,
      recipientId: clientId,
      recipientType: 'client',
      recipient: paymentDetails.clientEmail,
      recipientPhone: paymentDetails.clientPhone,
      subject,
      content,
      channel: template.channel,
      preferences: preferences.payment_failed,
      templateId: template._id.toString(),
      relatedEntityId: paymentId,
      relatedEntityType: 'payment'
    })
  }

  // ================== STAFF NOTIFICATIONS ==================
  async notifyStaffAssignment(
    appointmentId: string,
    staffId: string,
    businessId: string,
    appointmentDetails: any
  ): Promise<void> {
    const template = await this.getTemplate(businessId, 'staff_assignment')

    const variables = {
      staffName: appointmentDetails.staffName,
      clientName: appointmentDetails.clientName,
      serviceName: appointmentDetails.serviceName,
      appointmentDate: appointmentDetails.date,
      appointmentTime: appointmentDetails.time,
      businessName: appointmentDetails.businessName,
      appointmentNumber: appointmentDetails.appointmentNumber,
      serviceNotes: appointmentDetails.serviceNotes || 'None',
    }

    const content = this.replaceTemplateVariables(template.content, variables)
    const subject = this.replaceTemplateVariables(template.subject, variables)

    await this.sendNotification({
      businessId,
      recipientId: staffId,
      recipientType: 'staff',
      recipient: appointmentDetails.staffEmail,
      recipientPhone: appointmentDetails.staffPhone,
      subject,
      content,
      channel: template.channel,
      preferences: { email: true, sms: true }, // Staff always get notifications
      templateId: template._id.toString(),
      relatedEntityId: appointmentId,
      relatedEntityType: 'appointment'
    })
  }

  // ================== AUTOMATED REMINDERS ==================
  @Cron(CronExpression.EVERY_HOUR)
  async sendAppointmentReminders(): Promise<void> {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    // Get appointments for tomorrow that haven't been reminded
    const appointments = await this.getAppointmentsForReminder(tomorrow, dayAfterTomorrow)

    for (const appointment of appointments) {
      try {
        await this.notifyAppointmentReminder(
          appointment._id,
          appointment.clientId,
          appointment.businessId,
          appointment
        )

        // Mark as reminded (you might want to add a field to track this)
        await this.markAppointmentReminded(appointment._id)
      } catch (error) {
        console.error(`Failed to send reminder for appointment ${appointment._id}:`, error)
      }
    }
  }

  // ================== HELPER METHODS ==================
  private async sendNotification(notificationData: {
    businessId: string
    recipientId: string
    recipientType: string
    recipient: string
    recipientPhone: string
    subject: string
    content: string
    channel: string
    preferences: { email: boolean; sms: boolean }
    templateId: string
    relatedEntityId: string
    relatedEntityType: string
  }): Promise<void> {
    const { channel, preferences } = notificationData

    // Send email if enabled
    if ((channel === 'email' || channel === 'both') && preferences.email) {
      const emailResult = await this.emailService.sendEmail(
        notificationData.recipient,
        notificationData.subject,
        notificationData.content
      )

      await this.logNotification({
        ...notificationData,
        channel: 'email',
        status: emailResult.success ? 'sent' : 'failed',
        providerMessageId: emailResult.messageId,
        errorMessage: emailResult.error,
        sentAt: emailResult.success ? new Date() : null,
      })
    }

    // Send SMS if enabled
    if ((channel === 'sms' || channel === 'both') && preferences.sms && notificationData.recipientPhone) {
      // Strip HTML for SMS
      const smsContent = this.stripHtml(notificationData.content)

      const smsResult = await this.smsService.sendSMS(
        notificationData.recipientPhone,
        smsContent
      )

      await this.logNotification({
        ...notificationData,
        channel: 'sms',
        content: smsContent,
        status: smsResult.success ? 'sent' : 'failed',
        providerMessageId: smsResult.messageId,
        errorMessage: smsResult.error,
        sentAt: smsResult.success ? new Date() : null,
      })
    }
  }

  private async logNotification(logData: any): Promise<void> {
    const log = new this.notificationLogModel({
      businessId: new Types.ObjectId(logData.businessId),
      recipientId: new Types.ObjectId(logData.recipientId),
      recipientType: logData.recipientType,
      channel: logData.channel,
      recipient: logData.recipient,
      subject: logData.subject,
      content: logData.content,
      status: logData.status,
      providerMessageId: logData.providerMessageId,
      errorMessage: logData.errorMessage,
      sentAt: logData.sentAt,
      relatedEntityId: new Types.ObjectId(logData.relatedEntityId),
      relatedEntityType: logData.relatedEntityType,
      templateId: new Types.ObjectId(logData.templateId),
    })

    await log.save()
  }


  private async getTemplate(businessId: string, templateType: string): Promise<NotificationTemplateDocument> {
    let template = await this.notificationTemplateModel.findOne({
      businessId: new Types.ObjectId(businessId),
      templateType,
      isActive: true,
    }) as NotificationTemplateDocument | null

    // If no business-specific template, get default
    if (!template) {
      template = await this.notificationTemplateModel.findOne({
        templateType,
        isDefault: true,
        isActive: true,
      }) as NotificationTemplateDocument | null
    }

    if (!template) {
      throw new Error(`No template found for type: ${templateType}`)
    }

    return template
  }

  private async getUserPreferences(userId: string, businessId: string): Promise<any> {
    const preferences = await this.notificationPreferenceModel.findOne({
      userId: new Types.ObjectId(userId),
      businessId: new Types.ObjectId(businessId),
    })

    return preferences?.preferences || {
      booking_confirmation: { email: true, sms: true },
      booking_rejection: { email: true, sms: true },
      appointment_reminder: { email: true, sms: true },
      appointment_cancelled: { email: true, sms: true },
      payment_confirmation: { email: true, sms: false },
      payment_failed: { email: true, sms: true },
      promotional: { email: false, sms: false },
    }
  }

  private replaceTemplateVariables(template: string, variables: Record<string, any>): string {
    let result = template

    Object.keys(variables).forEach(key => {
      const placeholder = `{{${key}}}`
      const value = variables[key] || ''
      result = result.replace(new RegExp(placeholder, 'g'), value)
    })

    return result
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
  }

  private async getAppointmentsForReminder(startDate: Date, endDate: Date): Promise<any[]> {
    // This would query your appointment model
    // Return appointments that need reminders
    // You'll need to replace this with your actual appointment model query
    return []
  }

  private async markAppointmentReminded(appointmentId: string): Promise<void> {
    // Mark appointment as reminded to avoid duplicate reminders
    // You might want to add a 'reminderSent' field to your appointment schema
    // Example: await this.appointmentModel.findByIdAndUpdate(appointmentId, { reminderSent: true })
  }

  // Add this method to your NotificationService class
  async notifyAppointmentCompletion(
    appointmentId: string,
    clientId: string,
    businessId: string,
    appointmentDetails: any
  ): Promise<void> {
    const template = await this.getTemplate(businessId, 'appointment_completed')
    const preferences = await this.getUserPreferences(clientId, businessId)

    const variables = {
      clientName: appointmentDetails.clientName,
      serviceName: appointmentDetails.serviceName,
      appointmentDate: appointmentDetails.appointmentDate,
      appointmentTime: appointmentDetails.appointmentTime,
      businessName: appointmentDetails.businessName,
      appointmentNumber: appointmentDetails.appointmentNumber,
      completionTime: new Date().toLocaleTimeString(),
      completionDate: new Date().toLocaleDateString(),
    }

    const content = this.replaceTemplateVariables(template.content, variables)
    const subject = this.replaceTemplateVariables(template.subject, variables)

    await this.sendNotification({
      businessId,
      recipientId: clientId,
      recipientType: 'client',
      recipient: appointmentDetails.clientEmail,
      recipientPhone: appointmentDetails.clientPhone,
      subject,
      content,
      channel: template.channel,
      preferences: preferences.appointment_completed || preferences.appointment_reminder,
      templateId: template._id.toString(),
      relatedEntityId: appointmentId,
      relatedEntityType: 'appointment'
    })
  }


  // Add this method to your NotificationService class to fix the notifyAppointmentConfirmation error

  /**
   * Notify appointment confirmation (when booking is confirmed and appointment created)
   */
  async notifyAppointmentConfirmation(
    appointmentId: string,
    clientId: string,
    businessId: string,
    appointmentDetails: any
  ): Promise<void> {
    const template = await this.getTemplate(businessId, 'booking_confirmation')
    const preferences = await this.getUserPreferences(clientId, businessId)

    const variables = {
      clientName: appointmentDetails.clientName,
      serviceName: appointmentDetails.serviceName,
      appointmentDate: appointmentDetails.appointmentDate,
      appointmentTime: appointmentDetails.appointmentTime,
      businessName: appointmentDetails.businessName,
      businessAddress: appointmentDetails.businessAddress,
      appointmentNumber: appointmentDetails.appointmentNumber,
      confirmationDate: new Date().toLocaleDateString(),
      confirmationTime: new Date().toLocaleTimeString(),
    }

    const content = this.replaceTemplateVariables(template.content, variables)
    const subject = this.replaceTemplateVariables(template.subject, variables)

    await this.sendNotification({
      businessId,
      recipientId: clientId,
      recipientType: 'client',
      recipient: appointmentDetails.clientEmail,
      recipientPhone: appointmentDetails.clientPhone,
      subject,
      content,
      channel: template.channel,
      preferences: preferences.booking_confirmation,
      templateId: template._id.toString(),
      relatedEntityId: appointmentId,
      relatedEntityType: 'appointment'
    })
  }

  // ================== CONSULTATION NOTIFICATIONS ==================

  async sendConsultationConfirmation(clientId: string, businessId: string, data: any): Promise<void> {
    const preferences = await this.getUserPreferences(clientId, businessId);
    if (!preferences.booking_confirmation.email) return;

    const { subject, html } = this.emailTemplatesService.consultationConfirmation(data);

    await this.emailService.sendEmail(data.clientEmail, subject, html);
  }

  async sendConsultationReminder(clientId: string, businessId: string, data: any): Promise<void> {
    const preferences = await this.getUserPreferences(clientId, businessId);
    if (!preferences.appointment_reminder.email) return;

    const { subject, html } = this.emailTemplatesService.consultationReminder(data);

    await this.emailService.sendEmail(data.clientEmail, subject, html);
  }

  async sendConsultationThankYou(clientId: string, businessId: string, data: any): Promise<void> {
    const preferences = await this.getUserPreferences(clientId, businessId);
    // Use appointment_reminder pref for simplified logic or add a new one
    if (!preferences.appointment_reminder.email) return;

    const { subject, html } = this.emailTemplatesService.consultationThankYou(data);

    await this.emailService.sendEmail(data.clientEmail, subject, html);
  }

  async sendMarketingFollowUp(clientId: string, businessId: string, data: any): Promise<void> {
    const preferences = await this.getUserPreferences(clientId, businessId);
    // Use promotional preference or fallback to reminder
    if (preferences.promotional && !preferences.promotional.email) return;

    const { subject, html } = this.emailTemplatesService.marketingFollowUp(data);

    await this.emailService.sendEmail(data.clientEmail, subject, html);
  }
}