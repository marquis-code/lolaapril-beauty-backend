import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../booking/schemas/booking.schema';
import { EmailService } from '../notification/email.service';
import { EmailTemplatesService } from '../notification/templates/email-templates.service';

@Injectable()
export class BookingCronService {
    private readonly logger = new Logger(BookingCronService.name);

    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        private readonly emailService: EmailService,
        private readonly emailTemplatesService: EmailTemplatesService,
    ) { }

    /**
     * Runs every 30 minutes to check for bookings that need reminders.
     * Handles all tiers: 7d, 4d, 2d, 1d, morning, 2h
     */
    @Cron('0 */30 * * * *') // Every 30 minutes
    async processBookingReminders(): Promise<void> {
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

                // Parse start time and set it on the booking date
                if (booking.preferredStartTime) {
                    const [hours, minutes] = booking.preferredStartTime.split(':').map(Number);
                    bookingDate.setHours(hours || 0, minutes || 0, 0, 0);
                }

                const hoursUntil = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
                const tiersSent = booking.reminderTiersSent || [];

                // Determine which tier to send based on hours remaining
                let tierToSend: string | null = null;

                if (hoursUntil <= 2.5 && hoursUntil > 1 && !tiersSent.includes('2h')) {
                    tierToSend = '2h';
                } else if (hoursUntil <= 12 && hoursUntil > 2.5 && !tiersSent.includes('morning')) {
                    // Morning of — send between 6AM–12PM on the day of
                    const isToday = bookingDate.toDateString() === now.toDateString();
                    if (isToday && now.getHours() >= 6) {
                        tierToSend = 'morning';
                    }
                } else if (hoursUntil <= 30 && hoursUntil > 12 && !tiersSent.includes('1d')) {
                    tierToSend = '1d';
                } else if (hoursUntil <= 54 && hoursUntil > 30 && !tiersSent.includes('2d')) {
                    tierToSend = '2d';
                } else if (hoursUntil <= 102 && hoursUntil > 54 && !tiersSent.includes('4d')) {
                    tierToSend = '4d';
                } else if (hoursUntil <= 174 && hoursUntil > 102 && !tiersSent.includes('7d')) {
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

                        await this.emailService.sendEmail(
                            booking.clientEmail,
                            emailData.subject,
                            emailData.html,
                        );

                        // Update the booking with the sent tier
                        await this.bookingModel.findByIdAndUpdate(booking._id, {
                            $push: { reminderTiersSent: tierToSend },
                            $inc: { remindersSent: 1 },
                            $set: { lastReminderAt: new Date() },
                        });

                        sentCount++;
                        this.logger.log(`✅ Sent ${tierToSend} reminder for booking ${booking.bookingNumber}`);
                    } catch (err) {
                        this.logger.error(`❌ Failed to send reminder for booking ${booking.bookingNumber}: ${err.message}`);
                    }
                }
            }

            this.logger.log(`🔔 Booking reminder cron complete. Sent ${sentCount} reminders.`);
        } catch (error) {
            this.logger.error(`❌ Booking reminder cron failed: ${error.message}`);
        }
    }
}
