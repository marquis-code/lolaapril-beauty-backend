// // integration/gateway-manager.service.ts
// import { Injectable, BadRequestException } from '@nestjs/common';
// import { PaystackService } from './payment-gateways/paystack/paystack.service';
// import { StripeService } from './payment-gateways/stripe/stripe.service';
// import { SquareService } from './payment-gateways/square/square.service';
// import { IPaymentGateway } from './payment-gateways/base-gateway.interface';

// @Injectable()
// export class GatewayManagerService {
//   private gateways: Map<string, IPaymentGateway> = new Map();

//   constructor(
//     private paystackService: PaystackService,
//     private stripeService: StripeService,
//     private squareService: SquareService,
//   ) {
//     this.gateways.set('paystack', this.paystackService);
//     this.gateways.set('stripe', this.stripeService);
//     this.gateways.set('square', this.squareService);
//   }

//   getGateway(gatewayName: string): IPaymentGateway {
//     const gateway = this.gateways.get(gatewayName.toLowerCase());
    
//     if (!gateway) {
//       throw new BadRequestException(`Gateway ${gatewayName} not supported`);
//     }

//     return gateway;
//   }

//   async processPayment(gatewayName: string, amount: number, metadata: any) {
//     const gateway = this.getGateway(gatewayName);
//     return gateway.createPayment(amount, metadata);
//   }

//   async verifyPayment(gatewayName: string, reference: string) {
//     const gateway = this.getGateway(gatewayName);
//     return gateway.verifyPayment(reference);
//   }

//   async refundPayment(gatewayName: string, transactionId: string, amount: number) {
//     const gateway = this.getGateway(gatewayName);
//     return gateway.refund(transactionId, amount);
//   }
// }

// integration/gateway-manager.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PaystackService } from './payment-gateways/paystack/paystack.service';
import { StripeService } from './payment-gateways/stripe/stripe.service';
import { SquareService } from './payment-gateways/square/square.service';
import { IPaymentGateway } from './payment-gateways/base-gateway.interface';

@Injectable()
export class GatewayManagerService {
  private readonly logger = new Logger(GatewayManagerService.name);
  private gateways: Map<string, IPaymentGateway> = new Map();

  constructor(
    private paystackService: PaystackService,
    private stripeService: StripeService,
    private squareService: SquareService,
  ) {
    // Register available gateways
    this.gateways.set('paystack', this.paystackService);
    this.gateways.set('stripe', this.stripeService);
    this.gateways.set('square', this.squareService);
  }

  /**
   * Process a payment using the specified gateway
   */
  async processPayment(
    gateway: string,
    amount: number,
    metadata: any
  ): Promise<any> {
    try {
      const gatewayService = this.getGateway(gateway);
      
      this.logger.log(`Processing payment with ${gateway}: $${amount}`);
      
      const result = await gatewayService.createPayment(amount, metadata);
      
      this.logger.log(`Payment processed successfully with ${gateway}`);
      
      return {
        success: true,
        gateway,
        ...result
      };
    } catch (error) {
      this.logger.error(`Payment processing failed with ${gateway}: ${error.message}`, error.stack);
      throw new BadRequestException(`Payment processing failed: ${error.message}`);
    }
  }

  /**
   * Verify a payment using the specified gateway
   */
  async verifyPayment(gateway: string, reference: string): Promise<any> {
    try {
      const gatewayService = this.getGateway(gateway);
      
      this.logger.log(`Verifying payment with ${gateway}: ${reference}`);
      
      const result = await gatewayService.verifyPayment(reference);
      
      this.logger.log(`Payment verified successfully with ${gateway}`);
      
      return {
        success: true,
        gateway,
        ...result
      };
    } catch (error) {
      this.logger.error(`Payment verification failed with ${gateway}: ${error.message}`, error.stack);
      throw new BadRequestException(`Payment verification failed: ${error.message}`);
    }
  }

  /**
   * Process a refund using the specified gateway
   */
  async processRefund(
    gateway: string,
    transactionId: string,
    amount: number
  ): Promise<any> {
    try {
      const gatewayService = this.getGateway(gateway);
      
      this.logger.log(`Processing refund with ${gateway}: $${amount} for transaction ${transactionId}`);
      
      const result = await gatewayService.refund(transactionId, amount);
      
      this.logger.log(`Refund processed successfully with ${gateway}`);
      
      return {
        success: true,
        gateway,
        ...result
      };
    } catch (error) {
      this.logger.error(`Refund processing failed with ${gateway}: ${error.message}`, error.stack);
      throw new BadRequestException(`Refund processing failed: ${error.message}`);
    }
  }

  /**
   * Process a transfer/payout using the specified gateway
   */
  async processTransfer(
    gateway: string,
    amount: number,
    transferData: any
  ): Promise<any> {
    try {
      const gatewayService = this.getGateway(gateway);
      
      this.logger.log(`Processing transfer with ${gateway}: $${amount}`);
      
      // Different gateways handle transfers differently
      // For Paystack, we'd use their transfer API
      // For Stripe, we'd use their payout API
      // This is a simplified implementation
      
      if (gateway === 'paystack') {
        return await this.processPaystackTransfer(amount, transferData);
      } else if (gateway === 'stripe') {
        return await this.processStripeTransfer(amount, transferData);
      }
      
      throw new BadRequestException(`Transfer not supported for gateway: ${gateway}`);
    } catch (error) {
      this.logger.error(`Transfer processing failed with ${gateway}: ${error.message}`, error.stack);
      throw new BadRequestException(`Transfer processing failed: ${error.message}`);
    }
  }

  /**
   * Get gateway balance
   */
  async getBalance(gateway: string): Promise<number> {
    try {
      const gatewayService = this.getGateway(gateway);
      return await gatewayService.getBalance();
    } catch (error) {
      this.logger.error(`Failed to get balance for ${gateway}: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to get balance: ${error.message}`);
    }
  }

  /**
   * Initialize a gateway with custom configuration
   */
  async initializeGateway(gateway: string, config: any): Promise<void> {
    try {
      const gatewayService = this.getGateway(gateway);
      await gatewayService.initialize(config);
      this.logger.log(`Gateway ${gateway} initialized with custom config`);
    } catch (error) {
      this.logger.error(`Failed to initialize ${gateway}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get available gateways
   */
  getAvailableGateways(): string[] {
    return Array.from(this.gateways.keys());
  }

  /**
   * Check if a gateway is available
   */
  isGatewayAvailable(gateway: string): boolean {
    return this.gateways.has(gateway);
  }

  // Private helper methods
  private getGateway(gateway: string): IPaymentGateway {
    const gatewayService = this.gateways.get(gateway.toLowerCase());
    
    if (!gatewayService) {
      throw new BadRequestException(
        `Gateway '${gateway}' not supported. Available gateways: ${this.getAvailableGateways().join(', ')}`
      );
    }
    
    return gatewayService;
  }

  private async processPaystackTransfer(amount: number, transferData: any): Promise<any> {
    // Implement Paystack transfer logic
    // This would call Paystack's transfer API
    const axios = require('axios');
    const configService = require('@nestjs/config').ConfigService;
    
    try {
      const response = await axios.post(
        'https://api.paystack.co/transfer',
        {
          source: 'balance',
          amount: Math.round(amount * 100), // Convert to kobo
          recipient: transferData.recipient,
          reason: transferData.reason || 'Payout',
          reference: transferData.reference
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        transactionId: response.data.data.transfer_code,
        status: response.data.data.status,
        reference: response.data.data.reference
      };
    } catch (error) {
      this.logger.error('Paystack transfer failed', error);
      throw error;
    }
  }

  private async processStripeTransfer(amount: number, transferData: any): Promise<any> {
    // Implement Stripe payout logic
    try {
      const payout = await this.stripeService['stripe'].payouts.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: transferData.currency || 'usd',
        description: transferData.reason || 'Payout',
        metadata: {
          reference: transferData.reference
        }
      });

      return {
        transactionId: payout.id,
        status: payout.status,
        reference: transferData.reference
      };
    } catch (error) {
      this.logger.error('Stripe payout failed', error);
      throw error;
    }
  }

    async refundPayment(gatewayName: string, transactionId: string, amount: number) {
    const gateway = this.getGateway(gatewayName);
    return gateway.refund(transactionId, amount);
  }

}