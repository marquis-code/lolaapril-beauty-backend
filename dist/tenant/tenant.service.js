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
const user_schema_1 = require("../auth/schemas/user.schema");
let TenantService = class TenantService {
    constructor(businessModel, subscriptionModel, tenantConfigModel, userModel) {
        this.businessModel = businessModel;
        this.subscriptionModel = subscriptionModel;
        this.tenantConfigModel = tenantConfigModel;
        this.userModel = userModel;
    }
    async isSubdomainAvailable(subdomain) {
        const existingBusiness = await this.businessModel.findOne({ subdomain });
        return !existingBusiness;
    }
    async getBusinessBySubdomain(subdomain) {
        const business = (await this.businessModel
            .findOne({ subdomain })
            .populate("activeSubscription")
            .populate("ownerId", "firstName lastName email")
            .exec());
        if (!business) {
            throw new common_1.NotFoundException("Business not found");
        }
        return business;
    }
    async updateBusiness(businessId, updateData) {
        const business = (await this.businessModel
            .findByIdAndUpdate(businessId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true })
            .exec());
        if (!business) {
            throw new common_1.NotFoundException("Business not found");
        }
        return business;
    }
    async getBusinessesByOwner(ownerId) {
        return (await this.businessModel
            .find({ ownerId: new mongoose_2.Types.ObjectId(ownerId) })
            .populate("activeSubscription")
            .sort({ createdAt: -1 })
            .exec());
    }
    async getBusinessesByUser(userId) {
        return (await this.businessModel
            .find({
            $or: [{ ownerId: new mongoose_2.Types.ObjectId(userId) }, { adminIds: new mongoose_2.Types.ObjectId(userId) }, { staffIds: new mongoose_2.Types.ObjectId(userId) }],
        })
            .populate("activeSubscription")
            .sort({ createdAt: -1 })
            .exec());
    }
    async addStaffMember(businessId, staffData) {
        const business = await this.businessModel.findById(businessId);
        if (!business) {
            throw new common_1.NotFoundException("Business not found");
        }
        const existingUser = await this.userModel.findOne({ email: staffData.email });
        let userId;
        if (!existingUser) {
            const bcrypt = require("bcryptjs");
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(tempPassword, 12);
            const newUser = (await this.userModel.create({
                email: staffData.email,
                firstName: staffData.firstName,
                lastName: staffData.lastName,
                phone: staffData.phone,
                password: hashedPassword,
                role: user_schema_1.UserRole.STAFF,
                status: "active",
                staffBusinessId: business._id,
            }));
            userId = newUser._id;
        }
        else {
            await this.userModel.findByIdAndUpdate(existingUser._id, {
                role: user_schema_1.UserRole.STAFF,
                staffBusinessId: business._id,
            });
            userId = existingUser._id;
        }
        await this.businessModel.findByIdAndUpdate(businessId, {
            $addToSet: { staffIds: userId },
        });
        const finalUser = await this.userModel.findById(userId);
        return {
            id: finalUser._id,
            firstName: finalUser.firstName,
            lastName: finalUser.lastName,
            email: finalUser.email,
            role: finalUser.role,
        };
    }
    async removeStaffMember(businessId, staffId) {
        await this.businessModel.findByIdAndUpdate(businessId, {
            $pull: { staffIds: new mongoose_2.Types.ObjectId(staffId) },
        });
        await this.userModel.findByIdAndUpdate(staffId, {
            staffBusinessId: null,
            role: user_schema_1.UserRole.CLIENT,
        });
    }
    async addBusinessAdmin(businessId, adminId) {
        await this.businessModel.findByIdAndUpdate(businessId, {
            $addToSet: { adminIds: new mongoose_2.Types.ObjectId(adminId) },
        });
        await this.userModel.findByIdAndUpdate(adminId, {
            role: user_schema_1.UserRole.BUSINESS_ADMIN,
            $addToSet: { adminBusinesses: new mongoose_2.Types.ObjectId(businessId) },
        });
    }
    async removeBusinessAdmin(businessId, adminId) {
        await this.businessModel.findByIdAndUpdate(businessId, {
            $pull: { adminIds: new mongoose_2.Types.ObjectId(adminId) },
        });
        await this.userModel.findByIdAndUpdate(adminId, {
            $pull: { adminBusinesses: new mongoose_2.Types.ObjectId(businessId) },
        });
    }
    async checkSubscriptionLimits(businessId, context) {
        const business = await this.businessModel.findById(businessId).populate("activeSubscription").exec();
        if (!business) {
            throw new common_1.NotFoundException("Business not found");
        }
        const subscription = business.activeSubscription;
        if (!subscription) {
            return {
                isValid: false,
                limits: null,
                usage: null,
                warnings: ["No active subscription"],
            };
        }
        const usage = await this.getCurrentUsage(businessId);
        const limits = subscription.limits;
        const warnings = [];
        if (context === 'staff' || !context) {
            if (usage.staffCount >= limits.maxStaff) {
                warnings.push(`Staff limit reached (${limits.maxStaff})`);
            }
        }
        if (context === 'service' || !context) {
            if (usage.servicesCount >= limits.maxServices) {
                warnings.push(`Services limit reached (${limits.maxServices})`);
            }
        }
        if (context === 'booking' || !context) {
            if (usage.monthlyAppointments >= limits.maxAppointmentsPerMonth) {
                warnings.push(`Monthly appointments limit reached (${limits.maxAppointmentsPerMonth})`);
            }
        }
        if (usage.storageUsedGB >= limits.maxStorageGB) {
            warnings.push(`Storage limit reached (${limits.maxStorageGB}GB)`);
        }
        return {
            isValid: warnings.length === 0,
            limits,
            usage,
            warnings,
        };
    }
    async getTenantConfig(businessId) {
        const config = (await this.tenantConfigModel
            .findOne({ businessId: new mongoose_2.Types.ObjectId(businessId) })
            .exec());
        if (!config) {
            throw new common_1.NotFoundException("Tenant configuration not found");
        }
        return config;
    }
    async getBusinessById(businessId) {
        if (!mongoose_2.Types.ObjectId.isValid(businessId)) {
            throw new common_1.BadRequestException("Invalid business ID format");
        }
        const business = (await this.businessModel
            .findById(businessId)
            .populate("activeSubscription")
            .populate("ownerId", "firstName lastName email")
            .populate("adminIds", "firstName lastName email role")
            .populate("staffIds", "firstName lastName email role")
            .exec());
        if (!business) {
            throw new common_1.NotFoundException("Business not found");
        }
        return business;
    }
    async updateTenantConfig(businessId, configData) {
        const config = (await this.tenantConfigModel
            .findOneAndUpdate({ businessId: new mongoose_2.Types.ObjectId(businessId) }, Object.assign(Object.assign({}, configData), { updatedAt: new Date() }), { new: true, upsert: true })
            .exec());
        return config;
    }
    async suspendBusiness(businessId, reason) {
        await this.businessModel.findByIdAndUpdate(businessId, {
            status: "suspended",
            updatedAt: new Date(),
        });
    }
    async reactivateBusiness(businessId) {
        const business = await this.businessModel.findById(businessId);
        if (!business) {
            throw new common_1.NotFoundException("Business not found");
        }
        const hasActiveSubscription = await this.subscriptionModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            status: "active",
            endDate: { $gt: new Date() },
        });
        const newStatus = hasActiveSubscription ? "active" : "trial";
        await this.businessModel.findByIdAndUpdate(businessId, {
            status: newStatus,
            updatedAt: new Date(),
        });
    }
    async getCurrentUsage(businessId) {
        var _a;
        const business = await this.businessModel.findById(businessId);
        return {
            staffCount: ((_a = business === null || business === void 0 ? void 0 : business.staffIds) === null || _a === void 0 ? void 0 : _a.length) || 0,
            servicesCount: 0,
            monthlyAppointments: 0,
            storageUsedGB: 0,
        };
    }
};
TenantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(business_schema_1.Business.name)),
    __param(1, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __param(2, (0, mongoose_1.InjectModel)(tenant_config_schema_1.TenantConfig.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TenantService);
exports.TenantService = TenantService;
//# sourceMappingURL=tenant.service.js.map