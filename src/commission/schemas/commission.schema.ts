
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from "mongoose"

export type CommissionDocument = Commission & Document

@Schema()
export class CommissionRule {
  @Prop({ required: true })
  ruleName: string

  @Prop({ 
    required: true,
    enum: ['marketplace', 'direct_link', 'qr_code', 'business_website', 
           'google_search', 'social_media', 'referral', 'walk_in', 'phone']
  })
  sourceType: string

  @Prop({ required: true, default: 0 })
  commissionRate: number // Percentage

  @Prop({ required: true, default: true })
  isActive: boolean

  @Prop()
  description: string
}

@Schema()
export class BookingSourceTracking {
  @Prop({ 
    required: true,
    enum: ['marketplace', 'direct_link', 'qr_code', 'business_website', 
           'google_search', 'social_media', 'referral', 'walk_in', 'phone']
  })
  sourceType: string

  @Prop()
  sourceIdentifier: string // Unique ID for QR codes, tracking links

  @Prop()
  trackingCode: string // Generated tracking code

  @Prop()
  referralCode: string

  @Prop()
  utmSource: string

  @Prop()
  utmMedium: string

  @Prop()
  utmCampaign: string

  @Prop({ default: Date.now })
  trackedAt: Date

  @Prop()
  ipAddress: string

  @Prop()
  userAgent: string

  @Prop()
  referrerUrl: string
}

@Schema({ timestamps: true })
export class Commission {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  bookingId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Payment' })
  paymentId: Types.ObjectId

  @Prop({ type: BookingSourceTracking, required: true })
  sourceTracking: BookingSourceTracking

  @Prop({ required: true })
  bookingAmount: number

  @Prop({ required: true, default: false })
  isCommissionable: boolean

  @Prop({ default: 0 })
  commissionRate: number

  @Prop({ default: 0 })
  commissionAmount: number

  @Prop({ default: 0 })
  platformFee: number

  @Prop({ default: 0 })
  businessPayout: number

  @Prop({ required: true })
  commissionReason: string

  @Prop({ default: false })
  isFirstTimeClient: boolean

  @Prop({ default: false })
  isMarketplaceAcquired: boolean

  @Prop({ default: false })
  wasDisputed: boolean

  @Prop()
  disputeReason: string

  @Prop()
  disputeResolvedAt: Date

  @Prop({
    enum: ['pending', 'calculated', 'approved', 'paid', 'disputed', 'waived'],
    default: 'pending'
  })
  status: string

  @Prop({ default: Date.now })
  calculatedAt: Date

  @Prop()
  approvedAt: Date

  @Prop()
  paidAt: Date

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: Types.ObjectId

  @Prop()
  notes: string
}

export const CommissionSchema = SchemaFactory.createForClass(Commission)

// Indexes
CommissionSchema.index({ bookingId: 1 })
CommissionSchema.index({ businessId: 1 })
CommissionSchema.index({ clientId: 1 })
CommissionSchema.index({ status: 1 })
CommissionSchema.index({ isCommissionable: 1 })
CommissionSchema.index({ calculatedAt: 1 })
CommissionSchema.index({ 'sourceTracking.sourceType': 1 })