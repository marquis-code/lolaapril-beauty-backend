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
export type TrafficAnalyticsDocument = TrafficAnalytics & Document;
export declare class TrafficAnalytics {
    businessId: Types.ObjectId;
    visitorId: string;
    sessionId: string;
    pagePath: string;
    pageTitle: string;
    referrer: string;
    eventType: string;
    userAgent: {
        browser: string;
        os: string;
        device: string;
        source: string;
    };
    ip: string;
    location: {
        country: string;
        region: string;
        city: string;
        latitude?: number;
        longitude?: number;
    };
    metadata: Record<string, any>;
    timestamp: Date;
}
export declare const TrafficAnalyticsSchema: import("mongoose").Schema<TrafficAnalytics, import("mongoose").Model<TrafficAnalytics, any, any, any, Document<unknown, any, TrafficAnalytics, any, {}> & TrafficAnalytics & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TrafficAnalytics, Document<unknown, {}, import("mongoose").FlatRecord<TrafficAnalytics>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<TrafficAnalytics> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
