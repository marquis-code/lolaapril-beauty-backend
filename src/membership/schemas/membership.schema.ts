import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type MembershipDocument = Membership & Document

@Schema({ timestamps: true })
export class Membership {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  price: number

  @Prop({ required: true })
  currency: string

  @Prop({ required: true })
  duration: number // in days

  @Prop({ type: [Types.ObjectId], ref: "Service" })
  includedServices: Types.ObjectId[]

  @Prop({ default: 0 })
  discountPercentage: number

  @Prop({ default: "active", enum: ["active", "inactive"] })
  status: string

  @Prop()
  maxBookings: number

  @Prop({ default: false })
  autoRenewal: boolean

  @Prop({ type: Object })
  benefits: {
    priorityBooking: boolean
    discountOnProducts: number
    freeServices: string[]
    additionalPerks: string[]
  }
}

export const MembershipSchema = SchemaFactory.createForClass(Membership)

@Schema({ timestamps: true })
export class ClientMembership {
  @Prop({ type: Types.ObjectId, ref: "Client", required: true })
  clientId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Membership", required: true })
  membershipId: Types.ObjectId

  @Prop({ required: true })
  startDate: Date

  @Prop({ required: true })
  endDate: Date

  @Prop({ default: "active", enum: ["active", "expired", "cancelled", "suspended"] })
  status: string

  @Prop({ default: 0 })
  usedBookings: number

  @Prop({ type: [{ date: Date, serviceId: Types.ObjectId, bookingId: Types.ObjectId }] })
  usageHistory: Array<{
    date: Date
    serviceId: Types.ObjectId
    bookingId: Types.ObjectId
  }>

  @Prop()
  paymentId: Types.ObjectId

  @Prop({ default: false })
  autoRenewal: boolean
}

export const ClientMembershipSchema = SchemaFactory.createForClass(ClientMembership)

ClientMembershipSchema.index({ clientId: 1, status: 1 })
ClientMembershipSchema.index({ endDate: 1 })
