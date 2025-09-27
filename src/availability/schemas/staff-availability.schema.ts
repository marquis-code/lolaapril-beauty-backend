// src/modules/availability/schemas/staff-availability.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
import { TimeSlot } from "./business-hours.schema"

export type StaffAvailabilityDocument = StaffAvailability & Document

@Schema({ timestamps: true })
export class StaffAvailability {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  staffId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ required: true })
  date: Date

  @Prop({ type: [TimeSlot], required: true })
  availableSlots: TimeSlot[]

  @Prop({ type: [TimeSlot], default: [] })
  blockedSlots: TimeSlot[]

  @Prop({
    enum: ['available', 'unavailable', 'partial'],
    default: 'available'
  })
  status: string

  @Prop()
  reason: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const StaffAvailabilitySchema = SchemaFactory.createForClass(StaffAvailability)
StaffAvailabilitySchema.index({ staffId: 1, date: 1 })
StaffAvailabilitySchema.index({ businessId: 1, date: 1 })