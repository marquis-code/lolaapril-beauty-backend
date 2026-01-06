import { Model } from 'mongoose';
import { BookingDocument } from '../../booking/schemas/booking.schema';
import { PaymentDocument } from '../../payment/schemas/payment.schema';
interface CommissionCalculation {
    baseAmount: number;
    commissionRate: number;
    commissionAmount: number;
    platformFee: number;
    processingFee: number;
    totalPlatformFee: number;
    netAmount: number;
    breakdown: {
        commission: number;
        processing: number;
        platform: number;
    };
}
export declare class CommissionService {
    private bookingModel;
    private paymentModel;
    private readonly logger;
    private readonly DEFAULT_COMMISSION_RATE;
    private readonly PROCESSING_FEE_RATE;
    private readonly PROCESSING_FEE_FIXED;
    private readonly MARKETPLACE_COMMISSION_RATE;
    constructor(bookingModel: Model<BookingDocument>, paymentModel: Model<PaymentDocument>);
    calculateBookingCommission(booking: any): Promise<CommissionCalculation>;
    calculateFees(tenantId: string, amount: number, options?: {
        bookingSource?: string;
        customRate?: number;
    }): Promise<CommissionCalculation>;
    updateBookingCommission(bookingId: string, commissionData: Partial<CommissionCalculation>): Promise<void>;
    calculateTenantCommission(tenantId: string, startDate: Date, endDate: Date): Promise<{
        totalRevenue: number;
        totalCommission: number;
        totalProcessingFees: number;
        netRevenue: number;
        bookingCount: number;
    }>;
    getCommissionBreakdownBySource(tenantId: string, startDate: Date, endDate: Date): Promise<any[]>;
    calculateCommissionPreview(amount: number, sourceType: string): {
        rate: number;
        amount: number;
        reason: string;
    };
    getTenantCommissionStats(tenantId: string): Promise<any>;
    validateCommission(amount: number, commissionRate: number, calculatedCommission: number): boolean;
    private getCommissionReason;
    getCommissionRateForSource(sourceType: string): number;
}
export {};
