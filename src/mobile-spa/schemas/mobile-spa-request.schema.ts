import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type MobileSpaRequestDocument = MobileSpaRequest & Document;

@Schema()
export class MobileSpaService {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Service', required: true })
    serviceId: Types.ObjectId;

    @Prop({ required: true })
    serviceName: string;

    @Prop({ required: true })
    price: number;

    @Prop({ default: 1, min: 1 })
    quantity: number;
}

@Schema()
export class MobileSpaLocation {
    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    lat: number;

    @Prop({ required: true })
    lng: number;

    @Prop()
    placeId: string;

    @Prop()
    additionalDirections: string;
}

@Schema({ timestamps: true })
export class MobileSpaRequest {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    clientId: Types.ObjectId;

    @Prop({ required: true })
    clientName: string;

    @Prop({ required: true })
    clientEmail: string;

    @Prop()
    clientPhone: string;

    @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
    businessId: Types.ObjectId;

    @Prop()
    businessName: string;

    @Prop()
    businessEmail: string;

    @Prop({ type: [MobileSpaService], required: true })
    services: MobileSpaService[];

    @Prop({ required: true, min: 1 })
    numberOfPeople: number;

    @Prop({ type: MobileSpaLocation, required: true })
    location: MobileSpaLocation;

    @Prop({ required: true })
    requestedDate: Date;

    @Prop()
    requestedTime: string;

    @Prop({
        required: true,
        enum: ['pending', 'accepted', 'rejected', 'time_suggested', 'paid', 'completed', 'cancelled'],
        default: 'pending',
    })
    status: string;

    @Prop()
    suggestedDate: Date;

    @Prop()
    suggestedTime: string;

    @Prop()
    businessNotes: string;

    @Prop()
    clientNotes: string;

    @Prop()
    paymentLink: string;

    @Prop({
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    })
    paymentStatus: string;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: true, unique: true })
    requestNumber: string;
}

export const MobileSpaRequestSchema = SchemaFactory.createForClass(MobileSpaRequest);

MobileSpaRequestSchema.index({ clientId: 1 });
MobileSpaRequestSchema.index({ businessId: 1 });
MobileSpaRequestSchema.index({ status: 1 });
MobileSpaRequestSchema.index({ requestedDate: 1 });
MobileSpaRequestSchema.index({ createdAt: -1 });
MobileSpaRequestSchema.index({ requestNumber: 1 });
