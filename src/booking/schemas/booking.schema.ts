
// src/modules/booking/schemas/booking.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

export type BookingDocument = Booking & Document

@Schema()
export class BookedService {
  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  serviceId: Types.ObjectId

  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true })
  duration: number // in minutes

  @Prop({ default: 0 })
  bufferTime: number // Buffer time in minutes

  @Prop({ required: true })
  price: number

  // @Prop({ type: Types.ObjectId, ref: 'User' })
  // preferredStaffId?: Types.ObjectId
}

@Schema()
export class BookingMetadata {
  @Prop()
  userAgent: string

  @Prop()
  ipAddress: string

  @Prop()
  referrer: string

  @Prop({ default: 'web' })
  platform: string
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ default: 0 })
  totalBufferTime: number

  @Prop({ required: true, unique: true })
  bookingNumber: string

  @Prop({ type: [BookedService], required: true })
  services: BookedService[]

  @Prop({ required: true })
  preferredDate: Date

  @Prop({ required: true })
  preferredStartTime: string

  @Prop({ required: true })
  estimatedEndTime: string

  @Prop({ required: true })
  totalDuration: number

  @Prop({ required: true })
  estimatedTotal: number

  @Prop({ required: true })
  clientName: string

  @Prop({ required: true })
  clientEmail: string

  @Prop({ required: true })
  clientPhone: string

  @Prop()
  businessName: string

  @Prop()
  businessPhone: string

  @Prop()
  specialRequests: string

  @Prop({
    required: true,
    enum: [
      'pending', 
      'confirmed', 
      'cancelled', 
      'expired', 
      'payment_failed', 
      'slot_unavailable',
      'rejected'
    ],
    default: 'pending',
  })
  status: string

  @Prop({
    required: true,
    enum: ['online', 'phone', 'walk_in', 'admin'],
    default: 'online',
  })
  bookingSource: string

  @Prop()
  cancellationReason: string

  @Prop()
  rejectionReason: string

  @Prop()
  cancellationDate: Date

  @Prop()
  expiresAt: Date

  @Prop({ type: Types.ObjectId, ref: "User" })
  processedBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Appointment" })
  appointmentId: Types.ObjectId

  @Prop({ type: BookingMetadata, default: {} })
  metadata: BookingMetadata

  @Prop({ default: 0 })
  remindersSent: number

  @Prop()
  lastReminderAt: Date

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const BookingSchema = SchemaFactory.createForClass(Booking)

BookingSchema.index({ clientId: 1 })
BookingSchema.index({ businessId: 1 })
BookingSchema.index({ bookingNumber: 1 })
BookingSchema.index({ preferredDate: 1, preferredStartTime: 1 })
BookingSchema.index({ status: 1 })
BookingSchema.index({ bookingSource: 1 })
BookingSchema.index({ createdAt: -1 })
BookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
BookingSchema.index({ clientEmail: 1 })
BookingSchema.index({ clientPhone: 1 })