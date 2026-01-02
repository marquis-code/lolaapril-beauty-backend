// integration/payment-gateways/square/square.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPaymentGateway } from '../base-gateway.interface';

const { SquareClient, SquareEnvironment } = require('square');

@Injectable()
export class SquareService implements IPaymentGateway {
  private client: any;

  constructor(private configService: ConfigService) {
    this.client = new SquareClient({
      accessToken: this.configService.get<string>('SQUARE_ACCESS_TOKEN'),
      environment: SquareEnvironment.Production,
    });
  }

  async initialize(config: any): Promise<void> {
    this.client = new SquareClient({
      accessToken: config.accessToken,
      environment: config.environment || SquareEnvironment.Production,
    });
  }

  async createPayment(amount: number, metadata: any): Promise<any> {
    try {
      const response = await this.client.payments.create({
        sourceId: metadata.sourceId,
        idempotencyKey: metadata.idempotencyKey,
        amountMoney: {
          amount: BigInt(Math.round(amount * 100)),
          currency: metadata.currency || 'USD',
        },
        note: metadata.note,
      });

      return response.result?.payment || response;
    } catch (error) {
      console.error('Square payment creation error:', error);
      throw error;
    }
  }

  async verifyPayment(reference: string): Promise<any> {
    try {
      const response = await this.client.payments.get(reference);
      return response.result?.payment || response;
    } catch (error) {
      console.error('Square payment verification error:', error);
      throw error;
    }
  }

  async refund(transactionId: string, amount: number): Promise<any> {
    try {
      const response = await this.client.refunds.create({
        paymentId: transactionId,
        idempotencyKey: `refund-${Date.now()}`,
        amountMoney: {
          amount: BigInt(Math.round(amount * 100)),
          currency: 'USD',
        },
      });

      return response.result?.refund || response;
    } catch (error) {
      console.error('Square refund error:', error);
      throw error;
    }
  }

  async getBalance(): Promise<number> {
    // Square doesn't have a direct balance API
    // You'd need to calculate from transactions
    return 0;
  }
}