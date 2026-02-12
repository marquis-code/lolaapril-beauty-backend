import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IntegrationDocument = Integration & Document;

@Schema({ timestamps: true })
export class Integration {
    @Prop({ type: Types.ObjectId, ref: 'Business', required: true, unique: true })
    businessId: Types.ObjectId;

    @Prop({ required: true })
    provider: string; // 'google'

    @Prop({ required: true })
    refreshToken: string;

    @Prop()
    accessToken: string;

    @Prop()
    calendarId: string;

    @Prop({ type: Object })
    metadata: Record<string, any>;
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration);
IntegrationSchema.index({ businessId: 1, provider: 1 });
