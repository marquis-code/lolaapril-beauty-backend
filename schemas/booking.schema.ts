import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type BookingDocument = Booking & Document

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
  REFUNDED = "refunded",
  FAILED = "failed",
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  customerId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Staff", required: true })
  staffId: Types.ObjectId

  @Prop({ type: [{ type: Types.ObjectId, ref: "Service" }], required: true })
  services: Types.ObjectId[]

  @Prop({ required: true })
  appointmentDate: Date

  @Prop({ required: true })
  startTime: string // HH:MM format

  @Prop({ required: true })
  endTime: string // HH:MM format

  @Prop({ required: true })
  totalDuration: number // in minutes

  @Prop({ required: true })
  totalPrice: number

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus

  @Prop()
  notes?: string

  @Prop()
  customerNotes?: string

  @Prop()
  staffNotes?: string

  @Prop()
  cancellationReason?: string

  @Prop()
  cancellationDate?: Date

  @Prop({ type: Types.ObjectId, ref: "User" })
  cancelledBy?: Types.ObjectId

  @Prop()
  reminderSent?: boolean

  @Prop()
  confirmationSent?: boolean

  @Prop()
  paymentIntentId?: string // for Stripe integration

  @Prop()
  discountAmount?: number

  @Prop()
  discountCode?: string

  @Prop()
  actualStartTime?: Date

  @Prop()
  actualEndTime?: Date
}

export const BookingSchema = SchemaFactory.createForClass(Booking)
