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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const financial_report_schema_1 = require("./schemas/financial-report.schema");
const booking_schema_1 = require("../booking/schemas/booking.schema");
const payment_schema_1 = require("../payment/schemas/payment.schema");
const traffic_analytics_schema_1 = require("./schemas/traffic-analytics.schema");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(reportModel, bookingModel, paymentModel, commissionModel, trafficModel) {
        this.reportModel = reportModel;
        this.bookingModel = bookingModel;
        this.paymentModel = paymentModel;
        this.commissionModel = commissionModel;
        this.trafficModel = trafficModel;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async generateFinancialReport(businessId, startDate, endDate, reportPeriod = 'custom') {
        this.logger.log(`Generating financial report for business ${businessId} from ${startDate} to ${endDate}`);
        const [revenueBreakdown, commissionBreakdown, sourceBreakdown, bookingStats] = await Promise.all([
            this.calculateRevenueBreakdown(businessId, startDate, endDate),
            this.calculateCommissionBreakdown(businessId, startDate, endDate),
            this.calculateSourceBreakdown(businessId, startDate, endDate),
            this.calculateBookingStats(businessId, startDate, endDate)
        ]);
        const report = await this.reportModel.create({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            reportPeriod,
            startDate,
            endDate,
            revenue: revenueBreakdown,
            commissions: commissionBreakdown,
            sourceBreakdown,
            totalBookings: bookingStats.total,
            completedBookings: bookingStats.completed,
            cancelledBookings: bookingStats.cancelled,
            noShows: bookingStats.noShows,
            averageBookingValue: bookingStats.averageValue,
            generatedAt: new Date()
        });
        this.logger.log(`Financial report generated: ${report._id}`);
        return report;
    }
    async getReport(reportId) {
        const report = await this.reportModel.findById(reportId).exec();
        if (!report) {
            throw new Error('Report not found');
        }
        return report;
    }
    async getCommissionBreakdown(businessId, startDate, endDate) {
        const [commissionData, sourceData] = await Promise.all([
            this.calculateCommissionBreakdown(businessId, startDate, endDate),
            this.calculateSourceBreakdown(businessId, startDate, endDate)
        ]);
        const totalCommissions = await this.commissionModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    calculatedAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$commissionAmount' },
                    totalBookings: { $sum: 1 },
                    averageCommission: { $avg: '$commissionAmount' }
                }
            }
        ]).exec();
        const metrics = totalCommissions[0] || {
            totalAmount: 0,
            totalBookings: 0,
            averageCommission: 0
        };
        return {
            summary: {
                totalCommissions: metrics.totalAmount,
                totalBookings: metrics.totalBookings,
                averageCommission: metrics.averageCommission,
                marketplaceBookings: commissionData.marketplaceBookings,
                marketplaceCommissions: commissionData.marketplaceCommissions,
                directBookings: commissionData.directBookings,
                commissionSavings: commissionData.commissionSavings,
                averageCommissionRate: commissionData.averageCommissionRate
            },
            bySource: sourceData,
            period: {
                startDate,
                endDate
            }
        };
    }
    async calculateRevenueBreakdown(businessId, startDate, endDate) {
        const payments = await this.paymentModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    grossRevenue: { $sum: '$totalAmount' },
                    processingFees: { $sum: '$processingFee' }
                }
            }
        ]).exec();
        const commissions = await this.commissionModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    calculatedAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    platformCommissions: { $sum: '$commissionAmount' }
                }
            }
        ]).exec();
        const refunds = await this.paymentModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: 'refunded'
                }
            },
            {
                $group: {
                    _id: null,
                    totalRefunds: { $sum: '$totalAmount' }
                }
            }
        ]).exec();
        const grossRevenue = payments[0]?.grossRevenue || 0;
        const platformCommissions = commissions[0]?.platformCommissions || 0;
        const processingFees = payments[0]?.processingFees || 0;
        const totalRefunds = refunds[0]?.totalRefunds || 0;
        const netRevenue = grossRevenue - platformCommissions - processingFees - totalRefunds;
        const businessPayout = netRevenue;
        return {
            grossRevenue,
            platformCommissions,
            processingFees,
            refunds: totalRefunds,
            netRevenue,
            businessPayout
        };
    }
    async calculateCommissionBreakdown(businessId, startDate, endDate) {
        const result = await this.commissionModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    calculatedAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$isCommissionable',
                    count: { $sum: 1 },
                    totalCommissions: { $sum: '$commissionAmount' },
                    totalRevenue: { $sum: '$bookingAmount' },
                    averageRate: { $avg: '$commissionRate' }
                }
            }
        ]).exec();
        const commissionableData = result.find(r => r._id === true) || {
            count: 0,
            totalCommissions: 0,
            totalRevenue: 0,
            averageRate: 0
        };
        const nonCommissionableData = result.find(r => r._id === false) || {
            count: 0,
            totalCommissions: 0,
            totalRevenue: 0,
            averageRate: 0
        };
        return {
            marketplaceBookings: commissionableData.count,
            marketplaceCommissions: commissionableData.totalCommissions,
            directBookings: nonCommissionableData.count,
            commissionSavings: nonCommissionableData.totalRevenue,
            averageCommissionRate: commissionableData.averageRate
        };
    }
    async calculateSourceBreakdown(businessId, startDate, endDate) {
        return await this.commissionModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    calculatedAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$sourceTracking.sourceType',
                    bookingCount: { $sum: 1 },
                    revenue: { $sum: '$bookingAmount' },
                    commissions: { $sum: '$commissionAmount' }
                }
            },
            {
                $project: {
                    sourceType: '$_id',
                    bookingCount: 1,
                    revenue: 1,
                    commissions: 1,
                    netRevenue: { $subtract: ['$revenue', '$commissions'] }
                }
            },
            { $sort: { revenue: -1 } }
        ]).exec();
    }
    async calculateBookingStats(businessId, startDate, endDate) {
        const stats = await this.bookingModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$estimatedTotal' }
                }
            }
        ]).exec();
        const total = stats.reduce((sum, s) => sum + s.count, 0);
        const completed = stats.find(s => s._id === 'confirmed')?.count || 0;
        const cancelled = stats.find(s => s._id === 'cancelled')?.count || 0;
        const noShows = stats.find(s => s._id === 'no_show')?.count || 0;
        const totalValue = stats.reduce((sum, s) => sum + s.totalValue, 0);
        const averageValue = total > 0 ? totalValue / total : 0;
        return {
            total,
            completed,
            cancelled,
            noShows,
            averageValue
        };
    }
    async getDashboardMetrics(businessId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayMetrics = await this.generateFinancialReport(businessId, today, tomorrow, 'daily');
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthMetrics = await this.generateFinancialReport(businessId, monthStart, new Date(), 'monthly');
        const pendingBookings = await this.bookingModel.countDocuments({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            status: 'pending'
        }).exec();
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const upcomingAppointments = await this.bookingModel.countDocuments({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            status: 'confirmed',
            preferredDate: { $gte: today, $lte: nextWeek }
        }).exec();
        const todayTraffic = await this.getTrafficOverview(businessId, today, tomorrow);
        const monthTraffic = await this.getTrafficOverview(businessId, monthStart, new Date());
        return {
            today: {
                revenue: todayMetrics.revenue.grossRevenue,
                bookings: todayMetrics.totalBookings,
                commissions: todayMetrics.commissions.marketplaceCommissions,
                netRevenue: todayMetrics.revenue.netRevenue,
                traffic: todayTraffic,
            },
            monthToDate: {
                revenue: monthMetrics.revenue.grossRevenue,
                bookings: monthMetrics.totalBookings,
                commissions: monthMetrics.commissions.marketplaceCommissions,
                netRevenue: monthMetrics.revenue.netRevenue,
                commissionSavings: monthMetrics.commissions.commissionSavings,
                traffic: monthTraffic,
            },
            pending: {
                bookings: pendingBookings,
                appointments: upcomingAppointments
            },
            trends: {
                commissionRate: monthMetrics.commissions.averageCommissionRate,
                directBookingPercentage: monthMetrics.totalBookings > 0
                    ? (monthMetrics.commissions.directBookings / monthMetrics.totalBookings) * 100
                    : 0,
                avgPageViewsPerSession: monthTraffic.avgPageViewsPerSession,
            }
        };
    }
    async getFeeComparison(businessId) {
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() - 1);
        const report = await this.generateFinancialReport(businessId, monthStart, new Date(), 'monthly');
        const grossRevenue = report.revenue.grossRevenue;
        return {
            yourPlatform: {
                name: 'Your Platform (Lola Beauty)',
                grossRevenue,
                marketplaceCommissions: report.commissions.marketplaceCommissions,
                directBookingCommissions: 0,
                netRevenue: report.revenue.netRevenue,
                commissionRate: report.commissions.averageCommissionRate
            },
            competitors: [
                {
                    name: 'Fresha (Typical)',
                    grossRevenue,
                    marketplaceCommissions: grossRevenue * 0.20,
                    directBookingCommissions: grossRevenue * 0.20,
                    netRevenue: grossRevenue * 0.80,
                    commissionRate: 20,
                    note: 'Charges commission even on QR codes and direct links'
                },
                {
                    name: 'Booksy',
                    grossRevenue,
                    marketplaceCommissions: grossRevenue * 0.14,
                    directBookingCommissions: grossRevenue * 0.14,
                    netRevenue: grossRevenue * 0.86,
                    commissionRate: 14,
                    note: 'Lower rate but charges on all bookings'
                }
            ],
            savings: {
                vsFresha: (grossRevenue * 0.20) - report.commissions.marketplaceCommissions,
                vsBooksy: (grossRevenue * 0.14) - report.commissions.marketplaceCommissions,
                percentage: report.commissions.marketplaceCommissions > 0
                    ? ((grossRevenue * 0.20 - report.commissions.marketplaceCommissions) / (grossRevenue * 0.20)) * 100
                    : 100
            }
        };
    }
    async exportReportToCSV(reportId) {
        const report = await this.reportModel.findById(reportId).exec();
        if (!report) {
            throw new Error('Report not found');
        }
        const plainReport = {
            startDate: report.startDate,
            endDate: report.endDate,
            revenue: {
                grossRevenue: report.revenue?.grossRevenue || 0,
                platformCommissions: report.revenue?.platformCommissions || 0,
                processingFees: report.revenue?.processingFees || 0,
                refunds: report.revenue?.refunds || 0,
                netRevenue: report.revenue?.netRevenue || 0,
                businessPayout: report.revenue?.businessPayout || 0
            },
            commissions: {
                marketplaceBookings: report.commissions?.marketplaceBookings || 0,
                marketplaceCommissions: report.commissions?.marketplaceCommissions || 0,
                directBookings: report.commissions?.directBookings || 0,
                commissionSavings: report.commissions?.commissionSavings || 0,
                averageCommissionRate: report.commissions?.averageCommissionRate || 0
            },
            sourceBreakdown: report.sourceBreakdown || []
        };
        const csv = [
            ['Financial Report', `${plainReport.startDate} to ${plainReport.endDate}`],
            [],
            ['Revenue Breakdown'],
            ['Gross Revenue', plainReport.revenue.grossRevenue],
            ['Platform Commissions', plainReport.revenue.platformCommissions],
            ['Processing Fees', plainReport.revenue.processingFees],
            ['Refunds', plainReport.revenue.refunds],
            ['Net Revenue', plainReport.revenue.netRevenue],
            ['Business Payout', plainReport.revenue.businessPayout],
            [],
            ['Commission Breakdown'],
            ['Marketplace Bookings', plainReport.commissions.marketplaceBookings],
            ['Marketplace Commissions', plainReport.commissions.marketplaceCommissions],
            ['Direct Bookings', plainReport.commissions.directBookings],
            ['Commission Savings', plainReport.commissions.commissionSavings],
            ['Average Commission Rate', `${plainReport.commissions.averageCommissionRate}%`],
            [],
            ['Source Breakdown'],
            ['Source Type', 'Bookings', 'Revenue', 'Commissions', 'Net Revenue'],
            ...plainReport.sourceBreakdown.map((s) => [
                s.sourceType,
                s.bookingCount,
                s.revenue,
                s.commissions,
                s.netRevenue
            ])
        ];
        return csv.map(row => row.join(',')).join('\n');
    }
    async trackTraffic(data) {
        try {
            await this.trafficModel.create({
                ...data,
                businessId: new mongoose_2.Types.ObjectId(data.businessId),
            });
        }
        catch (error) {
            this.logger.error(`Error tracking traffic: ${error.message}`);
        }
    }
    async getTrafficOverview(businessId, startDate, endDate) {
        const [pageViews, uniqueVisitors, totalSessions] = await Promise.all([
            this.trafficModel.countDocuments({
                businessId: new mongoose_2.Types.ObjectId(businessId),
                timestamp: { $gte: startDate, $lte: endDate },
                eventType: 'page_view',
            }),
            this.trafficModel.distinct('visitorId', {
                businessId: new mongoose_2.Types.ObjectId(businessId),
                timestamp: { $gte: startDate, $lte: endDate },
            }),
            this.trafficModel.distinct('sessionId', {
                businessId: new mongoose_2.Types.ObjectId(businessId),
                timestamp: { $gte: startDate, $lte: endDate },
            }),
        ]);
        return {
            pageViews,
            uniqueVisitors: uniqueVisitors.length,
            totalSessions: totalSessions.length,
            avgPageViewsPerSession: totalSessions.length > 0 ? pageViews / totalSessions.length : 0,
        };
    }
    async getTrafficBreakdown(businessId, startDate, endDate, groupBy = 'page') {
        const groupField = groupBy === 'page' ? '$pagePath' : `$userAgent.${groupBy}`;
        return await this.trafficModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    timestamp: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: groupField,
                    count: { $sum: 1 },
                    uniqueVisitors: { $addToSet: '$visitorId' },
                },
            },
            {
                $project: {
                    label: '$_id',
                    count: 1,
                    uniqueVisitors: { $size: '$uniqueVisitors' },
                },
            },
            { $sort: { count: -1 } },
        ]).exec();
    }
    async getTrafficLocationBreakdown(businessId, startDate, endDate, groupBy = 'country') {
        const groupField = `$location.${groupBy}`;
        return await this.trafficModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    timestamp: { $gte: startDate, $lte: endDate },
                    'location.country': { $exists: true }
                },
            },
            {
                $group: {
                    _id: groupField,
                    count: { $sum: 1 },
                    uniqueVisitors: { $addToSet: '$visitorId' },
                },
            },
            {
                $project: {
                    location: '$_id',
                    count: 1,
                    uniqueVisitors: { $size: '$uniqueVisitors' },
                },
            },
            { $sort: { count: -1 } },
        ]).exec();
    }
    async getPageAnalytics(businessId, startDate, endDate) {
        return await this.trafficModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    timestamp: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: '$pagePath',
                    title: { $first: '$pageTitle' },
                    views: {
                        $sum: { $cond: [{ $eq: ['$eventType', 'page_view'] }, 1, 0] }
                    },
                    uniqueVisitors: { $addToSet: '$visitorId' },
                    interactions: {
                        $sum: { $cond: [{ $ne: ['$eventType', 'page_view'] }, 1, 0] }
                    }
                },
            },
            {
                $project: {
                    pagePath: '$_id',
                    title: 1,
                    views: 1,
                    uniqueVisitors: { $size: '$uniqueVisitors' },
                    interactions: 1,
                },
            },
            { $sort: { views: -1 } },
        ]).exec();
    }
    async getInteractionAnalytics(businessId, startDate, endDate) {
        return await this.trafficModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    timestamp: { $gte: startDate, $lte: endDate },
                    eventType: { $ne: 'page_view' }
                },
            },
            {
                $group: {
                    _id: {
                        eventType: '$eventType',
                        pagePath: '$pagePath',
                        label: '$metadata.label',
                        action: '$metadata.action'
                    },
                    count: { $sum: 1 },
                    uniqueVisitors: { $addToSet: '$visitorId' },
                    lastEvent: { $max: '$timestamp' }
                },
            },
            {
                $project: {
                    _id: 0,
                    eventType: '$_id.eventType',
                    pagePath: '$_id.pagePath',
                    label: '$_id.label',
                    action: '$_id.action',
                    count: 1,
                    uniqueVisitors: { $size: '$uniqueVisitors' },
                    lastEvent: 1
                },
            },
            { $sort: { count: -1 } },
        ]).exec();
    }
};
AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(financial_report_schema_1.FinancialReport.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(2, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(3, (0, mongoose_1.InjectModel)('Commission')),
    __param(4, (0, mongoose_1.InjectModel)(traffic_analytics_schema_1.TrafficAnalytics.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AnalyticsService);
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map