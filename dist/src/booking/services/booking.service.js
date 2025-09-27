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
var BookingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../schemas/booking.schema");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
let BookingService = BookingService_1 = class BookingService {
    constructor(bookingModel, eventEmitter) {
        this.bookingModel = bookingModel;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(BookingService_1.name);
    }
    async createBooking(createBookingData) {
        try {
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
            const booking = new this.bookingModel(Object.assign(Object.assign({}, createBookingData), { expiresAt, clientId: new mongoose_2.Types.ObjectId(createBookingData.clientId), businessId: new mongoose_2.Types.ObjectId(createBookingData.businessId), services: createBookingData.services.map(service => (Object.assign(Object.assign({}, service), { serviceId: new mongoose_2.Types.ObjectId(service.serviceId), preferredStaffId: service.preferredStaffId ?
                        new mongoose_2.Types.ObjectId(service.preferredStaffId) : undefined }))) }));
            const savedBooking = await booking.save();
            this.eventEmitter.emit('booking.created', savedBooking);
            this.logger.log(`Booking created: ${savedBooking.bookingNumber}`);
            return savedBooking;
        }
        catch (error) {
            this.logger.error(`Failed to create booking: ${error.message}`);
            throw error;
        }
    }
    async getBookingById(bookingId) {
        const booking = await this.bookingModel
            .findById(bookingId)
            .populate('services.serviceId', 'basicDetails pricingAndDuration')
            .populate('services.preferredStaffId', 'firstName lastName')
            .populate('processedBy', 'firstName lastName');
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async getBookings(query) {
        const filter = {
            businessId: new mongoose_2.Types.ObjectId(query.businessId)
        };
        if (query.clientId) {
            filter.clientId = new mongoose_2.Types.ObjectId(query.clientId);
        }
        if (query.status) {
            filter.status = query.status;
        }
        if (query.startDate && query.endDate) {
            filter.preferredDate = {
                $gte: new Date(query.startDate),
                $lte: new Date(query.endDate)
            };
        }
        const limit = parseInt(query.limit) || 50;
        const offset = parseInt(query.offset) || 0;
        const page = Math.floor(offset / limit) + 1;
        const [bookings, total] = await Promise.all([
            this.bookingModel
                .find(filter)
                .populate('services.serviceId', 'basicDetails pricingAndDuration')
                .populate('services.preferredStaffId', 'firstName lastName')
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(offset),
            this.bookingModel.countDocuments(filter)
        ]);
        return {
            bookings,
            total,
            page,
            limit
        };
    }
    async updateBookingStatus(bookingId, status, updatedBy, reason) {
        const updateData = {
            status,
            updatedAt: new Date()
        };
        if (updatedBy) {
            updateData.processedBy = new mongoose_2.Types.ObjectId(updatedBy);
        }
        if (reason) {
            if (status === 'cancelled') {
                updateData.cancellationReason = reason;
                updateData.cancellationDate = new Date();
            }
            else if (status === 'rejected') {
                updateData.rejectionReason = reason;
            }
        }
        const booking = await this.bookingModel.findByIdAndUpdate(bookingId, updateData, { new: true });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        this.eventEmitter.emit('booking.status.changed', {
            booking,
            previousStatus: booking.status,
            newStatus: status,
            updatedBy
        });
        this.logger.log(`Booking ${booking.bookingNumber} status changed to ${status}`);
        return booking;
    }
    async confirmBooking(bookingId, staffId, confirmedBy) {
        const booking = await this.bookingModel.findById(bookingId);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== 'pending') {
            throw new common_1.BadRequestException('Booking is not in pending status');
        }
        booking.status = 'confirmed';
        booking.processedBy = new mongoose_2.Types.ObjectId(confirmedBy);
        booking.updatedAt = new Date();
        const savedBooking = await booking.save();
        this.eventEmitter.emit('booking.confirmed', {
            booking: savedBooking,
            staffId,
            confirmedBy
        });
        this.logger.log(`Booking ${booking.bookingNumber} confirmed by staff ${confirmedBy}`);
        return savedBooking;
    }
    async rejectBooking(bookingId, reason, rejectedBy) {
        const booking = await this.bookingModel.findById(bookingId);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== 'pending') {
            throw new common_1.BadRequestException('Booking is not in pending status');
        }
        booking.status = 'rejected';
        booking.rejectionReason = reason;
        booking.processedBy = new mongoose_2.Types.ObjectId(rejectedBy);
        booking.updatedAt = new Date();
        await booking.save();
        this.eventEmitter.emit('booking.rejected', {
            booking,
            reason,
            rejectedBy
        });
        this.logger.log(`Booking ${booking.bookingNumber} rejected: ${reason}`);
    }
    async cancelBooking(bookingId, reason, cancelledBy) {
        const booking = await this.bookingModel.findById(bookingId);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (['cancelled', 'expired'].includes(booking.status)) {
            throw new common_1.BadRequestException('Booking is already cancelled or expired');
        }
        booking.status = 'cancelled';
        booking.cancellationReason = reason;
        booking.cancellationDate = new Date();
        booking.processedBy = new mongoose_2.Types.ObjectId(cancelledBy);
        booking.updatedAt = new Date();
        await booking.save();
        this.eventEmitter.emit('booking.cancelled', {
            booking,
            reason,
            cancelledBy
        });
        this.logger.log(`Booking ${booking.bookingNumber} cancelled: ${reason}`);
    }
    async getClientBookings(clientId, status) {
        const filter = {
            clientId: new mongoose_2.Types.ObjectId(clientId)
        };
        if (status) {
            filter.status = status;
        }
        return await this.bookingModel
            .find(filter)
            .populate('services.serviceId', 'basicDetails pricingAndDuration')
            .populate('businessId', 'businessName contact address')
            .sort({ createdAt: -1 });
    }
    async getTodayBookings(businessId) {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        return await this.bookingModel
            .find({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            preferredDate: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        })
            .populate('services.serviceId', 'basicDetails pricingAndDuration')
            .populate('services.preferredStaffId', 'firstName lastName')
            .sort({ preferredStartTime: 1 });
    }
    async getPendingBookings(businessId) {
        return await this.bookingModel
            .find({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            status: 'pending',
            expiresAt: { $gt: new Date() }
        })
            .populate('services.serviceId', 'basicDetails pricingAndDuration')
            .sort({ createdAt: 1 });
    }
    async getUpcomingBookings(businessId, days = 7) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);
        return await this.bookingModel
            .find({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            status: { $in: ['confirmed', 'pending'] },
            preferredDate: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .populate('services.serviceId', 'basicDetails pricingAndDuration')
            .sort({ preferredDate: 1, preferredStartTime: 1 });
    }
    async linkAppointment(bookingId, appointmentId) {
        await this.bookingModel.findByIdAndUpdate(bookingId, {
            appointmentId: new mongoose_2.Types.ObjectId(appointmentId),
            updatedAt: new Date()
        });
        this.logger.log(`Booking ${bookingId} linked to appointment ${appointmentId}`);
    }
    async extendBookingExpiry(bookingId, additionalMinutes = 30) {
        const booking = await this.bookingModel.findById(bookingId);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== 'pending') {
            throw new common_1.BadRequestException('Can only extend pending bookings');
        }
        const newExpiryTime = new Date(booking.expiresAt.getTime() + additionalMinutes * 60 * 1000);
        booking.expiresAt = newExpiryTime;
        booking.updatedAt = new Date();
        const savedBooking = await booking.save();
        this.logger.log(`Booking ${booking.bookingNumber} expiry extended by ${additionalMinutes} minutes`);
        return savedBooking;
    }
    async getBookingStats(businessId, startDate, endDate) {
        const matchStage = {
            businessId: new mongoose_2.Types.ObjectId(businessId)
        };
        if (startDate && endDate) {
            matchStage.createdAt = {
                $gte: startDate,
                $lte: endDate
            };
        }
        const stats = await this.bookingModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$estimatedTotal' }
                }
            }
        ]);
        const totalBookings = await this.bookingModel.countDocuments(matchStage);
        return {
            totalBookings,
            statusBreakdown: stats,
            conversionRate: this.calculateConversionRate(stats)
        };
    }
    async cleanupExpiredBookings() {
        try {
            const expiredBookings = await this.bookingModel.find({
                status: 'pending',
                expiresAt: { $lt: new Date() }
            });
            if (expiredBookings.length > 0) {
                await this.bookingModel.updateMany({
                    status: 'pending',
                    expiresAt: { $lt: new Date() }
                }, {
                    status: 'expired',
                    updatedAt: new Date()
                });
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
    async sendPaymentReminders() {
        try {
            const pendingBookings = await this.bookingModel.find({
                status: 'pending',
                remindersSent: { $lt: 3 },
                expiresAt: { $gt: new Date() },
                $or: [
                    { lastReminderAt: { $exists: false } },
                    { lastReminderAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) } }
                ]
            });
            for (const booking of pendingBookings) {
                this.eventEmitter.emit('booking.payment.reminder', booking);
                booking.remindersSent += 1;
                booking.lastReminderAt = new Date();
                await booking.save();
            }
            if (pendingBookings.length > 0) {
                this.logger.log(`Sent payment reminders for ${pendingBookings.length} bookings`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to send payment reminders: ${error.message}`);
        }
    }
    calculateConversionRate(stats) {
        var _a;
        const confirmedCount = ((_a = stats.find(s => s._id === 'confirmed')) === null || _a === void 0 ? void 0 : _a.count) || 0;
        const totalCount = stats.reduce((sum, s) => sum + s.count, 0);
        return totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0;
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingService.prototype, "cleanupExpiredBookings", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingService.prototype, "sendPaymentReminders", null);
BookingService = BookingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        event_emitter_1.EventEmitter2])
], BookingService);
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map