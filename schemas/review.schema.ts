import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type ReviewDocument = Review & Document

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  customerId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Staff", required: true })
  staffId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Booking", required: true })
  bookingId: Types.ObjectId

  @Prop({ required: true, min: 1, max: 5 })
  rating: number

  @Prop()
  comment?: string

  @Prop({ default: true })
  isVisible: boolean

  @Prop()
  response?: string // Staff/admin response

  @Prop({ type: Types.ObjectId, ref: "User" })
  respondedBy?: Types.ObjectId

  @Prop()
  responseDate?: Date
}

export const ReviewSchema = SchemaFactory.createForClass(Review)
