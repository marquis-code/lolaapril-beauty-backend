// import { Injectable, NotFoundException } from '@nestjs/common'
// import { InjectModel } from '@nestjs/mongoose'
// import { Model, Types } from 'mongoose'
// import { PricingTier, PricingTierDocument } from './schemas/pricing-tier.schema'
// import { FeeStructure, FeeStructureDocument } from './schemas/fee-structure.schema'
// import { PricingHistory, PricingHistoryDocument } from './schemas/pricing-history.schema'
// import { CreatePricingTierDto } from './dto/create-pricing-tier.dto'
// @Injectable()
// export class PricingService {
// constructor(
// @InjectModel(PricingTier.name) private pricingTierModel: Model<PricingTierDocument>,
// @InjectModel(FeeStructure.name) private feeStructureModel: Model<FeeStructureDocument>,
// @InjectModel(PricingHistory.name) private pricingHistoryModel: Model<PricingHistoryDocument>
// ) {}
// async createTier(createDto: CreatePricingTierDto) {
// const tier = new this.pricingTierModel(createDto)
// return tier.save()
// }
// async getActiveTiers() {
// return this.pricingTierModel.find({ isActive: true }).sort({ tierLevel: 1 }).lean()
// }
// async getBusinessFeeStructure(businessId: string) {
// const now = new Date()
// return this.feeStructureModel
// .findOne({
// businessId: new Types.ObjectId(businessId),
// effectiveFrom: { $lte: now },
// $or: [{ effectiveTo: { $gte: now } }, { effectiveTo: null }]
// })
// .populate('pricingTierId')
// .lean()
// }
// async calculateFees(businessId: string, bookingAmount: number) {
// const feeStructure = await this.getBusinessFeeStructure(businessId)
// if (!feeStructure) {
//   throw new NotFoundException('Fee structure not found')
// }

// const percentageFee = (bookingAmount * feeStructure.platformFeePercentage) / 100
// const fixedFee = feeStructure.platformFeeFixed || 0
// const totalPlatformFee = percentageFee + fixedFee
// const businessReceives = bookingAmount - totalPlatformFee

// return {
//   bookingAmount,
//   platformFeePercentage: feeStructure.platformFeePercentage,
//   platformFeeFixed: fixedFee,
//   totalPlatformFee,
//   businessReceives,
//   isGrandfathered: feeStructure.isGrandfathered
// }
// }
// async changePlan(businessId: string, newTierId: string, reason: string) {
// const currentStructure = await this.getBusinessFeeStructure(businessId)
// const newTier = await this.pricingTierModel.findById(newTierId)
// if (!newTier) {
//   throw new NotFoundException('New pricing tier not found')
// }

// // Close current fee structure
// if (currentStructure) {
//   currentStructure.effectiveTo = new Date()
//   await this.feeStructureModel.findByIdAndUpdate(currentStructure._id, {
//     effectiveTo: new Date()
//   })
// }

// // Create new fee structure
// const newStructure = await this.feeStructureModel.create({
//   businessId: new Types.ObjectId(businessId),
//   pricingTierId: new Types.ObjectId(newTierId),
//   effectiveFrom: new Date(),
//   platformFeePercentage: newTier.commissionRate,
//   isGrandfathered: false
// })

// // Record history
// const history = await this.pricingHistoryModel.create({
//   businessId: new Types.ObjectId(businessId),
//   changeType: currentStructure?.pricingTierId
//     ? 'upgrade'
//     : 'initial',
//   oldTierId: currentStructure?.pricingTierId,
//   newTierId: new Types.ObjectId(newTierId),
//   oldCommissionRate: currentStructure?.platformFeePercentage,
//   newCommissionRate: newTier.commissionRate,
//   effectiveDate: new Date(),
//   reason
// })

// return { newStructure, history }
// }
// async getPricingHistory(businessId: string) {
// return this.pricingHistoryModel
// .find({ businessId: new Types.ObjectId(businessId) })
// .populate('oldTierId')
// .populate('newTierId')
// .sort({ createdAt: -1 })
// .lean()
// }
// }


import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { PricingTier, PricingTierDocument } from './schemas/pricing-tier.schema'
import { FeeStructure, FeeStructureDocument } from './schemas/fee-structure.schema'
import { PricingHistory, PricingHistoryDocument } from './schemas/pricing-history.schema'
import { CreatePricingTierDto } from './dto/create-pricing-tier.dto'

// AGGRESSIVE FIX: Define explicit return types
type LeanPricingTier = {
  _id: any
  tierName: string
  tierLevel: number
  commissionRate: number
  isActive: boolean
  [key: string]: any
}

type LeanFeeStructure = {
  _id: any
  businessId: any
  pricingTierId: any
  platformFeePercentage: number
  platformFeeFixed?: number
  effectiveFrom: Date
  effectiveTo?: Date
  isGrandfathered: boolean
  [key: string]: any
}

type LeanPricingHistory = {
  _id: any
  businessId: any
  changeType: string
  oldTierId?: any
  newTierId: any
  oldCommissionRate?: number
  newCommissionRate: number
  effectiveDate: Date
  reason: string
  createdAt: Date
  [key: string]: any
}

@Injectable()
export class PricingService {
  constructor(
    @InjectModel(PricingTier.name) private pricingTierModel: Model<PricingTierDocument>,
    @InjectModel(FeeStructure.name) private feeStructureModel: Model<FeeStructureDocument>,
    @InjectModel(PricingHistory.name) private pricingHistoryModel: Model<PricingHistoryDocument>
  ) {}

  async createTier(createDto: CreatePricingTierDto) {
    const tier = new this.pricingTierModel(createDto)
    return tier.save()
  }

  async getActiveTiers(): Promise<LeanPricingTier[]> {
    // NUCLEAR FIX: Break the chain, add explicit types
    const query = this.pricingTierModel
      .find({ isActive: true })
      .sort({ tierLevel: 1 })
      .lean<LeanPricingTier[]>()
    
    const result = await query.exec()
    return result
  }

  async getBusinessFeeStructure(businessId: string): Promise<LeanFeeStructure | null> {
    const now = new Date()
    
    // NUCLEAR FIX: Break the chain, add explicit types
    const query = this.feeStructureModel
      .findOne({
        businessId: new Types.ObjectId(businessId),
        effectiveFrom: { $lte: now },
        $or: [{ effectiveTo: { $gte: now } }, { effectiveTo: null }]
      })
      .populate('pricingTierId')
      .lean<LeanFeeStructure>()
    
    const result = await query.exec()
    return result
  }

  async calculateFees(businessId: string, bookingAmount: number) {
    const feeStructure = await this.getBusinessFeeStructure(businessId)
    
    if (!feeStructure) {
      throw new NotFoundException('Fee structure not found')
    }

    const percentageFee = (bookingAmount * feeStructure.platformFeePercentage) / 100
    const fixedFee = feeStructure.platformFeeFixed || 0
    const totalPlatformFee = percentageFee + fixedFee
    const businessReceives = bookingAmount - totalPlatformFee

    return {
      bookingAmount,
      platformFeePercentage: feeStructure.platformFeePercentage,
      platformFeeFixed: fixedFee,
      totalPlatformFee,
      businessReceives,
      isGrandfathered: feeStructure.isGrandfathered
    }
  }

  async changePlan(businessId: string, newTierId: string, reason: string) {
    const currentStructure = await this.getBusinessFeeStructure(businessId)
    const newTier = await this.pricingTierModel.findById(newTierId)
    
    if (!newTier) {
      throw new NotFoundException('New pricing tier not found')
    }

    // Close current fee structure
    if (currentStructure) {
      await this.feeStructureModel.findByIdAndUpdate(currentStructure._id, {
        effectiveTo: new Date()
      })
    }

    // Create new fee structure
    const newStructure = await this.feeStructureModel.create({
      businessId: new Types.ObjectId(businessId),
      pricingTierId: new Types.ObjectId(newTierId),
      effectiveFrom: new Date(),
      platformFeePercentage: newTier.commissionRate,
      isGrandfathered: false
    })

    // Record history
    const history = await this.pricingHistoryModel.create({
      businessId: new Types.ObjectId(businessId),
      changeType: currentStructure?.pricingTierId ? 'upgrade' : 'initial',
      oldTierId: currentStructure?.pricingTierId,
      newTierId: new Types.ObjectId(newTierId),
      oldCommissionRate: currentStructure?.platformFeePercentage,
      newCommissionRate: newTier.commissionRate,
      effectiveDate: new Date(),
      reason
    })

    return { newStructure, history }
  }

  async getPricingHistory(businessId: string): Promise<LeanPricingHistory[]> {
    // NUCLEAR FIX: Break the chain, add explicit types
    const query = this.pricingHistoryModel
      .find({ businessId: new Types.ObjectId(businessId) })
      .populate('oldTierId')
      .populate('newTierId')
      .sort({ createdAt: -1 })
      .lean<LeanPricingHistory[]>()
    
    const result = await query.exec()
    return result
  }
}