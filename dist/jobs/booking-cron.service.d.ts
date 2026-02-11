import { Model } from 'mongoose';
import { BookingDocument } from '../booking/schemas/booking.schema';
import { EmailService } from '../notification/email.service';
import { EmailTemplatesService } from '../notification/templates/email-templates.service';
export declare class BookingCronService {
    private bookingModel;
    private readonly emailService;
    private readonly emailTemplatesService;
    private readonly logger;
    constructor(bookingModel: Model<BookingDocument>, emailService: EmailService, emailTemplatesService: EmailTemplatesService);
    processBookingReminders(): Promise<void>;
}
