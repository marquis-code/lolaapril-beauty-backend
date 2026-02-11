import { Model } from 'mongoose';
import { FinancialReportDocument } from './schemas/financial-report.schema';
import { BookingDocument } from '../booking/schemas/booking.schema';
import { PaymentDocument } from '../payment/schemas/payment.schema';
import { CommissionDocument } from '../commission/schemas/commission.schema';
export declare class AnalyticsService {
    private reportModel;
    private bookingModel;
    private paymentModel;
    private commissionModel;
    private readonly logger;
    constructor(reportModel: Model<FinancialReportDocument>, bookingModel: Model<BookingDocument>, paymentModel: Model<PaymentDocument>, commissionModel: Model<CommissionDocument>);
    generateFinancialReport(businessId: string, startDate: Date, endDate: Date, reportPeriod?: string): Promise<any>;
    getReport(reportId: string): Promise<FinancialReportDocument>;
    getCommissionBreakdown(businessId: string, startDate: Date, endDate: Date): Promise<any>;
    private calculateRevenueBreakdown;
    private calculateCommissionBreakdown;
    private calculateSourceBreakdown;
    private calculateBookingStats;
    getDashboardMetrics(businessId: string): Promise<any>;
    getFeeComparison(businessId: string): Promise<any>;
    exportReportToCSV(reportId: string): Promise<string>;
}
