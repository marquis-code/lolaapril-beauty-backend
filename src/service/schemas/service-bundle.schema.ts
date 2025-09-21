import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type ServiceBundleDocument = ServiceBundle & Document

@Schema()
export class BasicInfo {
  @Prop({ required: true })
  bundleName: string

  @Prop({ required: true })
  category: string

  @Prop({ required: true })
  description: string
}

@Schema()
export class BundleService {
  @Prop({ required: true })
  serviceId: string

  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true })
  duration: number

  @Prop({ required: true })
  sequence: number
}

@Schema()
export class BundlePricing {
  @Prop({ required: true })
  priceType: string

  @Prop({
    type: {
      currency: { type: String, required: true },
      amount: { type: Number, required: true },
    },
    required: true,
  })
  retailPrice: {
    currency: string
    amount: number
  }
}

@Schema()
export class BundleOnlineBooking {
  @Prop({ default: true })
  enabled: boolean

  @Prop({ default: "All clients" })
  availableFor: string
}

@Schema({ timestamps: true })
export class ServiceBundle {
  @Prop({ type: BasicInfo, required: true })
  basicInfo: BasicInfo

  @Prop({ type: [BundleService], required: true })
  services: BundleService[]

  @Prop({ required: true })
  scheduleType: string

  @Prop({ type: BundlePricing, required: true })
  pricing: BundlePricing

  @Prop({ type: BundleOnlineBooking, default: {} })
  onlineBooking: BundleOnlineBooking

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const ServiceBundleSchema = SchemaFactory.createForClass(ServiceBundle)

// Add indexes
ServiceBundleSchema.index({ "basicInfo.bundleName": 1 })
ServiceBundleSchema.index({ "basicInfo.category": 1 })
ServiceBundleSchema.index({ isActive: 1 })
ServiceBundleSchema.index({ createdAt: -1 })
