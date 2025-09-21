import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type BusinessSettingsDocument = BusinessSettings & Document

@Schema()
export class BusinessHours {
  @Prop({ required: true })
  day: string

  @Prop({ required: true })
  startTime: string

  @Prop({ required: true })
  endTime: string

  @Prop({ default: true })
  isOpen: boolean
}

@Schema()
export class AppointmentStatus {
  @Prop({ required: true, unique: true })
  statusName: string

  @Prop({ required: true })
  statusIcon: string

  @Prop({ required: true })
  statusColor: string

  @Prop()
  characterLimit: number

  @Prop({ default: true })
  isActive: boolean
}

@Schema()
export class CancellationReason {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, enum: ["client_initiated", "business_initiated", "external_factors"] })
  reasonType: string

  @Prop({ default: true })
  isActive: boolean
}

@Schema()
export class Resource {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ default: true })
  isActive: boolean
}

@Schema()
export class BlockedTimeType {
  @Prop({ required: true })
  type: string

  @Prop({ required: true })
  typeIcon: string

  @Prop({ required: true })
  duration: string

  @Prop({ required: true, enum: ["Paid", "Unpaid"] })
  compensation: string

  @Prop({ default: true })
  isActive: boolean
}

@Schema()
export class PaymentMethod {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, enum: ["cash", "credit_card", "debit_card", "bank_transfer", "digital_wallet"] })
  paymentType: string

  @Prop({ default: true })
  enabled: boolean
}

@Schema()
export class ServiceCharge {
  @Prop({
    type: {
      name: { type: String, required: true },
      description: { type: String, required: true },
    },
    required: true,
  })
  basicInfo: {
    name: string
    description: string
  }

  @Prop({
    type: {
      applyServiceChargeOn: { type: String, required: true },
      automaticallyApplyDuringCheckout: { type: Boolean, default: false },
    },
    required: true,
  })
  settings: {
    applyServiceChargeOn: string
    automaticallyApplyDuringCheckout: boolean
  }

  @Prop({
    type: {
      type: { type: String, required: true, enum: ["Flat rate", "Percentage", "Both"] },
      amount: {
        type: {
          currency: { type: String },
          value: { type: Number },
        },
      },
      percentage: { type: Number },
      flatRate: {
        type: {
          currency: { type: String },
          value: { type: Number },
        },
      },
    },
    required: true,
  })
  rateType: {
    type: string
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

  @Prop({
    type: {
      tax: { type: String, required: true },
      rate: { type: Number, required: true },
    },
    required: true,
  })
  taxRate: {
    tax: string
    rate: number
  }

  @Prop({ default: true })
  isActive: boolean
}

@Schema()
export class Tax {
  @Prop({ required: true })
  taxName: string

  @Prop({ required: true })
  taxRate: number

  @Prop({ default: true })
  isActive: boolean
}

@Schema()
export class ClosedPeriod {
  @Prop({ required: true })
  startDate: string

  @Prop({ required: true })
  endDate: string

  @Prop({ required: true })
  description: string

  @Prop({ default: true })
  businessClosed: boolean

  @Prop({ default: true })
  onlineBookingBlocked: boolean
}

@Schema({ timestamps: true })
export class BusinessSettings {
  @Prop({ required: true })
  businessName: string

  @Prop({ required: true })
  businessEmail: string

  @Prop({
    type: {
      countryCode: { type: String, required: true },
      number: { type: String, required: true },
    },
    required: true,
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
      country: { type: String, required: true },
    },
    required: true,
  })
  businessAddress: {
    street: string
    city: string
    region: string
    postcode: string
    country: string
  }

  @Prop({ type: [BusinessHours], required: true })
  businessHours: BusinessHours[]

  @Prop({ type: [AppointmentStatus], default: [] })
  appointmentStatuses: AppointmentStatus[]

  @Prop({ type: [CancellationReason], default: [] })
  cancellationReasons: CancellationReason[]

  @Prop({ type: [Resource], default: [] })
  resources: Resource[]

  @Prop({ type: [BlockedTimeType], default: [] })
  blockedTimeTypes: BlockedTimeType[]

  @Prop({ type: [PaymentMethod], default: [] })
  paymentMethods: PaymentMethod[]

  @Prop({ type: [ServiceCharge], default: [] })
  serviceCharges: ServiceCharge[]

  @Prop({ type: [Tax], default: [] })
  taxes: Tax[]

  @Prop({ type: [ClosedPeriod], default: [] })
  closedPeriods: ClosedPeriod[]

  @Prop({ default: "NGN" })
  defaultCurrency: string

  @Prop({ default: "Africa/Lagos" })
  timezone: string

  @Prop({ default: 15 })
  defaultAppointmentDuration: number

  @Prop({ default: 2 })
  bookingWindowHours: number

  @Prop({ default: true })
  allowOnlineBooking: boolean

  @Prop({ default: true })
  requireClientConfirmation: boolean

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const BusinessSettingsSchema = SchemaFactory.createForClass(BusinessSettings)

// Add indexes
BusinessSettingsSchema.index({ businessName: 1 })
BusinessSettingsSchema.index({ businessEmail: 1 })
