import { Model } from 'mongoose';
import { FAQDocument, AutoResponseDocument } from '../schemas/chat.schema';
export declare class ChatSeederService {
    private faqModel;
    private autoResponseModel;
    private readonly logger;
    constructor(faqModel: Model<FAQDocument>, autoResponseModel: Model<AutoResponseDocument>);
    seedDefaultFAQs(businessId: string): Promise<void>;
    seedDefaultAutoResponses(businessId: string): Promise<void>;
    seedAllForBusiness(businessId: string): Promise<void>;
}
