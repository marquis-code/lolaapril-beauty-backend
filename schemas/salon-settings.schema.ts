import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type SalonSettingsDocument = SalonSettings & Document

@Schema({ timestamps: true })
export class SalonSettings {
  @Prop({ required: true })
  salonName: string

  @Prop({ required: true })
  address: string

  @Prop({ required: true })
  phone: string

  @Prop({ required: true })
  email: string

  @Prop()
  website?: string

  @Prop()
  description?: string

  @Prop()
  logo?: string

  @Prop({ type: [String] })
  images: string[]

  @Prop({ required: true })
  openingTime: string // HH:MM format

  @Prop({ required: true })
  closingTime: string // HH:MM format

  @Prop({ type: [String], default: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] })
  workingDays: string[]

  @Prop({ default: 30 })
  defaultBookingDuration: number // in minutes

  @Prop({ default: 15 })
  bufferTime: number // in minutes between appointments

  @Prop({ default: 24 })
  cancellationPolicy: number // hours before appointment

  @Prop({ default: 50 })
  cancellationFeePercentage: number

  @Prop({ default: "USD" })
  currency: string

  @Prop({ default: 8.5 })
  taxRate: number // percentage

  @Prop({ default: true })
  allowOnlineBooking: boolean

  @Prop({ default: true })
  requireEmailVerification: boolean

  @Prop({ default: true })
  sendReminders: boolean

  @Prop({ default: 24 })
  reminderHours: number

  // @Prop({ type: Object })
  // socialMedia?: {
  //   facebook?: string
  //   instagram?: string
  //   twitter?: string
  //   linkedin?: string
  // }

@Prop({
  type: {
    facebook: { type: String, required: false },
    instagram: { type: String, required: false },
    twitter: { type: String, required: false },
    tiktok: { type: String, required: false }
  },
  default: {}
})
socialMedia: {
  facebook?: string
  instagram?: string
  twitter?: string
  tiktok?: string
}


  @Prop({ type: Object })
  paymentSettings?: {
    stripePublishableKey?: string
    stripeSecretKey?: string
    acceptCash?: boolean
    acceptCard?: boolean
    requireDeposit?: boolean
    depositPercentage?: number
  }
}

export const SalonSettingsSchema = SchemaFactory.createForClass(SalonSettings)
