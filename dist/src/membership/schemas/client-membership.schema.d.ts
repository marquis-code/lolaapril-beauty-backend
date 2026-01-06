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
import { type Document, Types } from "mongoose";
export type ClientMembershipDocument = ClientMembership & Document;
export declare class PointsTransaction {
    transactionType: string;
    points: number;
    description: string;
    saleId: Types.ObjectId;
    appointmentId: Types.ObjectId;
    transactionDate: Date;
}
export declare class ClientMembership {
    clientId: Types.ObjectId;
    membershipId: Types.ObjectId;
    membershipNumber: string;
    joinDate: Date;
    expiryDate: Date;
    totalPoints: number;
    totalSpent: number;
    currentTier: string;
    tierProgress: number;
    pointsHistory: PointsTransaction[];
    status: string;
    lastActivity: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ClientMembershipSchema: import("mongoose").Schema<ClientMembership, import("mongoose").Model<ClientMembership, any, any, any, Document<unknown, any, ClientMembership, any, {}> & ClientMembership & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ClientMembership, Document<unknown, {}, import("mongoose").FlatRecord<ClientMembership>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ClientMembership> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
