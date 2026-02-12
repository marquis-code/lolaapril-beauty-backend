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
    const payload: any = {
      email: metadata.email,
      amount: Math.round(amount * 100), // Convert to kobo
      metadata,
      bearer: 'account', // ✅ Customer bears Paystack transaction fees
    };

    // ✅ CRITICAL: Pass the reference to Paystack to maintain consistency
    if (metadata.reference) {
      payload.reference = metadata.reference;
      console.log('✅ Paystack: Using backend-generated reference:', metadata.reference);
    }

    // ✅ REDIRECT URL: If explicitly provided, use it for this transaction
    if (metadata.callback_url) {
      payload.callback_url = metadata.callback_url;
      console.log('✅ Paystack: Using custom callback URL:', metadata.callback_url);
    }

    // ✅ SUBACCOUNT SPLIT: If business has a subaccount, use it for automatic splitting
    if (metadata.subaccount) {
      payload.subaccount = metadata.subaccount;
      payload.transaction_charge = Math.round((metadata.platformFee || 0) * 100); // Lola April's platform fee in kobo
      console.log('✅ Paystack: Using subaccount split:', {
        subaccount: metadata.subaccount,
        platformFee: metadata.platformFee,
        businessReceives: amount - (metadata.platformFee || 0)
      });
    }

    const response = await axios.post(
      `${this.baseUrl}/transaction/initialize`,
      payload,
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

  /**
   * Create a subaccount for a business under Lola April's main account
   * This enables automatic payment splitting
   */
  async createSubaccount(data: {
    businessName: string;
    settlementBank: string;
    accountNumber: string;
    percentageCharge: number;
    description?: string;
    primaryContactEmail?: string;
    primaryContactName?: string;
    primaryContactPhone?: string;
    metadata?: any;
  }): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/subaccount`,
      {
        business_name: data.businessName,
        settlement_bank: data.settlementBank,
        account_number: data.accountNumber,
        percentage_charge: data.percentageCharge, // Business keeps this percentage
        description: data.description || `Subaccount for ${data.businessName}`,
        primary_contact_email: data.primaryContactEmail,
        primary_contact_name: data.primaryContactName,
        primary_contact_phone: data.primaryContactPhone,
        metadata: data.metadata,
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

  /**
   * Update a subaccount's details
   */
  async updateSubaccount(subaccountCode: string, data: any): Promise<any> {
    const response = await axios.put(
      `${this.baseUrl}/subaccount/${subaccountCode}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.data;
  }

  /**
   * Fetch subaccount details
   */
  async getSubaccount(subaccountCode: string): Promise<any> {
    const response = await axios.get(
      `${this.baseUrl}/subaccount/${subaccountCode}`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    return response.data.data;
  }

  /**
   * List all subaccounts
   */
  async listSubaccounts(page = 1, perPage = 50): Promise<any> {
    const response = await axios.get(
      `${this.baseUrl}/subaccount?perPage=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    return response.data.data;
  }
}
