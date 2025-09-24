import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type ClientDocument = Client & Document

@Schema()
export class EmergencyContact {
  @Prop({ required: true })
  fullName: string

  @Prop({ required: true })
  relationship: string

  @Prop()
  email: string

  @Prop({
    type: {
      countryCode: { type: String, required: true },
      number: { type: String, required: true },
    },
    required: true,
  })
  phone: {
    countryCode: string
    number: string
  }
}

// Create the schema for EmergencyContact
export const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact)

@Schema()
export class ClientProfile {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({
    type: {
      countryCode: { type: String, required: true },
      number: { type: String, required: true },
    },
    required: true,
  })
  phone: {
    countryCode: string
    number: string
  }

  @Prop({
    type: {
      dayAndMonth: { type: String },
      year: { type: String },
    },
  })
  birthday: {
    dayAndMonth: string
    year: string
  }

  @Prop()
  gender: string

  @Prop()
  pronouns: string

  @Prop()
  additionalEmail: string

  @Prop({
    type: {
      countryCode: { type: String },
      number: { type: String },
    },
  })
  additionalPhone: {
    countryCode: string
    number: string
  }
}

// Create the schema for ClientProfile
export const ClientProfileSchema = SchemaFactory.createForClass(ClientProfile)

@Schema()
export class AdditionalInfo {
  @Prop()
  clientSource: string

  @Prop({
    type: {
      clientId: { type: String },
      clientName: { type: String },
    },
  })
  referredBy: {
    clientId: string
    clientName: string
  }

  @Prop()
  preferredLanguage: string

  @Prop()
  occupation: string

  @Prop()
  country: string
}

// Create the schema for AdditionalInfo
export const AdditionalInfoSchema = SchemaFactory.createForClass(AdditionalInfo)

@Schema()
export class ClientAddress {
  @Prop()
  addressName: string

  @Prop()
  addressType: string

  @Prop({ required: true })
  street: string

  @Prop()
  aptSuite: string

  @Prop()
  district: string

  @Prop({ required: true })
  city: string

  @Prop({ required: true })
  region: string

  @Prop({ required: true })
  postcode: string

  @Prop({ required: true })
  country: string
}

// Create the schema for ClientAddress
export const ClientAddressSchema = SchemaFactory.createForClass(ClientAddress)

@Schema()
export class ClientSettings {
  @Prop({
    type: {
      emailNotifications: { type: Boolean, default: true },
    },
    default: {},
  })
  appointmentNotifications: {
    emailNotifications: boolean
  }

  @Prop({
    type: {
      clientAcceptsEmailMarketing: { type: Boolean, default: false },
    },
    default: {},
  })
  marketingNotifications: {
    clientAcceptsEmailMarketing: boolean
  }
}

// Create the schema for ClientSettings
export const ClientSettingsSchema = SchemaFactory.createForClass(ClientSettings)

@Schema({ timestamps: true })
export class Client {
  @Prop({ type: ClientProfileSchema, required: true })
  profile: ClientProfile

  @Prop({ type: AdditionalInfoSchema })
  additionalInfo: AdditionalInfo

  @Prop({
    type: {
      primary: { type: EmergencyContactSchema },
      secondary: { type: EmergencyContactSchema },
    },
  })
  emergencyContacts: {
    primary: EmergencyContact
    secondary: EmergencyContact
  }

  @Prop({ type: ClientAddressSchema })
  address: ClientAddress

  @Prop({ type: ClientSettingsSchema, default: {} })
  settings: ClientSettings

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: 0 })
  totalVisits: number

  @Prop({ default: 0 })
  totalSpent: number

  @Prop()
  lastVisit: Date

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const ClientSchema = SchemaFactory.createForClass(Client)

// Add indexes for better performance
ClientSchema.index({ "profile.email": 1 })
ClientSchema.index({ "profile.firstName": 1, "profile.lastName": 1 })
ClientSchema.index({ "profile.phone.number": 1 })
ClientSchema.index({ createdAt: -1 })
ClientSchema.index({ isActive: 1 })