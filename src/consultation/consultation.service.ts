import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
    ConsultationPackage, ConsultationPackageDocument,
    ConsultationBooking, ConsultationBookingDocument,
    ConsultationAvailability, ConsultationAvailabilityDocument
} from './schemas/consultation.schema';
import {
    CreateConsultationPackageDto, UpdateConsultationPackageDto,
    UpdateConsultationAvailabilityDto, BookConsultationDto
} from './dto/consultation.dto';
import { GoogleCalendarService } from '../integration/google-calendar.service';
import { NotificationService } from '../notification/notification.service';
import { Integration, IntegrationDocument } from '../integration/schemas/integration.schema';
import { GatewayManagerService } from '../integration/gateway-manager.service';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConsultationService {
    private readonly logger = new Logger(ConsultationService.name);

    constructor(
        @InjectModel(ConsultationPackage.name) private packageModel: Model<ConsultationPackageDocument>,
        @InjectModel(ConsultationBooking.name) private bookingModel: Model<ConsultationBookingDocument>,
        @InjectModel(ConsultationAvailability.name) private availabilityModel: Model<ConsultationAvailabilityDocument>,
        @InjectModel(Integration.name) private integrationModel: Model<IntegrationDocument>,
        private readonly googleCalendarService: GoogleCalendarService,
        private readonly notificationService: NotificationService,
        private readonly gatewayManager: GatewayManagerService,
        private readonly configService: ConfigService,
    ) { }

    // ================== PACKAGE MANAGEMENT ==================

    async createPackage(businessId: string, dto: CreateConsultationPackageDto) {
        const pkg = new this.packageModel({
            ...dto,
            businessId: new Types.ObjectId(businessId),
        });
        return pkg.save();
    }

    async getPackages(businessId: string, onlyActive = true) {
        const query: any = { businessId: new Types.ObjectId(businessId) };
        if (onlyActive) query.isActive = true;
        return this.packageModel.find(query).exec();
    }

    async updatePackage(businessId: string, packageId: string, dto: UpdateConsultationPackageDto) {
        const pkg = await this.packageModel.findOneAndUpdate(
            { _id: new Types.ObjectId(packageId), businessId: new Types.ObjectId(businessId) },
            { $set: dto },
            { new: true }
        );
        if (!pkg) throw new NotFoundException('Package not found');
        return pkg;
    }

    // ================== AVAILABILITY MANAGEMENT ==================

    async updateAvailability(businessId: string, dto: UpdateConsultationAvailabilityDto) {
        return this.availabilityModel.findOneAndUpdate(
            { businessId: new Types.ObjectId(businessId) },
            { $set: { weeklySchedule: dto.weeklySchedule } },
            { upsert: true, new: true }
        );
    }

    async getAvailability(businessId: string) {
        let availability = await this.availabilityModel.findOne({
            businessId: new Types.ObjectId(businessId)
        }).exec();

        if (!availability) {
            // Return default (all closed)
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

    // ================== SLOT GENERATION ==================

    async getAvailableSlots(businessId: string, dateStr: string, packageId: string) {
        const pkg = await this.packageModel.findById(packageId);
        if (!pkg) throw new NotFoundException('Package not found');

        const date = moment(dateStr).startOf('day');
        const dayOfWeek = date.day();

        const availability = await this.getAvailability(businessId);
        const daySchedule = availability.weeklySchedule.find(s => s.dayOfWeek === dayOfWeek);

        if (!daySchedule || !daySchedule.isOpen || daySchedule.timeSlots.length === 0) {
            return [];
        }

        // Get existing bookings for this day
        const startOfDay = date.toDate();
        const endOfDay = moment(date).endOf('day').toDate();
        const bookings = await this.bookingModel.find({
            businessId: new Types.ObjectId(businessId),
            startTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'cancelled' }
        }).exec();

        const availableSlots: string[] = [];
        const duration = pkg.duration;

        for (const scheduleSlot of daySchedule.timeSlots) {
            let current = moment(`${dateStr} ${scheduleSlot.startTime}`, 'YYYY-MM-DD HH:mm');
            const end = moment(`${dateStr} ${scheduleSlot.endTime}`, 'YYYY-MM-DD HH:mm');

            while (current.clone().add(duration, 'minutes').isSameOrBefore(end)) {
                const slotStart = current.toDate();
                const slotEnd = current.clone().add(duration, 'minutes').toDate();

                // Check for overlap
                const isConflict = bookings.some(b => {
                    return (slotStart < b.endTime && slotEnd > b.startTime);
                });

                if (!isConflict && current.isAfter(moment())) {
                    availableSlots.push(current.format('HH:mm'));
                }

                // Increment by 30 mins intervals for more consistency in choices
                current.add(30, 'minutes');
            }
        }

        return availableSlots;
    }

    async getBookings(businessId: string) {
        return this.bookingModel.find({ businessId: new Types.ObjectId(businessId) })
            .populate('packageId clientId')
            .sort({ startTime: -1 })
            .exec();
    }

    async getClientBookings(clientId: string) {
        return this.bookingModel.find({ clientId: new Types.ObjectId(clientId) })
            .populate('packageId businessId')
            .sort({ startTime: -1 })
            .exec();
    }

    // ================== BOOKING FLOW ==================

    async bookConsultation(clientId: string, businessId: string, dto: BookConsultationDto) {
        const pkg = await this.packageModel.findById(dto.packageId);
        if (!pkg) throw new NotFoundException('Package not found');

        const startTime = new Date(dto.startTime);
        const endTime = moment(startTime).add(pkg.duration, 'minutes').toDate();

        // Double check availability
        const dateStr = moment(startTime).format('YYYY-MM-DD');
        const availableSlots = await this.getAvailableSlots(businessId, dateStr, dto.packageId);
        const requestedTimeStr = moment(startTime).format('HH:mm');

        if (!availableSlots.includes(requestedTimeStr)) {
            throw new BadRequestException('Selected slot is no longer available');
        }

        const paymentReference = `CONS-${uuidv4()}`;

        const booking = new this.bookingModel({
            businessId: new Types.ObjectId(businessId),
            clientId: new Types.ObjectId(clientId),
            packageId: pkg._id,
            startTime,
            endTime,
            status: 'pending',
            paymentStatus: 'unpaid',
            paymentReference,
            notes: dto.notes
        });

        await booking.save();

        // Initialize Paystack Payment
        const populatedBooking = await booking.populate('clientId');
        const clientEmail = (populatedBooking.clientId as any).email;

        const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://lolaapril.com';
        const callback_url = `${frontendUrl}/consultation-success`;

        const payment = await this.gatewayManager.processPayment('paystack', pkg.price, {
            email: clientEmail,
            reference: paymentReference,
            callback_url,
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

    async verifyBookingPayment(reference: string) {
        const booking = await this.bookingModel.findOne({ paymentReference: reference });
        if (!booking) throw new NotFoundException('Booking not found');

        if (booking.status === 'confirmed') return booking;

        const verification = await this.gatewayManager.verifyPayment('paystack', reference);

        if (verification.status === 'success') {
            return this.confirmBooking(booking._id.toString());
        } else {
            throw new BadRequestException(`Payment ${verification.status}`);
        }
    }

    async completeBooking(businessId: string, bookingId: string) {
        const booking = await this.bookingModel.findOne({
            _id: new Types.ObjectId(bookingId),
            businessId: new Types.ObjectId(businessId)
        });

        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.status !== 'confirmed') {
            throw new BadRequestException(`Cannot complete booking with status: ${booking.status}`);
        }

        booking.status = 'completed';
        await booking.save();
        return booking;
    }

    async cleanupExpiredBookings() {
        const thirtyMinsAgo = moment().subtract(30, 'minutes').toDate();

        const result = await this.bookingModel.updateMany(
            {
                status: 'pending',
                createdAt: { $lt: thirtyMinsAgo }
            },
            {
                $set: { status: 'cancelled' }
            }
        );

        if (result.modifiedCount > 0) {
            this.logger.log(`Released ${result.modifiedCount} expired pending consultation slots`);
        }
    }

    async confirmBooking(bookingId: string) {
        const booking = await this.bookingModel.findById(bookingId).populate('packageId clientId');
        if (!booking) throw new NotFoundException('Booking not found');

        if (booking.status === 'confirmed') return booking;

        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';

        // Generate Google Meet Link
        // We need the business's refresh token. 
        // Assuming we have a way to get it from settings/business integration.
        // For now, let's look for it in the integration or business model.
        const businessId = booking.businessId.toString();
        const refreshToken = await this.getBusinessCalendarRefreshToken(businessId);

        if (refreshToken) {
            const { eventId, htmlLink, meetLink } = await this.googleCalendarService.createCalendarEvent({
                summary: `Consultation: ${(booking.packageId as any).name}`,
                description: `Virtual consultation with client. Notes: ${booking.notes || 'None'}`,
                startDateTime: booking.startTime,
                endDateTime: booking.endTime,
                attendeeEmail: (booking.clientId as any).email,
                refreshToken,
                createMeetLink: true
            });

            if (meetLink) {
                booking.meetingLink = meetLink;
                booking.calendarEventId = eventId;
            }
        }

        await booking.save();

        // Send Notification
        await this.sendConfirmationEmail(booking);

        return booking;
    }

    private async getBusinessCalendarRefreshToken(businessId: string): Promise<string | null> {
        const integration = await this.integrationModel.findOne({
            businessId: new Types.ObjectId(businessId),
            provider: 'google'
        }).exec();

        return integration?.refreshToken || this.configService.get('DEBUG_GOOGLE_REFRESH_TOKEN') || null;
    }

    private async sendConfirmationEmail(booking: any) {
        try {
            const client = booking.clientId as any;
            const pkg = booking.packageId as any;

            const advice = this.getRandomSpaAdvice();

            await this.notificationService.sendConsultationConfirmation(
                client._id.toString(),
                booking.businessId.toString(),
                {
                    clientName: client.firstName || 'Client',
                    clientEmail: client.email,
                    packageName: pkg.name,
                    date: moment(booking.startTime).format('LL'),
                    time: moment(booking.startTime).format('LT'),
                    meetLink: booking.meetingLink || 'To be provided shortly via email',
                    businessName: 'Lola April Beauty',
                    advice,
                }
            );

            this.logger.log(`✅ Confirmation email sent to ${client.email}`);
        } catch (error) {
            this.logger.error(`Failed to send confirmation email: ${error.message}`);
        }
    }

    private getRandomSpaAdvice(): string {
        const advices = [
            "Hydration is key! Drink plenty of water to maintain that post-spa glow.",
            "Take time for a 5-minute deep breathing exercise daily to reduce stress.",
            "Protect your skin with SPF even on cloudy days to maintain its health.",
            "A warm bath with Epsom salts can help relax your muscles after a long week.",
            "Consistency in your skincare routine is better than a one-time miracle product.",
            "Prioritize 7-8 hours of sleep for natural cellular repair and revitalization.",
            "Gently exfoliate your skin twice a week to remove dead cells and improve texture.",
            "Healthy eating reflects on your skin—incorporate more greens into your diet."
        ];
        return advices[Math.floor(Math.random() * advices.length)];
    }

    // ================== CRON METHODS ==================

    async sendReminders() {
        const now = new Date();
        const reminder24h = moment(now).add(24, 'hours').toDate();
        const reminder1h = moment(now).add(1, 'hour').toDate();

        // 1. Send 24h reminders (reminderSentCount = 0)
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

        // 2. Send 1h reminders (reminderSentCount = 1)
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

    private async sendReminderEmail(booking: any, timeLabel: string) {
        const client = booking.clientId as any;
        const pkg = booking.packageId as any;

        this.logger.log(`Sending ${timeLabel} reminder for booking ${booking._id}`);

        await this.notificationService.sendConsultationReminder(
            client._id.toString(),
            booking.businessId.toString(),
            {
                clientName: client.firstName || 'Client',
                clientEmail: client.email,
                packageName: pkg.name,
                date: moment(booking.startTime).format('LL'),
                time: moment(booking.startTime).format('LT'),
                meetLink: booking.meetingLink,
                businessName: 'Lola April Beauty',
            }
        );
    }

    async sendThankYouEmails() {
        const now = new Date();
        const bookings = await this.bookingModel.find({
            status: 'confirmed',
            endTime: { $lt: now },
            thankYouSent: false
        }).populate('clientId packageId');

        for (const booking of bookings) {
            const client = booking.clientId as any;
            const pkg = booking.packageId as any;

            this.logger.log(`Sending thank you for booking ${booking._id}`);

            await this.notificationService.sendConsultationThankYou(
                client._id.toString(),
                booking.businessId.toString(),
                {
                    clientName: client.firstName || 'Client',
                    clientEmail: client.email,
                    packageName: pkg.name,
                    businessName: 'Lola April Beauty',
                    advice: this.getRandomSpaAdvice(),
                }
            );

            booking.status = 'completed';
            booking.thankYouSent = true;
            await booking.save();
        }
    }

    async sendMarketingFollowUps() {
        const oneWeekAgo = moment().subtract(7, 'days').toDate();
        const eightDaysAgo = moment().subtract(8, 'days').toDate();

        // Find bookings that were completed exactly a week ago and haven't had a marketing follow-up
        const bookings = await this.bookingModel.find({
            status: 'completed',
            updatedAt: { $gte: eightDaysAgo, $lte: oneWeekAgo },
            marketingFollowUpSent: { $ne: true }
        }).populate('clientId packageId');

        for (const booking of bookings) {
            const client = booking.clientId as any;
            const pkg = booking.packageId as any;

            this.logger.log(`Sending marketing follow-up to ${client.email}`);

            await this.notificationService.sendMarketingFollowUp(
                client._id.toString(),
                booking.businessId.toString(),
                {
                    clientName: client.firstName || 'Client',
                    clientEmail: client.email,
                    packageName: pkg.name,
                    businessName: 'Lola April Beauty',
                }
            );

            booking.marketingFollowUpSent = true;
            await (booking as any).save();
        }
    }
}
