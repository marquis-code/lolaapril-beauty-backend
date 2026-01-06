import { Job } from 'bull';
import { Model } from 'mongoose';
export declare class ReminderProcessor {
    private bookingModel;
    private notificationModel;
    constructor(bookingModel: Model<any>, notificationModel: Model<any>);
    handleBookingReminder(job: Job): Promise<void>;
    scheduleReminders(job: Job): Promise<void>;
}
