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
        }).exec();
        if (existingBusiness) {
            throw new common_1.BadRequestException('Subdomain already taken');
        }
        const businessData = {
            businessName: createBusinessDto.businessName,
            subdomain: createBusinessDto.subdomain,
            businessType: createBusinessDto.businessType,
            ownerId: new mongoose_2.Types.ObjectId(createBusinessDto.ownerId),
            status: createBusinessDto.status || 'trial',
            trialEndsAt: createBusinessDto.trialEndsAt ? new Date(createBusinessDto.trialEndsAt) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        };
        if (createBusinessDto.address)
            businessData.address = createBusinessDto.address;
        if (createBusinessDto.contact)
            businessData.contact = createBusinessDto.contact;
        if (createBusinessDto.businessDescription)
            businessData.businessDescription = createBusinessDto.businessDescription;
        if (createBusinessDto.logo)
            businessData.logo = createBusinessDto.logo;
        if (createBusinessDto.images)
            businessData.images = createBusinessDto.images;
        if (createBusinessDto.settings)
            businessData.settings = createBusinessDto.settings;
        if (createBusinessDto.businessDocuments)
            businessData.businessDocuments = createBusinessDto.businessDocuments;
        if (createBusinessDto.adminIds && createBusinessDto.adminIds.length > 0) {
            businessData.adminIds = createBusinessDto.adminIds.map(id => new mongoose_2.Types.ObjectId(id));
        }
        const savedBusiness = await this.businessModel.create(businessData);
        const businessIdString = savedBusiness._id.toString();
        try {
            await this.createDefaultTenantConfig(businessIdString);
        }
        catch (error) {
            console.log('Warning: Failed to create default tenant config:', error.message);
        }
        try {
            await this.createTrialSubscription(businessIdString);
        }
        catch (error) {
            console.log('Warning: Failed to create trial subscription:', error.message);
        }
        return JSON.parse(JSON.stringify(savedBusiness));
    }
    async isSubdomainAvailable(subdomain) {
        const existingBusiness = await this.businessModel.findOne({ subdomain });
        return !existingBusiness;
    }
    async registerBusinessWithOwner(registrationData) {
        return await this.createBusiness(registrationData);
    }
    async getBusinessBySubdomain(subdomain) {
        const business = await this.businessModel
            .findOne({ subdomain })
            .populate('activeSubscription')
            .populate('ownerId', 'firstName lastName email')
            .exec();
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
            .populate('adminIds', 'firstName lastName email role')
            .exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async updateBusiness(businessId, updateData) {
        const business = await this.businessModel.findByIdAndUpdate(businessId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true }).exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async checkSubscriptionLimits(businessId) {
        const business = await this.businessModel
            .findById(businessId)
            .populate('activeSubscription')
            .exec();
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
        const config = await this.tenantConfigModel.findOne({ businessId }).exec();
        if (!config) {
            return await this.createDefaultTenantConfig(businessId);
        }
        return config;
    }
    async updateTenantConfig(businessId, configData) {
        const config = await this.tenantConfigModel.findOneAndUpdate({ businessId: new mongoose_2.Types.ObjectId(businessId) }, Object.assign(Object.assign({}, configData), { updatedAt: new Date() }), { new: true, upsert: true }).exec();
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
        }).exec();
        return savedSubscription;
    }
    async cancelSubscription(subscriptionId, reason) {
        const subscription = await this.subscriptionModel.findById(subscriptionId).exec();
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
        }).exec();
    }
    async getBusinessesByOwner(ownerId) {
        return await this.businessModel
            .find({ ownerId: new mongoose_2.Types.ObjectId(ownerId) })
            .populate('activeSubscription')
            .sort({ createdAt: -1 })
            .exec();
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
        }).exec();
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