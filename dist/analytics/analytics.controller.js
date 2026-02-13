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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const auth_1 = require("../auth");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../auth/schemas/user.schema");
const audit_interceptor_1 = require("../audit/interceptors/audit.interceptor");
const audit_decorator_1 = require("../audit/decorators/audit.decorator");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
const auth_2 = require("../auth");
const business_service_1 = require("../business/business.service");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService, businessService) {
        this.analyticsService = analyticsService;
        this.businessService = businessService;
    }
    async generateFinancialReport(startDate, endDate, reportPeriod = 'custom', businessId) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new common_1.BadRequestException('Invalid date format. Use YYYY-MM-DD');
            }
            if (start > end) {
                throw new common_1.BadRequestException('Start date must be before end date');
            }
            const report = await this.analyticsService.generateFinancialReport(businessId, start, end, reportPeriod);
            return {
                success: true,
                message: 'Financial report generated successfully',
                data: report,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getReport(reportId) {
        try {
            const report = await this.analyticsService.getReport(reportId);
            return {
                success: true,
                data: report,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getCommissionBreakdown(startDate, endDate, businessId) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new common_1.BadRequestException('Invalid date format. Use YYYY-MM-DD');
            }
            const breakdown = await this.analyticsService.getCommissionBreakdown(businessId, start, end);
            return {
                success: true,
                message: 'Commission breakdown retrieved successfully',
                data: breakdown,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getDashboardMetrics(businessId) {
        try {
            const metrics = await this.analyticsService.getDashboardMetrics(businessId);
            return {
                success: true,
                message: 'Dashboard metrics retrieved successfully',
                data: metrics,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getFeeComparison(businessId) {
        try {
            const comparison = await this.analyticsService.getFeeComparison(businessId);
            return {
                success: true,
                message: 'Fee comparison retrieved successfully',
                data: comparison,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async exportReportToCSV(reportId, res) {
        try {
            const csvContent = await this.analyticsService.exportReportToCSV(reportId);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="financial-report-${reportId}.csv"`);
            return res.send(csvContent);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getQuickStats(businessId) {
        try {
            const metrics = await this.analyticsService.getDashboardMetrics(businessId);
            return {
                success: true,
                message: 'Quick stats retrieved successfully',
                data: {
                    today: {
                        revenue: metrics.today.revenue,
                        bookings: metrics.today.bookings,
                        netRevenue: metrics.today.netRevenue,
                    },
                    thisMonth: {
                        revenue: metrics.monthToDate.revenue,
                        bookings: metrics.monthToDate.bookings,
                        netRevenue: metrics.monthToDate.netRevenue,
                        commissionSavings: metrics.monthToDate.commissionSavings,
                    },
                    pending: metrics.pending,
                    trends: metrics.trends,
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getRevenueTrends(startDate, endDate, granularity = 'daily', businessId) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new common_1.BadRequestException('Invalid date format. Use YYYY-MM-DD');
            }
            const report = await this.analyticsService.generateFinancialReport(businessId, start, end, granularity);
            return {
                success: true,
                message: 'Revenue trends retrieved successfully',
                data: {
                    period: {
                        start: startDate,
                        end: endDate,
                        granularity,
                    },
                    revenue: {
                        gross: report.revenue.grossRevenue,
                        net: report.revenue.netRevenue,
                        commissions: report.revenue.platformCommissions,
                        processingFees: report.revenue.processingFees,
                        refunds: report.revenue.refunds,
                    },
                    bookings: {
                        total: report.totalBookings,
                        completed: report.completedBookings,
                        cancelled: report.cancelledBookings,
                        noShows: report.noShows,
                        averageValue: report.averageBookingValue,
                    },
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getSourcePerformance(startDate, endDate, businessId) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new common_1.BadRequestException('Invalid date format. Use YYYY-MM-DD');
            }
            const report = await this.analyticsService.generateFinancialReport(businessId, start, end, 'custom');
            return {
                success: true,
                message: 'Source performance retrieved successfully',
                data: {
                    sources: report.sourceBreakdown,
                    summary: {
                        totalSources: report.sourceBreakdown.length,
                        topSource: report.sourceBreakdown[0]?.sourceType || 'N/A',
                        topSourceRevenue: report.sourceBreakdown[0]?.revenue || 0,
                    },
                    period: {
                        start: startDate,
                        end: endDate,
                    },
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getCommissionInsights(months = 3, businessId) {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - months);
            const [breakdown, comparison] = await Promise.all([
                this.analyticsService.getCommissionBreakdown(businessId, startDate, endDate),
                this.analyticsService.getFeeComparison(businessId),
            ]);
            return {
                success: true,
                message: 'Commission insights retrieved successfully',
                data: {
                    period: {
                        months,
                        startDate,
                        endDate,
                    },
                    breakdown: breakdown.summary,
                    savings: comparison.savings,
                    recommendations: this.generateCommissionRecommendations(breakdown),
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    generateCommissionRecommendations(breakdown) {
        const recommendations = [];
        const directPercentage = breakdown.summary.totalBookings > 0
            ? (breakdown.summary.directBookings / breakdown.summary.totalBookings) * 100
            : 0;
        if (directPercentage < 50) {
            recommendations.push('Increase direct bookings by promoting your QR codes and direct links to save on commissions');
        }
        if (breakdown.summary.marketplaceCommissions > 10000) {
            recommendations.push(`You could save ₦${Math.floor(breakdown.summary.marketplaceCommissions * 0.5)} per month by converting 50% of marketplace bookings to direct bookings`);
        }
        if (breakdown.summary.averageCommissionRate > 15) {
            recommendations.push('Your average commission rate is high. Consider negotiating better rates or increasing direct booking channels');
        }
        if (recommendations.length === 0) {
            recommendations.push('Great job! Your commission management is optimal. Keep promoting direct booking channels.');
        }
        return recommendations;
    }
    async trackTraffic(data, authBusinessId, ip) {
        let businessId = authBusinessId;
        if (!businessId && data.subdomain) {
            const business = await this.businessService.getBySubdomain(data.subdomain);
            if (business) {
                businessId = business._id.toString();
            }
        }
        if (!businessId) {
            if (data.businessId) {
                businessId = data.businessId;
            }
            else {
                throw new common_1.BadRequestException('Business context required (auth, subdomain, or businessId)');
            }
        }
        await this.analyticsService.trackTraffic({
            ...data,
            businessId,
            ip,
        });
        return { success: true };
    }
    async getTrafficOverview(startDate, endDate, businessId) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        const data = await this.analyticsService.getTrafficOverview(businessId, start, end);
        return { success: true, data };
    }
    async getTrafficBreakdown(startDate, endDate, groupBy = 'page', businessId) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        const data = await this.analyticsService.getTrafficBreakdown(businessId, start, end, groupBy);
        return { success: true, data };
    }
    async getTrafficLocationBreakdown(startDate, endDate, groupBy = 'country', businessId) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        const data = await this.analyticsService.getTrafficLocationBreakdown(businessId, start, end, groupBy);
        return { success: true, data };
    }
    async getTrafficPageStats(startDate, endDate, businessId) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        const data = await this.analyticsService.getPageAnalytics(businessId, start, end);
        return { success: true, data };
    }
    async getTrafficInteractionStats(startDate, endDate, businessId) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        const data = await this.analyticsService.getInteractionAnalytics(businessId, start, end);
        return { success: true, data };
    }
};
__decorate([
    (0, common_1.Post)('reports/generate'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.CREATE, entity: audit_log_schema_1.AuditEntity.FINANCIAL_REPORT }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate a financial report',
        description: 'Generates a comprehensive financial report for a specified period',
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String, description: 'ISO date string (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String, description: 'ISO date string (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({
        name: 'reportPeriod',
        required: false,
        enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
        description: 'Report period type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Financial report generated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid date format or business ID',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('reportPeriod')),
    __param(3, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "generateFinancialReport", null);
__decorate([
    (0, common_1.Get)('reports/:reportId'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.FINANCIAL_REPORT }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a financial report by ID',
        description: 'Retrieves a previously generated financial report',
    }),
    (0, swagger_1.ApiParam)({ name: 'reportId', type: String, description: 'Report ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Report retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Report not found',
    }),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)('commissions/breakdown'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.COMMISSION }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get detailed commission breakdown',
        description: 'Returns commission breakdown by source and booking type',
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Commission breakdown retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCommissionBreakdown", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.ANALYTICS }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get real-time dashboard metrics',
        description: 'Returns today, month-to-date, and trend metrics for the business',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard metrics retrieved successfully',
    }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboardMetrics", null);
__decorate([
    (0, common_1.Get)('fee-comparison'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.ANALYTICS }),
    (0, swagger_1.ApiOperation)({
        summary: 'Compare fees with competitor platforms',
        description: 'Shows how much you save compared to Fresha, Booksy, and other platforms',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Fee comparison retrieved successfully',
    }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getFeeComparison", null);
__decorate([
    (0, common_1.Get)('reports/:reportId/export'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.EXPORT, entity: audit_log_schema_1.AuditEntity.FINANCIAL_REPORT }),
    (0, swagger_1.ApiOperation)({
        summary: 'Export financial report to CSV',
        description: 'Downloads the financial report as a CSV file',
    }),
    (0, swagger_1.ApiParam)({ name: 'reportId', type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'CSV file generated successfully',
        content: {
            'text/csv': {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('reportId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "exportReportToCSV", null);
__decorate([
    (0, common_1.Get)('quick-stats'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({
        summary: 'Get quick stats for today and this month',
        description: 'Returns simplified metrics for quick overview',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Quick stats retrieved successfully',
    }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getQuickStats", null);
__decorate([
    (0, common_1.Get)('revenue/trends'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.ANALYTICS }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get revenue trends over time',
        description: 'Returns revenue data for charting and trend analysis',
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({
        name: 'granularity',
        required: false,
        enum: ['daily', 'weekly', 'monthly'],
        description: 'Data point granularity',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Revenue trends retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('granularity')),
    __param(3, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRevenueTrends", null);
__decorate([
    (0, common_1.Get)('sources/performance'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.ANALYTICS }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get booking source performance metrics',
        description: 'Analyzes which booking sources generate the most revenue',
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Source performance retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSourcePerformance", null);
__decorate([
    (0, common_1.Get)('commissions/insights'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.ANALYTICS }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get commission insights and savings',
        description: 'Shows detailed commission insights and potential savings',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'months',
        required: false,
        type: Number,
        description: 'Number of months to analyze (default: 3)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Commission insights retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('months')),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCommissionInsights", null);
__decorate([
    (0, common_1.Post)('track'),
    (0, auth_2.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Track a traffic event',
        description: 'Endpoint for client-side tracking (page views, clicks, etc.)',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_2.OptionalBusinessId)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackTraffic", null);
__decorate([
    (0, common_1.Get)('traffic/overview'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({
        summary: 'Get traffic overview',
        description: 'Returns page views, unique visitors, and session metrics',
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTrafficOverview", null);
__decorate([
    (0, common_1.Get)('traffic/breakdown'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({
        summary: 'Get traffic breakdown',
        description: 'Returns traffic breakdown by device, OS, browser, or page',
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'groupBy', required: false, enum: ['device', 'os', 'browser', 'page'] }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('groupBy')),
    __param(3, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTrafficBreakdown", null);
__decorate([
    (0, common_1.Get)('traffic/locations'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({
        summary: 'Get traffic breakdown by location',
        description: 'Returns traffic breakdown by country, region, or city',
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'groupBy', required: false, enum: ['country', 'region', 'city'] }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('groupBy')),
    __param(3, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTrafficLocationBreakdown", null);
__decorate([
    (0, common_1.Get)('traffic/pages'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({
        summary: 'Get traffic stats by page',
        description: 'Returns views, unique visitors, and interactions per page',
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTrafficPageStats", null);
__decorate([
    (0, common_1.Get)('traffic/interactions'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({
        summary: 'Get traffic interaction stats',
        description: 'Returns metrics for clicks, form submissions, and modal interactions',
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTrafficInteractionStats", null);
AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)(audit_interceptor_1.AuditInterceptor),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService,
        business_service_1.BusinessService])
], AnalyticsController);
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map