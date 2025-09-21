import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type StaffDocument = Staff & Document

export enum StaffStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ON_LEAVE = "on_leave",
}

@Schema({ timestamps: true })
export class Staff {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  employeeId: string

  @Prop({ required: true })
  specialization: string

  @Prop({ type: [{ type: Types.ObjectId, ref: "Service" }] })
  services: Types.ObjectId[]

  @Prop({ type: String, enum: StaffStatus, default: StaffStatus.ACTIVE })
  status: StaffStatus

  @Prop()
  bio?: string

  @Prop()
  experience?: number // years of experience

  @Prop({ type: [String] })
  certifications: string[]

  @Prop()
  hourlyRate?: number

  @Prop()
  commissionRate?: number // percentage

  @Prop({ default: Date.now })
  hireDate: Date

  @Prop()
  profileImage?: string

  @Prop({ type: [String] })
  languages: string[]

  @Prop({ default: 0 })
  rating: number

  @Prop({ default: 0 })
  totalReviews: number
}

export const StaffSchema = SchemaFactory.createForClass(Staff)
