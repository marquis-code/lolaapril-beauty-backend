import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { NotificationTemplate, NotificationTemplateDocument } from '../schemas/notification.schema'

@Injectable()
export class NotificationTemplateSeeder {
  constructor(
    @InjectModel(NotificationTemplate.name)
    private notificationTemplateModel: Model<NotificationTemplateDocument>,
  ) {}

  async seedDefaultTemplates(): Promise<void> {
    const templates = [
      {
        templateType: 'new_booking',
        name: 'New Booking Notification (Staff)',
        subject: 'New Booking Received - {{bookingNumber}}',
        content: `
          <h2>New Booking Received</h2>
          <p>Hello {{staffName}},</p>
          <p>A new booking has been received:</p>
          <ul>
            <li><strong>Booking Number:</strong> {{bookingNumber}}</li>
            <li><strong>Client:</strong> {{clientName}}</li>
            <li><strong>Service:</strong> {{serviceName}}</li>
            <li><strong>Date:</strong> {{appointmentDate}}</li>
            <li><strong>Time:</strong> {{appointmentTime}}</li>
            <li><strong>Duration:</strong> {{estimatedDuration}} minutes</li>
            <li><strong>Total:</strong> ₦{{estimatedTotal}}</li>
          </ul>
          <p><strong>Special Requests:</strong> {{specialRequests}}</p>
          <p>Please review and confirm this booking.</p>
          <p>Best regards,<br/>{{businessName}}</p>
        `,
        channel: 'email',
        isDefault: true,
        isActive: true,
      },
      {
        templateType: 'booking_confirmation',
        name: 'Booking Confirmation',
        subject: 'Booking Confirmed - {{appointmentNumber}}',
        content: `
          <h2>Booking Confirmed!</h2>
          <p>Hello {{clientName}},</p>
          <p>Your booking has been confirmed:</p>
          <ul>
            <li><strong>Appointment Number:</strong> {{appointmentNumber}}</li>
            <li><strong>Service:</strong> {{serviceName}}</li>
            <li><strong>Date:</strong> {{appointmentDate}}</li>
            <li><strong>Time:</strong> {{appointmentTime}}</li>
            <li><strong>Location:</strong> {{businessAddress}}</li>
          </ul>
          <p>We look forward to seeing you!</p>
          <p>Best regards,<br/>{{businessName}}</p>
        `,
        channel: 'both',
        isDefault: true,
        isActive: true,
      },
      {
        templateType: 'booking_rejection',
        name: 'Booking Rejection',
        subject: 'Booking Update - {{businessName}}',
        content: `
          <h2>Booking Update</h2>
          <p>Hello {{clientName}},</p>
          <p>Unfortunately, we cannot confirm your booking request for:</p>
          <ul>
            <li><strong>Service:</strong> {{serviceName}}</li>
            <li><strong>Requested Date:</strong> {{requestedDate}}</li>
            <li><strong>Requested Time:</strong> {{requestedTime}}</li>
          </ul>
          <p><strong>Reason:</strong> {{rejectionReason}}</p>
          <p>Please contact us at {{businessPhone}} to reschedule.</p>
          <p>Best regards,<br/>{{businessName}}</p>
        `,
        channel: 'both',
        isDefault: true,
        isActive: true,
      },
      {
        templateType: 'staff_assignment',
        name: 'Staff Assignment Notification',
        subject: 'New Appointment Assigned - {{appointmentNumber}}',
        content: `
          <h2>New Appointment Assigned</h2>
          <p>Hello {{staffName}},</p>
          <p>You have been assigned to a new appointment:</p>
          <ul>
            <li><strong>Appointment Number:</strong> {{appointmentNumber}}</li>
            <li><strong>Client:</strong> {{clientName}}</li>
            <li><strong>Service:</strong> {{serviceName}}</li>
            <li><strong>Date:</strong> {{appointmentDate}}</li>
            <li><strong>Time:</strong> {{appointmentTime}}</li>
          </ul>
          <p><strong>Notes:</strong> {{serviceNotes}}</p>
          <p>Best regards,<br/>{{businessName}}</p>
        `,
        channel: 'both',
        isDefault: true,
        isActive: true,
      },
      {
        templateType: 'payment_confirmation',
        name: 'Payment Confirmation',
        subject: 'Payment Received - {{transactionId}}',
        content: `
          <h2>Payment Confirmed!</h2>
          <p>Hello {{clientName}},</p>
          <p>Your payment has been received:</p>
          <ul>
            <li><strong>Amount:</strong> ₦{{paymentAmount}}</li>
            <li><strong>Method:</strong> {{paymentMethod}}</li>
            <li><strong>Transaction ID:</strong> {{transactionId}}</li>
            <li><strong>Service:</strong> {{serviceName}}</li>
            <li><strong>Appointment Date:</strong> {{appointmentDate}}</li>
          </ul>
          <p><a href="{{receiptUrl}}">View Receipt</a></p>
          <p>Thank you for your payment!</p>
          <p>Best regards,<br/>{{businessName}}</p>
        `,
        channel: 'email',
        isDefault: true,
        isActive: true,
      },
      {
        templateType: 'payment_failed',
        name: 'Payment Failed',
        subject: 'Payment Issue - Action Required',
        content: `
          <h2>Payment Failed</h2>
          <p>Hello {{clientName}},</p>
          <p>We encountered an issue with your payment:</p>
          <ul>
            <li><strong>Amount:</strong> ₦{{paymentAmount}}</li>
            <li><strong>Reason:</strong> {{failureReason}}</li>
            <li><strong>Service:</strong> {{serviceName}}</li>
            <li><strong>Appointment Date:</strong> {{appointmentDate}}</li>
          </ul>
          <p><a href="{{retryPaymentUrl}}">Retry Payment</a></p>
          <p>Please contact us at {{businessPhone}} if you need assistance.</p>
          <p>Best regards,<br/>{{businessName}}</p>
        `,
        channel: 'both',
        isDefault: true,
        isActive: true,
      },
      {
        templateType: 'appointment_reminder',
        name: 'Appointment Reminder',
        subject: 'Reminder: Appointment Tomorrow - {{appointmentNumber}}',
        content: `
          <h2>Appointment Reminder</h2>
          <p>Hello {{clientName}},</p>
          <p>This is a reminder of your upcoming appointment:</p>
          <ul>
            <li><strong>Service:</strong> {{serviceName}}</li>
            <li><strong>Date:</strong> {{appointmentDate}}</li>
            <li><strong>Time:</strong> {{appointmentTime}}</li>
            <li><strong>Staff:</strong> {{staffName}}</li>
            <li><strong>Location:</strong> {{businessAddress}}</li>
          </ul>
          <p>Please call {{businessPhone}} if you need to reschedule.</p>
          <p>See you soon!<br/>{{businessName}}</p>
        `,
        channel: 'both',
        isDefault: true,
        isActive: true,
      },
      {
        templateType: 'appointment_cancelled',
        name: 'Appointment Cancelled',
        subject: 'Appointment Cancelled - {{appointmentNumber}}',
        content: `
          <h2>Appointment Cancelled</h2>
          <p>Hello {{clientName}},</p>
          <p>Your appointment has been cancelled:</p>
          <ul>
            <li><strong>Appointment Number:</strong> {{appointmentNumber}}</li>
            <li><strong>Service:</strong> {{serviceName}}</li>
            <li><strong>Date:</strong> {{appointmentDate}}</li>
            <li><strong>Time:</strong> {{appointmentTime}}</li>
          </ul>
          <p><strong>Reason:</strong> {{cancellationReason}}</p>
          <p>Please contact us at {{businessPhone}} to reschedule.</p>
          <p>Best regards,<br/>{{businessName}}</p>
        `,
        channel: 'both',
        isDefault: true,
        isActive: true,
      },
    ]

    for (const template of templates) {
      const existing = await this.notificationTemplateModel.findOne({
        templateType: template.templateType,
        isDefault: true,
      })

      if (!existing) {
        await this.notificationTemplateModel.create(template)
        console.log(`✅ Created template: ${template.name}`)
      } else {
        console.log(`⏭️  Template already exists: ${template.name}`)
      }
    }

    console.log('✅ Template seeding completed!')
  }
}