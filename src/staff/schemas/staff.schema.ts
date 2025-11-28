

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