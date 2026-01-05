// src/modules/commission/services/commission-calculator.service.ts
import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Booking, BookingDocument } from '../../booking/schemas/booking.schema'
import { Commission, CommissionDocument } from '../schemas/commission.schema'
import { TrackingCode, TrackingCodeDocument } from '../schemas/tracking-code.schema'
import { SourceTrackingService } from './source-tracking.service'
import { BookingSourceDto } from '../dto/booking-source.dto'

export interface CommissionCalculation {
  isCommissionable: boolean
  commissionRate: number
  commissionAmount: number
  platformFee: number
  businessPayout: number
  reason: string
  isFirstTimeClient: boolean
}

@Injectable()
export class CommissionCalculatorService {
  constructor(
    @InjectModel('Commission')
    private commissionModel: Model<CommissionDocument>,
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    @InjectModel(TrackingCode.name)
    private trackingCodeModel: Model<TrackingCodeDocument>,
    private sourceTrackingService: SourceTrackingService
  ) {}

  async calculateCommission(
    bookingId: string,
    bookingData: {
      businessId: string
      clientId: string
      totalAmount: number
      sourceTracking: BookingSourceDto
    }
  ): Promise<CommissionCalculation> {
    const commissionDecision = await this.sourceTrackingService
      .shouldChargeCommission(
        bookingData.sourceTracking.sourceType,
        bookingData.clientId,
        bookingData.businessId,
        bookingData.sourceTracking.sourceIdentifier
      )

    if (!commissionDecision.shouldCharge) {
      return {
        isCommissionable: false,
        commissionRate: 0,
        commissionAmount: 0,
        platformFee: 0,
        businessPayout: bookingData.totalAmount,
        reason: commissionDecision.reason,
        isFirstTimeClient: commissionDecision.isFirstTime
      }
    }

    const commissionRate = await this.getCommissionRate(
      bookingData.businessId,
      bookingData.sourceTracking.sourceType
    )

    const commissionAmount = (bookingData.totalAmount * commissionRate) / 100
    const platformFee = commissionAmount
    const businessPayout = bookingData.totalAmount - platformFee

    return {
      isCommissionable: true,
      commissionRate,
      commissionAmount,
      platformFee,
      businessPayout,
      reason: commissionDecision.reason,
      isFirstTimeClient: commissionDecision.isFirstTime
    }
  }

  async createCommissionRecord(
    bookingId: string,
    paymentId: string,
    bookingData: any,
    calculation: CommissionCalculation
  ): Promise<any> {
    const commission = await this.commissionModel.create({
      bookingId: new Types.ObjectId(bookingId),
      businessId: new Types.ObjectId(bookingData.businessId),
      clientId: new Types.ObjectId(bookingData.clientId),
      paymentId: new Types.ObjectId(paymentId),
      sourceTracking: bookingData.sourceTracking,
      bookingAmount: bookingData.totalAmount,
      isCommissionable: calculation.isCommissionable,
      commissionRate: calculation.commissionRate,
      commissionAmount: calculation.commissionAmount,
      platformFee: calculation.platformFee,
      businessPayout: calculation.businessPayout,
      commissionReason: calculation.reason,
      isFirstTimeClient: calculation.isFirstTimeClient,
      isMarketplaceAcquired: calculation.isCommissionable,
      status: 'calculated',
      calculatedAt: new Date()
    })

    return commission as any
  }

  private async getCommissionRate(
    businessId: string,
    sourceType: string
  ): Promise<number> {
    const defaultRates: Record<string, number> = {
      marketplace: 20,
      direct_link: 0,
      qr_code: 0,
      business_website: 0,
      google_search: 0,
      social_media: 0,
      referral: 0,
      walk_in: 0,
      phone: 0
    }

    return defaultRates[sourceType] || 0
  }

  async disputeCommission(
    commissionId: string,
    reason: string,
    disputedBy: string
  ): Promise<void> {
    await this.commissionModel.updateOne(
      { _id: new Types.ObjectId(commissionId) },
      {
        $set: {
          status: 'disputed',
          wasDisputed: true,
          disputeReason: reason,
          updatedAt: new Date()
        }
      }
    ).exec()
  }

  async waiveCommission(
    commissionId: string,
    reason: string,
    waivedBy: string
  ): Promise<void> {
    await this.commissionModel.updateOne(
      { _id: new Types.ObjectId(commissionId) },
      {
        $set: {
          status: 'waived',
          commissionAmount: 0,
          platformFee: 0,
          notes: `Waived by ${waivedBy}: ${reason}`,
          updatedAt: new Date()
        }
      }
    ).exec()
  }

  async getCommissionByBooking(bookingId: string): Promise<any> {
    return this.commissionModel
      .findOne({ bookingId: new Types.ObjectId(bookingId) })
      .exec() as any
  }

  async getBusinessCommissionSummary(
    businessId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const matchStage: any = {
      businessId: new Types.ObjectId(businessId)
    }

    if (startDate && endDate) {
      matchStage.calculatedAt = {
        $gte: startDate,
        $lte: endDate
      }
    }

    const summary = await this.commissionModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          commissionableBookings: {
            $sum: { $cond: ['$isCommissionable', 1, 0] }
          },
          totalRevenue: { $sum: '$bookingAmount' },
          totalCommissions: { $sum: '$commissionAmount' },
          totalBusinessPayout: { $sum: '$businessPayout' },
          averageCommissionRate: { $avg: '$commissionRate' }
        }
      }
    ]).exec()

    const sourceBreakdown = await this.commissionModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$sourceTracking.sourceType',
          count: { $sum: 1 },
          totalCommissions: { $sum: '$commissionAmount' },
          totalRevenue: { $sum: '$bookingAmount' }
        }
      }
    ]).exec()

    return {
      summary: summary[0] || {
        totalBookings: 0,
        commissionableBookings: 0,
        totalRevenue: 0,
        totalCommissions: 0,
        totalBusinessPayout: 0,
        averageCommissionRate: 0
      },
      sourceBreakdown,
      commissionSavings: summary[0] 
        ? summary[0].totalRevenue - summary[0].totalCommissions
        : 0
    }
  }

  async getSourceBreakdown(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const matchStage = {
      businessId: new Types.ObjectId(businessId),
      calculatedAt: {
        $gte: startDate,
        $lte: endDate
      }
    }

    const breakdown = await this.commissionModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$sourceTracking.sourceType',
          totalBookings: { $sum: 1 },
          commissionableBookings: {
            $sum: { $cond: ['$isCommissionable', 1, 0] }
          },
          nonCommissionableBookings: {
            $sum: { $cond: ['$isCommissionable', 0, 1] }
          },
          totalRevenue: { $sum: '$bookingAmount' },
          totalCommissions: { $sum: '$commissionAmount' },
          businessPayout: { $sum: '$businessPayout' },
          commissionSavings: {
            $sum: {
              $cond: ['$isCommissionable', 0, '$bookingAmount']
            }
          }
        }
      },
      {
        $project: {
          sourceType: '$_id',
          totalBookings: 1,
          commissionableBookings: 1,
          nonCommissionableBookings: 1,
          totalRevenue: 1,
          totalCommissions: 1,
          businessPayout: 1,
          commissionSavings: 1,
          commissionPercentage: {
            $multiply: [
              { $divide: ['$commissionableBookings', '$totalBookings'] },
              100
            ]
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]).exec()

    return breakdown
  }
}