import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type PaymentDocument = Payment & Document

@Schema()
export class PaymentItem {
  @Prop({ required: true })
  itemType: string // 'service', 'product', 'bundle'

  @Prop({ required: true })
  itemId: string

  @Prop({ required: true })
  itemName: string

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  unitPrice: number

  @Prop({ required: true })
  totalPrice: number

  @Prop()
  discount: number

  @Prop()
  tax: number
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: "Client", required: true })
  clientId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Appointment" })
  appointmentId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Booking" })
  bookingId: Types.ObjectId

  @Prop({ required: true, unique: true })
  paymentReference: string

  @Prop({ type: [PaymentItem], required: true })
  items: PaymentItem[]

  @Prop({ required: true })
  subtotal: number

  @Prop({ default: 0 })
  totalDiscount: number

  @Prop({ default: 0 })
  totalTax: number

  @Prop({ default: 0 })
  serviceCharge: number

  @Prop({ required: true })
  totalAmount: number

  @Prop({
    required: true,
    enum: ["cash", "card", "bank_transfer", "mobile_money", "online"],
  })
  paymentMethod: string

  @Prop({
    required: true,
    enum: ["pending", "processing", "completed", "failed", "refunded", "partially_refunded"],
    default: "pending",
  })
  status: string

  @Prop()
  transactionId: string

  @Prop()
  gatewayResponse: string

  @Prop()
  paidAt: Date

  @Prop()
  refundedAmount: number

  @Prop()
  refundedAt: Date

  @Prop()
  refundReason: string

  @Prop({ type: Types.ObjectId, ref: "User" })
  processedBy: Types.ObjectId

  @Prop()
  notes: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const PaymentSchema = SchemaFactory.createForClass(Payment)

// Add indexes
PaymentSchema.index({ clientId: 1 })
PaymentSchema.index({ appointmentId: 1 })
PaymentSchema.index({ bookingId: 1 })
PaymentSchema.index({ paymentReference: 1 })
PaymentSchema.index({ status: 1 })
PaymentSchema.index({ paymentMethod: 1 })
PaymentSchema.index({ createdAt: -1 })
PaymentSchema.index({ paidAt: -1 })
