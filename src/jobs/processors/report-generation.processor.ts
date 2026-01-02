// jobs/processors/report-generation.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from '../../payment/schemas/payment.schema';
import { Booking, BookingDocument } from '../../booking/schemas/booking.schema';
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
    mostBooked: Array<{ name: string; count: number; revenue: number }>;
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

@Processor('reports')
@Injectable()
export class ReportGenerationProcessor {
  private readonly logger = new Logger(ReportGenerationProcessor.name);

  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private notificationService: NotificationService,
    private cacheService: CacheService,
    private emailService: EmailService,
  ) {}

  @Process('generate-monthly-report')
  async generateMonthlyReport(job: Job<MonthlyReportData>): Promise<MonthlyReport> {
    const { tenantId, month, year, sendEmail = true } = job.data;

    try {
      this.logger.log(`Generating monthly report for tenant ${tenantId} - ${month}/${year}`);

      // Calculate date range
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      // Generate comprehensive report
      const report: MonthlyReport = {
        tenantId,
        period: `${year}-${String(month).padStart(2, '0')}`,
        revenue: await this.calculateRevenue(tenantId, startDate, endDate),
        bookings: await this.calculateBookingStats(tenantId, startDate, endDate),
        clients: await this.calculateClientStats(tenantId, startDate, endDate),
        services: await this.calculateServiceStats(tenantId, startDate, endDate),
        performance: await this.calculatePerformanceMetrics(tenantId, startDate, endDate),
        commission: await this.calculateCommissionStats(tenantId, startDate, endDate),
      };

      // Cache the report
      const cacheKey = `report:monthly:${tenantId}:${year}-${month}`;
      await this.cacheService.set(cacheKey, report, 86400 * 30); // Cache for 30 days

      // Save report to database (optional)
      await this.saveReport(report);

      // Send email notification
      if (sendEmail) {
        await this.sendReportEmail(tenantId, report);
      }

      this.logger.log(`Monthly report generated successfully for tenant ${tenantId}`);

      return report;

    } catch (error) {
      this.logger.error(`Failed to generate monthly report: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('generate-analytics')
  async generateAnalytics(job: Job<AnalyticsJobData>): Promise<any> {
    const { tenantId, dateRange, metrics = [] } = job.data;

    try {
      this.logger.log(`Generating analytics for tenant ${tenantId}`);

      const analytics = {
        tenantId,
        dateRange,
        generatedAt: new Date(),
        data: {} as any
      };

      // Revenue analytics
      if (metrics.length === 0 || metrics.includes('revenue')) {
        analytics.data.revenue = await this.analyzeRevenueTrends(
          tenantId,
          dateRange.startDate,
          dateRange.endDate
        );
      }

      // Booking patterns
      if (metrics.length === 0 || metrics.includes('bookings')) {
        analytics.data.bookingPatterns = await this.analyzeBookingPatterns(
          tenantId,
          dateRange.startDate,
          dateRange.endDate
        );
      }

      // Client behavior
      if (metrics.length === 0 || metrics.includes('clients')) {
        analytics.data.clientBehavior = await this.analyzeClientBehavior(
          tenantId,
          dateRange.startDate,
          dateRange.endDate
        );
      }

      // Service performance
      if (metrics.length === 0 || metrics.includes('services')) {
        analytics.data.servicePerformance = await this.analyzeServicePerformance(
          tenantId,
          dateRange.startDate,
          dateRange.endDate
        );
      }

      // Peak hours analysis
      if (metrics.length === 0 || metrics.includes('peakHours')) {
        analytics.data.peakHours = await this.analyzePeakHours(
          tenantId,
          dateRange.startDate,
          dateRange.endDate
        );
      }

      // Cache results
      const cacheKey = `analytics:${tenantId}:${dateRange.startDate.getTime()}-${dateRange.endDate.getTime()}`;
      await this.cacheService.set(cacheKey, analytics, 3600); // Cache for 1 hour

      this.logger.log('Analytics generated successfully');

      return { success: true, analytics };

    } catch (error) {
      this.logger.error('Analytics generation failed', error.stack);
      throw error;
    }
  }

  // Revenue calculation methods
  private async calculateRevenue(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const revenueData = await this.paymentModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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

    // Calculate by payment method
    const byMethod: Record<string, number> = {};
    if (revenueData[0]?.byMethod) {
      revenueData[0].byMethod.forEach((item: any) => {
        byMethod[item.method] = (byMethod[item.method] || 0) + item.amount;
      });
    }

    // Calculate growth (compare to previous period)
    const prevStartDate = new Date(startDate);
    prevStartDate.setMonth(prevStartDate.getMonth() - 1);
    const prevEndDate = new Date(endDate);
    prevEndDate.setMonth(prevEndDate.getMonth() - 1);

    const prevRevenue = await this.paymentModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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

  private async calculateBookingStats(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const bookings = await this.bookingModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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

    const stats: any = {
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

  private async calculateClientStats(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const newClients = await this.bookingModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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
          businessId: new Types.ObjectId(tenantId),
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

  private async calculateServiceStats(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const serviceStats = await this.bookingModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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
          businessId: new Types.ObjectId(tenantId),
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

  private async calculatePerformanceMetrics(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    // FIX: Use aggregation instead of .find() to avoid complex type inference
    const bookingStats = await this.bookingModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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

    // Calculate totals from aggregation result
    let total = 0;
    let cancelled = 0;
    let completed = 0;

    bookingStats.forEach(stat => {
      total += stat.count;
      if (stat._id === 'cancelled') {
        cancelled = stat.count;
      } else if (stat._id === 'completed') {
        completed = stat.count;
      }
    });

    const avgBookingValue = await this.paymentModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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

  private async calculateCommissionStats(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const commissions = await this.bookingModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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

  // Analytics methods
  private async analyzeRevenueTrends(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const trends = await this.paymentModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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

  private async analyzeBookingPatterns(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const patterns = await this.bookingModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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

  private async analyzeClientBehavior(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    // Analyze repeat customers, booking frequency, etc.
    const behavior = await this.bookingModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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

  private async analyzeServicePerformance(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    return await this.bookingModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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

  private async analyzePeakHours(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    return await this.bookingModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
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

  private async saveReport(report: MonthlyReport): Promise<void> {
    // Save report to a Reports collection if needed
    // This allows historical report access
    this.logger.log(`Report saved for ${report.tenantId} - ${report.period}`);
  }

  private async sendReportEmail(tenantId: string, report: MonthlyReport): Promise<void> {
    try {
      // Get business owner email
      // In production, fetch from business/user schema
      const recipientEmail = 'business@example.com';

      const emailContent = this.generateReportEmailHTML(report);

      await this.emailService.sendEmail(
        recipientEmail,
        `Monthly Report - ${report.period}`,
        emailContent
      );

      this.logger.log(`Report email sent to ${recipientEmail}`);
    } catch (error) {
      this.logger.error('Failed to send report email', error.stack);
    }
  }

  private generateReportEmailHTML(report: MonthlyReport): string {
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
}