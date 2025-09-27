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
exports.TenantController = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("./tenant.service");
let TenantController = class TenantController {
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    async createBusiness(createDto) {
        return await this.tenantService.createBusiness(createDto);
    }
    async getBusiness(businessId) {
        return await this.tenantService.getBusinessById(businessId);
    }
    async updateBusiness(businessId, updateData) {
        return await this.tenantService.updateBusiness(businessId, updateData);
    }
    async getTenantConfig(businessId) {
        return await this.tenantService.getTenantConfig(businessId);
    }
    async updateTenantConfig(businessId, configData) {
        return await this.tenantService.updateTenantConfig(businessId, configData);
    }
    async checkLimits(businessId) {
        return await this.tenantService.checkSubscriptionLimits(businessId);
    }
    async createSubscription(businessId, subscriptionData) {
        return await this.tenantService.createSubscription(businessId, subscriptionData);
    }
    async cancelSubscription(subscriptionId, reason) {
        return await this.tenantService.cancelSubscription(subscriptionId, reason);
    }
    async getBusinessesByOwner(ownerId) {
        return await this.tenantService.getBusinessesByOwner(ownerId);
    }
};
__decorate([
    (0, common_1.Post)('business'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "createBusiness", null);
__decorate([
    (0, common_1.Get)('business/:businessId'),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getBusiness", null);
__decorate([
    (0, common_1.Put)('business/:businessId'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "updateBusiness", null);
__decorate([
    (0, common_1.Get)('config/:businessId'),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getTenantConfig", null);
__decorate([
    (0, common_1.Put)('config/:businessId'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "updateTenantConfig", null);
__decorate([
    (0, common_1.Get)('subscription/limits/:businessId'),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "checkLimits", null);
__decorate([
    (0, common_1.Post)('subscription/:businessId'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Put)('subscription/:subscriptionId/cancel'),
    __param(0, (0, common_1.Param)('subscriptionId')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "cancelSubscription", null);
__decorate([
    (0, common_1.Get)('businesses/owner/:ownerId'),
    __param(0, (0, common_1.Param)('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getBusinessesByOwner", null);
TenantController = __decorate([
    (0, common_1.Controller)('tenant'),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantController);
exports.TenantController = TenantController;
//# sourceMappingURL=tenant.controller.js.map