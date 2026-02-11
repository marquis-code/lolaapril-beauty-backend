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
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const review_service_1 = require("./review.service");
const review_dto_1 = require("./dto/review.dto");
const auth_1 = require("../auth");
let ReviewController = class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async createReview(user, dto) {
        const review = await this.reviewService.createReview(user?.sub || user?._id || user?.id, user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Customer', dto);
        return {
            success: true,
            data: review,
            message: 'Thank you for your review!',
        };
    }
    async getBusinessReviews(businessId, page, limit) {
        const result = await this.reviewService.getReviewsByBusiness(businessId, page || 1, limit || 20);
        return {
            success: true,
            data: result,
        };
    }
    async getServiceReviews(serviceId) {
        const reviews = await this.reviewService.getReviewsByService(serviceId);
        return {
            success: true,
            data: reviews,
        };
    }
    async getAppointmentReview(appointmentId) {
        const review = await this.reviewService.getReviewByAppointment(appointmentId);
        return {
            success: true,
            data: review,
        };
    }
    async respondToReview(reviewId, dto) {
        const review = await this.reviewService.respondToReview(reviewId, dto);
        return {
            success: true,
            data: review,
            message: 'Response submitted successfully',
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a review for a service/appointment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Review created successfully' }),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('business/:businessId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reviews for a business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reviews retrieved' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getBusinessReviews", null);
__decorate([
    (0, common_1.Get)('service/:serviceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reviews for a service' }),
    __param(0, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getServiceReviews", null);
__decorate([
    (0, common_1.Get)('appointment/:appointmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get review for a specific appointment' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getAppointmentReview", null);
__decorate([
    (0, common_1.Patch)(':id/respond'),
    (0, swagger_1.ApiOperation)({ summary: 'Business responds to a review' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_dto_1.BusinessRespondDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "respondToReview", null);
ReviewController = __decorate([
    (0, swagger_1.ApiTags)('Reviews'),
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [review_service_1.ReviewService])
], ReviewController);
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map