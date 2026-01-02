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
import { Document, Types } from "mongoose";
export type CommissionDocument = Commission & Document;
export declare class CommissionRule {
    ruleName: string;
    sourceType: string;
    commissionRate: number;
    isActive: boolean;
    description: string;
}
export declare class BookingSourceTracking {
    sourceType: string;
    sourceIdentifier: string;
    trackingCode: string;
    referralCode: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    trackedAt: Date;
    ipAddress: string;
    userAgent: string;
    referrerUrl: string;
}
export declare class Commission {
    bookingId: Types.ObjectId;
    businessId: Types.ObjectId;
    clientId: Types.ObjectId;
    paymentId: Types.ObjectId;
    sourceTracking: BookingSourceTracking;
    bookingAmount: number;
    isCommissionable: boolean;
    commissionRate: number;
    commissionAmount: number;
    platformFee: number;
    businessPayout: number;
    commissionReason: string;
    isFirstTimeClient: boolean;
    isMarketplaceAcquired: boolean;
    wasDisputed: boolean;
    disputeReason: string;
    disputeResolvedAt: Date;
    status: string;
    calculatedAt: Date;
    approvedAt: Date;
    paidAt: Date;
    approvedBy: Types.ObjectId;
    notes: string;
}
export declare const CommissionSchema: import("mongoose").Schema<Commission, import("mongoose").Model<Commission, any, any, any, Document<unknown, any, Commission, any, {}> & Commission & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Commission, Document<unknown, {}, import("mongoose").FlatRecord<Commission>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Commission> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
