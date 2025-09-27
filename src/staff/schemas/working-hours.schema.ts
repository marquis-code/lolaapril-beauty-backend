// src/modules/staff/schemas/working-hours.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type WorkingHoursDocument = WorkingHours & Document

@Schema()
export class TimeSlot {
  @Prop({ required: true })
  startTime: string // "09:00"

  @Prop({ required: true })
  endTime: string // "17:00"

  @Prop({ default: false })
  isBreak: boolean

  @Prop()
  breakType: string // "lunch", "coffee", "personal"
}

@Schema({ timestamps: true })
export class WorkingHours {
  @Prop({ type: Types.ObjectId, ref: 'Staff', required: true })
  staffId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ required: true })
  date: Date

  @Prop({ type: [TimeSlot], required: true })
  scheduledHours: TimeSlot[]

  @Prop({ type: [TimeSlot], default: [] })
  actualHours: TimeSlot[]

  @Prop({ default: 0 })
  scheduledMinutes: number

  @Prop({ default: 0 })
  actualMinutes: number

  @Prop({ default: 0 })
  breakMinutes: number

  @Prop({ default: 0 })
  overtimeMinutes: number

  @Prop({
    enum: ['present', 'absent', 'late', 'early_leave', 'sick', 'vacation'],
    default: 'present'
  })
  attendanceStatus: string

  @Prop()
  notes: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  checkedInBy: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User' })
  checkedOutBy: Types.ObjectId

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const WorkingHoursSchema = SchemaFactory.createForClass(WorkingHours)

// Add indexes
WorkingHoursSchema.index({ staffId: 1, date: 1 })
WorkingHoursSchema.index({ businessId: 1, date: 1 })