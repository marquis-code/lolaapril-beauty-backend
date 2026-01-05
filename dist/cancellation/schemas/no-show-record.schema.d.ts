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
export declare class NoShowRecord {
    clientId: Types.ObjectId;
    businessId: Types.ObjectId;
    appointmentId: Types.ObjectId;
    bookingId: Types.ObjectId;
    appointmentDate: Date;
    scheduledTime: string;
    bookedAmount: number;
    penaltyCharged: number;
    penaltyPaid: boolean;
    wasDeposited: boolean;
    depositAmount: number;
    depositForfeited: boolean;
    type: string;
    clientContactAttempts: number;
    notes: string;
    recordedAt: Date;
}
export type NoShowRecordDocument = NoShowRecord & Document;
export declare const NoShowRecordSchema: MongooseSchema<NoShowRecord, import("mongoose").Model<NoShowRecord, any, any, any, Document<unknown, any, NoShowRecord, any, {}> & NoShowRecord & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NoShowRecord, Document<unknown, {}, import("mongoose").FlatRecord<NoShowRecord>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<NoShowRecord> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
