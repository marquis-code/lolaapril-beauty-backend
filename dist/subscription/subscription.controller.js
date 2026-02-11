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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subscription_service_1 = require("./subscription.service");
const subscription_dto_1 = require("./dto/subscription.dto");
const auth_1 = require("../auth");
let SubscriptionController = class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async getAvailablePlans() {
        const plans = await this.subscriptionService.getAvailablePlans();
        return {
            success: true,
            data: plans,
            message: 'Plans retrieved successfully'
        };
    }
    async getPlanDetails(planType) {
        const plan = await this.subscriptionService.getPlanByType(planType);
        return {
            success: true,
            data: plan,
            message: 'Plan details retrieved'
        };
    }
    async getBusinessSubscription(businessId) {
        const data = await this.subscriptionService.getSubscriptionWithBusiness(businessId);
        return {
            success: true,
            data,
            message: 'Subscription retrieved successfully'
        };
    }
    async getHistory(businessId) {
        const history = await this.subscriptionService.getSubscriptionHistory(businessId);
        return {
            success: true,
            data: history,
            message: 'History retrieved successfully'
        };
    }
    async checkLimits(businessId, context) {
        const limits = await this.subscriptionService.checkLimits(businessId, context);
        return {
            success: true,
            data: limits,
            message: limits.canProceed
                ? 'Within subscription limits'
                : 'Subscription limit exceeded'
        };
    }
    async getUsage(businessId) {
        const usage = await this.subscriptionService.getCurrentUsage(businessId);
        return {
            success: true,
            data: usage,
            message: 'Usage statistics retrieved'
        };
    }
    async getTrialStatus(businessId) {
        const remainingDays = await this.subscriptionService.getRemainingTrialDays(businessId);
        const subscription = await this.subscriptionService.getBusinessSubscription(businessId);
        return {
            success: true,
            data: {
                isTrial: subscription.planType === 'trial',
                remainingDays,
                endDate: subscription.endDate
            }
        };
    }
    async upgradePlan(businessId, dto) {
        const result = await this.subscriptionService.upgradePlan(businessId, dto.planType, dto.billingCycle || 'monthly');
        return result;
    }
    async downgradePlan(businessId, dto) {
        return this.subscriptionService.downgradePlan(businessId, dto.planType);
    }
    async cancelSubscription(businessId, dto) {
        return this.subscriptionService.cancelSubscription(businessId, dto.reason, dto.immediate || false);
    }
    async reactivateSubscription(businessId) {
        return this.subscriptionService.reactivateSubscription(businessId);
    }
};
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Get)('plans'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available subscription plans (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plans retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getAvailablePlans", null);
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Get)('plans/:planType'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific plan details (Public)' }),
    __param(0, (0, common_1.Param)('planType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getPlanDetails", null);
__decorate([
    (0, common_1.Get)('business'),
    (0, auth_1.ValidateBusiness)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get business subscription details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription retrieved successfully' }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getBusinessSubscription", null);
__decorate([
    (0, common_1.Get)('business/history'),
    (0, auth_1.ValidateBusiness)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get subscription history' }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('business/limits'),
    (0, auth_1.ValidateBusiness)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check subscription limits and usage' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Limits checked successfully' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Query)('context')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "checkLimits", null);
__decorate([
    (0, common_1.Get)('business/usage'),
    (0, auth_1.ValidateBusiness)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current usage statistics' }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getUsage", null);
__decorate([
    (0, common_1.Get)('business/trial-status'),
    (0, auth_1.ValidateBusiness)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get trial status and remaining days' }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getTrialStatus", null);
__decorate([
    (0, common_1.Post)('business/upgrade'),
    (0, auth_1.ValidateBusiness)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upgrade subscription plan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plan upgraded successfully' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.UpgradePlanDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "upgradePlan", null);
__decorate([
    (0, common_1.Post)('business/downgrade'),
    (0, auth_1.ValidateBusiness)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Downgrade subscription plan (effective at end of period)' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.UpgradePlanDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "downgradePlan", null);
__decorate([
    (0, common_1.Post)('business/cancel'),
    (0, auth_1.ValidateBusiness)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel subscription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription cancelled' }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.CancelSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "cancelSubscription", null);
__decorate([
    (0, common_1.Post)('business/reactivate'),
    (0, auth_1.ValidateBusiness)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate cancelled subscription' }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "reactivateSubscription", null);
SubscriptionController = __decorate([
    (0, swagger_1.ApiTags)('Subscriptions'),
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], SubscriptionController);
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=subscription.controller.js.map