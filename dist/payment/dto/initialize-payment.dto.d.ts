export declare class InitializePaymentDto {
    email: string;
    amount: number;
    clientId: string;
    tenantId: string;
    appointmentId?: string;
    bookingId?: string;
    gateway?: string;
    metadata?: any;
}
