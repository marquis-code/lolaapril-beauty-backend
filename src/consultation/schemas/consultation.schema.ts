import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConsultationPackageDocument = ConsultationPackage & Document;
export type ConsultationBookingDocument = ConsultationBooking & Document;
export type ConsultationAvailabilityDocument = ConsultationAvailability & Document;

@Schema({ timestamps: true })
export class ConsultationPackage {
    @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
    businessId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ required: true, min: 1 })
    duration: number; // in minutes

    @Prop({ default: true })
    isActive: boolean;
}

export const ConsultationPackageSchema = SchemaFactory.createForClass(ConsultationPackage);

@Schema({ timestamps: true })
export class ConsultationBooking {
    @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
    businessId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    clientId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'ConsultationPackage', required: true })
    packageId: Types.ObjectId;

    @Prop({ required: true })
    startTime: Date;

    @Prop({ required: true })
    endTime: Date;

    @Prop({
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    })
    status: string;

    @Prop({
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    })
    paymentStatus: string;

    @Prop()
    meetingLink: string;

    @Prop()
    calendarEventId?: string;

    @Prop()
    paymentReference?: string;

    @Prop({ default: 0 })
    reminderSentCount: number;

    @Prop({ default: false })
    thankYouSent: boolean;

    @Prop({ default: false })
    marketingFollowUpSent: boolean;

    @Prop()
    notes: string;
}

export const ConsultationBookingSchema = SchemaFactory.createForClass(ConsultationBooking);

@Schema()
class ConsultationTimeSlot {
    @Prop({ required: true })
    startTime: string; // "HH:mm"

    @Prop({ required: true })
    endTime: string; // "HH:mm"
}

@Schema()
class ConsultationDaySchedule {
    @Prop({ required: true })
    dayOfWeek: number; // 0-6

    @Prop({ default: true })
    isOpen: boolean;

    @Prop({ type: [ConsultationTimeSlot], default: [] })
    timeSlots: ConsultationTimeSlot[];
}

@Schema({ timestamps: true })
export class ConsultationAvailability {
    @Prop({ type: Types.ObjectId, ref: 'Business', required: true, unique: true })
    businessId: Types.ObjectId;

    @Prop({ type: [ConsultationDaySchedule], required: true })
    weeklySchedule: ConsultationDaySchedule[];
}

export const ConsultationAvailabilitySchema = SchemaFactory.createForClass(ConsultationAvailability);

// Indexes
ConsultationBookingSchema.index({ businessId: 1, startTime: 1 });
ConsultationBookingSchema.index({ clientId: 1, startTime: 1 });
ConsultationPackageSchema.index({ businessId: 1 });
