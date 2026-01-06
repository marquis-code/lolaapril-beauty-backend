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
export type MembershipDocument = Membership & Document;
export declare class MembershipBenefit {
    benefitType: string;
    description: string;
    discountPercentage: number;
    freeServiceId: string;
    freeServiceName: string;
}
export declare class MembershipTier {
    tierName: string;
    tierLevel: number;
    minimumSpend: number;
    pointsMultiplier: number;
    benefits: MembershipBenefit[];
    tierColor: string;
}
export declare class Membership {
    membershipName: string;
    description: string;
    membershipType: string;
    tiers: MembershipTier[];
    pointsPerDollar: number;
    pointsRedemptionValue: number;
    subscriptionPrice: number;
    subscriptionDuration: number;
    generalBenefits: MembershipBenefit[];
    isActive: boolean;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const MembershipSchema: import("mongoose").Schema<Membership, import("mongoose").Model<Membership, any, any, any, Document<unknown, any, Membership, any, {}> & Membership & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Membership, Document<unknown, {}, import("mongoose").FlatRecord<Membership>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Membership> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
