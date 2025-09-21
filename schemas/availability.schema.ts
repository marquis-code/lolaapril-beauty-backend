import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type AvailabilityDocument = Availability & Document

export enum DayOfWeek {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

@Schema({ timestamps: true })
export class Availability {
  @Prop({ type: Types.ObjectId, ref: "Staff", required: true })
  staffId: Types.ObjectId

  @Prop({ type: String, enum: DayOfWeek, required: true })
  dayOfWeek: DayOfWeek

  @Prop({ required: true })
  startTime: string // HH:MM format

  @Prop({ required: true })
  endTime: string // HH:MM format

  @Prop({ default: true })
  isAvailable: boolean

  @Prop()
  breakStartTime?: string // HH:MM format

  @Prop()
  breakEndTime?: string // HH:MM format

  @Prop()
  notes?: string
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability)
