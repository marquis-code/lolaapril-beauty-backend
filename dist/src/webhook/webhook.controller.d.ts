import { WebhookProcessorService } from './webhook-processor.service';
export declare class WebhookController {
    private readonly webhookProcessor;
    constructor(webhookProcessor: WebhookProcessorService);
    handlePaystackWebhook(payload: any, signature: string): Promise<{
        success: boolean;
    }>;
    handleStripeWebhook(payload: any, signature: string): Promise<{
        success: boolean;
    }>;
    handleSquareWebhook(payload: any, signature: string): Promise<{
        success: boolean;
    }>;
}
