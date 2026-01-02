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
exports.ReminderProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ReminderProcessor = class ReminderProcessor {
    constructor(bookingModel, notificationModel) {
        this.bookingModel = bookingModel;
        this.notificationModel = notificationModel;
    }
    async handleBookingReminder(job) {
        const { bookingId, reminderType } = job.data;
        console.log(`Processing ${reminderType} reminder for booking ${bookingId}`);
        const booking = await this.bookingModel
            .findById(bookingId)
            .populate('clientId')
            .populate('businessId');
        if (!booking) {
            console.error(`Booking ${bookingId} not found`);
            return;
        }
        await this.notificationModel.create({
            recipientId: booking.clientId._id,
            type: 'booking_reminder',
            channel: 'email',
            subject: `Reminder: Upcoming appointment`,
            message: `Your appointment is scheduled for ${booking.bookingDate}`,
            status: 'pending',
        });
        console.log(`Reminder sent for booking ${bookingId}`);
    }
    async scheduleReminders(job) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const upcomingBookings = await this.bookingModel.find({
            bookingDate: {
                $gte: tomorrow,
                $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
            },
            status: 'confirmed',
        });
        console.log(`Found ${upcomingBookings.length} bookings for tomorrow`);
        for (const booking of upcomingBookings) {
            await job.queue.add('send-booking-reminder', {
                bookingId: booking._id.toString(),
                reminderType: '24_hour',
            });
        }
    }
};
__decorate([
    (0, bull_1.Process)('send-booking-reminder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReminderProcessor.prototype, "handleBookingReminder", null);
__decorate([
    (0, bull_1.Process)('schedule-reminders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReminderProcessor.prototype, "scheduleReminders", null);
ReminderProcessor = __decorate([
    (0, bull_1.Processor)('reminders'),
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Booking')),
    __param(1, (0, mongoose_1.InjectModel)('Notification')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ReminderProcessor);
exports.ReminderProcessor = ReminderProcessor;
//# sourceMappingURL=reminder.processor.js.map