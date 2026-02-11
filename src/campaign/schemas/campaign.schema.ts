import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CampaignDocument = Campaign & Document;

@Schema()
export class CampaignStats {
    @Prop({ default: 0 })
    sentCount: number;

    @Prop({ default: 0 })
    failedCount: number;

    @Prop({ default: 0 })
    openedCount: number;

    @Prop({ default: 0 })
    clickedCount: number;
}

@Schema({ timestamps: true })
export class Campaign {
    @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
    businessId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    content: string; // HTML content or reference to template

    @Prop()
    previewText: string;

    @Prop({
        type: {
            type: { type: String, enum: ['all', 'active_clients', 'specific_emails', 'query'], required: true },
            query: { type: Object }, // JSON for filtering
            specificEmails: [{ type: String }],
        },
        required: true,
    })
    audience: {
        type: 'all' | 'active_clients' | 'specific_emails' | 'query';
        query?: any;
        specificEmails?: string[];
    };

    @Prop({
        type: {
            type: { type: String, enum: ['now', 'scheduled', 'recurring'], required: true },
            scheduledAt: { type: Date },
            cronExpression: { type: String },
            timezone: { type: String },
        },
        required: true,
    })
    schedule: {
        type: 'now' | 'scheduled' | 'recurring';
        scheduledAt?: Date;
        cronExpression?: string;
        timezone?: string;
    };

    @Prop({
        type: String,
        enum: ['draft', 'scheduled', 'sending', 'completed', 'failed', 'cancelled'],
        default: 'draft',
        index: true,
    })
    status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed' | 'cancelled';

    @Prop({ type: CampaignStats, default: {} })
    stats: CampaignStats;

    // URL to the banner image used in the campaign if any
    @Prop()
    bannerUrl?: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;

    @Prop()
    lastRunAt: Date;

    @Prop()
    nextRunAt: Date;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

CampaignSchema.index({ businessId: 1, status: 1 });
CampaignSchema.index({ 'schedule.scheduledAt': 1 }); // For polling/checking scheduled tasks
