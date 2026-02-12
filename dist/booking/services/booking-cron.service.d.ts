import { Model } from 'mongoose';
import { BookingDocument } from '../schemas/booking.schema';
import { EmailTemplatesService } from '../../notification/templates/email-templates.service';
import { EmailService } from '../../notification/email.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class BookingCronService {
    private bookingModel;
    private emailTemplatesService;
    private emailService;
    private eventEmitter;
    private readonly logger;
    constructor(bookingModel: Model<BookingDocument>, emailTemplatesService: EmailTemplatesService, emailService: EmailService, eventEmitter: EventEmitter2);
    cleanupExpiredBookings(): Promise<void>;
    processBookingReminders(): Promise<void>;
    processRebookReminders(): Promise<void>;
}
