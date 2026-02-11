export interface IPaymentGateway {
    initialize(config: any): Promise<void>;
    createPayment(amount: number, metadata: any): Promise<any>;
    verifyPayment(reference: string): Promise<any>;
    refund(transactionId: string, amount: number): Promise<any>;
    getBalance(): Promise<number>;
}
export interface PaymentResponse {
    success: boolean;
    transactionId?: string;
    reference?: string;
    authorizationUrl?: string;
    accessCode?: string;
    status?: 'pending' | 'processing' | 'success' | 'failed';
    amount?: number;
    currency?: string;
    customer?: {
        email: string;
        name?: string;
    };
    metadata?: Record<string, any>;
    error?: string;
}
export interface VerificationResponse {
    success: boolean;
    status: 'success' | 'failed' | 'pending' | 'abandoned';
    transactionId: string;
    reference: string;
    amount: number;
    currency: string;
    paidAt?: Date;
    channel?: string;
    customer?: {
        email: string;
        name?: string;
    };
    metadata?: Record<string, any>;
    error?: string;
}
export interface RefundResponse {
    success: boolean;
    refundId: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'success' | 'failed';
    refundedAt?: Date;
    reason?: string;
    error?: string;
}
export interface GatewayConfig {
    name: string;
    apiKey?: string;
    secretKey?: string;
    publicKey?: string;
    environment?: 'production' | 'sandbox' | 'test';
    webhookSecret?: string;
    callbackUrl?: string;
    metadata?: Record<string, any>;
}
export interface TransferRequest {
    recipient: string;
    amount: number;
    currency?: string;
    reason?: string;
    reference?: string;
    bankCode?: string;
    accountName?: string;
    metadata?: Record<string, any>;
}
export interface TransferResponse {
    success: boolean;
    transferId: string;
    reference: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'success' | 'failed' | 'reversed';
    recipient: string;
    transferredAt?: Date;
    error?: string;
}
export interface WebhookEvent {
    event: string;
    data: any;
    signature?: string;
    timestamp?: Date;
}
export interface BalanceResponse {
    available: number;
    pending: number;
    currency: string;
    ledgerBalance?: number;
}
