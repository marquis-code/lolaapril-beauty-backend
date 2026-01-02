import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type CancellationPolicyDocument = CancellationPolicy & Document

@Schema()
export class PolicyRule {
  @Prop({ required: true })
  hoursBeforeAppointment: number

  @Prop({ required: true, default: 0 })
  refundPercentage: number

  @Prop({ required: true, default: 0 })
  penaltyPercentage: number

  @Prop()
  description: string
}

@Schema({ timestamps: true })
export class CancellationPolicy {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ required: true })
  policyName: string

  @Prop({ required: true, default: false })
  requiresDeposit: boolean

  @Prop({ default: 0 })
  depositPercentage: number

  @Prop({ default: 0 })
  minimumDepositAmount: number

  @Prop({ required: true, default: 24 })
  cancellationWindowHours: number

  @Prop({ type: [PolicyRule], required: true })
  rules: PolicyRule[]

  @Prop({ default: true })
  allowSameDayCancellation: boolean

  @Prop({ default: 0 })
  sameDayRefundPercentage: number

  @Prop({ default: true })
  sendReminders: boolean

  @Prop({ default: [24, 2] })
  reminderHours: number[]

  @Prop({ default: 3 })
  maxNoShowsBeforeDeposit: number

  @Prop({ default: true })
  isActive: boolean

  @Prop({ type: [Types.ObjectId], ref: 'Service' })
  applicableServices: Types.ObjectId[]

  @Prop()
  description: string
}

export const CancellationPolicySchema = SchemaFactory.createForClass(CancellationPolicy)

CancellationPolicySchema.index({ businessId: 1 })
CancellationPolicySchema.index({ isActive: 1 })