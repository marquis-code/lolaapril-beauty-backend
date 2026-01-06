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
exports.PricingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pricing_service_1 = require("./pricing.service");
const create_pricing_tier_dto_1 = require("./dto/create-pricing-tier.dto");
const auth_1 = require("../auth");
let PricingController = class PricingController {
    constructor(pricingService) {
        this.pricingService = pricingService;
    }
    async createTier(createDto) {
        return this.pricingService.createTier(createDto);
    }
    async getActiveTiers() {
        return this.pricingService.getActiveTiers();
    }
    async getBusisinessFeeStructure(businessId) {
        return this.pricingService.getBusinessFeeStructure(businessId);
    }
    async calculateFees(businessId, amount) {
        return this.pricingService.calculateFees(businessId, amount);
    }
    async changePlan(businessId, body) {
        return this.pricingService.changePlan(businessId, body.newTierId, body.reason);
    }
    async getPricingHistory(businessId) {
        return this.pricingService.getPricingHistory(businessId);
    }
};
__decorate([
    (0, common_1.Post)('tiers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create pricing tier (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pricing_tier_dto_1.CreatePricingTierDto]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "createTier", null);
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Get)('tiers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "getActiveTiers", null);
__decorate([
    (0, common_1.Get)('business/:businessId/fee-structure'),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "getBusisinessFeeStructure", null);
__decorate([
    (0, common_1.Post)('business/:businessId/calculate-fees'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "calculateFees", null);
__decorate([
    (0, common_1.Post)('business/:businessId/change-plan'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "changePlan", null);
__decorate([
    (0, common_1.Get)('business/:businessId/history'),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "getPricingHistory", null);
PricingController = __decorate([
    (0, swagger_1.ApiTags)('Pricing & Fees'),
    (0, common_1.Controller)('pricing'),
    __metadata("design:paramtypes", [pricing_service_1.PricingService])
], PricingController);
exports.PricingController = PricingController;
//# sourceMappingURL=pricing.controller.js.map