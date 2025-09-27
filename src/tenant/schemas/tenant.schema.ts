// ================== MULTI-TENANT SCHEMAS ==================
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type BusinessDocument = Business & Document
export type SubscriptionDocument = Subscription & Document
export type TenantConfigDocument = TenantConfig & Document

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

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({
    required: true,
    enum: ['basic', 'standard', 'premium', 'enterprise']
  })
  planType: string

  @Prop({ required: true })
  planName: string

  @Prop({ required: true })
  monthlyPrice: number

  @Prop({ required: true })
  yearlyPrice: number

  @Prop({
    required: true,
    enum: ['monthly', 'yearly']
  })
  billingCycle: string

  @Prop({ required: true })
  startDate: Date

  @Prop({ required: true })
  endDate: Date

  @Prop({ required: true })
  nextBillingDate: Date

  @Prop({
    required: true,
    enum: ['active', 'cancelled', 'expired', 'past_due'],
    default: 'active'
  })
  status: string

  @Prop({
    type: {
      maxStaff: Number,
      maxServices: Number,
      maxAppointmentsPerMonth: Number,
      maxStorageGB: Number,
      features: {
        onlineBooking: Boolean,
        analytics: Boolean,
        marketing: Boolean,
        inventory: Boolean,
        multiLocation: Boolean,
        apiAccess: Boolean,
        customBranding: Boolean,
        advancedReports: Boolean
      }
    },
    required: true
  })
  limits: {
    maxStaff: number
    maxServices: number
    maxAppointmentsPerMonth: number
    maxStorageGB: number
    features: {
      onlineBooking: boolean
      analytics: boolean
      marketing: boolean
      inventory: boolean
      multiLocation: boolean
      apiAccess: boolean
      customBranding: boolean
      advancedReports: boolean
    }
  }

  @Prop()
  trialDays: number

  @Prop({ default: false })
  autoRenew: boolean

  @Prop()
  cancellationDate: Date

  @Prop()
  cancellationReason: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

@Schema({ timestamps: true })
export class TenantConfig {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, unique: true })
  businessId: Types.ObjectId

  @Prop({
    type: {
      primary: String,
      secondary: String,
      accent: String,
      background: String,
      text: String
    },
    default: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745',
      background: '#ffffff',
      text: '#333333'
    }
  })
  brandColors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }

  @Prop({
    type: {
      fontFamily: String,
      fontSize: String,
      headerFont: String
    },
    default: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      headerFont: 'Inter, sans-serif'
    }
  })
  typography: {
    fontFamily: string
    fontSize: string
    headerFont: string
  }

  @Prop({
    type: {
      showBusinessLogo: { type: Boolean, default: true },
      showPoweredBy: { type: Boolean, default: true },
      customCSS: String,
      favicon: String
    },
    default: {}
  })
  customization: {
    showBusinessLogo: boolean
    showPoweredBy: boolean
    customCSS?: string
    favicon?: string
  }

  @Prop({
    type: {
      emailProvider: {
        type: String,
        enum: ['sendgrid', 'mailgun', 'ses', 'smtp'],
        default: 'smtp'
      },
      emailConfig: {
        apiKey: String,
        host: String,
        port: Number,
        username: String,
        password: String,
        fromEmail: String,
        fromName: String
      },
      smsProvider: {
        type: String,
        enum: ['twilio', 'nexmo', 'africas_talking', 'custom'],
        default: 'twilio'
      },
      smsConfig: {
        apiKey: String,
        apiSecret: String,
        senderId: String
      },
      paymentProvider: {
        type: String,
        enum: ['paystack', 'flutterwave', 'stripe', 'razorpay'],
        default: 'paystack'
      },
      paymentConfig: {
        publicKey: String,
        secretKey: String,
        webhookSecret: String
      }
    },
    default: {}
  })
  integrations: {
    emailProvider: string
    emailConfig?: {
      apiKey?: string
      host?: string
      port?: number
      username?: string
      password?: string
      fromEmail?: string
      fromName?: string
    }
    smsProvider: string
    smsConfig?: {
      apiKey?: string
      apiSecret?: string
      senderId?: string
    }
    paymentProvider: string
    paymentConfig?: {
      publicKey?: string
      secretKey?: string
      webhookSecret?: string
    }
  }

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const BusinessSchema = SchemaFactory.createForClass(Business)
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)
export const TenantConfigSchema = SchemaFactory.createForClass(TenantConfig)

// Add indexes
BusinessSchema.index({ subdomain: 1 })
BusinessSchema.index({ ownerId: 1 })
BusinessSchema.index({ status: 1 })
SubscriptionSchema.index({ businessId: 1 })
SubscriptionSchema.index({ status: 1 })
SubscriptionSchema.index({ endDate: 1 })
TenantConfigSchema.index({ businessId: 1 })