// src/modules/tenant/schemas/business.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

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

  @Prop({
    type: {
      facebook: { type: String, required: false },
      instagram: { type: String, required: false },
      twitter: { type: String, required: false },
      tiktok: { type: String, required: false },
    },
    default: {},
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
  @Prop({ default: "Africa/Lagos" })
  timezone: string

  @Prop({ default: "NGN" })
  currency: string

  @Prop({ default: "en" })
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
  taxRate: number

  @Prop({ default: 0 })
  serviceCharge: number

  @Prop({
    type: {
      booking_confirmation: { type: Boolean, default: true },
      payment_reminders: { type: Boolean, default: true },
      appointment_reminders: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    default: {},
  })
  notificationSettings: {
    booking_confirmation: boolean
    payment_reminders: boolean
    appointment_reminders: boolean
    marketing: boolean
  }
}

@Schema()
export class BusinessHours {
  @Prop({ required: true })
  day: string // monday, tuesday, etc.

  @Prop({ required: true })
  isOpen: boolean

  @Prop()
  openTime: string // "09:00"

  @Prop()
  closeTime: string // "18:00"

  @Prop({ type: [{ openTime: String, closeTime: String }], default: [] })
  breaks: Array<{ openTime: string; closeTime: string }>
}

@Schema({ timestamps: true })
export class Business {
  @Prop({ required: true, unique: true })
  businessName: string

  @Prop({ required: true, unique: true })
  subdomain: string

  @Prop()
  businessDescription: string

  @Prop({
    required: true,
    enum: ["salon", "spa", "barbershop", "beauty_clinic", "wellness_center", "other"],
  })
  businessType: string

  @Prop()
  logo: string

  @Prop({ type: [String], default: [] })
  images: string[]

  @Prop({ type: BusinessAddress, required: true })
  address: BusinessAddress

  @Prop({ type: BusinessContact, required: true })
  contact: BusinessContact

  @Prop({ type: BusinessSettings, default: {} })
  settings: BusinessSettings

  @Prop({ type: [BusinessHours], default: [] })
  businessHours: BusinessHours[]

  // ========== OWNERSHIP & ACCESS ==========
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  ownerId: Types.ObjectId

  @Prop({ type: [Types.ObjectId], ref: "User", default: [] })
  adminIds: Types.ObjectId[]

  @Prop({ type: [Types.ObjectId], ref: "User", default: [] })
  staffIds: Types.ObjectId[]

  // ========== STATUS & SUBSCRIPTION ==========
  @Prop({
    required: true,
    enum: ["active", "inactive", "suspended", "trial", "expired"],
    default: "trial",
  })
  status: string

  @Prop()
  trialEndsAt: Date

  @Prop({ type: Types.ObjectId, ref: "Subscription" })
  activeSubscription: Types.ObjectId

  // ========== BUSINESS DOCUMENTS ==========
  @Prop({
    type: {
      businessRegistration: {
        number: String,
        documentUrl: String, // URL/path to uploaded registration certificate
        uploadedAt: Date,
      },
      taxIdentification: {
        number: String,
        documentUrl: String, // URL/path to uploaded tax certificate
        uploadedAt: Date,
      },
      proofOfAddress: {
        documentUrl: String, // URL/path to utility bill or bank statement
        uploadedAt: Date,
      },
      governmentId: {
        type: { type: String, enum: ['national_id', 'passport', 'drivers_license'] },
        number: String,
        documentUrl: String, // URL/path to ID document
        uploadedAt: Date,
      },
      bankAccount: {
        accountName: String,
        accountNumber: String,
        bankName: String,
        bankCode: String,
        bankStatementUrl: String, // URL/path to bank statement for verification
      },
      kycStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
      },
      kycVerifiedAt: Date,
      kycVerifiedBy: { type: Types.ObjectId, ref: 'User' }, // Admin who verified
      rejectionReason: String,
    },
    default: {},
  })
  businessDocuments: {
    businessRegistration?: {
      number?: string
      documentUrl?: string
      uploadedAt?: Date
    }
    taxIdentification?: {
      number?: string
      documentUrl?: string
      uploadedAt?: Date
    }
    proofOfAddress?: {
      documentUrl?: string
      uploadedAt?: Date
    }
    governmentId?: {
      type?: string
      number?: string
      documentUrl?: string
      uploadedAt?: Date
    }
    bankAccount?: {
      accountName?: string
      accountNumber?: string
      bankName?: string
      bankCode?: string
      bankStatementUrl?: string
    }
    kycStatus?: string
    kycVerifiedAt?: Date
    kycVerifiedBy?: Types.ObjectId
    rejectionReason?: string
  }

  // ========== PAYMENT SETTINGS (SUBACCOUNT) ==========
  @Prop({
    type: {
      paystackSubaccountCode: String,
      paystackRecipientCode: String,
      percentageCharge: { type: Number, default: 0 }, // Business keeps this % (after platform fee)
      subaccountCreatedAt: Date,
    },
    default: {},
  })
  paymentSettings: {
    paystackSubaccountCode?: string
    paystackRecipientCode?: string
    percentageCharge?: number
    subaccountCreatedAt?: Date
  }

  // ========== STATISTICS ==========
  @Prop({ default: 0 })
  totalAppointments: number

  @Prop({ default: 0 })
  totalRevenue: number

  @Prop({ default: 0 })
  totalClients: number

  @Prop({ default: 0 })
  averageRating: number

  @Prop({ default: 0 })
  totalReviews: number

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const BusinessSchema = SchemaFactory.createForClass(Business)

// Indexes
BusinessSchema.index({ subdomain: 1 })
BusinessSchema.index({ ownerId: 1 })
BusinessSchema.index({ status: 1 })
BusinessSchema.index({ businessType: 1 })
BusinessSchema.index({ adminIds: 1 })
BusinessSchema.index({ staffIds: 1 })