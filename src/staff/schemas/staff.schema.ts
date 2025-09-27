// // ================== STAFF SCHEDULING SCHEMAS ==================
// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
// import { type Document, Types } from "mongoose"

// export type StaffDocument = Staff & Document
// export type StaffScheduleDocument = StaffSchedule & Document
// export type StaffAssignmentDocument = StaffAssignment & Document
// export type WorkingHoursDocument = WorkingHours & Document

// @Schema()
// export class StaffSkills {
//   @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
//   serviceId: Types.ObjectId

//   @Prop({ required: true })
//   serviceName: string

//   @Prop({
//     required: true,
//     enum: ['beginner', 'intermediate', 'expert', 'master'],
//     default: 'intermediate'
//   })
//   skillLevel: string

//   @Prop({ default: 0 })
//   experienceMonths: number

//   @Prop({ default: true })
//   isActive: boolean
// }

// @Schema()
// export class StaffCommission {
//   @Prop({ type: Types.ObjectId, ref: 'Service' })
//   serviceId: Types.ObjectId

//   @Prop({
//     required: true,
//     enum: ['percentage', 'fixed'],
//     default: 'percentage'
//   })
//   commissionType: string

//   @Prop({ required: true })
//   commissionValue: number // percentage or fixed amount

//   @Prop({ default: 0 })
//   minimumAmount: number

//   @Prop({ default: true })
//   isActive: boolean
// }

// @Schema({ timestamps: true })
// export class Staff {
//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   userId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
//   businessId: Types.ObjectId

//   @Prop({ required: true })
//   staffId: string // unique staff identifier

//   @Prop({ required: true })
//   firstName: string

//   @Prop({ required: true })
//   lastName: string

//   @Prop({ required: true })
//   email: string

//   @Prop({ required: true })
//   phone: string

//   @Prop({
//     required: true,
//     enum: ['stylist', 'barber', 'therapist', 'nail_tech', 'receptionist', 'manager', 'owner'],
//   })
//   role: string

//   @Prop({
//     required: true,
//     enum: ['full_time', 'part_time', 'contractor', 'intern'],
//     default: 'full_time'
//   })
//   employmentType: string

//   @Prop({ required: true })
//   hireDate: Date

//   @Prop()
//   terminationDate: Date

//   @Prop({
//     required: true,
//     enum: ['active', 'inactive', 'on_leave', 'terminated'],
//     default: 'active'
//   })
//   status: string

//   @Prop({ type: [StaffSkills], default: [] })
//   skills: StaffSkills[]

//   @Prop({ type: [StaffCommission], default: [] })
//   commissionStructure: StaffCommission[]

//   @Prop()
//   profileImage: string

//   @Prop()
//   bio: string

//   @Prop({ type: [String], default: [] })
//   certifications: string[]

//   @Prop({ default: 0 })
//   totalRating: number

//   @Prop({ default: 0 })
//   totalReviews: number

//   @Prop({ default: 0 })
//   completedAppointments: number

//   @Prop({ default: Date.now })
//   createdAt: Date

//   @Prop({ default: Date.now })
//   updatedAt: Date
// }

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

// @Schema()
// export class AssignmentDetails {
//   @Prop({ required: true })
//   startTime: string

//   @Prop({ required: true })
//   endTime: string

//   @Prop({
//     required: true,
//     enum: ['primary', 'secondary', 'backup'],
//     default: 'primary'
//   })
//   assignmentType: string

//   @Prop({ default: 0 })
//   estimatedDuration: number // in minutes

//   @Prop()
//   specialInstructions: string

//   @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
//   serviceId: Types.ObjectId

//   @Prop({ required: true })
//   serviceName: string
// }

// @Schema({ timestamps: true })
// export class StaffAssignment {
//   @Prop({ type: Types.ObjectId, ref: 'Staff', required: true })
//   staffId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
//   businessId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
//   appointmentId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   clientId: Types.ObjectId

//   @Prop({ required: true })
//   assignmentDate: Date

//   @Prop({ type: AssignmentDetails, required: true })
//   assignmentDetails: AssignmentDetails

//   @Prop({
//     required: true,
//     enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
//     default: 'scheduled'
//   })
//   status: string

//   @Prop()
//   actualStartTime: string

//   @Prop()
//   actualEndTime: string

//   @Prop()
//   completionNotes: string

//   @Prop({ default: 0 })
//   rating: number

//   @Prop()
//   clientFeedback: string

//   @Prop({
//     required: true,
//     enum: ['auto', 'manual', 'client_request'],
//     default: 'auto'
//   })
//   assignmentMethod: string

//   @Prop({ type: Types.ObjectId, ref: 'User' })
//   assignedBy: Types.ObjectId

//   @Prop({ default: Date.now })
//   createdAt: Date

//   @Prop({ default: Date.now })
//   updatedAt: Date
// }

// @Schema({ timestamps: true })
// export class WorkingHours {
//   @Prop({ type: Types.ObjectId, ref: 'Staff', required: true })
//   staffId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
//   businessId: Types.ObjectId

//   @Prop({ required: true })
//   date: Date

//   @Prop({ type: [TimeSlot], required: true })
//   scheduledHours: TimeSlot[]

//   @Prop({ type: [TimeSlot], default: [] })
//   actualHours: TimeSlot[]

//   @Prop({ default: 0 })
//   scheduledMinutes: number

//   @Prop({ default: 0 })
//   actualMinutes: number

//   @Prop({ default: 0 })
//   breakMinutes: number

//   @Prop({ default: 0 })
//   overtimeMinutes: number

//   @Prop({
//     enum: ['present', 'absent', 'late', 'early_leave', 'sick', 'vacation'],
//     default: 'present'
//   })
//   attendanceStatus: string

//   @Prop()
//   notes: string

//   @Prop({ type: Types.ObjectId, ref: 'User' })
//   checkedInBy: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'User' })
//   checkedOutBy: Types.ObjectId

//   @Prop({ default: Date.now })
//   createdAt: Date

//   @Prop({ default: Date.now })
//   updatedAt: Date
// }

// export const StaffSchema = SchemaFactory.createForClass(Staff)
// export const StaffScheduleSchema = SchemaFactory.createForClass(StaffSchedule)
// export const StaffAssignmentSchema = SchemaFactory.createForClass(StaffAssignment)
// export const WorkingHoursSchema = SchemaFactory.createForClass(WorkingHours)

// // Add indexes
// StaffSchema.index({ businessId: 1, userId: 1 })
// StaffSchema.index({ businessId: 1, status: 1 })
// StaffSchema.index({ staffId: 1 })
// StaffScheduleSchema.index({ staffId: 1, effectiveDate: 1 })
// StaffScheduleSchema.index({ businessId: 1, isActive: 1 })
// StaffAssignmentSchema.index({ staffId: 1, assignmentDate: 1 })
// StaffAssignmentSchema.index({ appointmentId: 1 })
// StaffAssignmentSchema.index({ businessId: 1, status: 1 })
// WorkingHoursSchema.index({ staffId: 1, date: 1 })
// WorkingHoursSchema.index({ businessId: 1, date: 1 })


// src/modules/staff/schemas/staff.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type StaffDocument = Staff & Document

@Schema()
export class StaffSkills {
  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  serviceId: Types.ObjectId

  @Prop({ required: true })
  serviceName: string

  @Prop({
    required: true,
    enum: ['beginner', 'intermediate', 'expert', 'master'],
    default: 'intermediate'
  })
  skillLevel: string

  @Prop({ default: 0 })
  experienceMonths: number

  @Prop({ default: true })
  isActive: boolean
}

@Schema()
export class StaffCommission {
  @Prop({ type: Types.ObjectId, ref: 'Service' })
  serviceId: Types.ObjectId

  @Prop({
    required: true,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  })
  commissionType: string

  @Prop({ required: true })
  commissionValue: number // percentage or fixed amount

  @Prop({ default: 0 })
  minimumAmount: number

  @Prop({ default: true })
  isActive: boolean
}

@Schema({ timestamps: true })
export class Staff {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId

  @Prop({ required: true })
  staffId: string // unique staff identifier

  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  phone: string

  @Prop({
    required: true,
    enum: ['stylist', 'barber', 'therapist', 'nail_tech', 'receptionist', 'manager', 'owner'],
  })
  role: string

  @Prop({
    required: true,
    enum: ['full_time', 'part_time', 'contractor', 'intern'],
    default: 'full_time'
  })
  employmentType: string

  @Prop({ required: true })
  hireDate: Date

  @Prop()
  terminationDate: Date

  @Prop({
    required: true,
    enum: ['active', 'inactive', 'on_leave', 'terminated'],
    default: 'active'
  })
  status: string

  @Prop({ type: [StaffSkills], default: [] })
  skills: StaffSkills[]

  @Prop({ type: [StaffCommission], default: [] })
  commissionStructure: StaffCommission[]

  @Prop()
  profileImage: string

  @Prop()
  bio: string

  @Prop({ type: [String], default: [] })
  certifications: string[]

  @Prop({ default: 0 })
  totalRating: number

  @Prop({ default: 0 })
  totalReviews: number

  @Prop({ default: 0 })
  completedAppointments: number

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const StaffSchema = SchemaFactory.createForClass(Staff)

// Add indexes
StaffSchema.index({ businessId: 1, userId: 1 })
StaffSchema.index({ businessId: 1, status: 1 })
StaffSchema.index({ staffId: 1 })