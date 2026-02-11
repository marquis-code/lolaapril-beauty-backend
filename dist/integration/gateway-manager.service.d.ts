import { PaystackService } from './payment-gateways/paystack/paystack.service';
import { StripeService } from './payment-gateways/stripe/stripe.service';
import { SquareService } from './payment-gateways/square/square.service';
export declare class GatewayManagerService {
    private paystackService;
    private stripeService;
    private squareService;
    private readonly logger;
    private gateways;
    constructor(paystackService: PaystackService, stripeService: StripeService, squareService: SquareService);
    processPayment(gateway: string, amount: number, metadata: any): Promise<any>;
    verifyPayment(gateway: string, reference: string): Promise<any>;
    processRefund(gateway: string, transactionId: string, amount: number): Promise<any>;
    processTransfer(gateway: string, amount: number, transferData: any): Promise<any>;
    getBalance(gateway: string): Promise<number>;
    initializeGateway(gateway: string, config: any): Promise<void>;
    getAvailableGateways(): string[];
    isGatewayAvailable(gateway: string): boolean;
    private getGateway;
    private processPaystackTransfer;
    private processStripeTransfer;
    refundPayment(gatewayName: string, transactionId: string, amount: number): Promise<any>;
}
