// ================== NOTIFICATION SCHEMAS ==================
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type NotificationTemplateDocument = NotificationTemplate & Document
export type NotificationLogDocument = NotificationLog & Document
export type NotificationPreferenceDocument = NotificationPreference & Document

@Schema()
export class TemplateVariable {
  @Prop({ required: true })
  key: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  example: string
}

@Schema({ timestamps: true })
export class NotificationTemplate {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ required: true })
  templateName: string

  @Prop({
    required: true,
    enum: [
      'booking_confirmation',
      'booking_rejection',
      'appointment_reminder',
      'appointment_cancelled',
      'appointment_completed',
      'payment_confirmation',
      'payment_failed',
      'staff_assignment',
      'custom'
    ]
  })
  templateType: string

  @Prop({
    required: true,
    enum: ['email', 'sms', 'both']
  })
  channel: string

  @Prop({ required: true })
  subject: string // For emails

  @Prop({ required: true })
  content: string // Template content with variables

  @Prop({ type: [TemplateVariable], default: [] })
  availableVariables: TemplateVariable[]

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: false })
  isDefault: boolean

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

@Schema({ timestamps: true })
export class NotificationLog {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipientId: Types.ObjectId

  @Prop({ required: true })
  recipientType: string // 'client', 'staff', 'admin'

  @Prop({ required: true })
  channel: string // 'email', 'sms'

  @Prop({ required: true })
  recipient: string // email address or phone number

  @Prop({ required: true })
  subject: string

  @Prop({ required: true })
  content: string

  @Prop({
    required: true,
    enum: ['pending', 'sent', 'delivered', 'failed', 'bounced']
  })
  status: string

  @Prop()
  providerMessageId: string

  @Prop()
  errorMessage: string

  @Prop()
  sentAt: Date

  @Prop()
  deliveredAt: Date

  @Prop({ type: Types.ObjectId })
  relatedEntityId: Types.ObjectId // booking, appointment, payment ID

  @Prop()
  relatedEntityType: string // 'booking', 'appointment', 'payment'

  @Prop({ type: Types.ObjectId, ref: 'NotificationTemplate' })
  templateId: Types.ObjectId

  @Prop({ default: false })
  isRead: boolean

  @Prop()
  readAt: Date

  @Prop({ default: Date.now })
  createdAt: Date
}

@Schema({ timestamps: true })
export class NotificationPreference {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({
    type: {
      booking_confirmation: { email: Boolean, sms: Boolean },
      booking_rejection: { email: Boolean, sms: Boolean },
      appointment_reminder: { email: Boolean, sms: Boolean },
      appointment_cancelled: { email: Boolean, sms: Boolean },
      appointment_completed: { email: Boolean, sms: Boolean },
      payment_confirmation: { email: Boolean, sms: Boolean },
      payment_failed: { email: Boolean, sms: Boolean },
      promotional: { email: Boolean, sms: Boolean },
    },
    default: {
      booking_confirmation: { email: true, sms: true },
      booking_rejection: { email: true, sms: true },
      appointment_reminder: { email: true, sms: true },
      appointment_cancelled: { email: true, sms: true },
       appointment_completed: { email: true, sms: false },
      payment_confirmation: { email: true, sms: false },
      payment_failed: { email: true, sms: true },
      promotional: { email: false, sms: false },
    }
  })
  preferences: {
    booking_confirmation: { email: boolean; sms: boolean }
    booking_rejection: { email: boolean; sms: boolean }
    appointment_reminder: { email: boolean; sms: boolean }
    appointment_cancelled: { email: boolean; sms: boolean }
    appointment_completed: { email: boolean; sms: boolean }
    payment_confirmation: { email: boolean; sms: boolean }
    payment_failed: { email: boolean; sms: boolean }
    promotional: { email: boolean; sms: boolean }
  }

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const NotificationTemplateSchema = SchemaFactory.createForClass(NotificationTemplate)
export const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog)
export const NotificationPreferenceSchema = SchemaFactory.createForClass(NotificationPreference)

// Add indexes
NotificationTemplateSchema.index({ businessId: 1, templateType: 1 })
NotificationLogSchema.index({ businessId: 1, recipientId: 1 })
NotificationLogSchema.index({ status: 1 })
NotificationLogSchema.index({ createdAt: -1 })
NotificationPreferenceSchema.index({ userId: 1, businessId: 1 })