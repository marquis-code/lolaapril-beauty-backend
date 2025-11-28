
// src/modules/availability/schemas/business-hours.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

export type BusinessHoursDocument = BusinessHours & Document

@Schema()
export class TimeSlot {
  @Prop({ required: true })
  startTime: string // "00:00" for 24hrs

  @Prop({ required: true })
  endTime: string // "23:59" for 24hrs

  @Prop({ default: false })
  isBreak: boolean
}

@Schema()
export class DaySchedule {
  @Prop({ required: true })
  dayOfWeek: number // 0-6 (Sunday-Saturday)

  @Prop({ default: true })
  isOpen: boolean

  @Prop({ type: [TimeSlot], default: [] })
  timeSlots: TimeSlot[]

  @Prop({ default: false })
  is24Hours: boolean // NEW: Flag for 24-hour operation
}

@Schema({ timestamps: true })
export class BusinessHours {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ type: [DaySchedule], required: true })
  weeklySchedule: DaySchedule[]

  @Prop({ type: [Date], default: [] })
  holidays: Date[]

  @Prop({ type: [Date], default: [] })
  specialOpenDays: Date[]

  @Prop({ default: 30 })
  defaultSlotDuration: number

  @Prop({ default: 0 })
  bufferTime: number // NEW: Default buffer time in minutes

  @Prop({ default: false })
  operates24x7: boolean // NEW: Flag for 24/7 operation

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const BusinessHoursSchema = SchemaFactory.createForClass(BusinessHours)
BusinessHoursSchema.index({ businessId: 1 })