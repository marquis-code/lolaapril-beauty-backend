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
var NotificationEventListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEventListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const realtime_gateway_1 = require("../gateways/realtime.gateway");
let NotificationEventListener = NotificationEventListener_1 = class NotificationEventListener {
    constructor(realtimeGateway) {
        this.realtimeGateway = realtimeGateway;
        this.logger = new common_1.Logger(NotificationEventListener_1.name);
    }
    handleAuditCreated(payload) {
        this.logger.log(`📢 Audit event received for business ${payload.businessId}`);
        this.realtimeGateway.emitAuditNotification(payload.businessId, payload.auditLog);
    }
    handleBookingCreated(payload) {
        this.logger.log(`📅 New booking created for business ${payload.businessId}`);
        const notification = {
            type: 'booking',
            subType: 'created',
            title: 'New Booking',
            message: `New booking from ${payload.booking.clientName}`,
            data: payload.booking,
            timestamp: new Date(),
        };
        this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification);
    }
    handleBookingStatusChanged(payload) {
        this.logger.log(`📝 Booking status changed for business ${payload.businessId}`);
        const notification = {
            type: 'booking',
            subType: 'status-changed',
            title: 'Booking Status Updated',
            message: `Booking ${payload.booking.id} changed from ${payload.oldStatus} to ${payload.newStatus}`,
            data: payload.booking,
            timestamp: new Date(),
        };
        this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification);
    }
    handlePaymentReceived(payload) {
        this.logger.log(`💰 Payment received for business ${payload.businessId}`);
        const notification = {
            type: 'payment',
            subType: 'received',
            title: 'Payment Received',
            message: `Payment of ${payload.payment.amount} received`,
            data: payload.payment,
            timestamp: new Date(),
        };
        this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification);
    }
    handleClientCreated(payload) {
        this.logger.log(`👤 New client created for business ${payload.businessId}`);
        const notification = {
            type: 'client',
            subType: 'created',
            title: 'New Client',
            message: `New client: ${payload.client.profile.firstName} ${payload.client.profile.lastName}`,
            data: payload.client,
            timestamp: new Date(),
        };
        this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification);
    }
    handleAppointmentReminder(payload) {
        this.logger.log(`⏰ Appointment reminder for business ${payload.businessId}`);
        const notification = {
            type: 'appointment',
            subType: 'reminder',
            title: 'Upcoming Appointment',
            message: `Appointment with ${payload.appointment.clientName} in 1 hour`,
            data: payload.appointment,
            timestamp: new Date(),
        };
        this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification);
    }
    handleStaffAvailabilityChanged(payload) {
        this.logger.log(`👨‍💼 Staff availability changed for business ${payload.businessId}`);
        const notification = {
            type: 'staff',
            subType: 'availability-changed',
            title: 'Staff Availability Update',
            message: `${payload.staff.name} is now ${payload.isAvailable ? 'available' : 'unavailable'}`,
            data: payload.staff,
            timestamp: new Date(),
        };
        this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification);
    }
    handleLowStockAlert(payload) {
        this.logger.log(`📦 Low stock alert for business ${payload.businessId}`);
        const notification = {
            type: 'inventory',
            subType: 'low-stock',
            title: 'Low Stock Alert',
            message: `${payload.product.name} is running low`,
            data: payload.product,
            priority: 'high',
            timestamp: new Date(),
        };
        this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification);
    }
    handleSystemAlert(payload) {
        this.logger.log(`⚠️ System alert for business ${payload.businessId}`);
        const notification = {
            type: 'system',
            subType: 'alert',
            title: payload.alert.title || 'System Alert',
            message: payload.alert.message,
            data: payload.alert,
            priority: payload.alert.priority || 'medium',
            timestamp: new Date(),
        };
        this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification);
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('audit.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationEventListener.prototype, "handleAuditCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('booking.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationEventListener.prototype, "handleBookingCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('booking.status-changed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationEventListener.prototype, "handleBookingStatusChanged", null);
__decorate([
    (0, event_emitter_1.OnEvent)('payment.received'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationEventListener.prototype, "handlePaymentReceived", null);
__decorate([
    (0, event_emitter_1.OnEvent)('client.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationEventListener.prototype, "handleClientCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.reminder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationEventListener.prototype, "handleAppointmentReminder", null);
__decorate([
    (0, event_emitter_1.OnEvent)('staff.availability-changed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationEventListener.prototype, "handleStaffAvailabilityChanged", null);
__decorate([
    (0, event_emitter_1.OnEvent)('inventory.low-stock'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationEventListener.prototype, "handleLowStockAlert", null);
__decorate([
    (0, event_emitter_1.OnEvent)('system.alert'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationEventListener.prototype, "handleSystemAlert", null);
NotificationEventListener = NotificationEventListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [realtime_gateway_1.RealtimeGateway])
], NotificationEventListener);
exports.NotificationEventListener = NotificationEventListener;
//# sourceMappingURL=notification-event.listener.js.map