import { Job } from 'bull';
import { Model } from 'mongoose';
import { PaymentDocument } from '../../payment/schemas/payment.schema';
import { BookingDocument } from '../../booking/schemas/booking.schema';
import { GatewayManagerService } from '../../integration/gateway-manager.service';
import { NotificationService } from '../../notification/notification.service';
import { CommissionCalculatorService } from '../../commission/services/commission-calculator.service';
interface PayoutJobData {
    tenantId: string;
    amount: number;
    period: 'daily' | 'weekly' | 'monthly';
    startDate?: Date;
    endDate?: Date;
}
interface PayoutResult {
    success: boolean;
    payoutId: string;
    amount: number;
    fees: number;
    netAmount: number;
    transactionId?: string;
    error?: string;
}
export declare class PayoutProcessor {
    private paymentModel;
    private bookingModel;
    private gatewayManager;
    private notificationService;
    private commissionCalculatorService;
    private readonly logger;
    constructor(paymentModel: Model<PaymentDocument>, bookingModel: Model<BookingDocument>, gatewayManager: GatewayManagerService, notificationService: NotificationService, commissionCalculatorService: CommissionCalculatorService);
    handlePayout(job: Job<PayoutJobData>): Promise<PayoutResult>;
    schedulePayouts(job: Job): Promise<void>;
    private verifyPayoutEligibility;
    private calculatePayoutFees;
    private getTenantBankDetails;
    private initiateTransfer;
    private recordPayoutTransaction;
    private updatePaymentRecords;
    private sendPayoutConfirmation;
    private recordFailedPayout;
    private sendPayoutFailureNotification;
    private findEligibleTenants;
    private calculateTenantPayout;
}
export {};
