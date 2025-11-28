"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateSeeder = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("../schemas/notification.schema");
let NotificationTemplateSeeder = class NotificationTemplateSeeder {
    constructor(notificationTemplateModel) {
        this.notificationTemplateModel = notificationTemplateModel;
    }
    async seedDefaultTemplates() {
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
        ];
        for (const template of templates) {
            const existing = await this.notificationTemplateModel.findOne({
                templateType: template.templateType,
                isDefault: true,
            });
            if (!existing) {
                await this.notificationTemplateModel.create(template);
                console.log(`✅ Created template: ${template.name}`);
            }
            else {
                console.log(`⏭️  Template already exists: ${template.name}`);
            }
        }
        console.log('✅ Template seeding completed!');
    }
};
NotificationTemplateSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationTemplate.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationTemplateSeeder);
exports.NotificationTemplateSeeder = NotificationTemplateSeeder;
//# sourceMappingURL=notification-templates.seeder.js.map