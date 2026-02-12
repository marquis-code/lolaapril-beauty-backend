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
var BookingCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingCronService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const booking_schema_1 = require("../schemas/booking.schema");
const email_templates_service_1 = require("../../notification/templates/email-templates.service");
const email_service_1 = require("../../notification/email.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let BookingCronService = BookingCronService_1 = class BookingCronService {
    constructor(bookingModel, emailTemplatesService, emailService, eventEmitter) {
        this.bookingModel = bookingModel;
        this.emailTemplatesService = emailTemplatesService;
        this.emailService = emailService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(BookingCronService_1.name);
    }
    async cleanupExpiredBookings() {
        try {
            const expiredBookings = await this.bookingModel
                .find({
                status: 'pending',
                expiresAt: { $lt: new Date() }
            })
                .exec();
            if (expiredBookings.length > 0) {
                await this.bookingModel.updateMany({
                    _id: { $in: expiredBookings.map(b => b._id) }
                }, {
                    status: 'expired',
                    updatedAt: new Date()
                }).exec();
                for (const booking of expiredBookings) {
                    this.eventEmitter.emit('booking.expired', booking);
                }
                this.logger.log(`Marked ${expiredBookings.length} bookings as expired`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to cleanup expired bookings: ${error.message}`);
        }
    }
    async processBookingReminders() {
        const now = new Date();
        const next8Days = new Date();
        next8Days.setDate(next8Days.getDate() + 8);
        const confirmedBookings = await this.bookingModel.find({
            status: 'confirmed',
            preferredDate: { $gte: now, $lte: next8Days }
        }).exec();
        for (const booking of confirmedBookings) {
            const dateStr = booking.preferredDate instanceof Date
                ? booking.preferredDate.toISOString().split('T')[0]
                : booking.preferredDate;
            const appointmentTime = new Date(`${dateStr}T${booking.preferredStartTime}`);
            const diffMs = appointmentTime.getTime() - now.getTime();
            const hoursUntil = diffMs / (1000 * 60 * 60);
            const daysUntil = hoursUntil / 24;
            const tiersSent = booking.reminderTiersSent || [];
            let tierToSend = null;
            if (hoursUntil <= 2.5 && hoursUntil > 1 && !tiersSent.includes('2h')) {
                tierToSend = '2h';
            }
            else if (daysUntil <= 1.2 && daysUntil > 0.5 && !tiersSent.includes('1d')) {
                tierToSend = '1d';
            }
            else if (daysUntil <= 2.2 && daysUntil > 1.5 && !tiersSent.includes('2d')) {
                tierToSend = '2d';
            }
            else if (daysUntil <= 7.2 && daysUntil > 6.5 && !tiersSent.includes('7d')) {
                tierToSend = '7d';
            }
            if (tierToSend && booking.clientEmail) {
                try {
                    const { subject, html } = this.emailTemplatesService.bookingReminder({
                        clientName: booking.clientName,
                        bookingNumber: booking.bookingNumber,
                        services: booking.services,
                        preferredDate: booking.preferredDate.toDateString(),
                        preferredStartTime: booking.preferredStartTime,
                        businessName: 'Lola April',
                        reminderTier: tierToSend
                    });
                    await this.emailService.sendEmail(booking.clientEmail, subject, html);
                    await this.bookingModel.findByIdAndUpdate(booking._id, {
                        $push: { reminderTiersSent: tierToSend },
                        lastReminderAt: new Date()
                    }).exec();
                    this.logger.log(`Sent ${tierToSend} reminder to ${booking.clientEmail} for booking ${booking.bookingNumber}`);
                }
                catch (error) {
                    this.logger.error(`Failed to send ${tierToSend} reminder for booking ${booking.bookingNumber}: ${error.message}`);
                }
            }
        }
    }
    async processRebookReminders() {
        const twoWeeksAgoStart = new Date();
        twoWeeksAgoStart.setDate(twoWeeksAgoStart.getDate() - 14);
        twoWeeksAgoStart.setHours(0, 0, 0, 0);
        const twoWeeksAgoEnd = new Date();
        twoWeeksAgoEnd.setDate(twoWeeksAgoEnd.getDate() - 14);
        twoWeeksAgoEnd.setHours(23, 59, 59, 999);
        const staleBookings = await this.bookingModel.find({
            status: 'completed',
            updatedAt: { $gte: twoWeeksAgoStart, $lte: twoWeeksAgoEnd },
            rebookReminderSent: { $ne: true }
        }).exec();
        for (const booking of staleBookings) {
            if (booking.clientEmail) {
                try {
                    const { subject, html } = this.emailTemplatesService.rebookReminder({
                        clientName: booking.clientName,
                        serviceName: booking.services[0]?.serviceName || 'previous',
                        businessName: 'Lola April',
                        businessId: booking.businessId.toString()
                    });
                    await this.emailService.sendEmail(booking.clientEmail, subject, html);
                    await this.bookingModel.findByIdAndUpdate(booking._id, { rebookReminderSent: true }).exec();
                    this.logger.log(`Sent re-book reminder to ${booking.clientEmail} for completed booking ${booking.bookingNumber}`);
                }
                catch (error) {
                    this.logger.error(`Failed to send re-book reminder for booking ${booking.bookingNumber}: ${error.message}`);
                }
            }
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingCronService.prototype, "cleanupExpiredBookings", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingCronService.prototype, "processBookingReminders", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingCronService.prototype, "processRebookReminders", null);
BookingCronService = BookingCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_templates_service_1.EmailTemplatesService,
        email_service_1.EmailService,
        event_emitter_1.EventEmitter2])
], BookingCronService);
exports.BookingCronService = BookingCronService;
//# sourceMappingURL=booking-cron.service.js.map