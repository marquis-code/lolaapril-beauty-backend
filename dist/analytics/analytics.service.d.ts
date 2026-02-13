import { Model } from 'mongoose';
import { FinancialReportDocument } from './schemas/financial-report.schema';
import { BookingDocument } from '../booking/schemas/booking.schema';
import { PaymentDocument } from '../payment/schemas/payment.schema';
import { CommissionDocument } from '../commission/schemas/commission.schema';
import { TrafficAnalyticsDocument } from './schemas/traffic-analytics.schema';
export declare class AnalyticsService {
    private reportModel;
    private bookingModel;
    private paymentModel;
    private commissionModel;
    private trafficModel;
    private readonly logger;
    constructor(reportModel: Model<FinancialReportDocument>, bookingModel: Model<BookingDocument>, paymentModel: Model<PaymentDocument>, commissionModel: Model<CommissionDocument>, trafficModel: Model<TrafficAnalyticsDocument>);
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
    trackTraffic(data: {
        businessId: string;
        visitorId: string;
        sessionId: string;
        pagePath: string;
        pageTitle?: string;
        referrer?: string;
        eventType?: string;
        userAgent: {
            browser: string;
            os: string;
            device: string;
            source: string;
        };
        ip?: string;
        location?: {
            country: string;
            region: string;
            city: string;
            latitude?: number;
            longitude?: number;
        };
        metadata?: Record<string, any>;
    }): Promise<void>;
    getTrafficOverview(businessId: string, startDate: Date, endDate: Date): Promise<any>;
    getTrafficBreakdown(businessId: string, startDate: Date, endDate: Date, groupBy?: 'device' | 'os' | 'browser' | 'page'): Promise<any[]>;
    getTrafficLocationBreakdown(businessId: string, startDate: Date, endDate: Date, groupBy?: 'country' | 'region' | 'city'): Promise<any[]>;
    getPageAnalytics(businessId: string, startDate: Date, endDate: Date): Promise<any[]>;
}
