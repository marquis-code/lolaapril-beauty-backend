import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConsultationService } from './consultation.service';

@Injectable()
export class ConsultationCronService {
    private readonly logger = new Logger(ConsultationCronService.name);

    constructor(private readonly consultationService: ConsultationService) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleReminders() {
        this.logger.log('Running consultation reminders cron...');
        await this.consultationService.sendReminders();
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleThankYouEmails() {
        this.logger.log('Running daily task: Consultation Thank You Emails');
        await this.consultationService.sendThankYouEmails();
    }

    @Cron('0 10 * * 0') // Every Sunday at 10 AM
    async handleMarketingFollowUps() {
        this.logger.log('Running weekly task: Marketing Follow-up Emails');
        await this.consultationService.sendMarketingFollowUps();
    }

    @Cron(CronExpression.EVERY_HOUR)
    async handleExpiredBookings() {
        this.logger.log('Running expired consultation bookings cleanup...');
        await this.consultationService.cleanupExpiredBookings();
    }
}
