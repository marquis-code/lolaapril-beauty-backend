import { Model } from 'mongoose';
import { WebhookDocument } from './schemas/webhook.schema';
import { ConfigService } from '@nestjs/config';
export declare class WebhookProcessorService {
    private webhookModel;
    private configService;
    constructor(webhookModel: Model<WebhookDocument>, configService: ConfigService);
    processWebhook(source: string, businessId: string, payload: any, signature: string): Promise<{
        success: boolean;
    }>;
    private verifySignature;
    private processPaystackWebhook;
    private processStripeWebhook;
    private processSquareWebhook;
}
