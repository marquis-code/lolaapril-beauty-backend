import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { EmailTemplatesService } from '../../notification/templates/email-templates.service';
import { EmailService } from '../../notification/email.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BookingCronService {
    private readonly logger = new Logger(BookingCronService.name);

    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        private emailTemplatesService: EmailTemplatesService,
        private emailService: EmailService,
        private eventEmitter: EventEmitter2
    ) { }

    /**
     * 1. CLEANUP EXPIRED BOOKINGS
     * Runs every 10 minutes to mark pending bookings that have expired.
     */
    @Cron(CronExpression.EVERY_10_MINUTES)
    async cleanupExpiredBookings(): Promise<void> {
        try {
            const expiredBookings = await this.bookingModel
                .find({
                    status: 'pending',
                    expiresAt: { $lt: new Date() }
                })
                .exec();

            if (expiredBookings.length > 0) {
                await this.bookingModel.updateMany(
                    {
                        _id: { $in: expiredBookings.map(b => b._id) }
                    },
                    {
                        status: 'expired',
                        updatedAt: new Date()
                    }
                ).exec();

                for (const booking of expiredBookings) {
                    this.eventEmitter.emit('booking.expired', booking);
                }

                this.logger.log(`Marked ${expiredBookings.length} bookings as expired`);
            }
        } catch (error) {
            this.logger.error(`Failed to cleanup expired bookings: ${error.message}`);
        }
    }

    /**
     * 2. TIERED APPOINTMENT REMINDERS
     * Tiered: 7 days, 2 days, 1 day, 2 hours
     */
    @Cron(CronExpression.EVERY_30_MINUTES)
    async processBookingReminders(): Promise<void> {
        const now = new Date();

        // Find confirmed bookings in the next 8 days
        const next8Days = new Date();
        next8Days.setDate(next8Days.getDate() + 8);

        const confirmedBookings = await this.bookingModel.find({
            status: 'confirmed',
            preferredDate: { $gte: now, $lte: next8Days }
        }).exec();

        for (const booking of confirmedBookings) {
            // Create a date object combining preferredDate and preferredStartTime
            const dateStr = booking.preferredDate instanceof Date
                ? booking.preferredDate.toISOString().split('T')[0]
                : booking.preferredDate;

            const appointmentTime = new Date(`${dateStr}T${booking.preferredStartTime}`);
            const diffMs = appointmentTime.getTime() - now.getTime();
            const hoursUntil = diffMs / (1000 * 60 * 60);
            const daysUntil = hoursUntil / 24;

            const tiersSent = booking.reminderTiersSent || [];
            let tierToSend: string | null = null;

            // Tier logic (using tiers defined in EmailTemplatesService)
            if (hoursUntil <= 2.5 && hoursUntil > 1 && !tiersSent.includes('2h')) {
                tierToSend = '2h';
            } else if (daysUntil <= 1.2 && daysUntil > 0.5 && !tiersSent.includes('1d')) {
                tierToSend = '1d';
            } else if (daysUntil <= 2.2 && daysUntil > 1.5 && !tiersSent.includes('2d')) {
                tierToSend = '2d';
            } else if (daysUntil <= 7.2 && daysUntil > 6.5 && !tiersSent.includes('7d')) {
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

                    await this.emailService.sendEmail(
                        booking.clientEmail,
                        subject,
                        html
                    );

                    // Update booking using findByIdAndUpdate to avoid concurrent modification issues
                    await this.bookingModel.findByIdAndUpdate(
                        booking._id,
                        {
                            $push: { reminderTiersSent: tierToSend },
                            lastReminderAt: new Date()
                        }
                    ).exec();

                    this.logger.log(`Sent ${tierToSend} reminder to ${booking.clientEmail} for booking ${booking.bookingNumber}`);
                } catch (error) {
                    this.logger.error(`Failed to send ${tierToSend} reminder for booking ${booking.bookingNumber}: ${error.message}`);
                }
            }
        }
    }

    /**
     * 3. RE-BOOK REMINDERS (2 Weeks)
     * Runs daily to find completed bookings exactly 2 weeks ago
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async processRebookReminders(): Promise<void> {
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

                    await this.emailService.sendEmail(
                        booking.clientEmail,
                        subject,
                        html
                    );

                    await this.bookingModel.findByIdAndUpdate(
                        booking._id,
                        { rebookReminderSent: true }
                    ).exec();

                    this.logger.log(`Sent re-book reminder to ${booking.clientEmail} for completed booking ${booking.bookingNumber}`);
                } catch (error) {
                    this.logger.error(`Failed to send re-book reminder for booking ${booking.bookingNumber}: ${error.message}`);
                }
            }
        }
    }
}
