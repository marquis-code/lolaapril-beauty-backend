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
