// // integration/payment-gateways/base-gateway.interface.ts
// export interface IPaymentGateway {
//   initialize(config: any): Promise<void>;
//   createPayment(amount: number, metadata: any): Promise<any>;
//   verifyPayment(reference: string): Promise<any>;
//   refund(transactionId: string, amount: number): Promise<any>;
//   getBalance(): Promise<number>;
// }

// integration/payment-gateways/base-gateway.interface.ts

/**
 * Base interface that all payment gateways must implement
 * This ensures consistent API across different payment providers
 */
export interface IPaymentGateway {
  /**
   * Initialize the gateway with custom configuration
   * @param config - Gateway-specific configuration object
   */
  initialize(config: any): Promise<void>;

  /**
   * Create a new payment transaction
   * @param amount - Payment amount in the smallest currency unit (e.g., cents, kobo)
   * @param metadata - Additional payment metadata (customer info, references, etc.)
   * @returns Payment creation response with authorization URL, reference, etc.
   */
  createPayment(amount: number, metadata: any): Promise<any>;

  /**
   * Verify a payment transaction
   * @param reference - Unique payment reference or transaction ID
   * @returns Payment verification result with status and details
   */
  verifyPayment(reference: string): Promise<any>;

  /**
   * Process a refund for a completed transaction
   * @param transactionId - Original transaction identifier
   * @param amount - Amount to refund (partial refunds supported)
   * @returns Refund processing result
   */
  refund(transactionId: string, amount: number): Promise<any>;

  /**
   * Get current account balance
   * @returns Account balance in the base currency
   */
  getBalance(): Promise<number>;
}

/**
 * Standard payment response interface
 */
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

/**
 * Standard verification response interface
 */
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

/**
 * Standard refund response interface
 */
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

/**
 * Gateway configuration interface
 */
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

/**
 * Transfer/Payout interface for business payouts
 */
export interface TransferRequest {
  recipient: string; // Account number or recipient code
  amount: number;
  currency?: string;
  reason?: string;
  reference?: string;
  bankCode?: string;
  accountName?: string;
  metadata?: Record<string, any>;
}

/**
 * Transfer response interface
 */
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

/**
 * Webhook event interface
 */
export interface WebhookEvent {
  event: string;
  data: any;
  signature?: string;
  timestamp?: Date;
}

/**
 * Balance response interface
 */
export interface BalanceResponse {
  available: number;
  pending: number;
  currency: string;
  ledgerBalance?: number;
}