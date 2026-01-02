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
export type PricingHistoryDocument = PricingHistory & Document;
export declare class PricingHistory {
    tenantId: Types.ObjectId;
    changeType: string;
    oldTierId: Types.ObjectId;
    newTierId: Types.ObjectId;
    oldCommissionRate: number;
    newCommissionRate: number;
    effectiveDate: Date;
    reason: string;
    changedBy: Types.ObjectId;
}
export declare const PricingHistorySchema: import("mongoose").Schema<PricingHistory, import("mongoose").Model<PricingHistory, any, any, any, Document<unknown, any, PricingHistory, any, {}> & PricingHistory & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PricingHistory, Document<unknown, {}, import("mongoose").FlatRecord<PricingHistory>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<PricingHistory> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
