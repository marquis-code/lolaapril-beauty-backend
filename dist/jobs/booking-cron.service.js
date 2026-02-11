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
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../booking/schemas/booking.schema");
const email_service_1 = require("../notification/email.service");
const email_templates_service_1 = require("../notification/templates/email-templates.service");
let BookingCronService = BookingCronService_1 = class BookingCronService {
    constructor(bookingModel, emailService, emailTemplatesService) {
        this.bookingModel = bookingModel;
        this.emailService = emailService;
        this.emailTemplatesService = emailTemplatesService;
        this.logger = new common_1.Logger(BookingCronService_1.name);
    }
    async processBookingReminders() {
        this.logger.log('🔔 Running booking reminder cron...');
        try {
            const now = new Date();
            const confirmedBookings = await this.bookingModel.find({
                status: { $in: ['confirmed', 'deposit_paid'] },
                preferredDate: { $gte: now },
            }).lean();
            let sentCount = 0;
            for (const booking of confirmedBookings) {
                const bookingDate = new Date(booking.preferredDate);
                if (booking.preferredStartTime) {
                    const [hours, minutes] = booking.preferredStartTime.split(':').map(Number);
                    bookingDate.setHours(hours || 0, minutes || 0, 0, 0);
                }
                const hoursUntil = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
                const tiersSent = booking.reminderTiersSent || [];
                let tierToSend = null;
                if (hoursUntil <= 2.5 && hoursUntil > 1 && !tiersSent.includes('2h')) {
                    tierToSend = '2h';
                }
                else if (hoursUntil <= 12 && hoursUntil > 2.5 && !tiersSent.includes('morning')) {
                    const isToday = bookingDate.toDateString() === now.toDateString();
                    if (isToday && now.getHours() >= 6) {
                        tierToSend = 'morning';
                    }
                }
                else if (hoursUntil <= 30 && hoursUntil > 12 && !tiersSent.includes('1d')) {
                    tierToSend = '1d';
                }
                else if (hoursUntil <= 54 && hoursUntil > 30 && !tiersSent.includes('2d')) {
                    tierToSend = '2d';
                }
                else if (hoursUntil <= 102 && hoursUntil > 54 && !tiersSent.includes('4d')) {
                    tierToSend = '4d';
                }
                else if (hoursUntil <= 174 && hoursUntil > 102 && !tiersSent.includes('7d')) {
                    tierToSend = '7d';
                }
                if (tierToSend && booking.clientEmail) {
                    try {
                        const services = (booking.services || []).map(s => ({
                            serviceName: s.serviceName,
                            price: s.price,
                            quantity: s.quantity || 1,
                        }));
                        const emailData = this.emailTemplatesService.bookingReminder({
                            clientName: booking.clientName,
                            bookingNumber: booking.bookingNumber,
                            services,
                            preferredDate: new Date(booking.preferredDate).toLocaleDateString('en-US', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            }),
                            preferredStartTime: booking.preferredStartTime,
                            businessName: booking.businessName || 'Lola April',
                            reminderTier: tierToSend,
                        });
                        await this.emailService.sendEmail(booking.clientEmail, emailData.subject, emailData.html);
                        await this.bookingModel.findByIdAndUpdate(booking._id, {
                            $push: { reminderTiersSent: tierToSend },
                            $inc: { remindersSent: 1 },
                            $set: { lastReminderAt: new Date() },
                        });
                        sentCount++;
                        this.logger.log(`✅ Sent ${tierToSend} reminder for booking ${booking.bookingNumber}`);
                    }
                    catch (err) {
                        this.logger.error(`❌ Failed to send reminder for booking ${booking.bookingNumber}: ${err.message}`);
                    }
                }
            }
            this.logger.log(`🔔 Booking reminder cron complete. Sent ${sentCount} reminders.`);
        }
        catch (error) {
            this.logger.error(`❌ Booking reminder cron failed: ${error.message}`);
        }
    }
};
__decorate([
    (0, schedule_1.Cron)('0 */30 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingCronService.prototype, "processBookingReminders", null);
BookingCronService = BookingCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_service_1.EmailService,
        email_templates_service_1.EmailTemplatesService])
], BookingCronService);
exports.BookingCronService = BookingCronService;
//# sourceMappingURL=booking-cron.service.js.map