import { Job } from 'bull';
import { Model } from 'mongoose';
import { PaymentDocument } from '../../payment/schemas/payment.schema';
import { BookingDocument } from '../../booking/schemas/booking.schema';
import { NotificationService } from '../../notification/notification.service';
import { CacheService } from '../../cache/cache.service';
import { EmailService } from '../../notification/email.service';
interface MonthlyReportData {
    tenantId: string;
    month: number;
    year: number;
    sendEmail?: boolean;
}
interface AnalyticsJobData {
    tenantId: string;
    dateRange: {
        startDate: Date;
        endDate: Date;
    };
    metrics?: string[];
}
interface MonthlyReport {
    tenantId: string;
    period: string;
    revenue: {
        total: number;
        byMethod: Record<string, number>;
        growth: number;
    };
    bookings: {
        total: number;
        confirmed: number;
        cancelled: number;
        completed: number;
        conversionRate: number;
    };
    clients: {
        new: number;
        returning: number;
        total: number;
    };
    services: {
        mostBooked: Array<{
            name: string;
            count: number;
            revenue: number;
        }>;
        averageValue: number;
    };
    performance: {
        avgBookingValue: number;
        cancellationRate: number;
        completionRate: number;
    };
    commission: {
        totalEarned: number;
        platformFees: number;
        netRevenue: number;
    };
}
export declare class ReportGenerationProcessor {
    private paymentModel;
    private bookingModel;
    private notificationService;
    private cacheService;
    private emailService;
    private readonly logger;
    constructor(paymentModel: Model<PaymentDocument>, bookingModel: Model<BookingDocument>, notificationService: NotificationService, cacheService: CacheService, emailService: EmailService);
    generateMonthlyReport(job: Job<MonthlyReportData>): Promise<MonthlyReport>;
    generateAnalytics(job: Job<AnalyticsJobData>): Promise<any>;
    private calculateRevenue;
    private calculateBookingStats;
    private calculateClientStats;
    private calculateServiceStats;
    private calculatePerformanceMetrics;
    private calculateCommissionStats;
    private analyzeRevenueTrends;
    private analyzeBookingPatterns;
    private analyzeClientBehavior;
    private analyzeServicePerformance;
    private analyzePeakHours;
    private saveReport;
    private sendReportEmail;
    private generateReportEmailHTML;
}
export {};
