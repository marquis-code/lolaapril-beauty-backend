"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ReportGenerationProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportGenerationProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("../../payment/schemas/payment.schema");
const booking_schema_1 = require("../../booking/schemas/booking.schema");
const notification_service_1 = require("../../notification/notification.service");
const cache_service_1 = require("../../cache/cache.service");
const email_service_1 = require("../../notification/email.service");
let ReportGenerationProcessor = ReportGenerationProcessor_1 = class ReportGenerationProcessor {
    constructor(paymentModel, bookingModel, notificationService, cacheService, emailService) {
        this.paymentModel = paymentModel;
        this.bookingModel = bookingModel;
        this.notificationService = notificationService;
        this.cacheService = cacheService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(ReportGenerationProcessor_1.name);
    }
    async generateMonthlyReport(job) {
        const { tenantId, month, year, sendEmail = true } = job.data;
        try {
            this.logger.log(`Generating monthly report for tenant ${tenantId} - ${month}/${year}`);
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            const report = {
                tenantId,
                period: `${year}-${String(month).padStart(2, '0')}`,
                revenue: await this.calculateRevenue(tenantId, startDate, endDate),
                bookings: await this.calculateBookingStats(tenantId, startDate, endDate),
                clients: await this.calculateClientStats(tenantId, startDate, endDate),
                services: await this.calculateServiceStats(tenantId, startDate, endDate),
                performance: await this.calculatePerformanceMetrics(tenantId, startDate, endDate),
                commission: await this.calculateCommissionStats(tenantId, startDate, endDate),
            };
            const cacheKey = `report:monthly:${tenantId}:${year}-${month}`;
            await this.cacheService.set(cacheKey, report, 86400 * 30);
            await this.saveReport(report);
            if (sendEmail) {
                await this.sendReportEmail(tenantId, report);
            }
            this.logger.log(`Monthly report generated successfully for tenant ${tenantId}`);
            return report;
        }
        catch (error) {
            this.logger.error(`Failed to generate monthly report: ${error.message}`, error.stack);
            throw error;
        }
    }
    async generateAnalytics(job) {
        const { tenantId, dateRange, metrics = [] } = job.data;
        try {
            this.logger.log(`Generating analytics for tenant ${tenantId}`);
            const analytics = {
                tenantId,
                dateRange,
                generatedAt: new Date(),
                data: {}
            };
            if (metrics.length === 0 || metrics.includes('revenue')) {
                analytics.data.revenue = await this.analyzeRevenueTrends(tenantId, dateRange.startDate, dateRange.endDate);
            }
            if (metrics.length === 0 || metrics.includes('bookings')) {
                analytics.data.bookingPatterns = await this.analyzeBookingPatterns(tenantId, dateRange.startDate, dateRange.endDate);
            }
            if (metrics.length === 0 || metrics.includes('clients')) {
                analytics.data.clientBehavior = await this.analyzeClientBehavior(tenantId, dateRange.startDate, dateRange.endDate);
            }
            if (metrics.length === 0 || metrics.includes('services')) {
                analytics.data.servicePerformance = await this.analyzeServicePerformance(tenantId, dateRange.startDate, dateRange.endDate);
            }
            if (metrics.length === 0 || metrics.includes('peakHours')) {
                analytics.data.peakHours = await this.analyzePeakHours(tenantId, dateRange.startDate, dateRange.endDate);
            }
            const cacheKey = `analytics:${tenantId}:${dateRange.startDate.getTime()}-${dateRange.endDate.getTime()}`;
            await this.cacheService.set(cacheKey, analytics, 3600);
            this.logger.log('Analytics generated successfully');
            return { success: true, analytics };
        }
        catch (error) {
            this.logger.error('Analytics generation failed', error.stack);
            throw error;
        }
    }
    async calculateRevenue(tenantId, startDate, endDate) {
        const revenueData = await this.paymentModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    status: 'completed',
                    paidAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' },
                    byMethod: {
                        $push: {
                            method: '$paymentMethod',
                            amount: '$totalAmount'
                        }
                    }
                }
            }
        ]);
        const byMethod = {};
        if (revenueData[0]?.byMethod) {
            revenueData[0].byMethod.forEach((item) => {
                byMethod[item.method] = (byMethod[item.method] || 0) + item.amount;
            });
        }
        const prevStartDate = new Date(startDate);
        prevStartDate.setMonth(prevStartDate.getMonth() - 1);
        const prevEndDate = new Date(endDate);
        prevEndDate.setMonth(prevEndDate.getMonth() - 1);
        const prevRevenue = await this.paymentModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    status: 'completed',
                    paidAt: { $gte: prevStartDate, $lte: prevEndDate }
                }
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const currentTotal = revenueData[0]?.total || 0;
        const previousTotal = prevRevenue[0]?.total || 0;
        const growth = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
        return {
            total: currentTotal,
            byMethod,
            growth: Math.round(growth * 100) / 100
        };
    }
    async calculateBookingStats(tenantId, startDate, endDate) {
        const bookings = await this.bookingModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const stats = {
            total: 0,
            confirmed: 0,
            cancelled: 0,
            completed: 0,
            pending: 0
        };
        bookings.forEach(b => {
            stats.total += b.count;
            stats[b._id] = b.count;
        });
        stats.conversionRate = stats.total > 0
            ? Math.round((stats.confirmed / stats.total) * 100 * 100) / 100
            : 0;
        return stats;
    }
    async calculateClientStats(tenantId, startDate, endDate) {
        const newClients = await this.bookingModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    createdAt: { $gte: startDate, $lte: endDate },
                    firstTimeClient: true
                }
            },
            {
                $group: {
                    _id: '$clientId'
                }
            },
            {
                $count: 'count'
            }
        ]);
        const totalClients = await this.bookingModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$clientId'
                }
            },
            {
                $count: 'count'
            }
        ]);
        const newCount = newClients[0]?.count || 0;
        const totalCount = totalClients[0]?.count || 0;
        return {
            new: newCount,
            returning: totalCount - newCount,
            total: totalCount
        };
    }
    async calculateServiceStats(tenantId, startDate, endDate) {
        const serviceStats = await this.bookingModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: { $in: ['confirmed', 'completed'] }
                }
            },
            { $unwind: '$services' },
            {
                $group: {
                    _id: '$services.serviceName',
                    count: { $sum: 1 },
                    revenue: { $sum: '$services.price' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        const totalRevenue = await this.paymentModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    status: 'completed',
                    paidAt: { $gte: startDate, $lte: endDate }
                }
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
        ]);
        return {
            mostBooked: serviceStats.map(s => ({
                name: s._id,
                count: s.count,
                revenue: s.revenue
            })),
            averageValue: totalRevenue[0]?.count > 0
                ? Math.round((totalRevenue[0].total / totalRevenue[0].count) * 100) / 100
                : 0
        };
    }
    async calculatePerformanceMetrics(tenantId, startDate, endDate) {
        const bookingStats = await this.bookingModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        let total = 0;
        let cancelled = 0;
        let completed = 0;
        bookingStats.forEach(stat => {
            total += stat.count;
            if (stat._id === 'cancelled') {
                cancelled = stat.count;
            }
            else if (stat._id === 'completed') {
                completed = stat.count;
            }
        });
        const avgBookingValue = await this.paymentModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    status: 'completed',
                    paidAt: { $gte: startDate, $lte: endDate }
                }
            },
            { $group: { _id: null, avg: { $avg: '$totalAmount' } } }
        ]);
        return {
            avgBookingValue: Math.round((avgBookingValue[0]?.avg || 0) * 100) / 100,
            cancellationRate: total > 0 ? Math.round((cancelled / total) * 100 * 100) / 100 : 0,
            completionRate: total > 0 ? Math.round((completed / total) * 100 * 100) / 100 : 0
        };
    }
    async calculateCommissionStats(tenantId, startDate, endDate) {
        const commissions = await this.bookingModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    createdAt: { $gte: startDate, $lte: endDate },
                    'commissionInfo.isCommissionable': true
                }
            },
            {
                $group: {
                    _id: null,
                    totalCommission: { $sum: '$commissionInfo.commissionAmount' },
                    totalRevenue: { $sum: '$estimatedTotal' }
                }
            }
        ]);
        const platformFees = commissions[0]?.totalCommission || 0;
        const totalRevenue = commissions[0]?.totalRevenue || 0;
        return {
            totalEarned: totalRevenue,
            platformFees,
            netRevenue: totalRevenue - platformFees
        };
    }
    async analyzeRevenueTrends(tenantId, startDate, endDate) {
        const trends = await this.paymentModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    status: 'completed',
                    paidAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$paidAt' },
                        month: { $month: '$paidAt' },
                        day: { $dayOfMonth: '$paidAt' }
                    },
                    revenue: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);
        return trends.map(t => ({
            date: new Date(t._id.year, t._id.month - 1, t._id.day),
            revenue: t.revenue,
            transactions: t.count
        }));
    }
    async analyzeBookingPatterns(tenantId, startDate, endDate) {
        const patterns = await this.bookingModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        dayOfWeek: { $dayOfWeek: '$preferredDate' },
                        hour: { $substr: ['$preferredStartTime', 0, 2] }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        return patterns;
    }
    async analyzeClientBehavior(tenantId, startDate, endDate) {
        const behavior = await this.bookingModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$clientId',
                    bookingCount: { $sum: 1 },
                    totalSpent: { $sum: '$estimatedTotal' },
                    avgBookingValue: { $avg: '$estimatedTotal' }
                }
            },
            {
                $group: {
                    _id: null,
                    repeatCustomers: {
                        $sum: { $cond: [{ $gt: ['$bookingCount', 1] }, 1, 0] }
                    },
                    oneTimeCustomers: {
                        $sum: { $cond: [{ $eq: ['$bookingCount', 1] }, 1, 0] }
                    },
                    avgBookingsPerClient: { $avg: '$bookingCount' },
                    avgSpendPerClient: { $avg: '$totalSpent' }
                }
            }
        ]);
        return behavior[0] || {};
    }
    async analyzeServicePerformance(tenantId, startDate, endDate) {
        return await this.bookingModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            { $unwind: '$services' },
            {
                $group: {
                    _id: '$services.serviceName',
                    bookings: { $sum: 1 },
                    revenue: { $sum: '$services.price' },
                    avgDuration: { $avg: '$services.duration' }
                }
            },
            { $sort: { revenue: -1 } }
        ]);
    }
    async analyzePeakHours(tenantId, startDate, endDate) {
        return await this.bookingModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(tenantId),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $substr: ['$preferredStartTime', 0, 2] },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
    }
    async saveReport(report) {
        this.logger.log(`Report saved for ${report.tenantId} - ${report.period}`);
    }
    async sendReportEmail(tenantId, report) {
        try {
            const recipientEmail = 'business@example.com';
            const emailContent = this.generateReportEmailHTML(report);
            await this.emailService.sendEmail(recipientEmail, `Monthly Report - ${report.period}`, emailContent);
            this.logger.log(`Report email sent to ${recipientEmail}`);
        }
        catch (error) {
            this.logger.error('Failed to send report email', error.stack);
        }
    }
    generateReportEmailHTML(report) {
        return `
      <h1>Monthly Business Report - ${report.period}</h1>
      
      <h2>Revenue Summary</h2>
      <p>Total Revenue: $${report.revenue.total.toFixed(2)}</p>
      <p>Growth: ${report.revenue.growth}%</p>
      
      <h2>Bookings</h2>
      <p>Total: ${report.bookings.total}</p>
      <p>Confirmed: ${report.bookings.confirmed}</p>
      <p>Conversion Rate: ${report.bookings.conversionRate}%</p>
      
      <h2>Client Stats</h2>
      <p>New Clients: ${report.clients.new}</p>
      <p>Returning Clients: ${report.clients.returning}</p>
      
      <h2>Performance</h2>
      <p>Average Booking Value: $${report.performance.avgBookingValue.toFixed(2)}</p>
      <p>Completion Rate: ${report.performance.completionRate}%</p>
      
      <p><small>Generated on ${new Date().toLocaleDateString()}</small></p>
    `;
    }
};
__decorate([
    (0, bull_1.Process)('generate-monthly-report'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportGenerationProcessor.prototype, "generateMonthlyReport", null);
__decorate([
    (0, bull_1.Process)('generate-analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportGenerationProcessor.prototype, "generateAnalytics", null);
ReportGenerationProcessor = ReportGenerationProcessor_1 = __decorate([
    (0, bull_1.Processor)('reports'),
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notification_service_1.NotificationService,
        cache_service_1.CacheService,
        email_service_1.EmailService])
], ReportGenerationProcessor);
exports.ReportGenerationProcessor = ReportGenerationProcessor;
//# sourceMappingURL=report-generation.processor.js.map