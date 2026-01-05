
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
// import { Document, Types } from "mongoose"

// @Schema({ timestamps: true })
// export class NoShowRecord {
//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   clientId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
//   businessId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
//   appointmentId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, ref: 'Booking' })
//   bookingId: Types.ObjectId

//   @Prop({ required: true })
//   appointmentDate: Date

//   @Prop({ required: true })
//   scheduledTime: string

//   @Prop({ required: true })
//   bookedAmount: number

//   @Prop({ default: 0 })
//   penaltyCharged: number

//   @Prop({ default: false })
//   penaltyPaid: boolean

//   @Prop({ default: false })
//   wasDeposited: boolean

//   @Prop({ default: 0 })
//   depositAmount: number

//   @Prop({ default: false })
//   depositForfeited: boolean

//   @Prop({
//     enum: ['no_show', 'late_cancellation', 'same_day_cancellation'],
//     required: true
//   })
//   type: string

//   @Prop()
//   clientContactAttempts: number

//   @Prop()
//   notes: string

//   @Prop({ default: Date.now })
//   recordedAt: Date
// }

// export type NoShowRecordDocument = NoShowRecord & Document
// export const NoShowRecordSchema = SchemaFactory.createForClass(NoShowRecord)

// NoShowRecordSchema.index({ clientId: 1 })
// NoShowRecordSchema.index({ businessId: 1 })
// NoShowRecordSchema.index({ appointmentId: 1 })
// NoShowRecordSchema.index({ type: 1 })
// NoShowRecordSchema.index({ recordedAt: -1 })

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class NoShowRecord {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Appointment', required: true })
  appointmentId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Booking' })
  bookingId: Types.ObjectId;

  @Prop({ required: true })
  appointmentDate: Date;

  @Prop({ required: true })
  scheduledTime: string;

  @Prop({ required: true })
  bookedAmount: number;

  @Prop({ default: 0 })
  penaltyCharged: number;

  @Prop({ default: false })
  penaltyPaid: boolean;

  @Prop({ default: false })
  wasDeposited: boolean;

  @Prop({ default: 0 })
  depositAmount: number;

  @Prop({ default: false })
  depositForfeited: boolean;

  @Prop({
    enum: ['no_show', 'late_cancellation', 'same_day_cancellation'],
    required: true
  })
  type: string;

  @Prop()
  clientContactAttempts: number;

  @Prop()
  notes: string;

  @Prop({ default: Date.now })
  recordedAt: Date;
}

export type NoShowRecordDocument = NoShowRecord & Document;
export const NoShowRecordSchema = SchemaFactory.createForClass(NoShowRecord);

NoShowRecordSchema.index({ clientId: 1 });
NoShowRecordSchema.index({ businessId: 1 });
NoShowRecordSchema.index({ appointmentId: 1 });
NoShowRecordSchema.index({ type: 1 });
NoShowRecordSchema.index({ recordedAt: -1 });