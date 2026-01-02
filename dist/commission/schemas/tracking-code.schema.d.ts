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
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export declare class TrackingCode {
    businessId: Types.ObjectId;
    code: string;
    codeType: string;
    name: string;
    description: string;
    targetUrl: string;
    isActive: boolean;
    clickCount: number;
    bookingCount: number;
    conversionRate: number;
    expiresAt: Date;
    metadata: any;
}
export type TrackingCodeDocument = TrackingCode & Document;
export declare const TrackingCodeSchema: MongooseSchema<TrackingCode, import("mongoose").Model<TrackingCode, any, any, any, Document<unknown, any, TrackingCode, any, {}> & TrackingCode & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TrackingCode, Document<unknown, {}, import("mongoose").FlatRecord<TrackingCode>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<TrackingCode> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
