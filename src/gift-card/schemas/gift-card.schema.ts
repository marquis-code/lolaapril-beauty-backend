import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type GiftCardDocument = GiftCard & Document

@Schema({ timestamps: true })
export class GiftCard {
  @Prop({ required: true, unique: true })
  code: string

  @Prop({ required: true })
  amount: number

  @Prop({ required: true })
  currency: string

  @Prop({ default: 0 })
  usedAmount: number

  @Prop({ required: true })
  expiryDate: Date

  @Prop({ type: Types.ObjectId, ref: "Client" })
  purchasedBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Client" })
  assignedTo: Types.ObjectId

  @Prop({ default: "active", enum: ["active", "used", "expired", "cancelled"] })
  status: string

  @Prop()
  purchaseDate: Date

  @Prop()
  notes: string

  @Prop({ type: [{ date: Date, amount: Number, bookingId: Types.ObjectId }] })
  usageHistory: Array<{
    date: Date
    amount: number
    bookingId: Types.ObjectId
  }>
}

export const GiftCardSchema = SchemaFactory.createForClass(GiftCard)

GiftCardSchema.index({ code: 1 })
GiftCardSchema.index({ status: 1 })
GiftCardSchema.index({ expiryDate: 1 })
