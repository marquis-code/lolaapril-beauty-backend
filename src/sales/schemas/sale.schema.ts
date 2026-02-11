import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type SaleDocument = Sale & Document

@Schema()
export class SaleItem {
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

  @Prop({ default: 0 })
  discount: number

  @Prop({ default: 0 })
  tax: number

  @Prop()
  staffId: string

  @Prop()
  staffName: string

  @Prop()
  commission: number
}

@Schema({ timestamps: true })
export class Sale {
  @Prop({ required: true, unique: true })
  saleNumber: string

  @Prop({ type: String, required: true, index: true })
  businessId: string

  @Prop({ type: Types.ObjectId, ref: "Client", required: true })
  clientId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Appointment" })
  appointmentId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Booking" })
  bookingId: Types.ObjectId

  @Prop({ type: [SaleItem], required: true })
  items: SaleItem[]

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

  @Prop({ required: true })
  amountPaid: number

  @Prop({ default: 0 })
  amountDue: number

  @Prop({
    required: true,
    enum: ["pending", "paid", "partially_paid", "overdue", "cancelled"],
    default: "pending",
  })
  paymentStatus: string

  @Prop({
    required: true,
    enum: ["draft", "confirmed", "completed", "cancelled"],
    default: "draft",
  })
  status: string

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  createdBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User" })
  completedBy: Types.ObjectId

  @Prop()
  completedAt: Date

  @Prop()
  notes: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const SaleSchema = SchemaFactory.createForClass(Sale)

// Add indexes
SaleSchema.index({ saleNumber: 1 })
SaleSchema.index({ clientId: 1 })
SaleSchema.index({ appointmentId: 1 })
SaleSchema.index({ bookingId: 1 })
SaleSchema.index({ status: 1 })
SaleSchema.index({ paymentStatus: 1 })
SaleSchema.index({ createdAt: -1 })
SaleSchema.index({ completedAt: -1 })
