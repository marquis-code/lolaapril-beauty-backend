import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TrafficAnalyticsDocument = TrafficAnalytics & Document;

@Schema({ timestamps: true })
export class TrafficAnalytics {
    @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
    businessId: Types.ObjectId;

    @Prop({ required: true })
    visitorId: string; // Persistent ID across sessions

    @Prop({ required: true })
    sessionId: string; // Unique ID for current session

    @Prop({ required: true })
    pagePath: string; // e.g., /services or /gallery

    @Prop()
    pageTitle: string;

    @Prop()
    referrer: string;

    @Prop({
        required: true,
        enum: ['page_view', 'click', 'form_submit', 'booking_intent', 'callback_request'],
        default: 'page_view',
    })
    eventType: string;

    @Prop({ type: Object })
    userAgent: {
        browser: string;
        os: string;
        device: string; // mobile, tablet, desktop
        source: string; // Original UA string
    };

    @Prop()
    ip: string;

    @Prop({ type: Object })
    location: {
        country: string;
        region: string;
        city: string;
        latitude?: number;
        longitude?: number;
    };

    @Prop({ type: Object })
    metadata: Record<string, any>; // For extra data like button clicks

    @Prop({ default: Date.now })
    timestamp: Date;
}

export const TrafficAnalyticsSchema = SchemaFactory.createForClass(TrafficAnalytics);

// Add indexes for efficient reporting
TrafficAnalyticsSchema.index({ businessId: 1, timestamp: -1 });
TrafficAnalyticsSchema.index({ businessId: 1, eventType: 1 });
TrafficAnalyticsSchema.index({ sessionId: 1 });
TrafficAnalyticsSchema.index({ visitorId: 1 });
