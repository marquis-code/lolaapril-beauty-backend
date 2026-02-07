import { Response } from 'express';
import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    generateFinancialReport(startDate: string, endDate: string, reportPeriod: string, businessId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getReport(reportId: string): Promise<{
        success: boolean;
        data: import("./schemas/financial-report.schema").FinancialReportDocument;
    }>;
    getCommissionBreakdown(startDate: string, endDate: string, businessId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getDashboardMetrics(businessId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getFeeComparison(businessId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    exportReportToCSV(reportId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getQuickStats(businessId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            today: {
                revenue: any;
                bookings: any;
                netRevenue: any;
            };
            thisMonth: {
                revenue: any;
                bookings: any;
                netRevenue: any;
                commissionSavings: any;
            };
            pending: any;
            trends: any;
        };
    }>;
    getRevenueTrends(startDate: string, endDate: string, granularity: string, businessId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            period: {
                start: string;
                end: string;
                granularity: string;
            };
            revenue: {
                gross: any;
                net: any;
                commissions: any;
                processingFees: any;
                refunds: any;
            };
            bookings: {
                total: any;
                completed: any;
                cancelled: any;
                noShows: any;
                averageValue: any;
            };
        };
    }>;
    getSourcePerformance(startDate: string, endDate: string, businessId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            sources: any;
            summary: {
                totalSources: any;
                topSource: any;
                topSourceRevenue: any;
            };
            period: {
                start: string;
                end: string;
            };
        };
    }>;
    getCommissionInsights(months: number, businessId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            period: {
                months: number;
                startDate: Date;
                endDate: Date;
            };
            breakdown: any;
            savings: any;
            recommendations: string[];
        };
    }>;
    private generateCommissionRecommendations;
}
