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
export type FeeStructureDocument = FeeStructure & Document;
export declare class FeeStructure {
    businessId: Types.ObjectId;
    pricingTierId: Types.ObjectId;
    effectiveFrom: Date;
    effectiveTo: Date;
    platformFeePercentage: number;
    platformFeeFixed: number;
    isGrandfathered: boolean;
    customRules: {
        noShowFee?: number;
        cancellationFee?: number;
        minBookingAmount?: number;
    };
}
export declare const FeeStructureSchema: import("mongoose").Schema<FeeStructure, import("mongoose").Model<FeeStructure, any, any, any, Document<unknown, any, FeeStructure, any, {}> & FeeStructure & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FeeStructure, Document<unknown, {}, import("mongoose").FlatRecord<FeeStructure>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<FeeStructure> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
