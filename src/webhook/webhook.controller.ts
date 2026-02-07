// webhook/webhook.controller.ts
import { Controller, Post, Body, Headers, Param } from '@nestjs/common';
import { BusinessId } from '../auth/decorators/business-context.decorator';
import { WebhookProcessorService } from './webhook-processor.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookProcessor: WebhookProcessorService) {}

  @Post('paystack')
  async handlePaystackWebhook(
    @BusinessId() businessId: string,
    @Body() payload: any,
    @Headers('x-paystack-signature') signature: string,
  ) {
    return this.webhookProcessor.processWebhook('paystack', businessId, payload, signature);
  }

  @Post('stripe')
  async handleStripeWebhook(
    @BusinessId() businessId: string,
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.webhookProcessor.processWebhook('stripe', businessId, payload, signature);
  }

  @Post('square')
  async handleSquareWebhook(
    @BusinessId() businessId: string,
    @Body() payload: any,
    @Headers('square-signature') signature: string,
  ) {
    return this.webhookProcessor.processWebhook('square', businessId, payload, signature);
  }
}
