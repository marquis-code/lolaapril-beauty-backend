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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
let ReviewService = class ReviewService {
    constructor(reviewModel) {
        this.reviewModel = reviewModel;
    }
    async createReview(clientId, clientName, dto) {
        if (dto.appointmentId) {
            const existing = await this.reviewModel.findOne({
                appointmentId: new mongoose_2.Types.ObjectId(dto.appointmentId),
            });
            if (existing) {
                throw new common_1.ConflictException('You have already reviewed this appointment');
            }
        }
        const review = new this.reviewModel({
            clientId: new mongoose_2.Types.ObjectId(clientId),
            clientName,
            businessId: new mongoose_2.Types.ObjectId(dto.businessId),
            appointmentId: dto.appointmentId ? new mongoose_2.Types.ObjectId(dto.appointmentId) : undefined,
            serviceId: dto.serviceId ? new mongoose_2.Types.ObjectId(dto.serviceId) : undefined,
            serviceName: dto.serviceName,
            rating: dto.rating,
            comment: dto.comment,
            isVerified: !!dto.appointmentId,
        });
        return review.save();
    }
    async getReviewsByBusiness(businessId, page = 1, limit = 20) {
        const filter = { businessId: new mongoose_2.Types.ObjectId(businessId), isVisible: true };
        const skip = (page - 1) * limit;
        const [reviews, total, ratingAgg] = await Promise.all([
            this.reviewModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.reviewModel.countDocuments(filter),
            this.reviewModel.aggregate([
                { $match: filter },
                { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
            ]),
        ]);
        return {
            reviews,
            total,
            averageRating: ratingAgg[0]?.avg || 0,
        };
    }
    async getReviewsByService(serviceId) {
        return this.reviewModel.find({
            serviceId: new mongoose_2.Types.ObjectId(serviceId),
            isVisible: true,
        }).sort({ createdAt: -1 }).lean();
    }
    async respondToReview(reviewId, dto) {
        const review = await this.reviewModel.findByIdAndUpdate(reviewId, {
            businessResponse: dto.response,
            businessRespondedAt: new Date(),
        }, { new: true });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return review;
    }
    async getReviewByAppointment(appointmentId) {
        return this.reviewModel.findOne({
            appointmentId: new mongoose_2.Types.ObjectId(appointmentId),
        }).lean();
    }
};
ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReviewService);
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map