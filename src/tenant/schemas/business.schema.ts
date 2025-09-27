// src/modules/tenant/schemas/business.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type BusinessDocument = Business & Document

@Schema()
export class BusinessAddress {
  @Prop({ required: true })
  street: string

  @Prop({ required: true })
  city: string

  @Prop({ required: true })
  state: string

  @Prop({ required: true })
  country: string

  @Prop()
  postalCode: string

  @Prop()
  latitude: number

  @Prop()
  longitude: number
}

@Schema()
export class BusinessContact {
  @Prop({ required: true })
  primaryPhone: string

  @Prop()
  secondaryPhone: string

  @Prop({ required: true })
  email: string

  @Prop()
  website: string

  // @Prop()
  // socialMedia: {
  //   facebook?: string
  //   instagram?: string
  //   twitter?: string
  //   tiktok?: string
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
}

@Schema()
export class BusinessSettings {
  @Prop({ default: 'Africa/Lagos' })
  timezone: string

  @Prop({ default: 'NGN' })
  currency: string

  @Prop({ default: 'en' })
  language: string

  @Prop({ default: 30 })
  defaultAppointmentDuration: number

  @Prop({ default: 15 })
  bufferTimeBetweenAppointments: number

  @Prop({ default: 24 })
  cancellationPolicyHours: number

  @Prop({ default: 7 })
  advanceBookingDays: number

  @Prop({ default: true })
  allowOnlineBooking: boolean

  @Prop({ default: true })
  requireEmailVerification: boolean

  @Prop({ default: false })
  requirePhoneVerification: boolean

  @Prop({ default: 10 })
  taxRate: number // percentage

  @Prop({ default: 0 })
  serviceCharge: number // percentage

  @Prop({
    type: {
      booking_confirmation: { type: Boolean, default: true },
      payment_reminders: { type: Boolean, default: true },
      appointment_reminders: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    default: {}
  })
  notificationSettings: {
    booking_confirmation: boolean
    payment_reminders: boolean
    appointment_reminders: boolean
    marketing: boolean
  }
}

@Schema({ timestamps: true })
export class Business {
  @Prop({ required: true, unique: true })
  businessName: string

  @Prop({ required: true, unique: true })
  subdomain: string // unique identifier for tenant

  @Prop()
  businessDescription: string

  @Prop({
    required: true,
    enum: ['salon', 'spa', 'barbershop', 'beauty_clinic', 'wellness_center', 'other']
  })
  businessType: string

  @Prop()
  logo: string // URL to logo image

  @Prop({ type: [String], default: [] })
  images: string[] // URLs to business images

  @Prop({ type: BusinessAddress, required: true })
  address: BusinessAddress

  @Prop({ type: BusinessContact, required: true })
  contact: BusinessContact

  @Prop({ type: BusinessSettings, default: {} })
  settings: BusinessSettings

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  adminIds: Types.ObjectId[]

  @Prop({
    required: true,
    enum: ['active', 'inactive', 'suspended', 'trial'],
    default: 'trial'
  })
  status: string

  @Prop()
  trialEndsAt: Date

  @Prop({ type: Types.ObjectId, ref: 'Subscription' })
  activeSubscription: Types.ObjectId

  @Prop({
    type: {
      businessRegistration: String,
      taxIdentification: String,
      bankAccount: {
        accountName: String,
        accountNumber: String,
        bankName: String,
        bankCode: String
      }
    },
    default: {}
  })
  businessDocuments: {
    businessRegistration?: string
    taxIdentification?: string
    bankAccount?: {
      accountName?: string
      accountNumber?: string
      bankName?: string
      bankCode?: string
    }
  }

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const BusinessSchema = SchemaFactory.createForClass(Business)

// Add indexes
BusinessSchema.index({ subdomain: 1 })
BusinessSchema.index({ ownerId: 1 })
BusinessSchema.index({ status: 1 })