import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type BookingDocument = Booking & Document

@Schema()
export class BookingService {
  @Prop({ required: true })
  serviceId: string

  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true })
  duration: number // in minutes

  @Prop({ required: true })
  price: number

  @Prop()
  staffId: string

  @Prop()
  staffName: string
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: "Client", required: true })
  clientId: Types.ObjectId

  @Prop({ type: [BookingService], required: true })
  services: BookingService[]

  @Prop({ required: true })
  bookingDate: Date

  @Prop({ required: true })
  startTime: string

  @Prop({ required: true })
  endTime: string

  @Prop({ required: true })
  totalDuration: number // in minutes

  @Prop({ required: true })
  totalAmount: number

  @Prop({
    required: true,
    enum: ["pending", "confirmed", "in_progress", "completed", "cancelled", "no_show"],
    default: "pending",
  })
  status: string

  @Prop({
    required: true,
    enum: ["online", "phone", "walk_in", "admin"],
    default: "online",
  })
  bookingSource: string

  @Prop()
  specialRequests: string

  @Prop()
  internalNotes: string

  @Prop()
  cancellationReason: string

  @Prop()
  cancellationDate: Date

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const BookingSchema = SchemaFactory.createForClass(Booking)

// Add indexes
BookingSchema.index({ clientId: 1 })
BookingSchema.index({ bookingDate: 1, startTime: 1 })
BookingSchema.index({ status: 1 })
BookingSchema.index({ bookingSource: 1 })
BookingSchema.index({ createdAt: -1 })
