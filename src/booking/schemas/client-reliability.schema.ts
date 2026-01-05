
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class ClientReliability {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Business' })
  businessId: Types.ObjectId;

  @Prop({ default: 100 })
  reliabilityScore: number;

  @Prop({ default: 0 })
  totalBookings: number;

  @Prop({ default: 0 })
  completedBookings: number;

  @Prop({ default: 0 })
  cancelledBookings: number;

  @Prop({ default: 0 })
  noShowCount: number;

  @Prop({ default: 0 })
  lateCancellations: number;

  @Prop({ default: 0 })
  onTimeArrivals: number;

  @Prop({ default: 0 })
  lateArrivals: number;

  @Prop()
  lastNoShowDate: Date;

  @Prop()
  lastCancellationDate: Date;

  @Prop()
  lastCompletedDate: Date;

  @Prop({ default: false })
  requiresDeposit: boolean;

  @Prop({ default: false })
  isBlacklisted: boolean;

  @Prop()
  blacklistReason: string;

  @Prop()
  blacklistedAt: Date;

  @Prop({ default: 0 })
  lifetimeValue: number;

  @Prop()
  riskLevel: string;
}

export type ClientReliabilityDocument = ClientReliability & Document;
export const ClientReliabilitySchema = SchemaFactory.createForClass(ClientReliability);

ClientReliabilitySchema.index({ clientId: 1, businessId: 1 }, { unique: true });
ClientReliabilitySchema.index({ reliabilityScore: 1 });
ClientReliabilitySchema.index({ requiresDeposit: 1 });
ClientReliabilitySchema.index({ isBlacklisted: 1 });