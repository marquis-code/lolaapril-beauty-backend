import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type VoucherDocument = Voucher & Document

@Schema({ timestamps: true })
export class Voucher {
  @Prop({ required: true, unique: true })
  code: string

  @Prop({ required: true })
  title: string

  @Prop()
  description: string

  @Prop({ required: true, enum: ["percentage", "fixed"] })
  discountType: string

  @Prop({ required: true })
  discountValue: number

  @Prop()
  minOrderAmount: number

  @Prop()
  maxDiscountAmount: number

  @Prop({ required: true })
  validFrom: Date

  @Prop({ required: true })
  validUntil: Date

  @Prop({ default: 1 })
  usageLimit: number

  @Prop({ default: 0 })
  usedCount: number

  @Prop({ default: 1 })
  usagePerClient: number

  @Prop({ default: "active", enum: ["active", "inactive", "expired"] })
  status: string

  @Prop({ type: [Types.ObjectId], ref: "Service" })
  applicableServices: Types.ObjectId[]

  @Prop({ type: [Types.ObjectId], ref: "Client" })
  applicableClients: Types.ObjectId[]

  @Prop({ default: false })
  isFirstTimeOnly: boolean

  @Prop({ type: [{ clientId: Types.ObjectId, usedAt: Date, bookingId: Types.ObjectId }] })
  usageHistory: Array<{
    clientId: Types.ObjectId
    usedAt: Date
    bookingId: Types.ObjectId
  }>
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher)

VoucherSchema.index({ code: 1 })
VoucherSchema.index({ status: 1 })
VoucherSchema.index({ validFrom: 1, validUntil: 1 })
