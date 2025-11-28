import { Model } from 'mongoose';
import { NotificationTemplateDocument } from '../schemas/notification.schema';
export declare class NotificationTemplateSeeder {
    private notificationTemplateModel;
    constructor(notificationTemplateModel: Model<NotificationTemplateDocument>);
    seedDefaultTemplates(): Promise<void>;
}
