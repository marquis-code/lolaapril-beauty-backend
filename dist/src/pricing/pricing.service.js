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
        const query = this.pricingTierModel
            .find({ isActive: true })
            .sort({ tierLevel: 1 })
            .lean();
        const result = await query.exec();
        return result;
    }
    async createFeeStructure(businessId, createDto) {
        const existingStructure = await this.getBusinessFeeStructure(businessId);
        if (existingStructure) {
            await this.feeStructureModel.findByIdAndUpdate(existingStructure._id, {
                effectiveTo: new Date()
            });
        }
        const feeStructure = await this.feeStructureModel.create({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            pricingTierId: createDto.pricingTierId ? new mongoose_2.Types.ObjectId(createDto.pricingTierId) : null,
            effectiveFrom: createDto.effectiveFrom ? new Date(createDto.effectiveFrom) : new Date(),
            effectiveTo: createDto.effectiveTo ? new Date(createDto.effectiveTo) : null,
            platformFeePercentage: createDto.platformFeePercentage,
            platformFeeFixed: createDto.platformFeeFixed || 0,
            isGrandfathered: createDto.isGrandfathered || false,
            customRules: createDto.customRules || {}
        });
        return feeStructure;
    }
    async getBusinessFeeStructure(businessId) {
        const now = new Date();
        const query = this.feeStructureModel
            .findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            effectiveFrom: { $lte: now },
            $or: [{ effectiveTo: { $gte: now } }, { effectiveTo: null }]
        })
            .populate('pricingTierId')
            .lean();
        const result = await query.exec();
        return result;
    }
    async calculateFees(businessId, bookingAmount) {
        const feeStructure = await this.getBusinessFeeStructure(businessId);
        if (!feeStructure) {
            throw new common_1.NotFoundException('Fee structure not found');
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
            isGrandfathered: feeStructure.isGrandfathered
        };
    }
    async changePlan(businessId, newTierId, reason) {
        const currentStructure = await this.getBusinessFeeStructure(businessId);
        const newTier = await this.pricingTierModel.findById(newTierId);
        if (!newTier) {
            throw new common_1.NotFoundException('New pricing tier not found');
        }
        if (currentStructure) {
            await this.feeStructureModel.findByIdAndUpdate(currentStructure._id, {
                effectiveTo: new Date()
            });
        }
        const newStructure = await this.feeStructureModel.create({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            pricingTierId: new mongoose_2.Types.ObjectId(newTierId),
            effectiveFrom: new Date(),
            platformFeePercentage: newTier.commissionRate,
            isGrandfathered: false
        });
        const history = await this.pricingHistoryModel.create({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            changeType: currentStructure?.pricingTierId ? 'upgrade' : 'initial',
            oldTierId: currentStructure?.pricingTierId,
            newTierId: new mongoose_2.Types.ObjectId(newTierId),
            oldCommissionRate: currentStructure?.platformFeePercentage,
            newCommissionRate: newTier.commissionRate,
            effectiveDate: new Date(),
            reason
        });
        return { newStructure, history };
    }
    async getPricingHistory(businessId) {
        const query = this.pricingHistoryModel
            .find({ businessId: new mongoose_2.Types.ObjectId(businessId) })
            .populate('oldTierId')
            .populate('newTierId')
            .sort({ createdAt: -1 })
            .lean();
        const result = await query.exec();
        return result;
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