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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { PricingService } from './pricing.service';
import { CreatePricingTierDto } from './dto/create-pricing-tier.dto';
export declare class PricingController {
    private readonly pricingService;
    constructor(pricingService: PricingService);
    createTier(createDto: CreatePricingTierDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/pricing-tier.schema").PricingTierDocument, {}, {}> & import("./schemas/pricing-tier.schema").PricingTier & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getActiveTiers(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/pricing-tier.schema").PricingTierDocument, {}, {}> & import("./schemas/pricing-tier.schema").PricingTier & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTenantFeeStructure(tenantId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/fee-structure.schema").FeeStructureDocument, {}, {}> & import("./schemas/fee-structure.schema").FeeStructure & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    calculateFees(tenantId: string, amount: number): Promise<{
        bookingAmount: number;
        platformFeePercentage: number;
        platformFeeFixed: number;
        totalPlatformFee: number;
        businessReceives: number;
        isGrandfathered: boolean;
    }>;
    changePlan(tenantId: string, body: {
        newTierId: string;
        changedBy: string;
        reason: string;
    }): Promise<{
        newStructure: import("mongoose").Document<unknown, {}, import("./schemas/fee-structure.schema").FeeStructureDocument, {}, {}> & import("./schemas/fee-structure.schema").FeeStructure & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        history: import("mongoose").Document<unknown, {}, import("./schemas/pricing-history.schema").PricingHistoryDocument, {}, {}> & import("./schemas/pricing-history.schema").PricingHistory & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    grandfatherPricing(tenantId: string, reason: string): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/fee-structure.schema").FeeStructureDocument, {}, {}> & import("./schemas/fee-structure.schema").FeeStructure & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getPricingHistory(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/pricing-history.schema").PricingHistoryDocument, {}, {}> & import("./schemas/pricing-history.schema").PricingHistory & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
