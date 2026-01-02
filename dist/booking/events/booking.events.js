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
var BookingEventHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingEventHandler = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_service_1 = require("../../notification/notification.service");
let BookingEventHandler = BookingEventHandler_1 = class BookingEventHandler {
    constructor(notificationService) {
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(BookingEventHandler_1.name);
    }
    async handleBookingCreated(booking) {
        this.logger.log(`Handling booking created event for: ${booking.bookingNumber}`);
        await this.notificationService.notifyStaffNewBooking(booking);
    }
    async handleBookingConfirmed(data) {
        this.logger.log(`Handling booking confirmed event for: ${data.booking.bookingNumber}`);
        await this.notificationService.notifyBookingConfirmation(data.booking._id, data.booking.clientId, data.booking.businessId, {
            clientName: data.booking.clientName,
            serviceName: data.booking.services.map(s => s.serviceName).join(', '),
            date: data.booking.preferredDate.toDateString(),
            time: data.booking.preferredStartTime,
            businessName: data.booking.businessName,
            businessAddress: data.booking.businessAddress || '',
            appointmentNumber: data.booking.bookingNumber,
            clientEmail: data.booking.clientEmail,
            clientPhone: data.booking.clientPhone
        });
    }
    async handleBookingCancelled(data) {
        this.logger.log(`Handling booking cancelled event for: ${data.booking.bookingNumber}`);
        await this.notificationService.notifyAppointmentCancellation(data.booking._id, data.booking.clientId, data.booking.businessId, {
            clientName: data.booking.clientName,
            serviceName: data.booking.services.map(s => s.serviceName).join(', '),
            appointmentDate: data.booking.preferredDate.toDateString(),
            appointmentTime: data.booking.preferredStartTime,
            businessName: data.booking.businessName,
            appointmentNumber: data.booking.bookingNumber,
            businessPhone: data.booking.businessPhone || '',
            clientEmail: data.booking.clientEmail,
            clientPhone: data.booking.clientPhone
        }, data.reason);
    }
    async handleBookingExpired(booking) {
        this.logger.log(`Handling booking expired event for: ${booking.bookingNumber}`);
    }
    async handlePaymentReminder(booking) {
        this.logger.log(`Sending payment reminder for booking: ${booking.bookingNumber}`);
        await this.notificationService.notifyPaymentReminder(booking._id, booking.clientId, booking.businessId, {
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
        });
    }
    async handleAppointmentCreated(data) {
        this.logger.log(`Handling appointment created event for: ${data.appointment.appointmentNumber}`);
        if (data.booking) {
        }
        await this.notificationService.notifyAppointmentConfirmation(data.appointment._id, data.appointment.clientId, data.appointment.businessId, {
            clientName: data.appointment.clientName,
            serviceName: data.appointment.services.map(s => s.serviceName).join(', '),
            appointmentDate: data.appointment.scheduledDate.toDateString(),
            appointmentTime: data.appointment.scheduledStartTime,
            businessName: data.appointment.businessName,
            businessAddress: data.appointment.businessAddress || '',
            appointmentNumber: data.appointment.appointmentNumber,
            clientEmail: data.appointment.clientEmail,
            clientPhone: data.appointment.clientPhone
        });
        if (data.staffAssignment) {
            await this.notificationService.notifyStaffAssignment(data.appointment._id, data.staffAssignment.staffId, data.appointment.businessId, {
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
            });
        }
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('booking.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingEventHandler.prototype, "handleBookingCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('booking.confirmed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingEventHandler.prototype, "handleBookingConfirmed", null);
__decorate([
    (0, event_emitter_1.OnEvent)('booking.cancelled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingEventHandler.prototype, "handleBookingCancelled", null);
__decorate([
    (0, event_emitter_1.OnEvent)('booking.expired'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingEventHandler.prototype, "handleBookingExpired", null);
__decorate([
    (0, event_emitter_1.OnEvent)('booking.payment.reminder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingEventHandler.prototype, "handlePaymentReminder", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingEventHandler.prototype, "handleAppointmentCreated", null);
BookingEventHandler = BookingEventHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], BookingEventHandler);
exports.BookingEventHandler = BookingEventHandler;
//# sourceMappingURL=booking.events.js.map