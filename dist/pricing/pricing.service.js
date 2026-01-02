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
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pricing_tier_schema_1 = require("./schemas/pricing-tier.schema");
const fee_structure_schema_1 = require("./schemas/fee-structure.schema");
const pricing_history_schema_1 = require("./schemas/pricing-history.schema");
let PricingService = class PricingService {
    constructor(pricingTierModel, feeStructureModel, pricingHistoryModel) {
        this.pricingTierModel = pricingTierModel;
        this.feeStructureModel = feeStructureModel;
        this.pricingHistoryModel = pricingHistoryModel;
    }
    async createTier(createDto) {
        const tier = new this.pricingTierModel(createDto);
        return tier.save();
    }
    async getActiveTiers() {
        return this.pricingTierModel.find({ isActive: true }).sort({ tierLevel: 1 }).exec();
    }
    async getTenantFeeStructure(tenantId) {
        const now = new Date();
        return this.feeStructureModel
            .findOne({
            tenantId: new mongoose_2.Types.ObjectId(tenantId),
            effectiveFrom: { $lte: now },
            $or: [{ effectiveTo: { $gte: now } }, { effectiveTo: null }],
        })
            .populate('pricingTierId')
            .exec();
    }
    async calculateFees(tenantId, bookingAmount) {
        const feeStructure = await this.getTenantFeeStructure(tenantId);
        if (!feeStructure) {
            throw new common_1.NotFoundException('Fee structure not found for tenant');
        }
        const percentageFee = (bookingAmount * feeStructure.platformFeePercentage) / 100;
        const fixedFee = feeStructure.platformFeeFixed || 0;
        const totalPlatformFee = percentageFee + fixedFee;
        const businessReceives = bookingAmount - totalPlatformFee;
        return {
            bookingAmount,
            platformFeePercentage: feeStructure.platformFeePercentage,
            platformFeeFixed: fixedFee,
            totalPlatformFee,
            businessReceives,
            isGrandfathered: feeStructure.isGrandfathered,
        };
    }
    async changeTenantPlan(tenantId, newTierId, changedBy, reason) {
        const currentStructure = await this.getTenantFeeStructure(tenantId);
        const newTier = await this.pricingTierModel.findById(newTierId);
        if (!newTier) {
            throw new common_1.NotFoundException('New pricing tier not found');
        }
        if (currentStructure) {
            currentStructure.effectiveTo = new Date();
            await currentStructure.save();
        }
        const newStructure = new this.feeStructureModel({
            tenantId: new mongoose_2.Types.ObjectId(tenantId),
            pricingTierId: new mongoose_2.Types.ObjectId(newTierId),
            effectiveFrom: new Date(),
            platformFeePercentage: newTier.commissionRate,
            isGrandfathered: false,
        });
        await newStructure.save();
        const history = new this.pricingHistoryModel({
            tenantId: new mongoose_2.Types.ObjectId(tenantId),
            changeType: currentStructure?.pricingTierId ?
                (newTier.tierLevel > currentStructure.pricingTierId.tierLevel ? 'upgrade' : 'downgrade') :
                'initial',
            oldTierId: currentStructure?.pricingTierId,
            newTierId: new mongoose_2.Types.ObjectId(newTierId),
            oldCommissionRate: currentStructure?.platformFeePercentage,
            newCommissionRate: newTier.commissionRate,
            effectiveDate: new Date(),
            reason,
            changedBy: new mongoose_2.Types.ObjectId(changedBy),
        });
        await history.save();
        return { newStructure, history };
    }
    async grandfatherTenantPricing(tenantId, reason) {
        const currentStructure = await this.getTenantFeeStructure(tenantId);
        if (!currentStructure) {
            throw new common_1.NotFoundException('Current fee structure not found');
        }
        currentStructure.isGrandfathered = true;
        await currentStructure.save();
        return {
            success: true,
            message: 'Tenant pricing grandfathered successfully',
            data: currentStructure,
        };
    }
    async getPricingHistory(tenantId) {
        return this.pricingHistoryModel
            .find({ tenantId: new mongoose_2.Types.ObjectId(tenantId) })
            .populate('oldTierId')
            .populate('newTierId')
            .populate('changedBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .exec();
    }
};
PricingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pricing_tier_schema_1.PricingTier.name)),
    __param(1, (0, mongoose_1.InjectModel)(fee_structure_schema_1.FeeStructure.name)),
    __param(2, (0, mongoose_1.InjectModel)(pricing_history_schema_1.PricingHistory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PricingService);
exports.PricingService = PricingService;
//# sourceMappingURL=pricing.service.js.map