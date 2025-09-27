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

  @Prop({ required: true })
  price: number

  @Prop({ type: Types.ObjectId, ref: 'User' })
  preferredStaffId?: Types.ObjectId
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
  platform: string // 'web', 'mobile', 'app'
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ required: true, unique: true })
  bookingNumber: string // e.g., "BK-2024-001"

  @Prop({ type: [BookedService], required: true })
  services: BookedService[]

  @Prop({ required: true })
  preferredDate: Date

  @Prop({ required: true })
  preferredStartTime: string

  @Prop({ required: true })
  estimatedEndTime: string

  @Prop({ required: true })
  totalDuration: number // in minutes

  @Prop({ required: true })
  estimatedTotal: number

  @Prop({ required: true })
  clientName: string

  @Prop({ required: true })
  clientEmail: string

  @Prop({ required: true })
  clientPhone: string

  // Added missing field
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
  expiresAt: Date // Auto-expire pending bookings

  @Prop({ type: Types.ObjectId, ref: "User" })
  processedBy: Types.ObjectId // Staff who confirmed/rejected

  @Prop({ type: Types.ObjectId, ref: "Appointment" })
  appointmentId: Types.ObjectId // Link to created appointment

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

// Add indexes for better performance
BookingSchema.index({ clientId: 1 })
BookingSchema.index({ businessId: 1 })
BookingSchema.index({ bookingNumber: 1 })
BookingSchema.index({ preferredDate: 1, preferredStartTime: 1 })
BookingSchema.index({ status: 1 })
BookingSchema.index({ bookingSource: 1 })
BookingSchema.index({ createdAt: -1 })
BookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL index
BookingSchema.index({ clientEmail: 1 })
BookingSchema.index({ clientPhone: 1 })

// Fix the pre-save middleware - use Model instead of this.constructor
BookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingNumber) {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    
    // Use this.model() to access the model properly
    const count = await this.model('Booking').countDocuments({
      createdAt: {
        $gte: new Date(year, today.getMonth(), today.getDate()),
        $lt: new Date(year, today.getMonth(), today.getDate() + 1)
      }
    })
    
    this.bookingNumber = `BK-${year}${month}${day}-${String(count + 1).padStart(3, '0')}`
  }
  next()
})