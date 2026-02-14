// webhook/webhook-processor.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Webhook, WebhookDocument } from './schemas/webhook.schema';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class WebhookProcessorService {
  constructor(
    @InjectModel(Webhook.name) private webhookModel: Model<WebhookDocument>,
    private configService: ConfigService,
  ) { }

  async processWebhook(source: string, businessId: string, payload: any, signature: string) {
    // Verify signature
    const isValid = this.verifySignature(source, payload, signature);

    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    // Store webhook
    const webhook = new this.webhookModel({
      businessId,
      event: payload.event || payload.type,
      source,
      payload,
      signature,
      status: 'pending',
    });

    await webhook.save();

    // Process based on source
    try {
      switch (source.toLowerCase()) {
        case 'paystack':
          await this.processPaystackWebhook(webhook);
          break;
        case 'stripe':
          await this.processStripeWebhook(webhook);
          break;
        case 'square':
          await this.processSquareWebhook(webhook);
          break;
        default:
          throw new Error(`Unknown webhook source: ${source}`);
      }

      webhook.status = 'processed';
      webhook.processedAt = new Date();
      await webhook.save();

      return { success: true };
    } catch (error) {
      webhook.status = 'failed';
      webhook.errorMessage = error.message;
      webhook.retryCount += 1;
      await webhook.save();

      // Retry logic
      if (webhook.retryCount < 3) {
        // Schedule retry
        console.log(`Scheduling retry for webhook ${webhook._id}`);
      }

      throw error;
    }
  }

  private verifySignature(source: string, payload: any, signature: string): boolean {
    let secret: string;

    switch (source.toLowerCase()) {
      case 'paystack':
        secret = this.configService.get('PAYSTACK_WEBHOOK_SECRET') || this.configService.get('PAYSTACK_SECRET_KEY');
        break;

      case 'stripe':
        secret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        break;
      default:
        return false;
    }

    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return hash === signature;
  }

  private async processPaystackWebhook(webhook: WebhookDocument) {
    const { event, data } = webhook.payload;

    webhook.processingLog.push(`Processing Paystack event: ${event}`);

    switch (event) {
      case 'charge.success':
        // Update payment status
        console.log('Processing successful charge');
        break;
      case 'transfer.success':
        console.log('Processing successful transfer');
        break;
      default:
        console.log(`Unhandled Paystack event: ${event}`);
    }

    await webhook.save();
  }

  private async processStripeWebhook(webhook: WebhookDocument) {
    const { type, data } = webhook.payload;

    webhook.processingLog.push(`Processing Stripe event: ${type}`);

    switch (type) {
      case 'payment_intent.succeeded':
        console.log('Processing payment intent succeeded');
        break;
      case 'payment_intent.failed':
        console.log('Processing payment intent failed');
        break;
      default:
        console.log(`Unhandled Stripe event: ${type}`);
    }

    await webhook.save();
  }

  private async processSquareWebhook(webhook: WebhookDocument) {
    const { type, data } = webhook.payload;

    webhook.processingLog.push(`Processing Square event: ${type}`);
    await webhook.save();
  }
}
