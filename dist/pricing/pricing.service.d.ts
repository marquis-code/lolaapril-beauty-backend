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
import { CreatePricingTierDto } from "./dto/create-pricing-tier.dto";
import { PricingHistory, PricingHistoryDocument } from './schemas/pricing-history.schema';
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
    getActiveTiers(): Promise<(import("mongoose").Document<unknown, {}, PricingTierDocument, {}, {}> & PricingTier & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTenantFeeStructure(tenantId: string): Promise<import("mongoose").Document<unknown, {}, FeeStructureDocument, {}, {}> & FeeStructure & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    calculateFees(tenantId: string, bookingAmount: number): Promise<{
        bookingAmount: number;
        platformFeePercentage: number;
        platformFeeFixed: number;
        totalPlatformFee: number;
        businessReceives: number;
        isGrandfathered: boolean;
    }>;
    changeTenantPlan(tenantId: string, newTierId: string, changedBy: string, reason: string): Promise<{
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
    grandfatherTenantPricing(tenantId: string, reason: string): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, FeeStructureDocument, {}, {}> & FeeStructure & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getPricingHistory(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, PricingHistoryDocument, {}, {}> & PricingHistory & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
