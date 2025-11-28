
// src/modules/payment/schemas/payment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

// Payment Item Schema
@Schema({ _id: false })
export class PaymentItem {
  @Prop({ required: true, enum: ['service', 'product', 'package', 'other'] })
  itemType: string

  @Prop({ type: Types.ObjectId, required: false })
  itemId?: Types.ObjectId

  @Prop({ required: true })
  itemName: string

  @Prop({ default: 1 })
  quantity: number

  @Prop({ required: true })
  unitPrice: number

  @Prop({ required: true })
  totalPrice: number

  @Prop({ default: 0 })
  discount: number

  @Prop({ default: 0 })
  tax: number
}

export const PaymentItemSchema = SchemaFactory.createForClass(PaymentItem)

// Main Payment Schema
@Schema({ 
  timestamps: true,
  collection: 'payments'
})
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Appointment' })
  appointmentId?: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Booking' })
  bookingId?: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Business' })
  businessId?: Types.ObjectId

  @Prop({ required: true, unique: true })
  paymentReference: string

  @Prop()
  transactionId?: string

  @Prop({ type: [PaymentItemSchema], default: [] })
  items: PaymentItem[]

  @Prop({ required: true })
  subtotal: number

  @Prop({ default: 0 })
  totalTax: number

  @Prop({ default: 0 })
  totalDiscount: number

  @Prop({ required: true })
  totalAmount: number

  // FIXED: Added 'gateway' field to track payment provider
  @Prop()
  gateway?: string

  // FIXED: Updated enum to match possible payment methods
  @Prop({ 
    required: true, 
    enum: ['cash', 'card', 'online', 'bank_transfer', 'mobile_money', 'crypto'],
    default: 'online'
  })
  paymentMethod: string

  @Prop({ 
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  })
  status: string

  @Prop()
  paidAt?: Date

  @Prop({ default: 0 })
  refundedAmount?: number

  @Prop()
  refundedAt?: Date

  @Prop()
  refundReason?: string

  @Prop()
  gatewayResponse?: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  processedBy?: Types.ObjectId

  @Prop()
  notes?: string

  @Prop({ type: Object })
  metadata?: Record<string, any>
}

export type PaymentDocument = Payment & Document
export const PaymentSchema = SchemaFactory.createForClass(Payment)

// Indexes for better query performance
PaymentSchema.index({ paymentReference: 1 })
PaymentSchema.index({ clientId: 1, createdAt: -1 })
PaymentSchema.index({ status: 1, createdAt: -1 })
PaymentSchema.index({ bookingId: 1 })
PaymentSchema.index({ appointmentId: 1 })
PaymentSchema.index({ transactionId: 1 })
PaymentSchema.index({ gateway: 1 })
