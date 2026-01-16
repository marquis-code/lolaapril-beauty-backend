import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types, Document } from "mongoose"

export type ServiceDocument = Service & Document

@Schema()
export class BasicDetails {
  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true })
  serviceType: string

  @Prop({ type: Types.ObjectId, ref: 'ServiceCategory', required: true })
  category: Types.ObjectId

  @Prop({ required: true })
  description: string
}

export const BasicDetailsSchema = SchemaFactory.createForClass(BasicDetails)

@Schema()
export class TeamMember {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  id: Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  role: string

  @Prop({ default: false })
  selected: boolean
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember)

@Schema()
export class TeamMembers {
  @Prop({ default: false })
  allTeamMembers: boolean

  @Prop({ type: [TeamMemberSchema], default: [] })
  selectedMembers: TeamMember[]
}

export const TeamMembersSchema = SchemaFactory.createForClass(TeamMembers)

@Schema()
export class Resources {
  @Prop({ default: false })
  isRequired: boolean

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Resource' }], default: [] })
  resourceList: Types.ObjectId[]
}

export const ResourcesSchema = SchemaFactory.createForClass(Resources)

@Schema()
export class Price {
  @Prop({ required: true })
  currency: string

  @Prop({ required: true })
  amount: number

  @Prop()
  minimumAmount?: number
}

export const PriceSchema = SchemaFactory.createForClass(Price)

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

export const ServiceDurationSchema = SchemaFactory.createForClass(ServiceDuration)

@Schema()
export class ExtraTimeOptions {
  @Prop()
  processingTime: string

  @Prop()
  blockedTime: string

  @Prop()
  extraServicingTime: string
}

export const ExtraTimeOptionsSchema = SchemaFactory.createForClass(ExtraTimeOptions)

@Schema()
export class PricingAndDuration {
  @Prop({ required: true, enum: ["Fixed", "Free", "From"] })
  priceType: string

  @Prop({ type: PriceSchema, required: true })
  price: Price

  @Prop({ type: ServiceDurationSchema, required: true })
  duration: ServiceDuration

  @Prop({ type: ExtraTimeOptionsSchema })
  extraTimeOptions: ExtraTimeOptions
}

export const PricingAndDurationSchema = SchemaFactory.createForClass(PricingAndDuration)

@Schema()
export class OnlineBooking {
  @Prop({ default: true })
  enabled: boolean

  @Prop({ default: "All clients" })
  availableFor: string
}

export const OnlineBookingSchema = SchemaFactory.createForClass(OnlineBooking)

@Schema()
export class ServiceSettings {
  @Prop({ type: OnlineBookingSchema, default: {} })
  onlineBooking: OnlineBooking

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Form' }], default: [] })
  forms: Types.ObjectId[]

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Commission' }], default: [] })
  commissions: Types.ObjectId[]

  @Prop({ type: Object, default: {} })
  generalSettings: Record<string, any>
}

export const ServiceSettingsSchema = SchemaFactory.createForClass(ServiceSettings)

@Schema()
export class ServiceVariant {
  @Prop({ required: true })
  variantName: string

  @Prop({ required: true })
  variantDescription: string

  @Prop({
    type: {
      priceType: { type: String, required: true },
      price: { type: PriceSchema, required: true },
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

export const ServiceVariantSchema = SchemaFactory.createForClass(ServiceVariant)

@Schema({ timestamps: true })
export class Service {
  @Prop({ type: BasicDetailsSchema, required: true })
  basicDetails: BasicDetails

  @Prop({ type: TeamMembersSchema, required: true })
  teamMembers: TeamMembers

  @Prop({ type: ResourcesSchema, default: {} })
  resources: Resources

  @Prop({ type: PricingAndDurationSchema, required: true })
  pricingAndDuration: PricingAndDuration

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ServiceAddOn' }], default: [] })
  serviceAddOns: Types.ObjectId[]

  @Prop({ type: ServiceSettingsSchema, default: {} })
  settings: ServiceSettings

  @Prop({ type: [ServiceVariantSchema], default: [] })
  variants: ServiceVariant[]

   // NEW: Add business reference
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

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
ServiceSchema.index({ businessId: 1 })