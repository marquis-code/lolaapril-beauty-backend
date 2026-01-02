// pricing.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PricingTier, PricingTierDocument } from './schemas/pricing-tier.schema';
import { FeeStructure, FeeStructureDocument } from './schemas/fee-structure.schema';
import { CreatePricingTierDto } from "./dto/create-pricing-tier.dto"
import { PricingHistory, PricingHistoryDocument } from './schemas/pricing-history.schema';

@Injectable()
export class PricingService {
  constructor(
    @InjectModel(PricingTier.name) private pricingTierModel: Model<PricingTierDocument>,
    @InjectModel(FeeStructure.name) private feeStructureModel: Model<FeeStructureDocument>,
    @InjectModel(PricingHistory.name) private pricingHistoryModel: Model<PricingHistoryDocument>,
  ) {}

  // Create new pricing tier
  async createTier(createDto: CreatePricingTierDto) {
    const tier = new this.pricingTierModel(createDto);
    return tier.save();
  }

  // Get all active tiers
  async getActiveTiers() {
    return this.pricingTierModel.find({ isActive: true }).sort({ tierLevel: 1 }).exec();
  }

  // Get tenant's current fee structure
  async getTenantFeeStructure(tenantId: string) {
    const now = new Date();
    return this.feeStructureModel
      .findOne({
        tenantId: new Types.ObjectId(tenantId),
        effectiveFrom: { $lte: now },
        $or: [{ effectiveTo: { $gte: now } }, { effectiveTo: null }],
      })
      .populate('pricingTierId')
      .exec();
  }

  // Calculate fees for a transaction
  async calculateFees(tenantId: string, bookingAmount: number) {
    const feeStructure = await this.getTenantFeeStructure(tenantId);
    
    if (!feeStructure) {
      throw new NotFoundException('Fee structure not found for tenant');
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

  // Upgrade/downgrade tenant plan
  async changeTenantPlan(
    tenantId: string,
    newTierId: string,
    changedBy: string,
    reason: string,
  ) {
    const currentStructure = await this.getTenantFeeStructure(tenantId);
    const newTier = await this.pricingTierModel.findById(newTierId);

    if (!newTier) {
      throw new NotFoundException('New pricing tier not found');
    }

    // Close current fee structure
    if (currentStructure) {
      currentStructure.effectiveTo = new Date();
      await currentStructure.save();
    }

    // Create new fee structure
    const newStructure = new this.feeStructureModel({
      tenantId: new Types.ObjectId(tenantId),
      pricingTierId: new Types.ObjectId(newTierId),
      effectiveFrom: new Date(),
      platformFeePercentage: newTier.commissionRate,
      isGrandfathered: false,
    });

    await newStructure.save();

    // Record history
    const history = new this.pricingHistoryModel({
      tenantId: new Types.ObjectId(tenantId),
      changeType: currentStructure?.pricingTierId ? 
        (newTier.tierLevel > (currentStructure.pricingTierId as any).tierLevel ? 'upgrade' : 'downgrade') : 
        'initial',
      oldTierId: currentStructure?.pricingTierId,
      newTierId: new Types.ObjectId(newTierId),
      oldCommissionRate: currentStructure?.platformFeePercentage,
      newCommissionRate: newTier.commissionRate,
      effectiveDate: new Date(),
      reason,
      changedBy: new Types.ObjectId(changedBy),
    });

    await history.save();

    return { newStructure, history };
  }

  // Grandfather a tenant's pricing
  async grandfatherTenantPricing(tenantId: string, reason: string) {
    const currentStructure = await this.getTenantFeeStructure(tenantId);
    
    if (!currentStructure) {
      throw new NotFoundException('Current fee structure not found');
    }

    currentStructure.isGrandfathered = true;
    await currentStructure.save();

    return {
      success: true,
      message: 'Tenant pricing grandfathered successfully',
      data: currentStructure,
    };
  }

  // Get pricing history for tenant
  async getPricingHistory(tenantId: string) {
    return this.pricingHistoryModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .populate('oldTierId')
      .populate('newTierId')
      .populate('changedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .exec();
  }
}