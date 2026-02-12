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

    @Cron(CronExpression.EVERY_HOUR)
    async handleThankYouEmails() {
        this.logger.log('Running consultation thank-you emails cron...');
        await this.consultationService.sendThankYouEmails();
    }

    @Cron('*/15 * * * *')
    async handleExpiredBookings() {
        this.logger.log('Running expired consultation bookings cleanup...');
        await this.consultationService.cleanupExpiredBookings();
    }
}
