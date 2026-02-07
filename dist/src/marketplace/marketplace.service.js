"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const business_verification_schema_1 = require("./schemas/business-verification.schema");
const review_schema_1 = require("./schemas/review.schema");
const quality_metric_schema_1 = require("./schemas/quality-metric.schema");
let MarketplaceService = class MarketplaceService {
    constructor(verificationModel, reviewModel, qualityMetricModel) {
        this.verificationModel = verificationModel;
        this.reviewModel = reviewModel;
        this.qualityMetricModel = qualityMetricModel;
    }
    async submitForVerification(businessId, documents) {
        const existing = await this.verificationModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (existing) {
            throw new common_1.BadRequestException('Verification already submitted');
        }
        const verification = new this.verificationModel({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            status: 'pending',
            verificationLevel: 'basic',
            businessDocuments: documents,
        });
        return verification.save();
    }
    async updateVerificationStatus(verificationId, status, verifiedBy, notes) {
        const verification = await this.verificationModel.findById(verificationId);
        if (!verification) {
            throw new common_1.NotFoundException('Verification not found');
        }
        verification.status = status;
        if (status === 'verified') {
            verification.verifiedBy = new mongoose_2.Types.ObjectId(verifiedBy);
            verification.verifiedAt = new Date();
        }
        if (status === 'rejected' && notes) {
            verification.rejectionReason = notes;
        }
        if (notes) {
            verification.verificationNotes.push(notes);
        }
        return verification.save();
    }
    async getVerificationStatus(businessId) {
        return this.verificationModel
            .findOne({ businessId: new mongoose_2.Types.ObjectId(businessId) })
            .populate('verifiedBy', 'firstName lastName')
            .exec();
    }
    async getPendingVerifications(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const verifications = await this.verificationModel
            .find({ status: { $in: ['pending', 'in_review'] } })
            .populate('tenantId', 'businessName email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.verificationModel.countDocuments({
            status: { $in: ['pending', 'in_review'] }
        });
        return {
            verifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async createReview(createDto) {
        const existing = await this.reviewModel.findOne({
            bookingId: new mongoose_2.Types.ObjectId(createDto.bookingId),
        });
        if (existing) {
            throw new common_1.BadRequestException('Review already exists for this booking');
        }
        const review = new this.reviewModel({
            businessId: new mongoose_2.Types.ObjectId(createDto.businessId),
            clientId: new mongoose_2.Types.ObjectId(createDto.clientId),
            bookingId: new mongoose_2.Types.ObjectId(createDto.bookingId),
            rating: createDto.rating,
            reviewText: createDto.reviewText,
            ratings: createDto.ratings,
            moderationStatus: 'pending',
            isVerifiedBooking: true,
        });
        const savedReview = await review.save();
        await this.updateBusinessRating(createDto.businessId);
        return savedReview;
    }
    async getBusinessReviews(businessId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const reviews = await this.reviewModel
            .find({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            moderationStatus: 'approved',
        })
            .populate('clientId', 'firstName lastName profilePhoto')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.reviewModel.countDocuments({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            moderationStatus: 'approved',
        });
        return {
            reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async moderateReview(reviewId, status, moderatorId, reason) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        review.moderationStatus = status;
        review.moderatedBy = new mongoose_2.Types.ObjectId(moderatorId);
        review.moderatedAt = new Date();
        if (reason) {
            review.moderationReason = reason;
        }
        return review.save();
    }
    async respondToReview(reviewId, responseText, responderId) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        review.businessResponse = {
            text: responseText,
            respondedAt: new Date(),
            respondedBy: new mongoose_2.Types.ObjectId(responderId),
        };
        return review.save();
    }
    async markReviewHelpful(reviewId, helpful) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (helpful) {
            review.helpfulCount += 1;
        }
        else {
            review.notHelpfulCount += 1;
        }
        return review.save();
    }
    async updateBusinessRating(businessId) {
        const stats = await this.reviewModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    moderationStatus: 'approved',
                },
            },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    avgService: { $avg: '$ratings.service' },
                    avgCleanliness: { $avg: '$ratings.cleanliness' },
                    avgProfessionalism: { $avg: '$ratings.professionalism' },
                    avgValueForMoney: { $avg: '$ratings.valueForMoney' },
                },
            },
        ]);
        return stats[0] || null;
    }
    async updateQualityMetrics(businessId) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const metrics = {
            responseRate: 95,
            avgResponseTime: 15,
            completionRate: 98,
            cancellationRate: 2,
            onTimeRate: 96,
        };
        await this.verificationModel.updateOne({ businessId: new mongoose_2.Types.ObjectId(businessId) }, { qualityMetrics: metrics });
        const metric = new this.qualityMetricModel({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            metricType: 'overall_quality',
            value: Object.values(metrics).reduce((a, b) => a + b, 0) / Object.keys(metrics).length,
            period: 'monthly',
            date: now,
            details: metrics,
        });
        await metric.save();
        return metrics;
    }
    async getBusinessQualityScore(businessId) {
        const verification = await this.verificationModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
        });
        if (!verification || !verification.qualityMetrics) {
            return null;
        }
        return {
            score: this.calculateQualityScore(verification.qualityMetrics),
            metrics: verification.qualityMetrics,
            verificationLevel: verification.verificationLevel,
            isVerified: verification.status === 'verified',
        };
    }
    calculateQualityScore(metrics) {
        const weights = {
            responseRate: 0.2,
            avgResponseTime: 0.15,
            completionRate: 0.3,
            cancellationRate: -0.2,
            onTimeRate: 0.15,
        };
        let score = 0;
        score += metrics.responseRate * weights.responseRate;
        score += (100 - metrics.avgResponseTime) * weights.avgResponseTime;
        score += metrics.completionRate * weights.completionRate;
        score += (100 - metrics.cancellationRate) * Math.abs(weights.cancellationRate);
        score += metrics.onTimeRate * weights.onTimeRate;
        return Math.round(score);
    }
    async searchBusinesses(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const verifiedBusinessIds = await this.verificationModel
            .find({ status: 'verified' })
            .select('tenantId')
            .lean();
        return {
            businesses: [],
            pagination: {
                page,
                limit,
                total: 0,
                pages: 0,
            },
        };
    }
    async getMarketplaceStats() {
        const totalBusinesses = await this.verificationModel.countDocuments();
        const verifiedBusinesses = await this.verificationModel.countDocuments({ status: 'verified' });
        const totalReviews = await this.reviewModel.countDocuments({ moderationStatus: 'approved' });
        const avgRating = await this.reviewModel.aggregate([
            { $match: { moderationStatus: 'approved' } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } },
        ]);
        return {
            totalBusinesses,
            verifiedBusinesses,
            verificationRate: totalBusinesses > 0 ? (verifiedBusinesses / totalBusinesses) * 100 : 0,
            totalReviews,
            avgRating: avgRating[0]?.avgRating || 0,
        };
    }
};
MarketplaceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(business_verification_schema_1.BusinessVerification.name)),
    __param(1, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(2, (0, mongoose_1.InjectModel)(quality_metric_schema_1.QualityMetric.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MarketplaceService);
exports.MarketplaceService = MarketplaceService;
//# sourceMappingURL=marketplace.service.js.map