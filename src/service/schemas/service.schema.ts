import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type ServiceDocument = Service & Document

@Schema()
export class TeamMember {
  @Prop({ required: true })
  id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  role: string

  @Prop({ default: true })
  selected: boolean
}

@Schema()
export class Currency {
  @Prop({ required: true, default: "NGN" })
  currency: string

  @Prop({ required: true })
  amount: number
}

@Schema()
export class Duration {
  @Prop({ required: true })
  value: number

  @Prop({ required: true, enum: ["min", "h"] })
  unit: string
}

@Schema()
export class ServiceDuration {
  @Prop({ type: Duration, required: true })
  servicingTime: Duration

  @Prop({ type: Duration, required: true })
  processingTime: Duration

  @Prop({ required: true })
  totalDuration: string
}

@Schema()
export class PricingAndDuration {
  @Prop({ required: true, enum: ["Fixed", "Free", "From"] })
  priceType: string

  @Prop({ type: Currency, required: true })
  price: Currency

  @Prop({ type: ServiceDuration, required: true })
  duration: ServiceDuration

  @Prop({ type: Object })
  extraTimeOptions?: any
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
  @Prop({ type: OnlineBooking, default: () => ({}) })
  onlineBooking: OnlineBooking

  @Prop({ type: [Object], default: [] })
  forms: any[]

  @Prop({ type: [Object], default: [] })
  commissions: any[]

  @Prop({ type: Object, default: {} })
  generalSettings: any
}

@Schema()
export class ServiceVariant {
  @Prop({ required: true })
  variantName: string

  @Prop({ required: true })
  variantDescription: string

  @Prop({ type: Object, required: true })
  pricing: any

  @Prop({ type: Object })
  settings?: any
}

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true })
  serviceType: string

  @Prop({ required: true })
  category: string

  @Prop({ required: true })
  description: string

  @Prop({ type: Object, required: true })
  teamMembers: {
    allTeamMembers: boolean
    selectedMembers: TeamMember[]
  }

  @Prop({ type: Object, default: { required: false, resourceList: [] } })
  resources: {
    required: boolean
    resourceList: any[]
  }

  @Prop({ type: PricingAndDuration, required: true })
  pricingAndDuration: PricingAndDuration

  @Prop({ type: [Object], default: [] })
  serviceAddOns: any[]

  @Prop({ type: ServiceSettings, default: () => ({}) })
  settings: ServiceSettings

  @Prop({ type: [ServiceVariant], default: [] })
  variants: ServiceVariant[]

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: 0 })
  bookingCount: number

  @Prop({ default: 0 })
  revenue: number
}

export const ServiceSchema = SchemaFactory.createForClass(Service)

// Create indexes
ServiceSchema.index({ serviceName: 1 })
ServiceSchema.index({ category: 1 })
ServiceSchema.index({ isActive: 1 })
ServiceSchema.index({ serviceType: 1 })
