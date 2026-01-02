// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
// import { Document, Types } from 'mongoose'


// @Schema({ timestamps: true })
// export class TrackingCode {
//   @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
//   businessId: Types.ObjectId

//   @Prop({ required: true, unique: true })
//   code: string

//   @Prop({ 
//     required: true,
//     enum: ['qr_code', 'direct_link', 'social_media', 'email_campaign']
//   })
//   codeType: string

//   @Prop({ required: true })
//   name: string

//   @Prop()
//   description: string

//   @Prop()
//   targetUrl: string

//   @Prop({ default: true })
//   isActive: boolean

//   @Prop({ default: 0 })
//   clickCount: number

//   @Prop({ default: 0 })
//   bookingCount: number

//   @Prop({ default: 0 })
//   conversionRate: number

//   @Prop()
//   expiresAt: Date

//   @Prop()
//   metadata: Map<string, any>
// }

// export type TrackingCodeDocument = TrackingCode & Document
// export const TrackingCodeSchema = SchemaFactory.createForClass(TrackingCode)

// TrackingCodeSchema.index({ businessId: 1 })
// TrackingCodeSchema.index({ code: 1 }, { unique: true })
// TrackingCodeSchema.index({ codeType: 1 })
// TrackingCodeSchema.index({ isActive: 1 })

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'

@Schema({ timestamps: true })
export class TrackingCode {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ required: true, unique: true })
  code: string

  @Prop({ 
    required: true,
    enum: ['qr_code', 'direct_link', 'social_media', 'email_campaign']
  })
  codeType: string

  @Prop({ required: true })
  name: string

  @Prop()
  description: string

  @Prop()
  targetUrl: string

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: 0 })
  clickCount: number

  @Prop({ default: 0 })
  bookingCount: number

  @Prop({ default: 0 })
  conversionRate: number

  @Prop()
  expiresAt: Date

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: any
}

export type TrackingCodeDocument = TrackingCode & Document
export const TrackingCodeSchema = SchemaFactory.createForClass(TrackingCode)

TrackingCodeSchema.index({ businessId: 1 })
TrackingCodeSchema.index({ code: 1 }, { unique: true })
TrackingCodeSchema.index({ codeType: 1 })
TrackingCodeSchema.index({ isActive: 1 })