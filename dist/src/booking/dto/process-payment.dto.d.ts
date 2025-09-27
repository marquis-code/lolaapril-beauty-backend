export declare class ProcessPaymentDto {
    bookingId: string;
    transactionReference: string;
    amount: number;
    paymentMethod: string;
    gateway: string;
    clientId: string;
    businessId: string;
    status: 'successful' | 'failed';
}
