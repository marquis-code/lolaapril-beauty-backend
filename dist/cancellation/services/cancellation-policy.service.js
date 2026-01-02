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
var CancellationPolicyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellationPolicyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cancellation_policy_schema_1 = require("../schemas/cancellation-policy.schema");
let CancellationPolicyService = CancellationPolicyService_1 = class CancellationPolicyService {
    constructor(policyModel) {
        this.policyModel = policyModel;
        this.logger = new common_1.Logger(CancellationPolicyService_1.name);
    }
    async getBusinessPolicy(businessId, serviceId) {
        const query = {
            businessId: new mongoose_2.Types.ObjectId(businessId),
            isActive: true
        };
        if (serviceId) {
            query.applicableServices = new mongoose_2.Types.ObjectId(serviceId);
        }
        const policy = await this.policyModel.findOne(query);
        if (policy) {
            return policy;
        }
        const defaultPolicy = await this.policyModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            isActive: true,
            applicableServices: { $size: 0 }
        });
        if (defaultPolicy) {
            return defaultPolicy;
        }
        return await this.createDefaultPolicy(businessId);
    }
    async createOrUpdatePolicy(businessId, policyDto) {
        const existingPolicy = await this.policyModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            isActive: true
        });
        if (existingPolicy) {
            Object.assign(existingPolicy, policyDto);
            await existingPolicy.save();
            this.logger.log(`Updated policy ${existingPolicy._id} for business ${businessId}`);
            return existingPolicy;
        }
        const newPolicy = await this.policyModel.create({
            ...policyDto,
            businessId: new mongoose_2.Types.ObjectId(businessId),
            isActive: true
        });
        this.logger.log(`Created new policy ${newPolicy._id} for business ${businessId}`);
        return newPolicy;
    }
    async calculateDepositAmount(businessId, totalAmount, serviceIds) {
        const policy = await this.getBusinessPolicy(businessId, serviceIds?.[0]);
        if (!policy || !policy.requiresDeposit) {
            return {
                requiresDeposit: false,
                depositAmount: 0,
                depositPercentage: 0,
                reason: 'Business does not require deposits'
            };
        }
        const depositAmount = Math.max((totalAmount * policy.depositPercentage) / 100, policy.minimumDepositAmount || 0);
        return {
            requiresDeposit: true,
            depositAmount: Math.round(depositAmount),
            depositPercentage: policy.depositPercentage,
            reason: `${policy.depositPercentage}% deposit required by business policy`
        };
    }
    async calculateRefund(businessId, appointmentDate, paidAmount, depositAmount = 0) {
        const policy = await this.getBusinessPolicy(businessId);
        const hoursUntilAppointment = (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);
        const applicableRule = policy.rules
            ?.sort((a, b) => b.hoursBeforeAppointment - a.hoursBeforeAppointment)
            .find(rule => hoursUntilAppointment >= rule.hoursBeforeAppointment);
        if (!applicableRule) {
            if (!policy.allowSameDayCancellation) {
                return {
                    canCancel: false,
                    refundAmount: 0,
                    penaltyAmount: paidAmount,
                    refundPercentage: 0,
                    reason: 'Same-day cancellations not allowed',
                    hoursNotice: hoursUntilAppointment
                };
            }
            const refundAmount = (paidAmount * policy.sameDayRefundPercentage) / 100;
            return {
                canCancel: true,
                refundAmount: Math.round(refundAmount),
                penaltyAmount: Math.round(paidAmount - refundAmount),
                refundPercentage: policy.sameDayRefundPercentage,
                reason: 'Same-day cancellation - reduced refund',
                hoursNotice: hoursUntilAppointment
            };
        }
        const refundAmount = (paidAmount * applicableRule.refundPercentage) / 100;
        const penaltyAmount = (paidAmount * applicableRule.penaltyPercentage) / 100;
        return {
            canCancel: true,
            refundAmount: Math.round(refundAmount),
            penaltyAmount: Math.round(penaltyAmount),
            refundPercentage: applicableRule.refundPercentage,
            reason: applicableRule.description ||
                `Cancelled ${hoursUntilAppointment.toFixed(1)} hours before appointment`,
            hoursNotice: hoursUntilAppointment
        };
    }
    async createDefaultPolicy(businessId) {
        const defaultPolicy = await this.policyModel.create({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            policyName: 'Default Cancellation Policy',
            requiresDeposit: true,
            depositPercentage: 20,
            minimumDepositAmount: 1000,
            cancellationWindowHours: 24,
            rules: [
                {
                    hoursBeforeAppointment: 48,
                    refundPercentage: 100,
                    penaltyPercentage: 0,
                    description: 'Full refund for cancellations 48+ hours before'
                },
                {
                    hoursBeforeAppointment: 24,
                    refundPercentage: 50,
                    penaltyPercentage: 50,
                    description: '50% refund for 24-48 hours notice'
                }
            ],
            allowSameDayCancellation: true,
            sameDayRefundPercentage: 0,
            sendReminders: true,
            reminderHours: [24, 4, 1],
            maxNoShowsBeforeDeposit: 2,
            isActive: true,
            applicableServices: [],
            description: 'Standard cancellation policy'
        });
        this.logger.log(`Created default policy for business ${businessId}`);
        return defaultPolicy;
    }
};
CancellationPolicyService = CancellationPolicyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cancellation_policy_schema_1.CancellationPolicy.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CancellationPolicyService);
exports.CancellationPolicyService = CancellationPolicyService;
//# sourceMappingURL=cancellation-policy.service.js.map