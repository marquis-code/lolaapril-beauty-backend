// webhook/webhook.controller.ts
import { Controller, Post, Body, Headers, Param } from '@nestjs/common';
import { WebhookProcessorService } from './webhook-processor.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookProcessor: WebhookProcessorService) {}

  @Post('paystack')
  async handlePaystackWebhook(
    @Body() payload: any,
    @Headers('x-paystack-signature') signature: string,
  ) {
    return this.webhookProcessor.processWebhook('paystack', payload, signature);
  }

  @Post('stripe')
  async handleStripeWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.webhookProcessor.processWebhook('stripe', payload, signature);
  }

  @Post('square')
  async handleSquareWebhook(
    @Body() payload: any,
    @Headers('square-signature') signature: string,
  ) {
    return this.webhookProcessor.processWebhook('square', payload, signature);
  }
}
