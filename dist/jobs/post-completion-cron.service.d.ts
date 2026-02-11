import { Model } from 'mongoose';
import { ScheduledReminderDocument } from './schemas/scheduled-reminder.schema';
import { EmailService } from '../notification/email.service';
import { EmailTemplatesService } from '../notification/templates/email-templates.service';
export declare class PostCompletionCronService {
    private scheduledReminderModel;
    private readonly emailService;
    private readonly emailTemplatesService;
    private readonly logger;
    constructor(scheduledReminderModel: Model<ScheduledReminderDocument>, emailService: EmailService, emailTemplatesService: EmailTemplatesService);
    processScheduledReminders(): Promise<void>;
}
