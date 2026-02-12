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
import { BusinessVerification, BusinessVerificationDocument } from './schemas/business-verification.schema';
import { Review, ReviewDocument } from './schemas/review.schema';
import { QualityMetricDocument } from './schemas/quality-metric.schema';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class MarketplaceService {
    private verificationModel;
    private reviewModel;
    private qualityMetricModel;
    constructor(verificationModel: Model<BusinessVerificationDocument>, reviewModel: Model<ReviewDocument>, qualityMetricModel: Model<QualityMetricDocument>);
    submitForVerification(businessId: string, documents: any): Promise<import("mongoose").Document<unknown, {}, BusinessVerificationDocument, {}, {}> & BusinessVerification & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateVerificationStatus(verificationId: string, status: string, verifiedBy: string, notes?: string): Promise<import("mongoose").Document<unknown, {}, BusinessVerificationDocument, {}, {}> & BusinessVerification & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getVerificationStatus(businessId: string): Promise<import("mongoose").Document<unknown, {}, BusinessVerificationDocument, {}, {}> & BusinessVerification & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getVerification(id: string): Promise<import("mongoose").Document<unknown, {}, BusinessVerificationDocument, {}, {}> & BusinessVerification & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getPendingVerifications(page?: number, limit?: number): Promise<{
        verifications: (import("mongoose").Document<unknown, {}, BusinessVerificationDocument, {}, {}> & BusinessVerification & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    createReview(createDto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getBusinessReviews(businessId: string, page?: number, limit?: number): Promise<{
        reviews: (import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    moderateReview(reviewId: string, status: string, moderatorId: string, reason?: string): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    respondToReview(reviewId: string, responseText: string, responderId: string): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    markReviewHelpful(reviewId: string, helpful: boolean): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private updateBusinessRating;
    updateQualityMetrics(businessId: string): Promise<{
        responseRate: number;
        avgResponseTime: number;
        completionRate: number;
        cancellationRate: number;
        onTimeRate: number;
    }>;
    getBusinessQualityScore(businessId: string): Promise<{
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
    private calculateQualityScore;
    searchBusinesses(filters: {
        location?: string;
        category?: string;
        minRating?: number;
        verifiedOnly?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
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
