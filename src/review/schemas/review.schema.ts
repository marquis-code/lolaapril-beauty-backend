import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    clientId: Types.ObjectId;

    @Prop({ required: true })
    clientName: string;

    @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
    businessId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Appointment' })
    appointmentId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Service' })
    serviceId: Types.ObjectId;

    @Prop()
    serviceName: string;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop({ maxlength: 1000 })
    comment: string;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({ default: true })
    isVisible: boolean;

    @Prop()
    businessResponse: string;

    @Prop()
    businessRespondedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ businessId: 1, createdAt: -1 });
ReviewSchema.index({ clientId: 1 });
ReviewSchema.index({ appointmentId: 1 }, { unique: true, sparse: true });
ReviewSchema.index({ serviceId: 1 });
ReviewSchema.index({ rating: 1 });
