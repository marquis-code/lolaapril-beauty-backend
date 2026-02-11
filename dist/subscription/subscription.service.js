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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subscription_schema_1 = require("./schemas/subscription.schema");
const business_schema_1 = require("../business/schemas/business.schema");
let SubscriptionService = class SubscriptionService {
    constructor(subscriptionModel, businessModel) {
        this.subscriptionModel = subscriptionModel;
        this.businessModel = businessModel;
        this.PLAN_DEFINITIONS = [
            {
                planType: 'trial',
                planName: '14-Day Free Trial',
                monthlyPrice: 0,
                yearlyPrice: 0,
                description: 'Try all basic features for 14 days',
                limits: {
                    maxStaff: 3,
                    maxServices: 10,
                    maxAppointmentsPerMonth: 100,
                    maxStorageGB: 1,
                    features: {
                        onlineBooking: true,
                        analytics: false,
                        marketing: false,
                        inventory: false,
                        multiLocation: false,
                        apiAccess: false,
                        customBranding: false,
                        advancedReports: false
                    }
                }
            },
            {
                planType: 'basic',
                planName: 'Basic Plan',
                monthlyPrice: 2900,
                yearlyPrice: 29000,
                description: 'Perfect for small salons getting started',
                limits: {
                    maxStaff: 5,
                    maxServices: 50,
                    maxAppointmentsPerMonth: 500,
                    maxStorageGB: 5,
                    features: {
                        onlineBooking: true,
                        analytics: true,
                        marketing: false,
                        inventory: false,
                        multiLocation: false,
                        apiAccess: false,
                        customBranding: false,
                        advancedReports: false
                    }
                }
            },
            {
                planType: 'standard',
                planName: 'Standard Plan',
                monthlyPrice: 7900,
                yearlyPrice: 79000,
                description: 'For growing businesses needing more features',
                limits: {
                    maxStaff: 15,
                    maxServices: 200,
                    maxAppointmentsPerMonth: 2000,
                    maxStorageGB: 20,
                    features: {
                        onlineBooking: true,
                        analytics: true,
                        marketing: true,
                        inventory: true,
                        multiLocation: false,
                        apiAccess: true,
                        customBranding: true,
                        advancedReports: true
                    }
                }
            },
            {
                planType: 'premium',
                planName: 'Premium Plan',
                monthlyPrice: 19900,
                yearlyPrice: 199000,
                description: 'For established businesses with multiple locations',
                limits: {
                    maxStaff: -1,
                    maxServices: -1,
                    maxAppointmentsPerMonth: -1,
                    maxStorageGB: 100,
                    features: {
                        onlineBooking: true,
                        analytics: true,
                        marketing: true,
                        inventory: true,
                        multiLocation: true,
                        apiAccess: true,
                        customBranding: true,
                        advancedReports: true
                    }
                }
            },
            {
                planType: 'enterprise',
                planName: 'Enterprise Plan',
                monthlyPrice: 0,
                yearlyPrice: 0,
                description: 'Custom solution for large chains',
                limits: {
                    maxStaff: -1,
                    maxServices: -1,
                    maxAppointmentsPerMonth: -1,
                    maxStorageGB: -1,
                    features: {
                        onlineBooking: true,
                        analytics: true,
                        marketing: true,
                        inventory: true,
                        multiLocation: true,
                        apiAccess: true,
                        customBranding: true,
                        advancedReports: true
                    }
                }
            }
        ];
    }
    async getAvailablePlans() {
        return this.PLAN_DEFINITIONS.map(plan => ({
            ...plan,
            monthlyPriceDisplay: (plan.monthlyPrice / 100).toFixed(2),
            yearlyPriceDisplay: (plan.yearlyPrice / 100).toFixed(2),
            yearlySavings: plan.monthlyPrice > 0
                ? (((plan.monthlyPrice * 12) - plan.yearlyPrice) / 100).toFixed(2)
                : '0.00'
        }));
    }
    async getPlanByType(planType) {
        const plan = this.PLAN_DEFINITIONS.find(p => p.planType === planType);
        if (!plan) {
            throw new common_1.NotFoundException(`Plan type '${planType}' not found`);
        }
        return plan;
    }
    async getBusinessSubscription(businessId) {
        const model = this.subscriptionModel;
        const subscription = await model
            .findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            status: { $in: ['active', 'past_due'] }
        })
            .lean()
            .exec();
        if (!subscription) {
            throw new common_1.NotFoundException('No active subscription found for this business');
        }
        return subscription;
    }
    async getSubscriptionWithBusiness(businessId) {
        const subscription = await this.getBusinessSubscription(businessId);
        const businessModel = this.businessModel;
        const business = await businessModel
            .findById(businessId)
            .select('businessName subdomain status')
            .lean()
            .exec();
        return {
            subscription,
            business
        };
    }
    async checkLimits(businessId, context) {
        try {
            const subscription = await this.getBusinessSubscription(businessId);
            const usage = await this.getCurrentUsage(businessId);
            const limits = subscription.limits;
            const warnings = [];
            const blocked = [];
            if (context === 'staff' || !context) {
                if (limits.maxStaff !== -1) {
                    if (usage.staffCount >= limits.maxStaff) {
                        blocked.push(`Staff limit reached (${limits.maxStaff}/${limits.maxStaff})`);
                    }
                    else if (usage.staffCount >= limits.maxStaff * 0.9) {
                        warnings.push(`Approaching staff limit (${usage.staffCount}/${limits.maxStaff})`);
                    }
                }
            }
            if (context === 'service' || !context) {
                if (limits.maxServices !== -1) {
                    if (usage.servicesCount >= limits.maxServices) {
                        blocked.push(`Services limit reached (${limits.maxServices}/${limits.maxServices})`);
                    }
                    else if (usage.servicesCount >= limits.maxServices * 0.9) {
                        warnings.push(`Approaching services limit (${usage.servicesCount}/${limits.maxServices})`);
                    }
                }
            }
            if (context === 'booking' || !context) {
                if (limits.maxAppointmentsPerMonth !== -1) {
                    if (usage.monthlyAppointments >= limits.maxAppointmentsPerMonth) {
                        blocked.push(`Monthly appointments limit reached (${limits.maxAppointmentsPerMonth}/${limits.maxAppointmentsPerMonth})`);
                    }
                    else if (usage.monthlyAppointments >= limits.maxAppointmentsPerMonth * 0.9) {
                        warnings.push(`Approaching monthly appointments limit (${usage.monthlyAppointments}/${limits.maxAppointmentsPerMonth})`);
                    }
                }
            }
            if (limits.maxStorageGB !== -1) {
                if (usage.storageUsedGB >= limits.maxStorageGB) {
                    blocked.push(`Storage limit reached (${limits.maxStorageGB}GB/${limits.maxStorageGB}GB)`);
                }
                else if (usage.storageUsedGB >= limits.maxStorageGB * 0.9) {
                    warnings.push(`Approaching storage limit (${usage.storageUsedGB}GB/${limits.maxStorageGB}GB)`);
                }
            }
            return {
                isValid: blocked.length === 0,
                canProceed: blocked.length === 0,
                limits,
                usage,
                warnings,
                blocked
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to check subscription limits');
        }
    }
    async hasFeature(businessId, feature) {
        try {
            const subscription = await this.getBusinessSubscription(businessId);
            return subscription.limits.features[feature] === true;
        }
        catch (error) {
            return false;
        }
    }
    async getCurrentUsage(businessId) {
        const model = this.businessModel;
        const business = await model.findById(businessId).lean().exec();
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return {
            staffCount: business?.staffIds?.length || 0,
            servicesCount: 0,
            monthlyAppointments: 0,
            storageUsedGB: 0
        };
    }
    async createTrialSubscription(businessId) {
        const trialPlan = await this.getPlanByType('trial');
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
        const subscription = await this.subscriptionModel.create({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            planType: trialPlan.planType,
            planName: trialPlan.planName,
            monthlyPrice: trialPlan.monthlyPrice,
            yearlyPrice: trialPlan.yearlyPrice,
            billingCycle: 'monthly',
            startDate,
            endDate,
            nextBillingDate: endDate,
            status: 'active',
            limits: trialPlan.limits,
            trialDays: 14
        });
        await this.businessModel.findByIdAndUpdate(businessId, {
            activeSubscription: subscription._id,
            status: 'trial',
            trialEndsAt: endDate
        });
        return subscription;
    }
    async upgradePlan(businessId, planType, billingCycle = 'monthly') {
        const currentSub = await this.getBusinessSubscription(businessId);
        const newPlan = await this.getPlanByType(planType);
        const planHierarchy = { trial: 0, basic: 1, standard: 2, premium: 3, enterprise: 4 };
        if (planHierarchy[planType] <= planHierarchy[currentSub.planType]) {
            throw new common_1.BadRequestException('Can only upgrade to a higher plan');
        }
        await this.subscriptionModel.findByIdAndUpdate(currentSub._id, {
            status: 'cancelled',
            cancellationDate: new Date(),
            cancellationReason: 'Upgraded to higher plan',
            updatedAt: new Date()
        });
        const startDate = new Date();
        const daysToAdd = billingCycle === 'yearly' ? 365 : 30;
        const endDate = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        const newSub = await this.subscriptionModel.create({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            planType: newPlan.planType,
            planName: newPlan.planName,
            monthlyPrice: newPlan.monthlyPrice,
            yearlyPrice: newPlan.yearlyPrice,
            billingCycle,
            startDate,
            endDate,
            nextBillingDate: endDate,
            status: 'active',
            limits: newPlan.limits,
            autoRenew: true
        });
        await this.businessModel.findByIdAndUpdate(businessId, {
            activeSubscription: newSub._id,
            status: 'active'
        });
        return {
            success: true,
            message: `Successfully upgraded to ${newPlan.planName}`,
            oldPlan: currentSub.planType,
            newPlan: newSub.planType,
            subscription: newSub
        };
    }
    async downgradePlan(businessId, planType) {
        const currentSub = await this.getBusinessSubscription(businessId);
        const newPlan = await this.getPlanByType(planType);
        const planHierarchy = { trial: 0, basic: 1, standard: 2, premium: 3, enterprise: 4 };
        if (planHierarchy[planType] >= planHierarchy[currentSub.planType]) {
            throw new common_1.BadRequestException('Can only downgrade to a lower plan');
        }
        await this.subscriptionModel.findByIdAndUpdate(currentSub._id, {
            $set: {
                'metadata.scheduledDowngrade': {
                    planType: newPlan.planType,
                    effectiveDate: currentSub.endDate
                }
            },
            updatedAt: new Date()
        });
        return {
            success: true,
            message: `Downgrade scheduled for ${currentSub.endDate.toDateString()}`,
            currentPlan: currentSub.planType,
            scheduledPlan: newPlan.planType,
            effectiveDate: currentSub.endDate
        };
    }
    async cancelSubscription(businessId, reason, immediate = false) {
        const subscription = await this.getBusinessSubscription(businessId);
        if (immediate) {
            await this.subscriptionModel.findByIdAndUpdate(subscription._id, {
                status: 'cancelled',
                cancellationDate: new Date(),
                cancellationReason: reason,
                endDate: new Date(),
                updatedAt: new Date()
            });
            await this.businessModel.findByIdAndUpdate(businessId, {
                status: 'inactive'
            });
            return {
                success: true,
                message: 'Subscription cancelled immediately',
                effectiveDate: new Date()
            };
        }
        else {
            await this.subscriptionModel.findByIdAndUpdate(subscription._id, {
                autoRenew: false,
                cancellationReason: reason,
                updatedAt: new Date()
            });
            return {
                success: true,
                message: 'Subscription will be cancelled at the end of billing period',
                effectiveDate: subscription.endDate
            };
        }
    }
    async reactivateSubscription(businessId) {
        const model = this.subscriptionModel;
        const subscription = await model
            .findOne({ businessId: new mongoose_2.Types.ObjectId(businessId) })
            .sort({ createdAt: -1 })
            .exec();
        if (!subscription) {
            throw new common_1.NotFoundException('No subscription found');
        }
        if (subscription.status === 'active') {
            throw new common_1.BadRequestException('Subscription is already active');
        }
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        await this.subscriptionModel.findByIdAndUpdate(subscription._id, {
            status: 'active',
            startDate,
            endDate,
            nextBillingDate: endDate,
            autoRenew: true,
            updatedAt: new Date()
        });
        await this.businessModel.findByIdAndUpdate(businessId, {
            status: 'active',
            activeSubscription: subscription._id
        });
        return {
            success: true,
            message: 'Subscription reactivated successfully',
            subscription
        };
    }
    async getSubscriptionHistory(businessId) {
        const model = this.subscriptionModel;
        const result = await model
            .find({ businessId: new mongoose_2.Types.ObjectId(businessId) })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        return result;
    }
    async isSubscriptionActive(businessId) {
        try {
            const subscription = await this.getBusinessSubscription(businessId);
            return subscription.status === 'active' && new Date() < new Date(subscription.endDate);
        }
        catch {
            return false;
        }
    }
    async getRemainingTrialDays(businessId) {
        try {
            const subscription = await this.getBusinessSubscription(businessId);
            if (subscription.planType !== 'trial') {
                return 0;
            }
            const now = new Date();
            const endDate = new Date(subscription.endDate);
            const remainingMs = endDate.getTime() - now.getTime();
            const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
            return Math.max(0, remainingDays);
        }
        catch {
            return 0;
        }
    }
};
SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __param(1, (0, mongoose_1.InjectModel)(business_schema_1.Business.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscription.service.js.map