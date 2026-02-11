import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduledReminder, ScheduledReminderDocument } from './schemas/scheduled-reminder.schema';
import { EmailService } from '../notification/email.service';
import { EmailTemplatesService } from '../notification/templates/email-templates.service';

@Injectable()
export class PostCompletionCronService {
    private readonly logger = new Logger(PostCompletionCronService.name);

    constructor(
        @InjectModel(ScheduledReminder.name)
        private scheduledReminderModel: Model<ScheduledReminderDocument>,
        private readonly emailService: EmailService,
        private readonly emailTemplatesService: EmailTemplatesService,
    ) { }

    /**
     * Runs every hour to process scheduled reminders (re-book emails, etc.)
     */
    @Cron('0 0 * * * *') // Every hour at minute 0
    async processScheduledReminders(): Promise<void> {
        this.logger.log('📩 Processing scheduled reminders...');

        try {
            const now = new Date();
            const pendingReminders = await this.scheduledReminderModel.find({
                scheduledFor: { $lte: now },
                sent: false,
                retries: { $lt: 3 },
            }).limit(100).lean();

            let sentCount = 0;
            let failCount = 0;

            for (const reminder of pendingReminders) {
                try {
                    let emailData: { subject: string; html: string } | null = null;

                    switch (reminder.type) {
                        case 'rebook_2weeks':
                        case 'rebook_after_completion':
                            emailData = this.emailTemplatesService.rebookReminder({
                                clientName: reminder.userName,
                                serviceName: reminder.serviceName || 'your last service',
                                businessName: reminder.businessName || 'Lola April',
                                businessId: reminder.businessId.toString(),
                            });
                            break;
                        default:
                            this.logger.warn(`Unknown reminder type: ${reminder.type}`);
                            continue;
                    }

                    if (emailData) {
                        await this.emailService.sendEmail(
                            reminder.userEmail,
                            emailData.subject,
                            emailData.html,
                        );

                        await this.scheduledReminderModel.findByIdAndUpdate(reminder._id, {
                            sent: true,
                            sentAt: new Date(),
                        });

                        sentCount++;
                        this.logger.log(`✅ Sent ${reminder.type} reminder to ${reminder.userEmail}`);
                    }
                } catch (err) {
                    failCount++;
                    await this.scheduledReminderModel.findByIdAndUpdate(reminder._id, {
                        $inc: { retries: 1 },
                        $set: { error: err.message },
                    });
                    this.logger.error(`❌ Failed to send reminder ${reminder._id}: ${err.message}`);
                }
            }

            this.logger.log(`📩 Scheduled reminders: ${sentCount} sent, ${failCount} failed.`);
        } catch (error) {
            this.logger.error(`❌ Scheduled reminder cron failed: ${error.message}`);
        }
    }
}
