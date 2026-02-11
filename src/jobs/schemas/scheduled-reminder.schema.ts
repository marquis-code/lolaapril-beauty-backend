import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ScheduledReminderDocument = ScheduledReminder & Document;

@Schema({ timestamps: true })
export class ScheduledReminder {
    @Prop({
        required: true,
        enum: ['rebook_2weeks', 'rebook_after_completion', 'thank_you'],
    })
    type: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    userEmail: string;

    @Prop({ required: true })
    userName: string;

    @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
    businessId: Types.ObjectId;

    @Prop()
    businessName: string;

    @Prop({ type: Types.ObjectId, ref: 'Appointment' })
    appointmentId: Types.ObjectId;

    @Prop()
    serviceName: string;

    @Prop({ required: true })
    scheduledFor: Date;

    @Prop({ default: false })
    sent: boolean;

    @Prop()
    sentAt: Date;

    @Prop({ default: 0 })
    retries: number;

    @Prop()
    error: string;
}

export const ScheduledReminderSchema = SchemaFactory.createForClass(ScheduledReminder);

ScheduledReminderSchema.index({ scheduledFor: 1, sent: 1 });
ScheduledReminderSchema.index({ userId: 1 });
ScheduledReminderSchema.index({ businessId: 1 });
ScheduledReminderSchema.index({ type: 1 });
