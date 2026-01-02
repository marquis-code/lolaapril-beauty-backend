import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class ClientReliability {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  clientId: Types.ObjectId

  @Prop({ default: 100 })
  reliabilityScore: number // 0-100

  @Prop({ default: 0 })
  totalBookings: number

  @Prop({ default: 0 })
  completedBookings: number

  @Prop({ default: 0 })
  cancelledBookings: number

  @Prop({ default: 0 })
  noShowCount: number

  @Prop({ default: 0 })
  lateCancellations: number // Cancelled with <24hrs notice

  @Prop({ default: 0 })
  onTimeArrivals: number

  @Prop()
  lastNoShowDate: Date

  @Prop()
  lastCancellationDate: Date

  @Prop({ default: false })
  requiresDeposit: boolean // Flag for unreliable clients

  @Prop({ default: false })
  isBlacklisted: boolean
}

export type ClientReliabilityDocument = ClientReliability & Document
export const ClientReliabilitySchema = SchemaFactory.createForClass(ClientReliability)