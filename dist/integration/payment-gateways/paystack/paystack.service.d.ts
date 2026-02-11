import { ConfigService } from '@nestjs/config';
import { IPaymentGateway } from '../base-gateway.interface';
export declare class PaystackService implements IPaymentGateway {
    private configService;
    private secretKey;
    private baseUrl;
    constructor(configService: ConfigService);
    initialize(config: any): Promise<void>;
    createPayment(amount: number, metadata: any): Promise<any>;
    verifyPayment(reference: string): Promise<any>;
    refund(transactionId: string, amount: number): Promise<any>;
    getBalance(): Promise<number>;
    createSubaccount(data: {
        businessName: string;
        settlementBank: string;
        accountNumber: string;
        percentageCharge: number;
        description?: string;
        primaryContactEmail?: string;
        primaryContactName?: string;
        primaryContactPhone?: string;
        metadata?: any;
    }): Promise<any>;
    updateSubaccount(subaccountCode: string, data: any): Promise<any>;
    getSubaccount(subaccountCode: string): Promise<any>;
    listSubaccounts(page?: number, perPage?: number): Promise<any>;
}
