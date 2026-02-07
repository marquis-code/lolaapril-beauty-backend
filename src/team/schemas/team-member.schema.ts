import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types, Document } from "mongoose"

export type TeamMemberDocument = TeamMember & Document

// Export TeamRole enum
export enum TeamRole {
  ADMIN = "admin",
  MANAGER = "manager",
  STYLIST = "stylist",
  THERAPIST = "therapist",
  RECEPTIONIST = "receptionist",
  CLEANER = "cleaner"
}

// Export TeamStatus enum (assuming you need active/inactive status)
export enum TeamStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  ON_LEAVE = "on_leave"
}

// Export EmploymentType enum for consistency
export enum EmploymentType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  FREELANCE = "freelance"
}

// Export CommissionType enum for consistency
export enum CommissionType {
  PERCENTAGE = "percentage",
  FIXED = "fixed"
}

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

export const WorkingHoursSchema = SchemaFactory.createForClass(WorkingHours)

@Schema()
export class Skills {
  @Prop({ type: [Types.ObjectId], ref: 'Service', default: [] })
  services: Types.ObjectId[]

  @Prop({ type: [String], default: [] })
  specializations: string[]

  @Prop()
  experienceLevel: string
}

export const SkillsSchema = SchemaFactory.createForClass(Skills)

@Schema()
export class Commission {
  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  serviceId: Types.ObjectId

  @Prop({ required: true })
  serviceName: string

  @Prop({ required: true, enum: ['percentage', 'fixed'] })
  commissionType: string

  @Prop({ required: true })
  commissionValue: number
}

export const CommissionSchema = SchemaFactory.createForClass(Commission)

@Schema({ timestamps: true })
export class TeamMember {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  businessId: Types.ObjectId

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

  @Prop({ type: [WorkingHoursSchema], default: [] })
  workingHours: WorkingHours[]

  @Prop({ type: SkillsSchema, default: {} })
  skills: Skills

  @Prop({ type: [CommissionSchema], default: [] })
  commissions: Commission[]

  @Prop()
  profileImage: string

  @Prop()
  bio: string

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: true })
  canBookOnline: boolean

  @Prop({
    type: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
    }
  })
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
TeamMemberSchema.index({ "skills.services": 1 })
TeamMemberSchema.index({ "commissions.serviceId": 1 })