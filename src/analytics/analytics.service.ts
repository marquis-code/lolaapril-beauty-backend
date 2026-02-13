import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { FinancialReport, FinancialReportDocument } from './schemas/financial-report.schema'
import { Booking, BookingDocument } from '../booking/schemas/booking.schema'
import { Payment, PaymentDocument } from '../payment/schemas/payment.schema'
import { Commission, CommissionDocument } from '../commission/schemas/commission.schema'
import { TrafficAnalytics, TrafficAnalyticsDocument } from './schemas/traffic-analytics.schema'

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name)

  constructor(
    @InjectModel(FinancialReport.name)
    private reportModel: Model<FinancialReportDocument>,
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    @InjectModel('Commission')
    private commissionModel: Model<CommissionDocument>,
    @InjectModel(TrafficAnalytics.name)
    private trafficModel: Model<TrafficAnalyticsDocument>
  ) { }

  async generateFinancialReport(
    businessId: string,
    startDate: Date,
    endDate: Date,
    reportPeriod: string = 'custom'
  ): Promise<any> {
    this.logger.log(
      `Generating financial report for business ${businessId} from ${startDate} to ${endDate}`
    )

    const [
      revenueBreakdown,
      commissionBreakdown,
      sourceBreakdown,
      bookingStats
    ] = await Promise.all([
      this.calculateRevenueBreakdown(businessId, startDate, endDate),
      this.calculateCommissionBreakdown(businessId, startDate, endDate),
      this.calculateSourceBreakdown(businessId, startDate, endDate),
      this.calculateBookingStats(businessId, startDate, endDate)
    ])

    const report = await this.reportModel.create({
      businessId: new Types.ObjectId(businessId),
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
    })

    this.logger.log(`Financial report generated: ${report._id}`)

    return report as any
  }

  /**
   * Get financial report by ID
   */
  async getReport(reportId: string): Promise<FinancialReportDocument> {
    const report = await this.reportModel.findById(reportId).exec()

    if (!report) {
      throw new Error('Report not found')
    }

    return report as any
  }

  /**
   * Get detailed commission breakdown
   */
  async getCommissionBreakdown(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const [commissionData, sourceData] = await Promise.all([
      this.calculateCommissionBreakdown(businessId, startDate, endDate),
      this.calculateSourceBreakdown(businessId, startDate, endDate)
    ])

    // Get additional metrics
    const totalCommissions = await this.commissionModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId),
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
    ]).exec()

    const metrics = totalCommissions[0] || {
      totalAmount: 0,
      totalBookings: 0,
      averageCommission: 0
    }

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
    }
  }

  /**
   * Calculate detailed revenue breakdown
   */
  private async calculateRevenueBreakdown(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const payments = await this.paymentModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId),
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
    ]).exec()

    const commissions = await this.commissionModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId),
          calculatedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          platformCommissions: { $sum: '$commissionAmount' }
        }
      }
    ]).exec()

    const refunds = await this.paymentModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId),
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
    ]).exec()

    const grossRevenue = payments[0]?.grossRevenue || 0
    const platformCommissions = commissions[0]?.platformCommissions || 0
    const processingFees = payments[0]?.processingFees || 0
    const totalRefunds = refunds[0]?.totalRefunds || 0

    const netRevenue = grossRevenue - platformCommissions - processingFees - totalRefunds
    const businessPayout = netRevenue

    return {
      grossRevenue,
      platformCommissions,
      processingFees,
      refunds: totalRefunds,
      netRevenue,
      businessPayout
    }
  }

  /**
   * Calculate commission breakdown by source
   */
  private async calculateCommissionBreakdown(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const result = await this.commissionModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId),
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
    ]).exec()

    const commissionableData = result.find(r => r._id === true) || {
      count: 0,
      totalCommissions: 0,
      totalRevenue: 0,
      averageRate: 0
    }

    const nonCommissionableData = result.find(r => r._id === false) || {
      count: 0,
      totalCommissions: 0,
      totalRevenue: 0,
      averageRate: 0
    }

    return {
      marketplaceBookings: commissionableData.count,
      marketplaceCommissions: commissionableData.totalCommissions,
      directBookings: nonCommissionableData.count,
      commissionSavings: nonCommissionableData.totalRevenue,
      averageCommissionRate: commissionableData.averageRate
    }
  }

  /**
   * Calculate booking breakdown by source
   */
  private async calculateSourceBreakdown(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    return await this.commissionModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId),
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
    ]).exec()
  }

  /**
   * Calculate booking statistics
   */
  private async calculateBookingStats(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const stats = await this.bookingModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId),
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
    ]).exec()

    const total = stats.reduce((sum, s) => sum + s.count, 0)
    const completed = stats.find(s => s._id === 'confirmed')?.count || 0
    const cancelled = stats.find(s => s._id === 'cancelled')?.count || 0
    const noShows = stats.find(s => s._id === 'no_show')?.count || 0
    const totalValue = stats.reduce((sum, s) => sum + s.totalValue, 0)
    const averageValue = total > 0 ? totalValue / total : 0

    return {
      total,
      completed,
      cancelled,
      noShows,
      averageValue
    }
  }

  /**
   * Get real-time dashboard metrics
   */
  async getDashboardMetrics(businessId: string): Promise<any> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Today's metrics
    const todayMetrics = await this.generateFinancialReport(
      businessId,
      today,
      tomorrow,
      'daily'
    )

    // Month-to-date metrics
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthMetrics = await this.generateFinancialReport(
      businessId,
      monthStart,
      new Date(),
      'monthly'
    )

    // Pending bookings
    const pendingBookings = await this.bookingModel.countDocuments({
      businessId: new Types.ObjectId(businessId),
      status: 'pending'
    }).exec()

    // Upcoming appointments (next 7 days)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    const upcomingAppointments = await this.bookingModel.countDocuments({
      businessId: new Types.ObjectId(businessId),
      status: 'confirmed',
      preferredDate: { $gte: today, $lte: nextWeek }
    }).exec()

    // Today's traffic
    const todayTraffic = await this.getTrafficOverview(businessId, today, tomorrow)

    // Month-to-date traffic
    const monthTraffic = await this.getTrafficOverview(businessId, monthStart, new Date())

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
    }
  }

  /**
   * Get fee comparison vs competitors (showing Fresha-like platforms)
   */
  async getFeeComparison(businessId: string): Promise<any> {
    const monthStart = new Date()
    monthStart.setMonth(monthStart.getMonth() - 1)

    const report = await this.generateFinancialReport(
      businessId,
      monthStart,
      new Date(),
      'monthly'
    )

    // Calculate what they would pay with different platforms
    const grossRevenue = report.revenue.grossRevenue

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
    }
  }

  /**
   * Export report to CSV
   */
  async exportReportToCSV(reportId: string): Promise<string> {
    const report = await this.reportModel.findById(reportId).exec()

    if (!report) {
      throw new Error('Report not found')
    }

    // Convert to plain object manually to avoid .lean() type issues
    const plainReport: any = {
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
    }

    // Create CSV content
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
      ...plainReport.sourceBreakdown.map((s: any) => [
        s.sourceType,
        s.bookingCount,
        s.revenue,
        s.commissions,
        s.netRevenue
      ])
    ]

    return csv.map(row => row.join(',')).join('\n')
  }

  // ================== TRAFFIC ANALYTICS ==================

  /**
   * Track a traffic event (page view, click, etc.)
   */
  async trackTraffic(data: {
    businessId: string
    visitorId: string
    sessionId: string
    pagePath: string
    pageTitle?: string
    referrer?: string
    eventType?: string
    userAgent: {
      browser: string
      os: string
      device: string
      source: string
    }
    metadata?: Record<string, any>
  }): Promise<void> {
    try {
      await this.trafficModel.create({
        ...data,
        businessId: new Types.ObjectId(data.businessId),
      })
    } catch (error) {
      this.logger.error(`Error tracking traffic: ${error.message}`)
    }
  }

  /**
   * Get traffic overview (visits, sessions, bounce rate)
   */
  async getTrafficOverview(businessId: string, startDate: Date, endDate: Date): Promise<any> {
    const [pageViews, uniqueVisitors, totalSessions] = await Promise.all([
      this.trafficModel.countDocuments({
        businessId: new Types.ObjectId(businessId),
        timestamp: { $gte: startDate, $lte: endDate },
        eventType: 'page_view',
      }),
      this.trafficModel.distinct('visitorId', {
        businessId: new Types.ObjectId(businessId),
        timestamp: { $gte: startDate, $lte: endDate },
      }),
      this.trafficModel.distinct('sessionId', {
        businessId: new Types.ObjectId(businessId),
        timestamp: { $gte: startDate, $lte: endDate },
      }),
    ])

    return {
      pageViews,
      uniqueVisitors: uniqueVisitors.length,
      totalSessions: totalSessions.length,
      avgPageViewsPerSession: totalSessions.length > 0 ? pageViews / totalSessions.length : 0,
    }
  }

  /**
   * Get traffic breakdown by device, OS, browser, or page
   */
  async getTrafficBreakdown(
    businessId: string,
    startDate: Date,
    endDate: Date,
    groupBy: 'device' | 'os' | 'browser' | 'page' = 'page'
  ): Promise<any[]> {
    const groupField = groupBy === 'page' ? '$pagePath' : `$userAgent.${groupBy}`

    return await this.trafficModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId),
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
    ]).exec()
  }
}