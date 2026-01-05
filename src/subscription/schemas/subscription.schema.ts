import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type SubscriptionDocument = Subscription & Document

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({
    required: true,
    enum: ['trial', 'basic', 'standard', 'premium', 'enterprise']
  })
  planType: string

  @Prop({ required: true })
  planName: string

  @Prop({ required: true })
  monthlyPrice: number

  @Prop({ required: true })
  yearlyPrice: number

  @Prop({
    required: true,
    enum: ['monthly', 'yearly']
  })
  billingCycle: string

  @Prop({ required: true })
  startDate: Date

  @Prop({ required: true })
  endDate: Date

  @Prop({ required: true })
  nextBillingDate: Date

  @Prop({
    required: true,
    enum: ['active', 'cancelled', 'expired', 'past_due'],
    default: 'active'
  })
  status: string

  @Prop({
    type: {
      maxStaff: Number,
      maxServices: Number,
      maxAppointmentsPerMonth: Number,
      maxStorageGB: Number,
      features: {
        onlineBooking: Boolean,
        analytics: Boolean,
        marketing: Boolean,
        inventory: Boolean,
        multiLocation: Boolean,
        apiAccess: Boolean,
        customBranding: Boolean,
        advancedReports: Boolean
      }
    },
    required: true
  })
  limits: {
    maxStaff: number
    maxServices: number
    maxAppointmentsPerMonth: number
    maxStorageGB: number
    features: {
      onlineBooking: boolean
      analytics: boolean
      marketing: boolean
      inventory: boolean
      multiLocation: boolean
      apiAccess: boolean
      customBranding: boolean
      advancedReports: boolean
    }
  }

  @Prop()
  trialDays: number

  @Prop({ default: false })
  autoRenew: boolean

  @Prop()
  cancellationDate: Date

  @Prop()
  cancellationReason: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)

// Indexes
SubscriptionSchema.index({ businessId: 1 })
SubscriptionSchema.index({ status: 1 })
SubscriptionSchema.index({ endDate: 1 })
SubscriptionSchema.index({ planType: 1 })
