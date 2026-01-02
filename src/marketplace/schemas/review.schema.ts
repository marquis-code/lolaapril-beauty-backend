
// schemas/review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define nested object types
class DetailedRatings {
  @Prop({ min: 1, max: 5 })
  service: number;

  @Prop({ min: 1, max: 5 })
  cleanliness: number;

  @Prop({ min: 1, max: 5 })
  professionalism: number;

  @Prop({ min: 1, max: 5 })
  valueForMoney: number;
}

class BusinessResponse {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  respondedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  respondedBy: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  businessId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  bookingId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  reviewText: string;

  @Prop({ type: DetailedRatings })
  ratings: DetailedRatings;

  @Prop({ type: [String], default: [] })
  photos: string[];

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected', 'flagged'] })
  moderationStatus: string;

  @Prop()
  moderationReason: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  moderatedBy: Types.ObjectId;

  @Prop()
  moderatedAt: Date;

  @Prop({ type: BusinessResponse })
  businessResponse: BusinessResponse;

  @Prop({ default: false })
  isVerifiedBooking: boolean;

  @Prop({ default: 0 })
  helpfulCount: number;

  @Prop({ default: 0 })
  notHelpfulCount: number;
}

export type ReviewDocument = Review & Document;
export const ReviewSchema = SchemaFactory.createForClass(Review);

// Add indexes for better query performance
ReviewSchema.index({ businessId: 1, rating: -1 });
ReviewSchema.index({ clientId: 1 });
ReviewSchema.index({ bookingId: 1 });
ReviewSchema.index({ moderationStatus: 1 });