// // src/modules/staff/schemas/staff-schedule.schema.ts
// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
// import { type Document, Types } from "mongoose"

// export type StaffScheduleDocument = StaffSchedule & Document

// @Schema()
// export class TimeSlot {
//   @Prop({ required: true })
//   startTime: string // "09:00"

//   @Prop({ required: true })
//   endTime: string // "17:00"

//   @Prop({ default: false })
//   isBreak: boolean

//   @Prop()
//   breakType: string // "lunch", "coffee", "personal"
// }

// @Schema()
// export class DailySchedule {
//   @Prop({ required: true })
//   dayOfWeek: number // 0-6 (Sunday-Saturday)

//   @Prop({ default: true })
//   isWorkingDay: boolean

//   @Prop({ type: [TimeSlot], default: [] })
//   workingHours: TimeSlot[]

//   @Prop({ type: [TimeSlot], default: [] })
//   breaks: TimeSlot[]

//   @Prop({ default: 8 })
//   maxHoursPerDay: number
// }

// @Schema({ timestamps: true })
// export class StaffSchedule {
//   @Prop({ type: Types.ObjectId, ref: 'Staff', required: true })
//   staffId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
//   businessId: Types.ObjectId

//   @Prop({ required: true })
//   effectiveDate: Date

//   @Prop()
//   endDate: Date // null means indefinite

//   @Prop({ type: [DailySchedule], required: true })
//   weeklySchedule: DailySchedule[]

//   @Prop({
//     required: true,
//     enum: ['regular', 'temporary', 'override'],
//     default: 'regular'
//   })
//   scheduleType: string

//   @Prop()
//   reason: string // for temporary or override schedules

//   @Prop({ default: true })
//   isActive: boolean

//   @Prop({ type: Types.ObjectId, ref: 'User' })
//   createdBy: Types.ObjectId

//   @Prop({ default: Date.now })
//   createdAt: Date

//   @Prop({ default: Date.now })
//   updatedAt: Date
// }

// export const StaffScheduleSchema = SchemaFactory.createForClass(StaffSchedule)

// // Add indexes
// StaffScheduleSchema.index({ staffId: 1, effectiveDate: 1 })
// StaffScheduleSchema.index({ businessId: 1, isActive: 1 })

// src/modules/staff/schemas/staff-schedule.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type StaffScheduleDocument = StaffSchedule & Document

@Schema()
export class TimeSlot {
  @Prop({ required: true })
  startTime: string // "09:00"

  @Prop({ required: true })
  endTime: string // "17:00"

  @Prop({ default: false })
  isBreak: boolean

  @Prop({ required: false })
  breakType?: string // "lunch", "coffee", "personal"
}

@Schema()
export class DailySchedule {
  @Prop({ required: true })
  dayOfWeek: number // 0-6 (Sunday-Saturday)

  @Prop({ default: true })
  isWorkingDay: boolean

  @Prop({ type: [TimeSlot], default: [] })
  workingHours: TimeSlot[]

  @Prop({ type: [TimeSlot], default: [] })
  breaks: TimeSlot[]

  @Prop({ default: 8 })
  maxHoursPerDay: number
}

@Schema({ timestamps: true })
export class StaffSchedule {
  @Prop({ type: Types.ObjectId, ref: 'Staff', required: true })
  staffId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ required: true })
  effectiveDate: Date

  @Prop()
  endDate: Date // null means indefinite

  @Prop({ type: [DailySchedule], required: true })
  weeklySchedule: DailySchedule[]

  @Prop({
    required: true,
    enum: ['regular', 'temporary', 'override'],
    default: 'regular'
  })
  scheduleType: string

  @Prop()
  reason: string // for temporary or override schedules

  @Prop({ default: true })
  isActive: boolean

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const StaffScheduleSchema = SchemaFactory.createForClass(StaffSchedule)

// Add indexes
StaffScheduleSchema.index({ staffId: 1, effectiveDate: 1 })
StaffScheduleSchema.index({ businessId: 1, isActive: 1 })