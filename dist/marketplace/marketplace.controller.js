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
exports.MarketplaceController = void 0;
const common_1 = require("@nestjs/common");
const business_context_decorator_1 = require("../auth/decorators/business-context.decorator");
const marketplace_service_1 = require("./marketplace.service");
const create_review_dto_1 = require("./dto/create-review.dto");
let MarketplaceController = class MarketplaceController {
    constructor(marketplaceService) {
        this.marketplaceService = marketplaceService;
    }
    submitVerification(businessId, documents) {
        return this.marketplaceService.submitForVerification(businessId, documents);
    }
    updateVerificationStatus(id, body) {
        return this.marketplaceService.updateVerificationStatus(id, body.status, body.verifiedBy, body.notes);
    }
    getVerification(id) {
        return this.marketplaceService.getVerification(id);
    }
    getVerificationStatus(businessId) {
        return this.marketplaceService.getVerificationStatus(businessId);
    }
    getQualityScoreById(id) {
        return this.marketplaceService.getBusinessQualityScore(id);
    }
    getQualityScore(businessId) {
        return this.marketplaceService.getBusinessQualityScore(businessId);
    }
    getPendingVerifications(page, limit) {
        return this.marketplaceService.getPendingVerifications(page, limit);
    }
    createReview(createDto) {
        return this.marketplaceService.createReview(createDto);
    }
    getBusinessReviews(businessId, page, limit) {
        return this.marketplaceService.getBusinessReviews(businessId, page, limit);
    }
    moderateReview(id, body) {
        return this.marketplaceService.moderateReview(id, body.status, body.moderatorId, body.reason);
    }
    respondToReview(id, body) {
        return this.marketplaceService.respondToReview(id, body.text, body.responderId);
    }
    markHelpful(id, helpful) {
        return this.marketplaceService.markReviewHelpful(id, helpful);
    }
    updateQualityMetrics(businessId) {
        return this.marketplaceService.updateQualityMetrics(businessId);
    }
    getQualityScore(businessId) {
        return this.marketplaceService.getBusinessQualityScore(businessId);
    }
    searchBusinesses(filters) {
        return this.marketplaceService.searchBusinesses(filters);
    }
    getMarketplaceStats() {
        return this.marketplaceService.getMarketplaceStats();
    }
};
__decorate([
    (0, common_1.Post)('verification'),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "submitVerification", null);
__decorate([
    (0, common_1.Put)('verification/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "updateVerificationStatus", null);
__decorate([
    (0, common_1.Get)('verification/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getVerification", null);
__decorate([
    (0, common_1.Get)('verification'),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getVerificationStatus", null);
__decorate([
    (0, common_1.Get)('quality/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getQualityScoreById", null);
__decorate([
    (0, common_1.Get)('quality'),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getQualityScore", null);
__decorate([
    (0, common_1.Get)('verification/pending'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getPendingVerifications", null);
__decorate([
    (0, common_1.Post)('reviews'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('reviews/business/:businessId'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getBusinessReviews", null);
__decorate([
    (0, common_1.Put)('reviews/:id/moderate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "moderateReview", null);
__decorate([
    (0, common_1.Post)('reviews/:id/respond'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "respondToReview", null);
__decorate([
    (0, common_1.Post)('reviews/:id/helpful'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('helpful')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "markHelpful", null);
__decorate([
    (0, common_1.Post)('quality/update'),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "updateQualityMetrics", null);
__decorate([
    (0, common_1.Get)('quality'),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getQualityScore", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "searchBusinesses", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getMarketplaceStats", null);
MarketplaceController = __decorate([
    (0, common_1.Controller)('marketplace'),
    __metadata("design:paramtypes", [marketplace_service_1.MarketplaceService])
], MarketplaceController);
exports.MarketplaceController = MarketplaceController;
//# sourceMappingURL=marketplace.controller.js.map