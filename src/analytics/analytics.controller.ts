// src/modules/analytics/analytics.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
  Res,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard, BusinessId } from '../auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { Audit } from '../audit/decorators/audit.decorator';
import { AuditAction, AuditEntity } from '../audit/schemas/audit-log.schema';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Generate Financial Report
   * POST /analytics/reports/generate
   */
  @Post('reports/generate')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @Audit({ action: AuditAction.CREATE, entity: AuditEntity.FINANCIAL_REPORT })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Generate a financial report',
    description: 'Generates a comprehensive financial report for a specified period',
  })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'ISO date string (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'ISO date string (YYYY-MM-DD)' })
  @ApiQuery({
    name: 'reportPeriod',
    required: false,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
    description: 'Report period type',
  })
  @ApiResponse({
    status: 201,
    description: 'Financial report generated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date format or business ID',
  })
  async generateFinancialReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('reportPeriod') reportPeriod: string = 'custom',
    @BusinessId() businessId: string,
  ) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      if (start > end) {
        throw new BadRequestException('Start date must be before end date');
      }

      const report = await this.analyticsService.generateFinancialReport(
        businessId,
        start,
        end,
        reportPeriod,
      );

      return {
        success: true,
        message: 'Financial report generated successfully',
        data: report,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get Financial Report by ID
   * GET /analytics/reports/:reportId
   */
  @Get('reports/:reportId')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.FINANCIAL_REPORT })
  @ApiOperation({
    summary: 'Get a financial report by ID',
    description: 'Retrieves a previously generated financial report',
  })
  @ApiParam({ name: 'reportId', type: String, description: 'Report ID' })
  @ApiResponse({
    status: 200,
    description: 'Report retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  async getReport(@Param('reportId') reportId: string) {
    try {
      const report = await this.analyticsService.getReport(reportId);

      return {
        success: true,
        data: report,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get Commission Breakdown
   * GET /analytics/commissions/breakdown
   */
  @Get('commissions/breakdown')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.COMMISSION })
  @ApiOperation({
    summary: 'Get detailed commission breakdown',
    description: 'Returns commission breakdown by source and booking type',
  })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Commission breakdown retrieved successfully',
  })
  async getCommissionBreakdown(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @BusinessId() businessId: string,
  ) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      const breakdown = await this.analyticsService.getCommissionBreakdown(
        businessId,
        start,
        end,
      );

      return {
        success: true,
        message: 'Commission breakdown retrieved successfully',
        data: breakdown,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get Dashboard Metrics
   * GET /analytics/dashboard
   */
  @Get('dashboard')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.ANALYTICS })
  @ApiOperation({
    summary: 'Get real-time dashboard metrics',
    description: 'Returns today, month-to-date, and trend metrics for the business',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard metrics retrieved successfully',
  })
  async getDashboardMetrics(@BusinessId() businessId: string) {
    try {
      const metrics = await this.analyticsService.getDashboardMetrics(businessId);

      return {
        success: true,
        message: 'Dashboard metrics retrieved successfully',
        data: metrics,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get Fee Comparison
   * GET /analytics/fee-comparison
   */
  @Get('fee-comparison')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.ANALYTICS })
  @ApiOperation({
    summary: 'Compare fees with competitor platforms',
    description: 'Shows how much you save compared to Fresha, Booksy, and other platforms',
  })
  @ApiResponse({
    status: 200,
    description: 'Fee comparison retrieved successfully',
  })
  async getFeeComparison(@BusinessId() businessId: string) {
    try {
      const comparison = await this.analyticsService.getFeeComparison(businessId);

      return {
        success: true,
        message: 'Fee comparison retrieved successfully',
        data: comparison,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Export Report to CSV
   * GET /analytics/reports/:reportId/export
   */
  @Get('reports/:reportId/export')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @Audit({ action: AuditAction.EXPORT, entity: AuditEntity.FINANCIAL_REPORT })
  @ApiOperation({
    summary: 'Export financial report to CSV',
    description: 'Downloads the financial report as a CSV file',
  })
  @ApiParam({ name: 'reportId', type: String })
  @ApiResponse({
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
  })
  async exportReportToCSV(
    @Param('reportId') reportId: string,
    @Res() res: Response,
  ) {
    try {
      const csvContent = await this.analyticsService.exportReportToCSV(reportId);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="financial-report-${reportId}.csv"`,
      );

      return res.send(csvContent);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get Quick Stats (Today & This Month)
   * GET /analytics/quick-stats
   */
  @Get('quick-stats')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Get quick stats for today and this month',
    description: 'Returns simplified metrics for quick overview',
  })
  @ApiResponse({
    status: 200,
    description: 'Quick stats retrieved successfully',
  })
  async getQuickStats(@BusinessId() businessId: string) {
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get Revenue Trends
   * GET /analytics/revenue/trends
   */
  @Get('revenue/trends')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.ANALYTICS })
  @ApiOperation({
    summary: 'Get revenue trends over time',
    description: 'Returns revenue data for charting and trend analysis',
  })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @ApiQuery({
    name: 'granularity',
    required: false,
    enum: ['daily', 'weekly', 'monthly'],
    description: 'Data point granularity',
  })
  @ApiResponse({
    status: 200,
    description: 'Revenue trends retrieved successfully',
  })
  async getRevenueTrends(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('granularity') granularity: string = 'daily',
    @BusinessId() businessId: string,
  ) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      // Generate report for the period
      const report = await this.analyticsService.generateFinancialReport(
        businessId,
        start,
        end,
        granularity,
      );

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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get Source Performance
   * GET /analytics/sources/performance
   */
  @Get('sources/performance')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.ANALYTICS })
  @ApiOperation({
    summary: 'Get booking source performance metrics',
    description: 'Analyzes which booking sources generate the most revenue',
  })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Source performance retrieved successfully',
  })
  async getSourcePerformance(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @BusinessId() businessId: string,
  ) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      const report = await this.analyticsService.generateFinancialReport(
        businessId,
        start,
        end,
        'custom',
      );

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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get Commission Insights
   * GET /analytics/commissions/insights
   */
  @Get('commissions/insights')
  @Roles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.ANALYTICS })
  @ApiOperation({
    summary: 'Get commission insights and savings',
    description: 'Shows detailed commission insights and potential savings',
  })
  @ApiQuery({
    name: 'months',
    required: false,
    type: Number,
    description: 'Number of months to analyze (default: 3)',
  })
  @ApiResponse({
    status: 200,
    description: 'Commission insights retrieved successfully',
  })
  async getCommissionInsights(
    @Query('months') months: number = 3,
    @BusinessId() businessId: string,
  ) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const [breakdown, comparison] = await Promise.all([
        this.analyticsService.getCommissionBreakdown(
          businessId,
          startDate,
          endDate,
        ),
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Helper: Generate commission recommendations
   */
  private generateCommissionRecommendations(breakdown: any): string[] {
    const recommendations: string[] = [];
    const directPercentage =
      breakdown.summary.totalBookings > 0
        ? (breakdown.summary.directBookings / breakdown.summary.totalBookings) * 100
        : 0;

    if (directPercentage < 50) {
      recommendations.push(
        'Increase direct bookings by promoting your QR codes and direct links to save on commissions',
      );
    }

    if (breakdown.summary.marketplaceCommissions > 10000) {
      recommendations.push(
        `You could save ₦${Math.floor(breakdown.summary.marketplaceCommissions * 0.5)} per month by converting 50% of marketplace bookings to direct bookings`,
      );
    }

    if (breakdown.summary.averageCommissionRate > 15) {
      recommendations.push(
        'Your average commission rate is high. Consider negotiating better rates or increasing direct booking channels',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Great job! Your commission management is optimal. Keep promoting direct booking channels.',
      );
    }

    return recommendations;
  }
}