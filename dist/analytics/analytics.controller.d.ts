import { Response } from 'express';
import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    generateFinancialReport(businessId: string, startDate: string, endDate: string, reportPeriod?: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getReport(reportId: string): Promise<{
        success: boolean;
        data: import("./schemas/financial-report.schema").FinancialReportDocument;
    }>;
    getCommissionBreakdown(businessId: string, startDate: string, endDate: string): Promise<{
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
    getRevenueTrends(businessId: string, startDate: string, endDate: string, granularity?: string): Promise<{
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
    getSourcePerformance(businessId: string, startDate: string, endDate: string): Promise<{
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
    getCommissionInsights(businessId: string, months?: number): Promise<{
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
