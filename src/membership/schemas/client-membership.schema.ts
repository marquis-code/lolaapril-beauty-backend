import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type ClientMembershipDocument = ClientMembership & Document

@Schema()
export class PointsTransaction {
  @Prop({ required: true })
  transactionType: string // 'earned', 'redeemed', 'expired', 'bonus'

  @Prop({ required: true })
  points: number

  @Prop({ required: true })
  description: string

  @Prop({ type: Types.ObjectId, ref: "Sale" })
  saleId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Appointment" })
  appointmentId: Types.ObjectId

  @Prop({ default: Date.now })
  transactionDate: Date
}

@Schema({ timestamps: true })
export class ClientMembership {
  @Prop({ type: Types.ObjectId, ref: "Client", required: true })
  clientId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Membership", required: true })
  membershipId: Types.ObjectId

  @Prop({ required: true })
  membershipNumber: string

  @Prop({ required: true })
  joinDate: Date

  @Prop()
  expiryDate: Date

  @Prop({ default: 0 })
  totalPoints: number

  @Prop({ default: 0 })
  totalSpent: number

  @Prop()
  currentTier: string

  @Prop({ default: 0 })
  tierProgress: number

  @Prop({ type: [PointsTransaction], default: [] })
  pointsHistory: PointsTransaction[]

  @Prop({
    required: true,
    enum: ["active", "inactive", "expired", "suspended"],
    default: "active",
  })
  status: string

  @Prop()
  lastActivity: Date

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const ClientMembershipSchema = SchemaFactory.createForClass(ClientMembership)

// Add indexes
ClientMembershipSchema.index({ clientId: 1 })
ClientMembershipSchema.index({ membershipId: 1 })
ClientMembershipSchema.index({ membershipNumber: 1 })
ClientMembershipSchema.index({ status: 1 })
ClientMembershipSchema.index({ joinDate: -1 })
