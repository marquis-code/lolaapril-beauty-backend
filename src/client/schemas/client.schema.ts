import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type ClientDocument = Client & Document

@Schema()
export class Phone {
  @Prop({ required: true })
  countryCode: string

  @Prop({ required: true })
  number: string
}

@Schema()
export class Birthday {
  @Prop({ required: true })
  dayAndMonth: string

  @Prop({ required: true })
  year: string
}

@Schema()
export class EmergencyContact {
  @Prop({ required: true })
  fullName: string

  @Prop({ required: true })
  relationship: string

  @Prop({ required: true })
  email: string

  @Prop({ type: Phone, required: true })
  phone: Phone
}

@Schema()
export class Address {
  @Prop({ required: true })
  addressName: string

  @Prop({ required: true })
  addressType: string

  @Prop({ required: true })
  street: string

  @Prop()
  aptSuite?: string

  @Prop({ required: true })
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

@Schema()
export class ClientSettings {
  @Prop({ type: Object, default: { emailNotifications: true } })
  appointmentNotifications: { emailNotifications: boolean }

  @Prop({ type: Object, default: { clientAcceptsEmailMarketing: true } })
  marketingNotifications: { clientAcceptsEmailMarketing: boolean }
}

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ type: Phone, required: true })
  phone: Phone

  @Prop({ type: Birthday })
  birthday?: Birthday

  @Prop({ enum: ["Male", "Female", "Other", "Prefer not to say"] })
  gender?: string

  @Prop()
  pronouns?: string

  @Prop()
  additionalEmail?: string

  @Prop({ type: Phone })
  additionalPhone?: Phone

  @Prop()
  clientSource?: string

  @Prop({ type: Object })
  referredBy?: { clientId: string; clientName: string }

  @Prop()
  preferredLanguage?: string

  @Prop()
  occupation?: string

  @Prop()
  country?: string

  @Prop({ type: Object })
  emergencyContacts?: {
    primary?: EmergencyContact
    secondary?: EmergencyContact
  }

  @Prop({ type: Address })
  address?: Address

  @Prop({ type: ClientSettings, default: () => ({}) })
  settings: ClientSettings

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: 0 })
  totalVisits: number

  @Prop({ default: 0 })
  totalSpent: number

  @Prop()
  lastVisit?: Date

  @Prop([String])
  tags: string[]

  @Prop()
  notes?: string
}

export const ClientSchema = SchemaFactory.createForClass(Client)

// Create indexes for better performance
ClientSchema.index({ email: 1 })
ClientSchema.index({ firstName: 1, lastName: 1 })
ClientSchema.index({ phone: 1 })
ClientSchema.index({ isActive: 1 })
