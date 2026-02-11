

// src/modules/booking/schemas/booking.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types, Schema as MongooseSchema } from "mongoose"

export type BookingDocument = Booking & Document

@Schema()
export class BookingSource {
  @Prop({
    required: true,
    enum: ['marketplace', 'direct_link', 'qr_code', 'business_website',
      'google_search', 'social_media', 'referral', 'walk_in', 'phone']
  })
  sourceType: string

  @Prop()
  sourceIdentifier: string

  @Prop()
  referralCode: string

  @Prop()
  utmSource: string

  @Prop()
  utmMedium: string

  @Prop()
  utmCampaign: string

  @Prop({ default: Date.now })
  trackedAt: Date

  @Prop()
  ipAddress: string

  @Prop()
  userAgent: string
}

@Schema()
export class CommissionInfo {
  @Prop({ required: true, default: false })
  isCommissionable: boolean

  @Prop({ default: 0 })
  commissionRate: number

  @Prop({ default: 0 })
  commissionAmount: number

  @Prop()
  commissionReason: string

  @Prop({ default: Date.now })
  calculatedAt: Date
}

@Schema()
export class BookedService {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Service', required: true })
  serviceId: Types.ObjectId

  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true })
  duration: number

  @Prop({ default: 0 })
  bufferTime: number

  @Prop({ required: true })
  price: number

  @Prop({ default: 1, min: 1 })
  quantity: number
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
  @Prop({ default: false })
  requiresDeposit: boolean

  @Prop({ default: 0 })
  depositAmount: number

  @Prop({ default: false })
  depositPaid: boolean

  @Prop()
  depositTransactionId: string

  @Prop()
  depositReason: string

  @Prop({ default: 0 })
  remainingAmount: number

  @Prop({ type: BookingSource, required: true })
  bookingSource: BookingSource

  @Prop({ type: CommissionInfo })
  commissionInfo: CommissionInfo

  @Prop({ default: false })
  firstTimeClient: boolean

  @Prop()
  clientReliabilityScore: number

  @Prop({ type: MongooseSchema.Types.Mixed })
  commissionPreview: any

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Business', required: true })
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

  @Prop()
  clientPhone?: string

  @Prop()
  businessName: string

  @Prop()
  businessPhone: string

  @Prop()
  specialRequests: string

  @Prop()
  bookingNotes?: string

  @Prop({
    required: true,
    enum: [
      'pending',
      'confirmed',
      'cancelled',
      'expired',
      'payment_failed',
      'slot_unavailable',
      'rejected',
      'deposit_paid'
    ],
    default: 'pending'
  })
  status: string

  @Prop()
  cancellationReason: string

  @Prop()
  rejectionReason: string

  @Prop()
  cancellationDate: Date

  @Prop()
  expiresAt: Date

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  processedBy: Types.ObjectId

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Appointment' })
  appointmentId: Types.ObjectId

  @Prop({ type: BookingMetadata, default: {} })
  metadata: BookingMetadata

  @Prop({ default: 0 })
  remindersSent: number

  @Prop()
  lastReminderAt: Date

  @Prop({ type: [String], default: [] })
  reminderTiersSent: string[]

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
// REMOVED TTL INDEX - Bookings should not be auto-deleted after confirmation
// BookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
BookingSchema.index({ expiresAt: 1 }) // Keep index for queries but without auto-deletion
BookingSchema.index({ clientEmail: 1 })
BookingSchema.index({ clientPhone: 1 })