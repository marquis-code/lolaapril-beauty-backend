export declare class ProcessPaymentDto {
    paymentType?: 'full' | 'deposit' | 'remaining';
    depositAmount?: number;
    bookingId: string;
    transactionReference: string;
    amount: number;
    paymentMethod: string;
    gateway: string;
    clientId: string;
    businessId: string;
    status: 'successful' | 'failed';
    captureNow?: boolean;
}
