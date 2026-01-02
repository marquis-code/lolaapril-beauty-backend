// // integration/payment-gateways/stripe/stripe.service.ts
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import Stripe from 'stripe';
// import { IPaymentGateway } from '../base-gateway.interface';

// @Injectable()
// export class StripeService implements IPaymentGateway {
//   private stripe: Stripe;

//   constructor(private configService: ConfigService) {
//     const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
//     this.stripe = new Stripe(secretKey, {
//       apiVersion: '2023-10-16',
//     });
//   }

//   async initialize(config: any): Promise<void> {
//     this.stripe = new Stripe(config.secretKey, {
//       apiVersion: '2023-10-16',
//     });
//   }

//   async createPayment(amount: number, metadata: any): Promise<any> {
//     const paymentIntent = await this.stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Convert to cents
//       currency: metadata.currency || 'usd',
//       metadata,
//     });

//     return {
//       clientSecret: paymentIntent.client_secret,
//       paymentIntentId: paymentIntent.id,
//     };
//   }

//   async verifyPayment(reference: string): Promise<any> {
//     const paymentIntent = await this.stripe.paymentIntents.retrieve(reference);
    
//     return {
//       status: paymentIntent.status,
//       amount: paymentIntent.amount / 100,
//       currency: paymentIntent.currency,
//     };
//   }

//   async refund(transactionId: string, amount: number): Promise<any> {
//     const refund = await this.stripe.refunds.create({
//       payment_intent: transactionId,
//       amount: Math.round(amount * 100),
//     });

//     return refund;
//   }

//   async getBalance(): Promise<number> {
//     const balance = await this.stripe.balance.retrieve();
//     return balance.available[0].amount / 100;
//   }
// }


// integration/payment-gateways/stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { IPaymentGateway } from '../base-gateway.interface';

@Injectable()
export class StripeService implements IPaymentGateway {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  async initialize(config: any): Promise<void> {
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createPayment(amount: number, metadata: any): Promise<any> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: metadata.currency || 'usd',
      metadata,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async verifyPayment(reference: string): Promise<any> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(reference);
    
    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    };
  }

  async refund(transactionId: string, amount: number): Promise<any> {
    const refund = await this.stripe.refunds.create({
      payment_intent: transactionId,
      amount: Math.round(amount * 100),
    });

    return refund;
  }

  async getBalance(): Promise<number> {
    const balance = await this.stripe.balance.retrieve();
    return balance.available[0]?.amount ? balance.available[0].amount / 100 : 0;
  }
}