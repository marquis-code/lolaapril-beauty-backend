
// integration/integration.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayManagerService } from './gateway-manager.service';
import { PaystackService } from './payment-gateways/paystack/paystack.service';
import { StripeService } from './payment-gateways/stripe/stripe.service';
import { SquareService } from './payment-gateways/square/square.service';

@Module({
  imports: [ConfigModule],
  providers: [
    GatewayManagerService,
    PaystackService,
    StripeService,
    SquareService,
  ],
  exports: [GatewayManagerService],
})
export class IntegrationModule {}