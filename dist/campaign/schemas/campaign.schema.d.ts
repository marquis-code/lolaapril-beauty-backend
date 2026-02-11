/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Document, Types } from 'mongoose';
export type CampaignDocument = Campaign & Document;
export declare class CampaignStats {
    sentCount: number;
    failedCount: number;
    openedCount: number;
    clickedCount: number;
}
declare class CampaignAudience {
    type: string;
    query?: any;
    specificEmails?: string[];
}
declare class CampaignSchedule {
    type: string;
    scheduledAt?: Date;
    cronExpression?: string;
    timezone?: string;
}
export declare class Campaign {
    businessId: Types.ObjectId;
    name: string;
    subject: string;
    content: string;
    previewText: string;
    audience: CampaignAudience;
    schedule: CampaignSchedule;
    status: string;
    stats: CampaignStats;
    bannerUrl?: string;
    createdBy: Types.ObjectId;
    lastRunAt: Date;
    nextRunAt: Date;
}
export declare const CampaignSchema: import("mongoose").Schema<Campaign, import("mongoose").Model<Campaign, any, any, any, Document<unknown, any, Campaign, any, {}> & Campaign & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Campaign, Document<unknown, {}, import("mongoose").FlatRecord<Campaign>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Campaign> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
