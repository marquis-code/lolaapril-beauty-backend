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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const notification_schema_1 = require("../notification/schemas/notification.schema");
const email_service_1 = require("./email.service");
const sms_service_1 = require("./sms.service");
let NotificationService = class NotificationService {
    constructor(notificationTemplateModel, notificationLogModel, notificationPreferenceModel, emailService, smsService) {
        this.notificationTemplateModel = notificationTemplateModel;
        this.notificationLogModel = notificationLogModel;
        this.notificationPreferenceModel = notificationPreferenceModel;
        this.emailService = emailService;
        this.smsService = smsService;
    }
    async notifyBookingConfirmation(bookingId, clientId, businessId, bookingDetails) {
        const template = await this.getTemplate(businessId, 'booking_confirmation');
        const preferences = await this.getUserPreferences(clientId, businessId);
        const variables = {
            clientName: bookingDetails.clientName,
            serviceName: bookingDetails.serviceName,
            appointmentDate: bookingDetails.date,
            appointmentTime: bookingDetails.time,
            businessName: bookingDetails.businessName,
            businessAddress: bookingDetails.businessAddress,
            appointmentNumber: bookingDetails.appointmentNumber,
        };
        const content = this.replaceTemplateVariables(template.content, variables);
        const subject = this.replaceTemplateVariables(template.subject, variables);
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
        });
    }
    async notifyBookingRejection(bookingId, clientId, businessId, bookingDetails, rejectionReason) {
        const template = await this.getTemplate(businessId, 'booking_rejection');
        const preferences = await this.getUserPreferences(clientId, businessId);
        const variables = {
            clientName: bookingDetails.clientName,
            serviceName: bookingDetails.serviceName,
            requestedDate: bookingDetails.date,
            requestedTime: bookingDetails.time,
            businessName: bookingDetails.businessName,
            rejectionReason,
            businessPhone: bookingDetails.businessPhone,
        };
        const content = this.replaceTemplateVariables(template.content, variables);
        const subject = this.replaceTemplateVariables(template.subject, variables);
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
        });
    }
    async notifyAppointmentReminder(appointmentId, clientId, businessId, appointmentDetails) {
        const template = await this.getTemplate(businessId, 'appointment_reminder');
        const preferences = await this.getUserPreferences(clientId, businessId);
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
        };
        const content = this.replaceTemplateVariables(template.content, variables);
        const subject = this.replaceTemplateVariables(template.subject, variables);
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
        });
    }
    async notifyStaffNewBooking(booking) {
        try {
            if (!booking) {
                console.error('notifyStaffNewBooking: booking is undefined or null');
                return;
            }
            if (!booking.businessId) {
                console.error('notifyStaffNewBooking: booking.businessId is undefined', booking);
                return;
            }
            const businessId = booking.businessId.toString ? booking.businessId.toString() : String(booking.businessId);
            const template = await this.getTemplate(businessId, 'new_booking');
            const services = Array.isArray(booking.services) ? booking.services : [];
            const serviceName = services.length > 0
                ? services.map(s => s.serviceName || 'Service').join(', ')
                : 'N/A';
            const variables = {
                staffName: 'Team',
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
            };
            const content = this.replaceTemplateVariables(template.content, variables);
            const subject = this.replaceTemplateVariables(template.subject, variables);
            const staffEmail = process.env.STAFF_NOTIFICATION_EMAIL || 'staff@business.com';
            const staffPhone = process.env.STAFF_NOTIFICATION_PHONE || '';
            const bookingId = booking._id ? (booking._id.toString ? booking._id.toString() : String(booking._id)) : 'unknown';
            const templateId = template._id ? (template._id.toString ? template._id.toString() : String(template._id)) : 'unknown';
            await this.sendNotification({
                businessId,
                recipientId: businessId,
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
            });
        }
        catch (error) {
            console.error(`Failed to send new booking notification: ${error.message}`);
            console.error('Booking object:', JSON.stringify(booking, null, 2));
        }
    }
    async notifySlotUnavailableRefund(bookingId, clientId, businessId, details) {
        const template = await this.getTemplate(businessId, 'booking_rejection');
        const preferences = await this.getUserPreferences(clientId, businessId);
        const variables = {
            clientName: details.clientName,
            serviceName: details.serviceName,
            requestedDate: details.date,
            requestedTime: details.time,
            businessName: details.businessName,
            rejectionReason: 'Slot no longer available - full refund processed',
            businessPhone: details.businessPhone,
        };
        const content = this.replaceTemplateVariables(template.content, variables);
        const subject = this.replaceTemplateVariables(template.subject, variables);
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
        });
    }
    async notifyPaymentReminder(bookingId, clientId, businessId, details) {
        const template = await this.getTemplate(businessId, 'payment_failed');
        const preferences = await this.getUserPreferences(clientId, businessId);
        const variables = {
            clientName: details.clientName,
            paymentAmount: details.amount,
            failureReason: 'Payment reminder - please complete payment',
            serviceName: details.serviceName,
            appointmentDate: details.appointmentDate,
            businessName: details.businessName,
            businessPhone: details.businessPhone,
            retryPaymentUrl: details.paymentUrl,
        };
        const content = this.replaceTemplateVariables(template.content, variables);
        const subject = this.replaceTemplateVariables(template.subject, variables);
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
        });
    }
    async notifyAppointmentCancellation(appointmentId, clientId, businessId, appointmentDetails, cancellationReason) {
        const template = await this.getTemplate(businessId, 'appointment_cancelled');
        const preferences = await this.getUserPreferences(clientId, businessId);
        const variables = {
            clientName: appointmentDetails.clientName,
            serviceName: appointmentDetails.serviceName,
            appointmentDate: appointmentDetails.date,
            appointmentTime: appointmentDetails.time,
            businessName: appointmentDetails.businessName,
            cancellationReason,
            businessPhone: appointmentDetails.businessPhone,
            appointmentNumber: appointmentDetails.appointmentNumber,
        };
        const content = this.replaceTemplateVariables(template.content, variables);
        const subject = this.replaceTemplateVariables(template.subject, variables);
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
        });
    }
    async notifyPaymentConfirmation(paymentId, clientId, businessId, paymentDetails) {
        const template = await this.getTemplate(businessId, 'payment_confirmation');
        const preferences = await this.getUserPreferences(clientId, businessId);
        const variables = {
            clientName: paymentDetails.clientName,
            paymentAmount: paymentDetails.amount,
            paymentMethod: paymentDetails.method,
            transactionId: paymentDetails.transactionId,
            serviceName: paymentDetails.serviceName,
            appointmentDate: paymentDetails.appointmentDate,
            businessName: paymentDetails.businessName,
            receiptUrl: paymentDetails.receiptUrl,
        };
        const content = this.replaceTemplateVariables(template.content, variables);
        const subject = this.replaceTemplateVariables(template.subject, variables);
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
        });
    }
    async notifyPaymentFailed(paymentId, clientId, businessId, paymentDetails) {
        const template = await this.getTemplate(businessId, 'payment_failed');
        const preferences = await this.getUserPreferences(clientId, businessId);
        const variables = {
            clientName: paymentDetails.clientName,
            paymentAmount: paymentDetails.amount,
            failureReason: paymentDetails.failureReason,
            serviceName: paymentDetails.serviceName,
            appointmentDate: paymentDetails.appointmentDate,
            businessName: paymentDetails.businessName,
            businessPhone: paymentDetails.businessPhone,
            retryPaymentUrl: paymentDetails.retryPaymentUrl,
        };
        const content = this.replaceTemplateVariables(template.content, variables);
        const subject = this.replaceTemplateVariables(template.subject, variables);
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
        });
    }
    async notifyStaffAssignment(appointmentId, staffId, businessId, appointmentDetails) {
        const template = await this.getTemplate(businessId, 'staff_assignment');
        const variables = {
            staffName: appointmentDetails.staffName,
            clientName: appointmentDetails.clientName,
            serviceName: appointmentDetails.serviceName,
            appointmentDate: appointmentDetails.date,
            appointmentTime: appointmentDetails.time,
            businessName: appointmentDetails.businessName,
            appointmentNumber: appointmentDetails.appointmentNumber,
            serviceNotes: appointmentDetails.serviceNotes || 'None',
        };
        const content = this.replaceTemplateVariables(template.content, variables);
        const subject = this.replaceTemplateVariables(template.subject, variables);
        await this.sendNotification({
            businessId,
            recipientId: staffId,
            recipientType: 'staff',
            recipient: appointmentDetails.staffEmail,
            recipientPhone: appointmentDetails.staffPhone,
            subject,
            content,
            channel: template.channel,
            preferences: { email: true, sms: true },
            templateId: template._id.toString(),
            relatedEntityId: appointmentId,
            relatedEntityType: 'appointment'
        });
    }
    async sendAppointmentReminders() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        const appointments = await this.getAppointmentsForReminder(tomorrow, dayAfterTomorrow);
        for (const appointment of appointments) {
            try {
                await this.notifyAppointmentReminder(appointment._id, appointment.clientId, appointment.businessId, appointment);
                await this.markAppointmentReminded(appointment._id);
            }
            catch (error) {
                console.error(`Failed to send reminder for appointment ${appointment._id}:`, error);
            }
        }
    }
    async sendNotification(notificationData) {
        const { channel, preferences } = notificationData;
        if ((channel === 'email' || channel === 'both') && preferences.email) {
            const emailResult = await this.emailService.sendEmail(notificationData.recipient, notificationData.subject, notificationData.content);
            await this.logNotification({
                ...notificationData,
                channel: 'email',
                status: emailResult.success ? 'sent' : 'failed',
                providerMessageId: emailResult.messageId,
                errorMessage: emailResult.error,
                sentAt: emailResult.success ? new Date() : null,
            });
        }
        if ((channel === 'sms' || channel === 'both') && preferences.sms && notificationData.recipientPhone) {
            const smsContent = this.stripHtml(notificationData.content);
            const smsResult = await this.smsService.sendSMS(notificationData.recipientPhone, smsContent);
            await this.logNotification({
                ...notificationData,
                channel: 'sms',
                content: smsContent,
                status: smsResult.success ? 'sent' : 'failed',
                providerMessageId: smsResult.messageId,
                errorMessage: smsResult.error,
                sentAt: smsResult.success ? new Date() : null,
            });
        }
    }
    async logNotification(logData) {
        const log = new this.notificationLogModel({
            businessId: new mongoose_2.Types.ObjectId(logData.businessId),
            recipientId: new mongoose_2.Types.ObjectId(logData.recipientId),
            recipientType: logData.recipientType,
            channel: logData.channel,
            recipient: logData.recipient,
            subject: logData.subject,
            content: logData.content,
            status: logData.status,
            providerMessageId: logData.providerMessageId,
            errorMessage: logData.errorMessage,
            sentAt: logData.sentAt,
            relatedEntityId: new mongoose_2.Types.ObjectId(logData.relatedEntityId),
            relatedEntityType: logData.relatedEntityType,
            templateId: new mongoose_2.Types.ObjectId(logData.templateId),
        });
        await log.save();
    }
    async getTemplate(businessId, templateType) {
        let template = await this.notificationTemplateModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            templateType,
            isActive: true,
        });
        if (!template) {
            template = await this.notificationTemplateModel.findOne({
                templateType,
                isDefault: true,
                isActive: true,
            });
        }
        if (!template) {
            throw new Error(`No template found for type: ${templateType}`);
        }
        return template;
    }
    async getUserPreferences(userId, businessId) {
        const preferences = await this.notificationPreferenceModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            businessId: new mongoose_2.Types.ObjectId(businessId),
        });
        return preferences?.preferences || {
            booking_confirmation: { email: true, sms: true },
            booking_rejection: { email: true, sms: true },
            appointment_reminder: { email: true, sms: true },
            appointment_cancelled: { email: true, sms: true },
            payment_confirmation: { email: true, sms: false },
            payment_failed: { email: true, sms: true },
            promotional: { email: false, sms: false },
        };
    }
    replaceTemplateVariables(template, variables) {
        let result = template;
        Object.keys(variables).forEach(key => {
            const placeholder = `{{${key}}}`;
            const value = variables[key] || '';
            result = result.replace(new RegExp(placeholder, 'g'), value);
        });
        return result;
    }
    stripHtml(html) {
        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    }
    async getAppointmentsForReminder(startDate, endDate) {
        return [];
    }
    async markAppointmentReminded(appointmentId) {
    }
    async notifyAppointmentCompletion(appointmentId, clientId, businessId, appointmentDetails) {
        const template = await this.getTemplate(businessId, 'appointment_completed');
        const preferences = await this.getUserPreferences(clientId, businessId);
        const variables = {
            clientName: appointmentDetails.clientName,
            serviceName: appointmentDetails.serviceName,
            appointmentDate: appointmentDetails.appointmentDate,
            appointmentTime: appointmentDetails.appointmentTime,
            businessName: appointmentDetails.businessName,
            appointmentNumber: appointmentDetails.appointmentNumber,
            completionTime: new Date().toLocaleTimeString(),
            completionDate: new Date().toLocaleDateString(),
        };
        const content = this.replaceTemplateVariables(template.content, variables);
        const subject = this.replaceTemplateVariables(template.subject, variables);
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
        });
    }
    async notifyAppointmentConfirmation(appointmentId, clientId, businessId, appointmentDetails) {
        const template = await this.getTemplate(businessId, 'booking_confirmation');
        const preferences = await this.getUserPreferences(clientId, businessId);
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
        };
        const content = this.replaceTemplateVariables(template.content, variables);
        const subject = this.replaceTemplateVariables(template.subject, variables);
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
        });
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "sendAppointmentReminders", null);
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationTemplate.name)),
    __param(1, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationLog.name)),
    __param(2, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationPreference.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        email_service_1.EmailService,
        sms_service_1.SMSService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map