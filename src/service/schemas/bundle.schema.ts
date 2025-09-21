import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type BundleDocument = Bundle & Document

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
  @Prop({ required: true, default: "Service pricing" })
  priceType: string

  @Prop({ type: Object, required: true })
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
export class Bundle {
  @Prop({ required: true })
  bundleName: string

  @Prop({ required: true })
  category: string

  @Prop({ required: true })
  description: string

  @Prop({ type: [BundleService], required: true })
  services: BundleService[]

  @Prop({ required: true, default: "Booked in sequence" })
  scheduleType: string

  @Prop({ type: BundlePricing, required: true })
  pricing: BundlePricing

  @Prop({ type: BundleOnlineBooking, default: () => ({}) })
  onlineBooking: BundleOnlineBooking

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: 0 })
  bookingCount: number

  @Prop({ default: 0 })
  revenue: number

  @Prop()
  totalDuration?: number

  @Prop()
  discountPercentage?: number
}

export const BundleSchema = SchemaFactory.createForClass(Bundle)

// Create indexes
BundleSchema.index({ bundleName: 1 })
BundleSchema.index({ category: 1 })
BundleSchema.index({ isActive: 1 })
