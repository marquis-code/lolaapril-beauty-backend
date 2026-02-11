import { WebhookProcessorService } from './webhook-processor.service';
export declare class WebhookController {
    private readonly webhookProcessor;
    constructor(webhookProcessor: WebhookProcessorService);
    handlePaystackWebhook(businessId: string, payload: any, signature: string): Promise<{
        success: boolean;
    }>;
    handleStripeWebhook(businessId: string, payload: any, signature: string): Promise<{
        success: boolean;
    }>;
    handleSquareWebhook(businessId: string, payload: any, signature: string): Promise<{
        success: boolean;
    }>;
}
