import { ConfigService } from '@nestjs/config';
import { IPaymentGateway } from '../base-gateway.interface';
export declare class SquareService implements IPaymentGateway {
    private configService;
    private client;
    constructor(configService: ConfigService);
    initialize(config: any): Promise<void>;
    createPayment(amount: number, metadata: any): Promise<any>;
    verifyPayment(reference: string): Promise<any>;
    refund(transactionId: string, amount: number): Promise<any>;
    getBalance(): Promise<number>;
}
