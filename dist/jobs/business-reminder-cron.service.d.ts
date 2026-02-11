import { Model } from 'mongoose';
import { AppointmentDocument } from '../appointment/schemas/appointment.schema';
import { EmailService } from '../notification/email.service';
import { EmailTemplatesService } from '../notification/templates/email-templates.service';
export declare class BusinessReminderCronService {
    private appointmentModel;
    private readonly emailService;
    private readonly emailTemplatesService;
    private readonly logger;
    constructor(appointmentModel: Model<AppointmentDocument>, emailService: EmailService, emailTemplatesService: EmailTemplatesService);
    remindBusinessesToCompleteAppointments(): Promise<void>;
}
