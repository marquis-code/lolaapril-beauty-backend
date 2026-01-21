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
var BusinessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const business_schema_1 = require("./schemas/business.schema");
const subscription_service_1 = require("../subscription/subscription.service");
const user_schema_1 = require("../auth/schemas/user.schema");
const paystack_service_1 = require("../integration/payment-gateways/paystack/paystack.service");
const bcrypt = require("bcryptjs");
let BusinessService = BusinessService_1 = class BusinessService {
    constructor(businessModel, userModel, subscriptionService, paystackService) {
        this.businessModel = businessModel;
        this.userModel = userModel;
        this.subscriptionService = subscriptionService;
        this.paystackService = paystackService;
        this.logger = new common_1.Logger(BusinessService_1.name);
    }
    async isSubdomainAvailable(subdomain) {
        const model = this.businessModel;
        const existing = await model.findOne({ subdomain }).lean().exec();
        return !existing;
    }
    async getBySubdomain(subdomain) {
        const model = this.businessModel;
        const business = await model
            .findOne({ subdomain })
            .populate('ownerId', 'firstName lastName email')
            .lean()
            .exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async getById(businessId) {
        if (!mongoose_2.Types.ObjectId.isValid(businessId)) {
            throw new common_1.BadRequestException('Invalid business ID format');
        }
        const model = this.businessModel;
        const business = await model
            .findById(businessId)
            .populate('ownerId', 'firstName lastName email')
            .populate('adminIds', 'firstName lastName email role')
            .populate('staffIds', 'firstName lastName email role')
            .lean()
            .exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async getBusinessesByUser(userId) {
        const model = this.businessModel;
        const businesses = await model
            .find({
            $or: [
                { ownerId: new mongoose_2.Types.ObjectId(userId) },
                { adminIds: new mongoose_2.Types.ObjectId(userId) },
                { staffIds: new mongoose_2.Types.ObjectId(userId) }
            ]
        })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        return businesses;
    }
    async update(businessId, updateData) {
        const model = this.businessModel;
        const business = await model
            .findByIdAndUpdate(businessId, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true })
            .lean()
            .exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
    async addStaff(businessId, staffData) {
        const model = this.businessModel;
        const business = await model.findById(businessId).exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        const userModel = this.userModel;
        const existingUser = await userModel.findOne({ email: staffData.email }).exec();
        let userId;
        if (!existingUser) {
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(tempPassword, 12);
            const newUser = await userModel.create({
                email: staffData.email,
                firstName: staffData.firstName,
                lastName: staffData.lastName,
                phone: staffData.phone,
                password: hashedPassword,
                role: user_schema_1.UserRole.STAFF,
                status: 'active',
                staffBusinessId: business._id,
                authProvider: 'local'
            });
            userId = newUser._id;
        }
        else {
            await userModel.findByIdAndUpdate(existingUser._id, {
                role: user_schema_1.UserRole.STAFF,
                staffBusinessId: business._id
            }).exec();
            userId = existingUser._id;
        }
        await model.findByIdAndUpdate(businessId, {
            $addToSet: { staffIds: userId }
        }).exec();
        const finalUser = await userModel.findById(userId).lean().exec();
        return {
            id: finalUser._id,
            firstName: finalUser.firstName,
            lastName: finalUser.lastName,
            email: finalUser.email,
            role: finalUser.role
        };
    }
    async removeStaff(businessId, staffId) {
        const businessModel = this.businessModel;
        const userModel = this.userModel;
        await businessModel.findByIdAndUpdate(businessId, {
            $pull: { staffIds: new mongoose_2.Types.ObjectId(staffId) }
        }).exec();
        await userModel.findByIdAndUpdate(staffId, {
            staffBusinessId: null,
            role: user_schema_1.UserRole.CLIENT
        }).exec();
    }
    async addAdmin(businessId, adminId) {
        const businessModel = this.businessModel;
        const userModel = this.userModel;
        await businessModel.findByIdAndUpdate(businessId, {
            $addToSet: { adminIds: new mongoose_2.Types.ObjectId(adminId) }
        }).exec();
        await userModel.findByIdAndUpdate(adminId, {
            role: user_schema_1.UserRole.BUSINESS_ADMIN,
            $addToSet: { adminBusinesses: new mongoose_2.Types.ObjectId(businessId) }
        }).exec();
    }
    async removeAdmin(businessId, adminId) {
        const businessModel = this.businessModel;
        const userModel = this.userModel;
        await businessModel.findByIdAndUpdate(businessId, {
            $pull: { adminIds: new mongoose_2.Types.ObjectId(adminId) }
        }).exec();
        await userModel.findByIdAndUpdate(adminId, {
            $pull: { adminBusinesses: new mongoose_2.Types.ObjectId(adminId) }
        }).exec();
    }
    async getSettings(businessId) {
        const model = this.businessModel;
        const business = await model
            .findById(businessId)
            .select('settings')
            .lean()
            .exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business.settings;
    }
    async updateSettings(businessId, settings) {
        const model = this.businessModel;
        const business = await model
            .findByIdAndUpdate(businessId, { settings, updatedAt: new Date() }, { new: true, runValidators: true })
            .select('settings')
            .lean()
            .exec();
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business.settings;
    }
    async checkSubscriptionLimits(businessId, context) {
        return this.subscriptionService.checkLimits(businessId, context);
    }
    async createPaystackSubaccount(businessId) {
        try {
            const business = await this.getById(businessId);
            if (business.businessDocuments?.kycStatus !== 'verified') {
                throw new common_1.BadRequestException('Business KYC must be verified before creating subaccount');
            }
            if (business.paymentSettings?.paystackSubaccountCode) {
                this.logger.warn(`Business ${businessId} already has a subaccount`);
                return {
                    subaccountCode: business.paymentSettings.paystackSubaccountCode,
                    alreadyExists: true,
                };
            }
            const bankAccount = business.businessDocuments?.bankAccount;
            if (!bankAccount?.accountNumber || !bankAccount?.bankCode) {
                throw new common_1.BadRequestException('Complete bank account details required to create subaccount');
            }
            this.logger.log(`Creating Paystack subaccount for business: ${business.businessName}`);
            const platformFeePercentage = 2.5;
            const businessPercentage = 100 - platformFeePercentage;
            const subaccountData = await this.paystackService.createSubaccount({
                businessName: business.businessName,
                settlementBank: bankAccount.bankCode,
                accountNumber: bankAccount.accountNumber,
                percentageCharge: businessPercentage,
                description: `${business.businessName} - Lola April Marketplace`,
                primaryContactEmail: business.email,
                primaryContactName: business.businessName,
                primaryContactPhone: business.phone,
                metadata: {
                    businessId: businessId,
                    subdomain: business.subdomain,
                    platformFee: platformFeePercentage,
                },
            });
            await this.businessModel.findByIdAndUpdate(businessId, {
                $set: {
                    'paymentSettings.paystackSubaccountCode': subaccountData.subaccount_code,
                    'paymentSettings.percentageCharge': businessPercentage,
                    'paymentSettings.subaccountCreatedAt': new Date(),
                },
            });
            this.logger.log(`✅ Subaccount created: ${subaccountData.subaccount_code}`);
            return {
                subaccountCode: subaccountData.subaccount_code,
                businessPercentage,
                platformFeePercentage,
                message: 'Subaccount created successfully',
            };
        }
        catch (error) {
            this.logger.error(`Failed to create subaccount for business ${businessId}:`, error.message);
            throw error;
        }
    }
    async verifyBusinessKYC(businessId, adminId) {
        try {
            const business = await this.getById(businessId);
            const docs = business.businessDocuments;
            const missingDocs = [];
            if (!docs?.businessRegistration?.documentUrl) {
                missingDocs.push('Business Registration Certificate');
            }
            if (!docs?.taxIdentification?.documentUrl) {
                missingDocs.push('Tax Identification Certificate');
            }
            if (!docs?.governmentId?.documentUrl) {
                missingDocs.push('Government ID');
            }
            if (!docs?.bankAccount?.bankStatementUrl) {
                missingDocs.push('Bank Statement');
            }
            if (missingDocs.length > 0) {
                throw new common_1.BadRequestException(`Missing required documents: ${missingDocs.join(', ')}. Please upload all required documents before KYC verification.`);
            }
            const updateData = {
                'businessDocuments.kycStatus': 'verified',
                'businessDocuments.kycVerifiedAt': new Date(),
            };
            if (adminId) {
                updateData['businessDocuments.kycVerifiedBy'] = adminId;
            }
            await this.businessModel.findByIdAndUpdate(businessId, { $set: updateData });
            this.logger.log(`✅ KYC verified for business: ${business.businessName}`);
            const subaccountResult = await this.createPaystackSubaccount(businessId);
            return {
                kycVerified: true,
                subaccount: subaccountResult,
                message: 'Business verified and subaccount created successfully',
            };
        }
        catch (error) {
            this.logger.error(`Failed to verify KYC for business ${businessId}:`, error.message);
            throw error;
        }
    }
    async rejectBusinessKYC(businessId, reason, adminId) {
        try {
            const business = await this.getById(businessId);
            const updateData = {
                'businessDocuments.kycStatus': 'rejected',
                'businessDocuments.rejectionReason': reason,
            };
            if (adminId) {
                updateData['businessDocuments.kycVerifiedBy'] = adminId;
            }
            await this.businessModel.findByIdAndUpdate(businessId, { $set: updateData });
            this.logger.log(`❌ KYC rejected for business: ${business.businessName}`);
            return {
                kycRejected: true,
                reason,
                message: 'KYC verification rejected. Business owner will be notified.',
            };
        }
        catch (error) {
            this.logger.error(`Failed to reject KYC for business ${businessId}:`, error.message);
            throw error;
        }
    }
    async getSubaccountDetails(businessId) {
        const business = await this.getById(businessId);
        if (!business.paymentSettings?.paystackSubaccountCode) {
            throw new common_1.NotFoundException('Business does not have a Paystack subaccount');
        }
        const subaccountData = await this.paystackService.getSubaccount(business.paymentSettings.paystackSubaccountCode);
        return {
            subaccountCode: subaccountData.subaccount_code,
            businessName: subaccountData.business_name,
            accountNumber: subaccountData.account_number,
            settlementBank: subaccountData.settlement_bank,
            percentageCharge: subaccountData.percentage_charge,
            isActive: subaccountData.is_verified,
            currency: subaccountData.currency,
        };
    }
};
BusinessService = BusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(business_schema_1.Business.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        subscription_service_1.SubscriptionService,
        paystack_service_1.PaystackService])
], BusinessService);
exports.BusinessService = BusinessService;
//# sourceMappingURL=business.service.js.map