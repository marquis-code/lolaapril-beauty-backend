// ============================================================================
// ANALYTICS & REPORTING MODULE
// Solves: Fee Transparency & Financial Visibility Problems
// ============================================================================

// ============================================================================
// 1. FINANCIAL REPORT SCHEMA
// src/analytics/schemas/financial-report.schema.ts
// ============================================================================

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type FinancialReportDocument = FinancialReport & Document

@Schema()
export class RevenueBreakdown {
  @Prop({ required: true, default: 0 })
  grossRevenue: number

  @Prop({ required: true, default: 0 })
  platformCommissions: number

  @Prop({ required: true, default: 0 })
  processingFees: number

  @Prop({ required: true, default: 0 })
  refunds: number

  @Prop({ required: true, default: 0 })
  netRevenue: number

  @Prop({ required: true, default: 0 })
  businessPayout: number
}

@Schema()
export class CommissionBreakdown {
  @Prop({ required: true, default: 0 })
  marketplaceBookings: number

  @Prop({ required: true, default: 0 })
  marketplaceCommissions: number

  @Prop({ required: true, default: 0 })
  directBookings: number

  @Prop({ required: true, default: 0 })
  commissionSavings: number

  @Prop({ required: true, default: 0 })
  averageCommissionRate: number
}

@Schema()
export class SourceBreakdown {
  @Prop({ required: true })
  sourceType: string

  @Prop({ required: true, default: 0 })
  bookingCount: number

  @Prop({ required: true, default: 0 })
  revenue: number

  @Prop({ required: true, default: 0 })
  commissions: number

  @Prop({ required: true, default: 0 })
  netRevenue: number
}

@Schema({ timestamps: true })
export class FinancialReport {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ required: true })
  reportPeriod: string // 'daily', 'weekly', 'monthly', 'custom'

  @Prop({ required: true })
  startDate: Date

  @Prop({ required: true })
  endDate: Date

  @Prop({ type: RevenueBreakdown, required: true })
  revenue: RevenueBreakdown

  @Prop({ type: CommissionBreakdown, required: true })
  commissions: CommissionBreakdown

  @Prop({ type: [SourceBreakdown] })
  sourceBreakdown: SourceBreakdown[]

  @Prop({ required: true, default: 0 })
  totalBookings: number

  @Prop({ required: true, default: 0 })
  completedBookings: number

  @Prop({ required: true, default: 0 })
  cancelledBookings: number

  @Prop({ required: true, default: 0 })
  noShows: number

  @Prop({ required: true, default: 0 })
  averageBookingValue: number

  @Prop({ default: Date.now })
  generatedAt: Date
}

export const FinancialReportSchema = SchemaFactory.createForClass(FinancialReport)

FinancialReportSchema.index({ businessId: 1, reportPeriod: 1 })
FinancialReportSchema.index({ startDate: 1, endDate: 1 })
FinancialReportSchema.index({ generatedAt: -1 })

// // ============================================================================
// // 2. ANALYTICS SERVICE
// // src/analytics/services/analytics.service.ts
// // ============================================================================

// import { Injectable, Logger } from '@nestjs/common'
// import { InjectModel } from '@nestjs/mongoose'
// import { Model, Types } from 'mongoose'
// import { FinancialReport, FinancialReportDocument } from '../schemas/financial-report.schema'
// import { Booking, BookingDocument } from '../../booking/schemas/booking.schema'
// import { Payment, PaymentDocument } from '../../payment/schemas/payment.schema'
// import { Commission, CommissionDocument } from '../../commission/schemas/commission.schema'

// @Injectable()
// export class AnalyticsService {
//   private readonly logger = new Logger(AnalyticsService.name)

//   constructor(
//     @InjectModel(FinancialReport.name)
//     private reportModel: Model<FinancialReportDocument>,
//     @InjectModel(Booking.name)
//     private bookingModel: Model<BookingDocument>,
//     @InjectModel(Payment.name)
//     private paymentModel: Model<PaymentDocument>,
//     @InjectModel(Commission.name)
//     private commissionModel: Model<CommissionDocument>
//   ) {}

//   /**
//    * Generate comprehensive financial report
//    */
//   async generateFinancialReport(
//     businessId: string,
//     startDate: Date,
//     endDate: Date,
//     reportPeriod: string = 'custom'
//   ): Promise<FinancialReportDocument> {
//     this.logger.log(
//       `Generating financial report for business ${businessId} from ${startDate} to ${endDate}`
//     )

//     // Calculate all metrics
//     const [
//       revenueBreakdown,
//       commissionBreakdown,
//       sourceBreakdown,
//       bookingStats
//     ] = await Promise.all([
//       this.calculateRevenueBreakdown(businessId, startDate, endDate),
//       this.calculateCommissionBreakdown(businessId, startDate, endDate),
//       this.calculateSourceBreakdown(businessId, startDate, endDate),
//       this.calculateBookingStats(businessId, startDate, endDate)
//     ])

//     // Create report
//     const report = await this.reportModel.create({
//       businessId: new Types.ObjectId(businessId),
//       reportPeriod,
//       startDate,
//       endDate,
//       revenue: revenueBreakdown,
//       commissions: commissionBreakdown,
//       sourceBreakdown,
//       totalBookings: bookingStats.total,
//       completedBookings: bookingStats.completed,
//       cancelledBookings: bookingStats.cancelled,
//       noShows: bookingStats.noShows,
//       averageBookingValue: bookingStats.averageValue,
//       generatedAt: new Date()
//     })

//     this.logger.log(`Financial report generated: ${report._id}`)
//     return report
//   }

//   /**
//    * Calculate detailed revenue breakdown
//    */
//   private async calculateRevenueBreakdown(
//     businessId: string,
//     startDate: Date,
//     endDate: Date
//   ): Promise<any> {
//     const payments = await this.paymentModel.aggregate([
//       {
//         $match: {
//           businessId: new Types.ObjectId(businessId),
//           createdAt: { $gte: startDate, $lte: endDate },
//           status: 'completed'
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           grossRevenue: { $sum: '$totalAmount' },
//           processingFees: { $sum: '$processingFee' }
//         }
//       }
//     ]).exec()

//     const commissions = await this.commissionModel.aggregate([
//       {
//         $match: {
//           businessId: new Types.ObjectId(businessId),
//           calculatedAt: { $gte: startDate, $lte: endDate }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           platformCommissions: { $sum: '$commissionAmount' }
//         }
//       }
//     ]).exec()

//     const refunds = await this.paymentModel.aggregate([
//       {
//         $match: {
//           businessId: new Types.ObjectId(businessId),
//           createdAt: { $gte: startDate, $lte: endDate },
//           status: 'refunded'
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           totalRefunds: { $sum: '$totalAmount' }
//         }
//       }
//     ]).exec()

//     const grossRevenue = payments[0]?.grossRevenue || 0
//     const platformCommissions = commissions[0]?.platformCommissions || 0
//     const processingFees = payments[0]?.processingFees || 0
//     const totalRefunds = refunds[0]?.totalRefunds || 0

//     const netRevenue = grossRevenue - platformCommissions - processingFees - totalRefunds
//     const businessPayout = netRevenue

//     return {
//       grossRevenue,
//       platformCommissions,
//       processingFees,
//       refunds: totalRefunds,
//       netRevenue,
//       businessPayout
//     }
//   }

//   /**
//    * Calculate commission breakdown by source
//    */
//   private async calculateCommissionBreakdown(
//     businessId: string,
//     startDate: Date,
//     endDate: Date
//   ): Promise<any> {
//     const result = await this.commissionModel.aggregate([
//       {
//         $match: {
//           businessId: new Types.ObjectId(businessId),
//           calculatedAt: { $gte: startDate, $lte: endDate }
//         }
//       },
//       {
//         $group: {
//           _id: '$isCommissionable',
//           count: { $sum: 1 },
//           totalCommissions: { $sum: '$commissionAmount' },
//           totalRevenue: { $sum: '$bookingAmount' },
//           averageRate: { $avg: '$commissionRate' }
//         }
//       }
//     ]).exec()

//     const commissionableData = result.find(r => r._id === true) || {
//       count: 0,
//       totalCommissions: 0,
//       totalRevenue: 0,
//       averageRate: 0
//     }

//     const nonCommissionableData = result.find(r => r._id === false) || {
//       count: 0,
//       totalCommissions: 0,
//       totalRevenue: 0,
//       averageRate: 0
//     }

//     return {
//       marketplaceBookings: commissionableData.count,
//       marketplaceCommissions: commissionableData.totalCommissions,
//       directBookings: nonCommissionableData.count,
//       commissionSavings: nonCommissionableData.totalRevenue,
//       averageCommissionRate: commissionableData.averageRate
//     }
//   }

//   /**
//    * Calculate booking breakdown by source
//    */
//   private async calculateSourceBreakdown(
//     businessId: string,
//     startDate: Date,
//     endDate: Date
//   ): Promise<any[]> {
//     return await this.commissionModel.aggregate([
//       {
//         $match: {
//           businessId: new Types.ObjectId(businessId),
//           calculatedAt: { $gte: startDate, $lte: endDate }
//         }
//       },
//       {
//         $group: {
//           _id: '$sourceTracking.sourceType',
//           bookingCount: { $sum: 1 },
//           revenue: { $sum: '$bookingAmount' },
//           commissions: { $sum: '$commissionAmount' }
//         }
//       },
//       {
//         $project: {
//           sourceType: '$_id',
//           bookingCount: 1,
//           revenue: 1,
//           commissions: 1,
//           netRevenue: { $subtract: ['$revenue', '$commissions'] }
//         }
//       },
//       { $sort: { revenue: -1 } }
//     ]).exec()
//   }

//   /**
//    * Calculate booking statistics
//    */
//   private async calculateBookingStats(
//     businessId: string,
//     startDate: Date,
//     endDate: Date
//   ): Promise<any> {
//     const stats = await this.bookingModel.aggregate([
//       {
//         $match: {
//           businessId: new Types.ObjectId(businessId),
//           createdAt: { $gte: startDate, $lte: endDate }
//         }
//       },
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 },
//           totalValue: { $sum: '$estimatedTotal' }
//         }
//       }
//     ]).exec()

//     const total = stats.reduce((sum, s) => sum + s.count, 0)
//     const completed = stats.find(s => s._id === 'confirmed')?.count || 0
//     const cancelled = stats.find(s => s._id === 'cancelled')?.count || 0
//     const noShows = stats.find(s => s._id === 'no_show')?.count || 0
//     const totalValue = stats.reduce((sum, s) => sum + s.totalValue, 0)
//     const averageValue = total > 0 ? totalValue / total : 0

//     return {
//       total,
//       completed,
//       cancelled,
//       noShows,
//       averageValue
//     }
//   }

//   /**
//    * Get real-time dashboard metrics
//    */
//   async getDashboardMetrics(businessId: string): Promise<any> {
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
//     const tomorrow = new Date(today)
//     tomorrow.setDate(tomorrow.getDate() + 1)

//     // Today's metrics
//     const todayMetrics = await this.generateFinancialReport(
//       businessId,
//       today,
//       tomorrow,
//       'daily'
//     )

//     // Month-to-date metrics
//     const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
//     const monthMetrics = await this.generateFinancialReport(
//       businessId,
//       monthStart,
//       new Date(),
//       'monthly'
//     )

//     // Pending bookings
//     const pendingBookings = await this.bookingModel.countDocuments({
//       businessId: new Types.ObjectId(businessId),
//       status: 'pending'
//     }).exec()

//     // Upcoming appointments (next 7 days)
//     const nextWeek = new Date()
//     nextWeek.setDate(nextWeek.getDate() + 7)
    
//     const upcomingAppointments = await this.bookingModel.countDocuments({
//       businessId: new Types.ObjectId(businessId),
//       status: 'confirmed',
//       preferredDate: { $gte: today, $lte: nextWeek }
//     }).exec()

//     return {
//       today: {
//         revenue: todayMetrics.revenue.grossRevenue,
//         bookings: todayMetrics.totalBookings,
//         commissions: todayMetrics.commissions.marketplaceCommissions,
//         netRevenue: todayMetrics.revenue.netRevenue
//       },
//       monthToDate: {
//         revenue: monthMetrics.revenue.grossRevenue,
//         bookings: monthMetrics.totalBookings,
//         commissions: monthMetrics.commissions.marketplaceCommissions,
//         netRevenue: monthMetrics.revenue.netRevenue,
//         commissionSavings: monthMetrics.commissions.commissionSavings
//       },
//       pending: {
//         bookings: pendingBookings,
//         appointments: upcomingAppointments
//       },
//       trends: {
//         commissionRate: monthMetrics.commissions.averageCommissionRate,
//         directBookingPercentage: monthMetrics.totalBookings > 0
//           ? (monthMetrics.commissions.directBookings / monthMetrics.totalBookings) * 100
//           : 0
//       }
//     }
//   }

//   /**
//    * Get fee comparison vs competitors (showing Fresha-like platforms)
//    */
//   async getFeeComparison(businessId: string): Promise<any> {
//     const monthStart = new Date()
//     monthStart.setMonth(monthStart.getMonth() - 1)
    
//     const report = await this.generateFinancialReport(
//       businessId,
//       monthStart,
//       new Date(),
//       'monthly'
//     )

//     // Calculate what they would pay with different platforms
//     const grossRevenue = report.revenue.grossRevenue

//     return {
//       yourPlatform: {
//         name: 'Your Platform (Lola Beauty)',
//         grossRevenue,
//         marketplaceCommissions: report.commissions.marketplaceCommissions,
//         directBookingCommissions: 0,
//         netRevenue: report.revenue.netRevenue,
//         commissionRate: report.commissions.averageCommissionRate
//       },
//       competitors: [
//         {
//           name: 'Fresha (Typical)',
//           grossRevenue,
//           marketplaceCommissions: grossRevenue * 0.20, // 20% on ALL bookings
//           directBookingCommissions: grossRevenue * 0.20, // They charge even on direct!
//           netRevenue: grossRevenue * 0.80,
//           commissionRate: 20,
//           note: 'Charges commission even on QR codes and direct links'
//         },
//         {
//           name: 'Booksy',
//           grossRevenue,
//           marketplaceCommissions: grossRevenue * 0.14,
//           directBookingCommissions: grossRevenue * 0.14,
//           netRevenue: grossRevenue * 0.86,
//           commissionRate: 14,
//           note: 'Lower rate but charges on all bookings'
//         }
//       ],
//       savings: {
//         vsFresha: (grossRevenue * 0.20) - report.commissions.marketplaceCommissions,
//         vsBooksy: (grossRevenue * 0.14) - report.commissions.marketplaceCommissions,
//         percentage: report.commissions.marketplaceCommissions > 0
//           ? ((grossRevenue * 0.20 - report.commissions.marketplaceCommissions) / (grossRevenue * 0.20)) * 100
//           : 100
//       }
//     }
//   }

//   /**
//    * Export report to CSV
//    */
//   async exportReportToCSV(reportId: string): Promise<string> {
//     const report = await this.reportModel.findById(reportId).lean().exec()
    
//     if (!report) {
//       throw new Error('Report not found')
//     }

//     // Create CSV content
//     const csv = [
//       ['Financial Report', `${report.startDate} to ${report.endDate}`],
//       [],
//       ['Revenue Breakdown'],
//       ['Gross Revenue', report.revenue.grossRevenue],
//       ['Platform Commissions', report.revenue.platformCommissions],
//       ['Processing Fees', report.revenue.processingFees],
//       ['Refunds', report.revenue.refunds],
//       ['Net Revenue', report.revenue.netRevenue],
//       ['Business Payout', report.revenue.businessPayout],
//       [],
//       ['Commission Breakdown'],
//       ['Marketplace Bookings', report.commissions.marketplaceBookings],
//       ['Marketplace Commissions', report.commissions.marketplaceCommissions],
//       ['Direct Bookings', report.commissions.directBookings],
//       ['Commission Savings', report.commissions.commissionSavings],
//       ['Average Commission Rate', `${report.commissions.averageCommissionRate}%`],
//       [],
//       ['Source Breakdown'],
//       ['Source Type', 'Bookings', 'Revenue', 'Commissions', 'Net Revenue'],
//       ...report.sourceBreakdown.map(s => [
//         s.sourceType,
//         s.bookingCount,
//         s.revenue,
//         s.commissions,
//         s.netRevenue
//       ])
//     ]

//     return csv.map(row => row.join(',')).join('\n')
//   }
// }

// // ============================================================================
// // 3. ANALYTICS CONTROLLER
// // src/analytics/controllers/analytics.controller.ts
// // ============================================================================

// import {
//   Controller,
//   Get,
//   Post,
//   Query,
//   Param,
//   UseGuards,
//   Request,
//   Res,
//   HttpStatus
// } from '@nestjs/common'
// import { Response } from 'express'
// import { ApiTags, ApiOperation } from '@nestjs/swagger'
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
// import { TenantGuard } from '../../tenant/guards/tenant.guard'
// import { AnalyticsService } from '../services/analytics.service'

// @ApiTags('Analytics')
// @Controller('analytics')
// @UseGuards(TenantGuard, JwtAuthGuard)
// export class AnalyticsController {
//   constructor(private analyticsService: AnalyticsService) {}

//   @Get('dashboard')
//   @ApiOperation({ summary: 'Get real-time dashboard metrics' })
//   async getDashboard(@Request() req: any) {
//     try {
//       const businessId = req.tenant.businessId
//       const metrics = await this.analyticsService.getDashboardMetrics(businessId)

//       return {
//         success: true,
//         data: metrics,
//         message: 'Dashboard metrics retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to retrieve dashboard metrics'
//       }
//     }
//   }

//   @Post('reports/generate')
//   @ApiOperation({ summary: 'Generate financial report' })
//   async generateReport(
//     @Query('startDate') startDate: string,
//     @Query('endDate') endDate: string,
//     @Query('period') period: string,
//     @Request() req: any
//   ) {
//     try {
//       const businessId = req.tenant.businessId

//       const report = await this.analyticsService.generateFinancialReport(
//         businessId,
//         new Date(startDate),
//         new Date(endDate),
//         period || 'custom'
//       )

//       return {
//         success: true,
//         data: report,
//         message: 'Financial report generated successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to generate financial report'
//       }
//     }
//   }

//   @Get('reports/:reportId')
//   @ApiOperation({ summary: 'Get financial report by ID' })
//   async getReport(
//     @Param('reportId') reportId: string,
//     @Request() req: any
//   ) {
//     try {
//       const report = await this.analyticsService.getReport(reportId)

//       return {
//         success: true,
//         data: report,
//         message: 'Report retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to retrieve report'
//       }
//     }
//   }

//   @Get('reports/:reportId/export')
//   @ApiOperation({ summary: 'Export report to CSV' })
//   async exportReport(
//     @Param('reportId') reportId: string,
//     @Res() res: Response
//   ) {
//     try {
//       const csv = await this.analyticsService.exportReportToCSV(reportId)

//       res.setHeader('Content-Type', 'text/csv')
//       res.setHeader('Content-Disposition', `attachment; filename="report-${reportId}.csv"`)
//       res.send(csv)
//     } catch (error) {
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         error: error.message,
//         message: 'Failed to export report'
//       })
//     }
//   }

//   @Get('fee-comparison')
//   @ApiOperation({ summary: 'Compare fees vs competitors' })
//   async getFeeComparison(@Request() req: any) {
//     try {
//       const businessId = req.tenant.businessId
//       const comparison = await this.analyticsService.getFeeComparison(businessId)

//       return {
//         success: true,
//         data: comparison,
//         message: 'Fee comparison retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to retrieve fee comparison'
//       }
//     }
//   }

//   @Get('commission-breakdown')
//   @ApiOperation({ summary: 'Get detailed commission breakdown' })
//   async getCommissionBreakdown(
//     @Query('startDate') startDate: string,
//     @Query('endDate') endDate: string,
//     @Request() req: any
//   ) {
//     try {
//       const businessId = req.tenant.businessId

//       const breakdown = await this.analyticsService.getCommissionBreakdown(
//         businessId,
//         new Date(startDate),
//         new Date(endDate)
//       )

//       return {
//         success: true,
//         data: breakdown,
//         message: 'Commission breakdown retrieved successfully'
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//         message: 'Failed to retrieve commission breakdown'
//       }
//     }
//   }
// }

// // Continue in next artifact...