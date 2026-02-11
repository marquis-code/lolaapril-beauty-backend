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

// Define nested schemas classes to avoid "type" key conflicts
@Schema({ _id: false })
class CampaignAudience {
    @Prop({ type: String, enum: ['all', 'active_clients', 'specific_emails', 'query'], required: true })
    type: string;

    @Prop({ type: Object })
    query?: any;

    @Prop({ type: [String] })
    specificEmails?: string[];
}

@Schema({ _id: false })
class CampaignSchedule {
    @Prop({ type: String, enum: ['now', 'scheduled', 'recurring'], required: true })
    type: string;

    @Prop({ type: Date })
    scheduledAt?: Date;

    @Prop({ type: String })
    cronExpression?: string; // For recurring

    @Prop({ type: String })
    timezone?: string;
}

const CampaignAudienceSchema = SchemaFactory.createForClass(CampaignAudience);
const CampaignScheduleSchema = SchemaFactory.createForClass(CampaignSchedule);


@Schema({ timestamps: true })
export class Campaign {
    @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
    businessId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    content: string; // HTML content 

    @Prop()
    previewText: string;

    @Prop({ type: CampaignAudienceSchema, required: true })
    audience: CampaignAudience;

    @Prop({ type: CampaignScheduleSchema, required: true })
    schedule: CampaignSchedule;

    @Prop({
        type: String,
        enum: ['draft', 'scheduled', 'sending', 'completed', 'failed', 'cancelled'],
        default: 'draft',
        index: true,
    })
    status: string;

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
