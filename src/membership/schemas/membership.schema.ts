import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type MembershipDocument = Membership & Document

@Schema()
export class MembershipBenefit {
  @Prop({ required: true })
  benefitType: string // 'discount', 'free_service', 'priority_booking', 'exclusive_access'

  @Prop({ required: true })
  description: string

  @Prop()
  discountPercentage: number

  @Prop()
  freeServiceId: string

  @Prop()
  freeServiceName: string
}

@Schema()
export class MembershipTier {
  @Prop({ required: true })
  tierName: string

  @Prop({ required: true })
  tierLevel: number

  @Prop({ required: true })
  minimumSpend: number

  @Prop({ required: true })
  pointsMultiplier: number

  @Prop({ type: [MembershipBenefit], default: [] })
  benefits: MembershipBenefit[]

  @Prop({ required: true })
  tierColor: string
}

@Schema({ timestamps: true })
export class Membership {
  @Prop({ required: true })
  membershipName: string

  @Prop({ required: true })
  description: string

  @Prop({
    required: true,
    enum: ["points_based", "tier_based", "subscription", "prepaid"],
  })
  membershipType: string

  @Prop({ type: [MembershipTier], default: [] })
  tiers: MembershipTier[]

  @Prop({ default: 1 })
  pointsPerDollar: number

  @Prop({ default: 100 })
  pointsRedemptionValue: number // How many points = $1

  @Prop()
  subscriptionPrice: number

  @Prop()
  subscriptionDuration: number // in months

  @Prop({ type: [MembershipBenefit], default: [] })
  generalBenefits: MembershipBenefit[]

  @Prop({ default: true })
  isActive: boolean

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  createdBy: Types.ObjectId

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const MembershipSchema = SchemaFactory.createForClass(Membership)

// Add indexes
MembershipSchema.index({ membershipName: 1 })
MembershipSchema.index({ membershipType: 1 })
MembershipSchema.index({ isActive: 1 })
