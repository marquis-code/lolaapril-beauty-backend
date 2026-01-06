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
import { Model, Types } from 'mongoose';
import { PricingTier, PricingTierDocument } from './schemas/pricing-tier.schema';
import { FeeStructure, FeeStructureDocument } from './schemas/fee-structure.schema';
import { PricingHistory, PricingHistoryDocument } from './schemas/pricing-history.schema';
import { CreatePricingTierDto } from './dto/create-pricing-tier.dto';
type LeanPricingTier = {
    _id: any;
    tierName: string;
    tierLevel: number;
    commissionRate: number;
    isActive: boolean;
    [key: string]: any;
};
type LeanFeeStructure = {
    _id: any;
    businessId: any;
    pricingTierId: any;
    platformFeePercentage: number;
    platformFeeFixed?: number;
    effectiveFrom: Date;
    effectiveTo?: Date;
    isGrandfathered: boolean;
    [key: string]: any;
};
type LeanPricingHistory = {
    _id: any;
    businessId: any;
    changeType: string;
    oldTierId?: any;
    newTierId: any;
    oldCommissionRate?: number;
    newCommissionRate: number;
    effectiveDate: Date;
    reason: string;
    createdAt: Date;
    [key: string]: any;
};
export declare class PricingService {
    private pricingTierModel;
    private feeStructureModel;
    private pricingHistoryModel;
    constructor(pricingTierModel: Model<PricingTierDocument>, feeStructureModel: Model<FeeStructureDocument>, pricingHistoryModel: Model<PricingHistoryDocument>);
    createTier(createDto: CreatePricingTierDto): Promise<import("mongoose").Document<unknown, {}, PricingTierDocument, {}, {}> & PricingTier & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getActiveTiers(): Promise<LeanPricingTier[]>;
    getBusinessFeeStructure(businessId: string): Promise<LeanFeeStructure | null>;
    calculateFees(businessId: string, bookingAmount: number): Promise<{
        bookingAmount: number;
        platformFeePercentage: number;
        platformFeeFixed: number;
        totalPlatformFee: number;
        businessReceives: number;
        isGrandfathered: boolean;
    }>;
    changePlan(businessId: string, newTierId: string, reason: string): Promise<{
        newStructure: import("mongoose").Document<unknown, {}, FeeStructureDocument, {}, {}> & FeeStructure & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        history: import("mongoose").Document<unknown, {}, PricingHistoryDocument, {}, {}> & PricingHistory & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getPricingHistory(businessId: string): Promise<LeanPricingHistory[]>;
}
export {};
