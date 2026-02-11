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
export declare class ClientReliability {
    clientId: Types.ObjectId;
    businessId: Types.ObjectId;
    reliabilityScore: number;
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    noShowCount: number;
    lateCancellations: number;
    onTimeArrivals: number;
    lateArrivals: number;
    lastNoShowDate: Date;
    lastCancellationDate: Date;
    lastCompletedDate: Date;
    requiresDeposit: boolean;
    isBlacklisted: boolean;
    blacklistReason: string;
    blacklistedAt: Date;
    lifetimeValue: number;
    riskLevel: string;
}
export type ClientReliabilityDocument = ClientReliability & Document;
export declare const ClientReliabilitySchema: MongooseSchema<ClientReliability, import("mongoose").Model<ClientReliability, any, any, any, Document<unknown, any, ClientReliability, any, {}> & ClientReliability & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ClientReliability, Document<unknown, {}, import("mongoose").FlatRecord<ClientReliability>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ClientReliability> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
