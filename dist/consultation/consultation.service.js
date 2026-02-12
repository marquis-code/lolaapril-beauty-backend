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
var ConsultationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const consultation_schema_1 = require("./schemas/consultation.schema");
const google_calendar_service_1 = require("../integration/google-calendar.service");
const notification_service_1 = require("../notification/notification.service");
const integration_schema_1 = require("../integration/schemas/integration.schema");
const gateway_manager_service_1 = require("../integration/gateway-manager.service");
const moment = require("moment");
const uuid_1 = require("uuid");
let ConsultationService = ConsultationService_1 = class ConsultationService {
    constructor(packageModel, bookingModel, availabilityModel, integrationModel, googleCalendarService, notificationService, gatewayManager) {
        this.packageModel = packageModel;
        this.bookingModel = bookingModel;
        this.availabilityModel = availabilityModel;
        this.integrationModel = integrationModel;
        this.googleCalendarService = googleCalendarService;
        this.notificationService = notificationService;
        this.gatewayManager = gatewayManager;
        this.logger = new common_1.Logger(ConsultationService_1.name);
    }
    async createPackage(businessId, dto) {
        const pkg = new this.packageModel({
            ...dto,
            businessId: new mongoose_2.Types.ObjectId(businessId),
        });
        return pkg.save();
    }
    async getPackages(businessId, onlyActive = true) {
        const query = { businessId: new mongoose_2.Types.ObjectId(businessId) };
        if (onlyActive)
            query.isActive = true;
        return this.packageModel.find(query).exec();
    }
    async updatePackage(businessId, packageId, dto) {
        const pkg = await this.packageModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(packageId), businessId: new mongoose_2.Types.ObjectId(businessId) }, { $set: dto }, { new: true });
        if (!pkg)
            throw new common_1.NotFoundException('Package not found');
        return pkg;
    }
    async updateAvailability(businessId, dto) {
        return this.availabilityModel.findOneAndUpdate({ businessId: new mongoose_2.Types.ObjectId(businessId) }, { $set: { weeklySchedule: dto.weeklySchedule } }, { upsert: true, new: true });
    }
    async getAvailability(businessId) {
        let availability = await this.availabilityModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId)
        }).exec();
        if (!availability) {
            return {
                businessId,
                weeklySchedule: Array.from({ length: 7 }, (_, i) => ({
                    dayOfWeek: i,
                    isOpen: false,
                    timeSlots: []
                }))
            };
        }
        return availability;
    }
    async getAvailableSlots(businessId, dateStr, packageId) {
        const pkg = await this.packageModel.findById(packageId);
        if (!pkg)
            throw new common_1.NotFoundException('Package not found');
        const date = moment(dateStr).startOf('day');
        const dayOfWeek = date.day();
        const availability = await this.getAvailability(businessId);
        const daySchedule = availability.weeklySchedule.find(s => s.dayOfWeek === dayOfWeek);
        if (!daySchedule || !daySchedule.isOpen || daySchedule.timeSlots.length === 0) {
            return [];
        }
        const startOfDay = date.toDate();
        const endOfDay = moment(date).endOf('day').toDate();
        const bookings = await this.bookingModel.find({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            startTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'cancelled' }
        }).exec();
        const availableSlots = [];
        const duration = pkg.duration;
        for (const scheduleSlot of daySchedule.timeSlots) {
            let current = moment(`${dateStr} ${scheduleSlot.startTime}`, 'YYYY-MM-DD HH:mm');
            const end = moment(`${dateStr} ${scheduleSlot.endTime}`, 'YYYY-MM-DD HH:mm');
            while (current.clone().add(duration, 'minutes').isSameOrBefore(end)) {
                const slotStart = current.toDate();
                const slotEnd = current.clone().add(duration, 'minutes').toDate();
                const isConflict = bookings.some(b => {
                    return (slotStart < b.endTime && slotEnd > b.startTime);
                });
                if (!isConflict && current.isAfter(moment())) {
                    availableSlots.push(current.format('HH:mm'));
                }
                current.add(30, 'minutes');
            }
        }
        return availableSlots;
    }
    async getBookings(businessId) {
        return this.bookingModel.find({ businessId: new mongoose_2.Types.ObjectId(businessId) })
            .populate('packageId clientId')
            .sort({ startTime: -1 })
            .exec();
    }
    async getClientBookings(clientId) {
        return this.bookingModel.find({ clientId: new mongoose_2.Types.ObjectId(clientId) })
            .populate('packageId businessId')
            .sort({ startTime: -1 })
            .exec();
    }
    async bookConsultation(clientId, businessId, dto) {
        const pkg = await this.packageModel.findById(dto.packageId);
        if (!pkg)
            throw new common_1.NotFoundException('Package not found');
        const startTime = new Date(dto.startTime);
        const endTime = moment(startTime).add(pkg.duration, 'minutes').toDate();
        const dateStr = moment(startTime).format('YYYY-MM-DD');
        const availableSlots = await this.getAvailableSlots(businessId, dateStr, dto.packageId);
        const requestedTimeStr = moment(startTime).format('HH:mm');
        if (!availableSlots.includes(requestedTimeStr)) {
            throw new common_1.BadRequestException('Selected slot is no longer available');
        }
        const paymentReference = `CONS-${(0, uuid_1.v4)()}`;
        const booking = new this.bookingModel({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            clientId: new mongoose_2.Types.ObjectId(clientId),
            packageId: pkg._id,
            startTime,
            endTime,
            status: 'pending',
            paymentStatus: 'unpaid',
            paymentReference,
            notes: dto.notes
        });
        await booking.save();
        const populatedBooking = await booking.populate('clientId');
        const clientEmail = populatedBooking.clientId.email;
        const payment = await this.gatewayManager.processPayment('paystack', pkg.price, {
            email: clientEmail,
            reference: paymentReference,
            metadata: {
                bookingId: booking._id,
                type: 'consultation',
                businessId
            }
        });
        return {
            booking,
            payment: {
                authorization_url: payment.authorization_url,
                reference: paymentReference,
            }
        };
    }
    async verifyBookingPayment(reference) {
        const booking = await this.bookingModel.findOne({ paymentReference: reference });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status === 'confirmed')
            return booking;
        const verification = await this.gatewayManager.verifyPayment('paystack', reference);
        if (verification.status === 'success') {
            return this.confirmBooking(booking._id.toString());
        }
        else {
            throw new common_1.BadRequestException(`Payment ${verification.status}`);
        }
    }
    async completeBooking(businessId, bookingId) {
        const booking = await this.bookingModel.findOne({
            _id: new mongoose_2.Types.ObjectId(bookingId),
            businessId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status !== 'confirmed') {
            throw new common_1.BadRequestException(`Cannot complete booking with status: ${booking.status}`);
        }
        booking.status = 'completed';
        await booking.save();
        return booking;
    }
    async cleanupExpiredBookings() {
        const thirtyMinsAgo = moment().subtract(30, 'minutes').toDate();
        const result = await this.bookingModel.updateMany({
            status: 'pending',
            createdAt: { $lt: thirtyMinsAgo }
        }, {
            $set: { status: 'cancelled' }
        });
        if (result.modifiedCount > 0) {
            this.logger.log(`Released ${result.modifiedCount} expired pending consultation slots`);
        }
    }
    async confirmBooking(bookingId) {
        const booking = await this.bookingModel.findById(bookingId).populate('packageId clientId');
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status === 'confirmed')
            return booking;
        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
        const businessId = booking.businessId.toString();
        const refreshToken = await this.getBusinessCalendarRefreshToken(businessId);
        if (refreshToken) {
            const { eventId, htmlLink, meetLink } = await this.googleCalendarService.createCalendarEvent({
                summary: `Consultation: ${booking.packageId.name}`,
                description: `Virtual consultation with client. Notes: ${booking.notes || 'None'}`,
                startDateTime: booking.startTime,
                endDateTime: booking.endTime,
                attendeeEmail: booking.clientId.email,
                refreshToken,
                createMeetLink: true
            });
            if (meetLink) {
                booking.meetingLink = meetLink;
                booking.calendarEventId = eventId;
            }
        }
        await booking.save();
        await this.sendConfirmationEmail(booking);
        return booking;
    }
    async getBusinessCalendarRefreshToken(businessId) {
        const integration = await this.integrationModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            provider: 'google'
        }).exec();
        return integration?.refreshToken || process.env.DEBUG_GOOGLE_REFRESH_TOKEN || null;
    }
    async sendConfirmationEmail(booking) {
        try {
            const client = booking.clientId;
            const pkg = booking.packageId;
            await this.notificationService.sendConsultationConfirmation(client._id.toString(), booking.businessId.toString(), {
                clientName: client.firstName || 'Client',
                clientEmail: client.email,
                packageName: pkg.name,
                date: moment(booking.startTime).format('LL'),
                time: moment(booking.startTime).format('LT'),
                meetLink: booking.meetingLink || 'To be provided',
                businessName: 'Lola April Beauty',
            });
            this.logger.log(`✅ Confirmation email sent to ${client.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send confirmation email: ${error.message}`);
        }
    }
    async sendReminders() {
        const now = new Date();
        const reminder24h = moment(now).add(24, 'hours').toDate();
        const reminder1h = moment(now).add(1, 'hour').toDate();
        const bookings24h = await this.bookingModel.find({
            status: 'confirmed',
            startTime: { $gte: now, $lte: reminder24h },
            reminderSentCount: 0
        }).populate('clientId packageId');
        for (const booking of bookings24h) {
            await this.sendReminderEmail(booking, '24-hour');
            booking.reminderSentCount = 1;
            await booking.save();
        }
        const bookings1h = await this.bookingModel.find({
            status: 'confirmed',
            startTime: { $gte: now, $lte: reminder1h },
            reminderSentCount: 1
        }).populate('clientId packageId');
        for (const booking of bookings1h) {
            await this.sendReminderEmail(booking, '1-hour');
            booking.reminderSentCount = 2;
            await booking.save();
        }
    }
    async sendReminderEmail(booking, timeLabel) {
        const client = booking.clientId;
        const pkg = booking.packageId;
        this.logger.log(`Sending ${timeLabel} reminder for booking ${booking._id}`);
        await this.notificationService.sendConsultationReminder(client._id.toString(), booking.businessId.toString(), {
            clientName: client.firstName || 'Client',
            clientEmail: client.email,
            packageName: pkg.name,
            date: moment(booking.startTime).format('LL'),
            time: moment(booking.startTime).format('LT'),
            meetLink: booking.meetingLink,
            businessName: 'Lola April Beauty',
        });
    }
    async sendThankYouEmails() {
        const now = new Date();
        const bookings = await this.bookingModel.find({
            status: 'confirmed',
            endTime: { $lt: now },
            thankYouSent: false
        }).populate('clientId packageId');
        for (const booking of bookings) {
            const client = booking.clientId;
            const pkg = booking.packageId;
            this.logger.log(`Sending thank you for booking ${booking._id}`);
            await this.notificationService.sendConsultationThankYou(client._id.toString(), booking.businessId.toString(), {
                clientName: client.firstName || 'Client',
                clientEmail: client.email,
                packageName: pkg.name,
                businessName: 'Lola April Beauty',
            });
            booking.status = 'completed';
            booking.thankYouSent = true;
            await booking.save();
        }
    }
};
ConsultationService = ConsultationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(consultation_schema_1.ConsultationPackage.name)),
    __param(1, (0, mongoose_1.InjectModel)(consultation_schema_1.ConsultationBooking.name)),
    __param(2, (0, mongoose_1.InjectModel)(consultation_schema_1.ConsultationAvailability.name)),
    __param(3, (0, mongoose_1.InjectModel)(integration_schema_1.Integration.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        google_calendar_service_1.GoogleCalendarService,
        notification_service_1.NotificationService,
        gateway_manager_service_1.GatewayManagerService])
], ConsultationService);
exports.ConsultationService = ConsultationService;
//# sourceMappingURL=consultation.service.js.map