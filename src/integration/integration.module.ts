
// integration/integration.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayManagerService } from './gateway-manager.service';
import { PaystackService } from './payment-gateways/paystack/paystack.service';
import { StripeService } from './payment-gateways/stripe/stripe.service';
import { SquareService } from './payment-gateways/square/square.service';
import { GoogleCalendarService } from './google-calendar.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Integration, IntegrationSchema } from './schemas/integration.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Integration.name, schema: IntegrationSchema }])
  ],
  providers: [
    GatewayManagerService,
    PaystackService,
    StripeService,
    SquareService,
    GoogleCalendarService,
  ],
  exports: [
    GatewayManagerService,
    PaystackService,
    GoogleCalendarService,
    MongooseModule
  ],
})
export class IntegrationModule { }