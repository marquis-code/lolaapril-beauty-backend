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
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const business_schema_1 = require("./schemas/business.schema");
const subscription_schema_1 = require("./schemas/subscription.schema");
const tenant_config_schema_1 = require("./schemas/tenant-config.schema");
let TenantService = class TenantService {
    constructor(businessModel, subscriptionModel, tenantConfigModel) {
        this.businessModel = businessModel;
        this.subscriptionModel = subscriptionModel;
        this.tenantConfigModel = tenantConfigModel;
    }
    async createBusiness(createBusinessDto) {
        const existingBusiness = await this.businessModel.findOne({
            subdomain: createBusinessDto.subdomain
        });
        if (existingBusiness) {
            throw new common_1.BadRequestException('Subdomain already taken');
        }
        const businessData = {
            businessName: createBusinessDto.businessName,
            subdomain: createBusinessDto.subdomain,
            businessType: createBusinessDto.businessType,
            address: createBusinessDto.address,
            contact: createBusinessDto.contact,
            ownerId: new mongoose_2.Types.ObjectId(createBusinessDto.ownerId),
            status: 'trial',
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        };
        const business = new this.businessModel(businessData);
        const savedBusiness = await business.save();
        await this.createDefaultTenantConfig(savedBusiness._id.toString());
        await this.createTrialSubscription(savedBusiness._id.toString());
        return savedBusiness;
    }
    async getBusinessBySubdomain(subdomain) {
        const business = await this.businessModel
            .findOne({ subdomain })
            .populate('activeSubscription')
            .populate('ownerId', 'firstName lastName email');
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async getBusinessById(businessId) {
        const business = await this.businessModel
            .findById(businessId)
            .populate('activeSubscription')
            .populate('ownerId', 'firstName lastName email')
            .populate('adminIds', 'firstName lastName email role');
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async updateBusiness(businessId, updateData) {
        const business = await this.businessModel.findByIdAndUpdate(businessId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async checkSubscriptionLimits(businessId) {
        const business = await this.businessModel
            .findById(businessId)
            .populate('activeSubscription');
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        const subscription = business.activeSubscription;
        if (!subscription) {
            return {
                isValid: false,
                limits: null,
                usage: null,
                warnings: ['No active subscription']
            };
        }
        const usage = await this.getCurrentUsage(businessId);
        const limits = subscription.limits;
        const warnings = [];
        if (usage.staffCount >= limits.maxStaff) {
            warnings.push(`Staff limit reached (${limits.maxStaff})`);
        }
        if (usage.servicesCount >= limits.maxServices) {
            warnings.push(`Services limit reached (${limits.maxServices})`);
        }
        if (usage.monthlyAppointments >= limits.maxAppointmentsPerMonth) {
            warnings.push(`Monthly appointments limit reached (${limits.maxAppointmentsPerMonth})`);
        }
        if (usage.storageUsedGB >= limits.maxStorageGB) {
            warnings.push(`Storage limit reached (${limits.maxStorageGB}GB)`);
        }
        return {
            isValid: warnings.length === 0,
            limits,
            usage,
            warnings
        };
    }
    async getTenantConfig(businessId) {
        const config = await this.tenantConfigModel.findOne({ businessId });
        if (!config) {
            return await this.createDefaultTenantConfig(businessId);
        }
        return config;
    }
    async updateTenantConfig(businessId, configData) {
        const config = await this.tenantConfigModel.findOneAndUpdate({ businessId: new mongoose_2.Types.ObjectId(businessId) }, Object.assign(Object.assign({}, configData), { updatedAt: new Date() }), { new: true, upsert: true });
        return config;
    }
    async createSubscription(businessId, subscriptionData) {
        const startDate = new Date();
        const endDate = new Date();
        if (subscriptionData.billingCycle === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        }
        else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }
        const subscription = new this.subscriptionModel(Object.assign(Object.assign({ businessId: new mongoose_2.Types.ObjectId(businessId) }, subscriptionData), { startDate,
            endDate, nextBillingDate: endDate, status: 'active' }));
        const savedSubscription = await subscription.save();
        await this.businessModel.findByIdAndUpdate(businessId, {
            activeSubscription: savedSubscription._id,
            status: 'active'
        });
        return savedSubscription;
    }
    async cancelSubscription(subscriptionId, reason) {
        const subscription = await this.subscriptionModel.findById(subscriptionId);
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        subscription.status = 'cancelled';
        subscription.cancellationDate = new Date();
        subscription.cancellationReason = reason;
        subscription.autoRenew = false;
        await subscription.save();
        await this.businessModel.findByIdAndUpdate(subscription.businessId, {
            status: 'inactive'
        });
    }
    async getBusinessesByOwner(ownerId) {
        return await this.businessModel
            .find({ ownerId: new mongoose_2.Types.ObjectId(ownerId) })
            .populate('activeSubscription')
            .sort({ createdAt: -1 });
    }
    async addBusinessAdmin(businessId, adminId) {
        await this.businessModel.findByIdAndUpdate(businessId, {
            $addToSet: { adminIds: new mongoose_2.Types.ObjectId(adminId) }
        });
    }
    async removeBusinessAdmin(businessId, adminId) {
        await this.businessModel.findByIdAndUpdate(businessId, {
            $pull: { adminIds: new mongoose_2.Types.ObjectId(adminId) }
        });
    }
    async suspendBusiness(businessId, reason) {
        await this.businessModel.findByIdAndUpdate(businessId, {
            status: 'suspended',
            updatedAt: new Date()
        });
    }
    async reactivateBusiness(businessId) {
        const business = await this.businessModel.findById(businessId);
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        const hasActiveSubscription = await this.subscriptionModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            status: 'active',
            endDate: { $gt: new Date() }
        });
        const newStatus = hasActiveSubscription ? 'active' : 'trial';
        await this.businessModel.findByIdAndUpdate(businessId, {
            status: newStatus,
            updatedAt: new Date()
        });
    }
    async createDefaultTenantConfig(businessId) {
        const config = new this.tenantConfigModel({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            brandColors: {
                primary: '#007bff',
                secondary: '#6c757d',
                accent: '#28a745',
                background: '#ffffff',
                text: '#333333'
            },
            typography: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                headerFont: 'Inter, sans-serif'
            },
            customization: {
                showBusinessLogo: true,
                showPoweredBy: true
            },
            integrations: {
                emailProvider: 'smtp',
                smsProvider: 'twilio',
                paymentProvider: 'paystack'
            }
        });
        return await config.save();
    }
    async createTrialSubscription(businessId) {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
        const subscription = new this.subscriptionModel({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            planType: 'trial',
            planName: 'Trial Plan',
            monthlyPrice: 0,
            yearlyPrice: 0,
            billingCycle: 'monthly',
            startDate,
            endDate,
            nextBillingDate: endDate,
            status: 'active',
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
            },
            trialDays: 14
        });
        const savedSubscription = await subscription.save();
        await this.businessModel.findByIdAndUpdate(businessId, {
            activeSubscription: savedSubscription._id
        });
        return savedSubscription;
    }
    async getCurrentUsage(businessId) {
        return {
            staffCount: 0,
            servicesCount: 0,
            monthlyAppointments: 0,
            storageUsedGB: 0
        };
    }
};
TenantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(business_schema_1.Business.name)),
    __param(1, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __param(2, (0, mongoose_1.InjectModel)(tenant_config_schema_1.TenantConfig.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TenantService);
exports.TenantService = TenantService;
//# sourceMappingURL=tenant.service.js.map