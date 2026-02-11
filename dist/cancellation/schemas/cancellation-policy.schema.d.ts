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
export type CancellationPolicyDocument = CancellationPolicy & Document;
export interface PolicyRule {
    hoursBeforeAppointment: number;
    refundPercentage: number;
    penaltyPercentage: number;
    description?: string;
}
export declare class CancellationPolicy {
    businessId: Types.ObjectId;
    policyName: string;
    requiresDeposit: boolean;
    depositPercentage: number;
    minimumDepositAmount: number;
    cancellationWindowHours: number;
    rules: PolicyRule[];
    allowSameDayCancellation: boolean;
    sameDayRefundPercentage: number;
    sendReminders: boolean;
    reminderHours: number[];
    maxNoShowsBeforeDeposit: number;
    isActive: boolean;
    applicableServices: Types.ObjectId[];
    description: string;
}
export declare const CancellationPolicySchema: MongooseSchema<CancellationPolicy, import("mongoose").Model<CancellationPolicy, any, any, any, Document<unknown, any, CancellationPolicy, any, {}> & CancellationPolicy & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CancellationPolicy, Document<unknown, {}, import("mongoose").FlatRecord<CancellationPolicy>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CancellationPolicy> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
