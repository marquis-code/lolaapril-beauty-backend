// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
// import { Document, Types } from 'mongoose'

// export type CancellationPolicyDocument = CancellationPolicy & Document

// @Schema()
// export class PolicyRule {
//   @Prop({ required: true })
//   hoursBeforeAppointment: number

//   @Prop({ required: true, default: 0 })
//   refundPercentage: number

//   @Prop({ required: true, default: 0 })
//   penaltyPercentage: number

//   @Prop()
//   description: string
// }

// @Schema({ timestamps: true })
// export class CancellationPolicy {
//   @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
//   businessId: Types.ObjectId

//   @Prop({ required: true })
//   policyName: string

//   @Prop({ required: true, default: false })
//   requiresDeposit: boolean

//   @Prop({ default: 0 })
//   depositPercentage: number

//   @Prop({ default: 0 })
//   minimumDepositAmount: number

//   @Prop({ required: true, default: 24 })
//   cancellationWindowHours: number

//   @Prop({ type: [PolicyRule], required: true })
//   rules: PolicyRule[]

//   @Prop({ default: true })
//   allowSameDayCancellation: boolean

//   @Prop({ default: 0 })
//   sameDayRefundPercentage: number

//   @Prop({ default: true })
//   sendReminders: boolean

//   @Prop({ default: [24, 2] })
//   reminderHours: number[]

//   @Prop({ default: 3 })
//   maxNoShowsBeforeDeposit: number

//   @Prop({ default: true })
//   isActive: boolean

//   @Prop({ type: [Types.ObjectId], ref: 'Service' })
//   applicableServices: Types.ObjectId[]

//   @Prop()
//   description: string
// }

// export const CancellationPolicySchema = SchemaFactory.createForClass(CancellationPolicy)

// CancellationPolicySchema.index({ businessId: 1 })
// CancellationPolicySchema.index({ isActive: 1 })

// ==================== cancellation-policy.schema.ts ====================
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type CancellationPolicyDocument = CancellationPolicy & Document;

// Define PolicyRule as a plain interface instead of a decorated class
export interface PolicyRule {
  hoursBeforeAppointment: number;
  refundPercentage: number;
  penaltyPercentage: number;
  description?: string;
}

// Create a raw schema for PolicyRule
const PolicyRuleSchema = new MongooseSchema({
  hoursBeforeAppointment: { type: Number, required: true },
  refundPercentage: { type: Number, required: true, default: 0 },
  penaltyPercentage: { type: Number, required: true, default: 0 },
  description: { type: String }
}, { _id: false });

@Schema({ timestamps: true })
export class CancellationPolicy {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId;

  @Prop({ required: true })
  policyName: string;

  @Prop({ required: true, default: false })
  requiresDeposit: boolean;

  @Prop({ default: 0 })
  depositPercentage: number;

  @Prop({ default: 0 })
  minimumDepositAmount: number;

  @Prop({ required: true, default: 24 })
  cancellationWindowHours: number;

  @Prop({ type: [PolicyRuleSchema], required: true })
  rules: PolicyRule[];

  @Prop({ default: true })
  allowSameDayCancellation: boolean;

  @Prop({ default: 0 })
  sameDayRefundPercentage: number;

  @Prop({ default: true })
  sendReminders: boolean;

  @Prop({ default: [24, 2] })
  reminderHours: number[];

  @Prop({ default: 3 })
  maxNoShowsBeforeDeposit: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Service' })
  applicableServices: Types.ObjectId[];

  @Prop()
  description: string;
}

export const CancellationPolicySchema = SchemaFactory.createForClass(CancellationPolicy);

CancellationPolicySchema.index({ businessId: 1 });
CancellationPolicySchema.index({ isActive: 1 });
