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
import { MarketplaceService } from './marketplace.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class MarketplaceController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    submitVerification(businessId: string, documents: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/business-verification.schema").BusinessVerificationDocument, {}, {}> & import("./schemas/business-verification.schema").BusinessVerification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateVerificationStatus(id: string, body: {
        status: string;
        verifiedBy: string;
        notes?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/business-verification.schema").BusinessVerificationDocument, {}, {}> & import("./schemas/business-verification.schema").BusinessVerification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getVerification(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/business-verification.schema").BusinessVerificationDocument, {}, {}> & import("./schemas/business-verification.schema").BusinessVerification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getVerificationStatus(businessId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/business-verification.schema").BusinessVerificationDocument, {}, {}> & import("./schemas/business-verification.schema").BusinessVerification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getQualityScoreById(id: string): Promise<{
        score: number;
        metrics: {
            responseRate: number;
            avgResponseTime: number;
            completionRate: number;
            cancellationRate: number;
            onTimeRate: number;
        };
        verificationLevel: string;
        isVerified: boolean;
    }>;
    getQualityScore(businessId: string): Promise<{
        score: number;
        metrics: {
            responseRate: number;
            avgResponseTime: number;
            completionRate: number;
            cancellationRate: number;
            onTimeRate: number;
        };
        verificationLevel: string;
        isVerified: boolean;
    }>;
    getPendingVerifications(page: number, limit: number): Promise<{
        verifications: (import("mongoose").Document<unknown, {}, import("./schemas/business-verification.schema").BusinessVerificationDocument, {}, {}> & import("./schemas/business-verification.schema").BusinessVerification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    createReview(createDto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/review.schema").ReviewDocument, {}, {}> & import("./schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getBusinessReviews(businessId: string, page: number, limit: number): Promise<{
        reviews: (import("mongoose").Document<unknown, {}, import("./schemas/review.schema").ReviewDocument, {}, {}> & import("./schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    moderateReview(id: string, body: {
        status: string;
        moderatorId: string;
        reason?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/review.schema").ReviewDocument, {}, {}> & import("./schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    respondToReview(id: string, body: {
        text: string;
        responderId: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/review.schema").ReviewDocument, {}, {}> & import("./schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    markHelpful(id: string, helpful: boolean): Promise<import("mongoose").Document<unknown, {}, import("./schemas/review.schema").ReviewDocument, {}, {}> & import("./schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateQualityMetrics(businessId: string): Promise<{
        responseRate: number;
        avgResponseTime: number;
        completionRate: number;
        cancellationRate: number;
        onTimeRate: number;
    }>;
    searchBusinesses(filters: any): Promise<{
        businesses: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getMarketplaceStats(): Promise<{
        totalBusinesses: number;
        verifiedBusinesses: number;
        verificationRate: number;
        totalReviews: number;
        avgRating: any;
    }>;
}
