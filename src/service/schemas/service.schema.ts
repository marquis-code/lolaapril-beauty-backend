import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type ServiceDocument = Service & Document

@Schema()
export class BasicDetails {
  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true })
  serviceType: string

  @Prop({ required: true })
  category: string

  @Prop({ required: true })
  description: string
}

@Schema()
export class TeamMember {
  @Prop({ required: true })
  id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  role: string

  @Prop({ default: false })
  selected: boolean
}

@Schema()
export class TeamMembers {
  @Prop({ default: false })
  allTeamMembers: boolean

  @Prop({ type: [TeamMember], default: [] })
  selectedMembers: TeamMember[]
}

@Schema()
export class Resources {
  @Prop({ default: false })
  required: boolean

  @Prop({ type: [String], default: [] })
  resourceList: string[]
}

@Schema()
export class Price {
  @Prop({ required: true })
  currency: string

  @Prop({ required: true })
  amount: number

  @Prop()
  minimumAmount?: number
}

@Schema()
export class ServiceDuration {
  @Prop({
    type: {
      value: { type: Number, required: true },
      unit: { type: String, required: true, enum: ["min", "h"] },
    },
    required: true,
  })
  servicingTime: {
    value: number
    unit: "min" | "h"
  }

  @Prop({
    type: {
      value: { type: Number, required: true },
      unit: { type: String, required: true, enum: ["min", "h"] },
    },
    required: true,
  })
  processingTime: {
    value: number
    unit: "min" | "h"
  }

  @Prop({ required: true })
  totalDuration: string
}

@Schema()
export class ExtraTimeOptions {
  @Prop()
  processingTime: string

  @Prop()
  blockedTime: string

  @Prop()
  extraServicingTime: string
}

@Schema()
export class PricingAndDuration {
  @Prop({ required: true, enum: ["Fixed", "Free", "From"] })
  priceType: string

  @Prop({ type: Price, required: true })
  price: Price

  @Prop({ type: ServiceDuration, required: true })
  duration: ServiceDuration

  @Prop({ type: ExtraTimeOptions })
  extraTimeOptions: ExtraTimeOptions
}

@Schema()
export class OnlineBooking {
  @Prop({ default: true })
  enabled: boolean

  @Prop({ default: "All clients" })
  availableFor: string
}

@Schema()
export class ServiceSettings {
  @Prop({ type: OnlineBooking, default: {} })
  onlineBooking: OnlineBooking

  @Prop({ type: [String], default: [] })
  forms: string[]

  @Prop({ type: [String], default: [] })
  commissions: string[]

  @Prop({ type: Object, default: {} })
  generalSettings: Record<string, any>
}

@Schema()
export class ServiceVariant {
  @Prop({ required: true })
  variantName: string

  @Prop({ required: true })
  variantDescription: string

  @Prop({
    type: {
      priceType: { type: String, required: true },
      price: { type: Price, required: true },
      duration: {
        type: {
          value: { type: Number, required: true },
          unit: { type: String, required: true },
        },
        required: true,
      },
    },
    required: true,
  })
  pricing: {
    priceType: string
    price: Price
    duration: {
      value: number
      unit: string
    }
  }

  @Prop({
    type: {
      sku: { type: String },
    },
    default: {},
  })
  settings: {
    sku?: string
  }
}

@Schema({ timestamps: true })
export class Service {
  @Prop({ type: BasicDetails, required: true })
  basicDetails: BasicDetails

  @Prop({ type: TeamMembers, required: true })
  teamMembers: TeamMembers

  @Prop({ type: Resources, default: {} })
  resources: Resources

  @Prop({ type: PricingAndDuration, required: true })
  pricingAndDuration: PricingAndDuration

  @Prop({ type: [String], default: [] })
  serviceAddOns: string[]

  @Prop({ type: ServiceSettings, default: {} })
  settings: ServiceSettings

  @Prop({ type: [ServiceVariant], default: [] })
  variants: ServiceVariant[]

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const ServiceSchema = SchemaFactory.createForClass(Service)

// Add indexes
ServiceSchema.index({ "basicDetails.serviceName": 1 })
ServiceSchema.index({ "basicDetails.category": 1 })
ServiceSchema.index({ "basicDetails.serviceType": 1 })
ServiceSchema.index({ isActive: 1 })
ServiceSchema.index({ createdAt: -1 })
