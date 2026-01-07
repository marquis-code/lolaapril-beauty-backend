// ============================================================================
// FILE 1: schemas/business-settings.schema.ts - COMPLETE SCHEMA
// ============================================================================
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

export type BusinessSettingsDocument = BusinessSettings & Document

// ==================== SUBDOCUMENT SCHEMAS ====================

const BusinessHoursSchema = {
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isOpen: { type: Boolean, default: true }
}

const AppointmentStatusSchema = {
  statusName: { type: String, required: true, unique: true },
  statusIcon: { type: String, required: true },
  statusColor: { type: String, required: true },
  characterLimit: { type: Number },
  isActive: { type: Boolean, default: true }
}

const CancellationReasonSchema = {
  name: { type: String, required: true },
  reasonType: { type: String, required: true, enum: ["client_initiated", "business_initiated", "external_factors"] },
  isActive: { type: Boolean, default: true }
}

const ResourceSchema = {
  name: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}

const BlockedTimeTypeSchema = {
  type: { type: String, required: true },
  typeIcon: { type: String, required: true },
  duration: { type: String, required: true },
  compensation: { type: String, required: true, enum: ["Paid", "Unpaid"] },
  isActive: { type: Boolean, default: true }
}

const PaymentMethodSchema = {
  name: { type: String, required: true },
  paymentType: { type: String, required: true, enum: ["cash", "credit_card", "debit_card", "bank_transfer", "digital_wallet"] },
  enabled: { type: Boolean, default: true }
}

const ServiceChargeSchema = {
  basicInfo: {
    name: { type: String, required: true },
    description: { type: String, required: true }
  },
  settings: {
    applyServiceChargeOn: { type: String, required: true },
    automaticallyApplyDuringCheckout: { type: Boolean, default: false }
  },
  rateType: {
    type: { type: String, required: true, enum: ["Flat rate", "Percentage", "Both"] },
    amount: {
      currency: { type: String },
      value: { type: Number }
    },
    percentage: { type: Number },
    flatRate: {
      currency: { type: String },
      value: { type: Number }
    }
  },
  taxRate: {
    tax: { type: String, required: true },
    rate: { type: Number, required: true }
  },
  isActive: { type: Boolean, default: true }
}

const TaxSchema = {
  taxName: { type: String, required: true },
  taxRate: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}

const ClosedPeriodSchema = {
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, required: true },
  businessClosed: { type: Boolean, default: true },
  onlineBookingBlocked: { type: Boolean, default: true }
}

// ==================== TYPESCRIPT INTERFACES ====================

export interface BusinessHours {
  day: string
  startTime: string
  endTime: string
  isOpen: boolean
}

export interface AppointmentStatus {
  statusName: string
  statusIcon: string
  statusColor: string
  characterLimit?: number
  isActive: boolean
}

export interface CancellationReason {
  name: string
  reasonType: "client_initiated" | "business_initiated" | "external_factors"
  isActive: boolean
}

export interface Resource {
  name: string
  description: string
  isActive: boolean
}

export interface BlockedTimeType {
  type: string
  typeIcon: string
  duration: string
  compensation: "Paid" | "Unpaid"
  isActive: boolean
}

export interface PaymentMethod {
  name: string
  paymentType: "cash" | "credit_card" | "debit_card" | "bank_transfer" | "digital_wallet"
  enabled: boolean
}

export interface ServiceCharge {
  basicInfo: {
    name: string
    description: string
  }
  settings: {
    applyServiceChargeOn: string
    automaticallyApplyDuringCheckout: boolean
  }
  rateType: {
    type: "Flat rate" | "Percentage" | "Both"
    amount?: {
      currency: string
      value: number
    }
    percentage?: number
    flatRate?: {
      currency: string
      value: number
    }
  }
  taxRate: {
    tax: string
    rate: number
  }
  isActive: boolean
}

export interface Tax {
  taxName: string
  taxRate: number
  isActive: boolean
}

export interface ClosedPeriod {
  startDate: string
  endDate: string
  description: string
  businessClosed: boolean
  onlineBookingBlocked: boolean
}

// ==================== MAIN SCHEMA ====================

@Schema({ timestamps: true })
export class BusinessSettings {
  // ✅ Business Reference - Links settings to a specific business
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, unique: true })
  businessId: Types.ObjectId

  @Prop({ type: String, required: true })
  businessName: string

  @Prop({ type: String, required: true })
  businessEmail: string

  @Prop({
    type: {
      countryCode: { type: String, required: true },
      number: { type: String, required: true }
    },
    required: true
  })
  businessPhone: {
    countryCode: string
    number: string
  }

  @Prop({
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      region: { type: String, required: true },
      postcode: { type: String, required: true },
      country: { type: String, required: true }
    },
    required: true
  })
  businessAddress: {
    street: string
    city: string
    region: string
    postcode: string
    country: string
  }

  @Prop({ type: [BusinessHoursSchema], required: true })
  businessHours: BusinessHours[]

  @Prop({ type: [AppointmentStatusSchema], default: [] })
  appointmentStatuses: AppointmentStatus[]

  @Prop({ type: [CancellationReasonSchema], default: [] })
  cancellationReasons: CancellationReason[]

  @Prop({ type: [ResourceSchema], default: [] })
  resources: Resource[]

  @Prop({ type: [BlockedTimeTypeSchema], default: [] })
  blockedTimeTypes: BlockedTimeType[]

  @Prop({ type: [PaymentMethodSchema], default: [] })
  paymentMethods: PaymentMethod[]

  @Prop({ type: [ServiceChargeSchema], default: [] })
  serviceCharges: ServiceCharge[]

  @Prop({ type: [TaxSchema], default: [] })
  taxes: Tax[]

  @Prop({ type: [ClosedPeriodSchema], default: [] })
  closedPeriods: ClosedPeriod[]

  @Prop({ type: String, default: "NGN" })
  defaultCurrency: string

  @Prop({ type: String, default: "Africa/Lagos" })
  timezone: string

  @Prop({ type: Number, default: 15 })
  defaultAppointmentDuration: number

  @Prop({ type: Number, default: 2 })
  bookingWindowHours: number

  @Prop({ type: Boolean, default: true })
  allowOnlineBooking: boolean

  @Prop({ type: Boolean, default: true })
  requireClientConfirmation: boolean
}

export const BusinessSettingsSchema = SchemaFactory.createForClass(BusinessSettings)

// ==================== INDEXES ====================
BusinessSettingsSchema.index({ businessId: 1 }, { unique: true }) // ✅ Ensures one settings per business
BusinessSettingsSchema.index({ businessName: 1 })
BusinessSettingsSchema.index({ businessEmail: 1 })