import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type TeamMemberDocument = TeamMember & Document

@Schema()
export class WorkingHours {
  @Prop({ required: true })
  day: string

  @Prop({ required: true })
  startTime: string

  @Prop({ required: true })
  endTime: string

  @Prop({ default: true })
  isWorking: boolean
}

@Schema()
export class Skills {
  @Prop({ type: [String], default: [] })
  services: string[]

  @Prop({ type: [String], default: [] })
  specializations: string[]

  @Prop()
  experienceLevel: string
}

@Schema()
export class Commission {
  @Prop({ required: true })
  serviceId: string

  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true })
  commissionType: string // 'percentage' | 'fixed'

  @Prop({ required: true })
  commissionValue: number
}

@Schema({ timestamps: true })
export class TeamMember {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({
    type: {
      countryCode: { type: String, required: true },
      number: { type: String, required: true },
    },
    required: true,
  })
  phone: {
    countryCode: string
    number: string
  }

  @Prop({
    required: true,
    enum: ["admin", "manager", "stylist", "therapist", "receptionist", "cleaner"],
  })
  role: string

  @Prop({
    required: true,
    enum: ["full_time", "part_time", "contract", "freelance"],
  })
  employmentType: string

  @Prop()
  hireDate: Date

  @Prop()
  salary: number

  @Prop({ type: [WorkingHours], default: [] })
  workingHours: WorkingHours[]

  @Prop({ type: Skills, default: {} })
  skills: Skills

  @Prop({ type: [Commission], default: [] })
  commissions: Commission[]

  @Prop()
  profileImage: string

  @Prop()
  bio: string

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: true })
  canBookOnline: boolean

  @Prop()
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember)

// Add indexes
TeamMemberSchema.index({ email: 1 })
TeamMemberSchema.index({ role: 1 })
TeamMemberSchema.index({ isActive: 1 })
TeamMemberSchema.index({ employmentType: 1 })
