// integration/payment-gateways/paystack/paystack.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IPaymentGateway } from '../base-gateway.interface';

@Injectable()
export class PaystackService implements IPaymentGateway {
  private secretKey: string;
  private baseUrl = 'https://api.paystack.co';

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
  }

  async initialize(config: any): Promise<void> {
    this.secretKey = config.secretKey || this.secretKey;
  }

  async createPayment(amount: number, metadata: any): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/transaction/initialize`,
      {
        email: metadata.email,
        amount: Math.round(amount * 100), // Convert to kobo
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.data;
  }


  async verifyPayment(reference: string): Promise<any> {
    const response = await axios.get(
      `${this.baseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    return response.data.data;
  }

  async refund(transactionId: string, amount: number): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/refund`,
      {
        transaction: transactionId,
        amount: Math.round(amount * 100),
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    return response.data.data;
  }

  async getBalance(): Promise<number> {
    const response = await axios.get(`${this.baseUrl}/balance`, {
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });

    return response.data.data[0].balance / 100;
  }
}
