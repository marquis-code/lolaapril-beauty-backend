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
const pricing_service_1 = require("./pricing.service");
const create_pricing_tier_dto_1 = require("./dto/create-pricing-tier.dto");
let PricingController = class PricingController {
    constructor(pricingService) {
        this.pricingService = pricingService;
    }
    createTier(createDto) {
        return this.pricingService.createTier(createDto);
    }
    getActiveTiers() {
        return this.pricingService.getActiveTiers();
    }
    getTenantFeeStructure(tenantId) {
        return this.pricingService.getTenantFeeStructure(tenantId);
    }
    calculateFees(tenantId, amount) {
        return this.pricingService.calculateFees(tenantId, amount);
    }
    changePlan(tenantId, body) {
        return this.pricingService.changeTenantPlan(tenantId, body.newTierId, body.changedBy, body.reason);
    }
    grandfatherPricing(tenantId, reason) {
        return this.pricingService.grandfatherTenantPricing(tenantId, reason);
    }
    getPricingHistory(tenantId) {
        return this.pricingService.getPricingHistory(tenantId);
    }
};
__decorate([
    (0, common_1.Post)('tiers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pricing_tier_dto_1.CreatePricingTierDto]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "createTier", null);
__decorate([
    (0, common_1.Get)('tiers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "getActiveTiers", null);
__decorate([
    (0, common_1.Get)('tenant/:tenantId/fee-structure'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "getTenantFeeStructure", null);
__decorate([
    (0, common_1.Post)('tenant/:tenantId/calculate-fees'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "calculateFees", null);
__decorate([
    (0, common_1.Post)('tenant/:tenantId/change-plan'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "changePlan", null);
__decorate([
    (0, common_1.Post)('tenant/:tenantId/grandfather'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "grandfatherPricing", null);
__decorate([
    (0, common_1.Get)('tenant/:tenantId/history'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "getPricingHistory", null);
PricingController = __decorate([
    (0, common_1.Controller)('pricing'),
    __metadata("design:paramtypes", [pricing_service_1.PricingService])
], PricingController);
exports.PricingController = PricingController;
//# sourceMappingURL=pricing.controller.js.map