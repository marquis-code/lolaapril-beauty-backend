// commission/commission.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../../booking/schemas/booking.schema';
import { Payment, PaymentDocument } from '../../payment/schemas/payment.schema';

interface CommissionCalculation {
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  platformFee: number;
  processingFee: number;
  totalPlatformFee: number;
  netAmount: number;
  breakdown: {
    commission: number;
    processing: number;
    platform: number;
  };
}

@Injectable()
export class CommissionService {
  private readonly logger = new Logger(CommissionService.name);

  // Default commission rates (can be overridden by tenant config)
  private readonly DEFAULT_COMMISSION_RATE = 0.15; // 15%
  private readonly PROCESSING_FEE_RATE = 0.029; // 2.9%
  private readonly PROCESSING_FEE_FIXED = 0.30; // $0.30
  private readonly MARKETPLACE_COMMISSION_RATE = 0.20; // 20% for marketplace bookings

  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
  ) {}

  /**
   * Calculate commission and fees for a booking
   */
  async calculateBookingCommission(booking: any): Promise<CommissionCalculation> {
    try {
      const amount = booking.estimatedTotal || 0;
      
      // Determine commission rate based on booking source
      let commissionRate = this.DEFAULT_COMMISSION_RATE;
      
      if (booking.bookingSource?.sourceType === 'marketplace') {
        commissionRate = this.MARKETPLACE_COMMISSION_RATE;
      } else if (booking.bookingSource?.sourceType === 'direct_link' || 
                 booking.bookingSource?.sourceType === 'qr_code') {
        commissionRate = 0.10; // Lower rate for direct bookings
      }

      // Calculate fees
      const commissionAmount = amount * commissionRate;
      const processingFee = (amount * this.PROCESSING_FEE_RATE) + this.PROCESSING_FEE_FIXED;
      const platformFee = commissionAmount + processingFee;
      const netAmount = amount - platformFee;

      return {
        baseAmount: amount,
        commissionRate,
        commissionAmount,
        platformFee: commissionAmount,
        processingFee,
        totalPlatformFee: platformFee,
        netAmount,
        breakdown: {
          commission: commissionAmount,
          processing: processingFee,
          platform: platformFee
        }
      };
    } catch (error) {
      this.logger.error('Failed to calculate booking commission', error.stack);
      throw error;
    }
  }

  /**
   * Calculate fees for a payment/payout
   */
  async calculateFees(
    tenantId: string,
    amount: number,
    options?: {
      bookingSource?: string;
      customRate?: number;
    }
  ): Promise<CommissionCalculation> {
    try {
      // Get tenant-specific commission rate if configured
      let commissionRate = options?.customRate || this.DEFAULT_COMMISSION_RATE;

      // Adjust rate based on booking source
      if (options?.bookingSource === 'marketplace') {
        commissionRate = this.MARKETPLACE_COMMISSION_RATE;
      }

      // Calculate fees
      const commissionAmount = amount * commissionRate;
      const processingFee = (amount * this.PROCESSING_FEE_RATE) + this.PROCESSING_FEE_FIXED;
      const totalPlatformFee = commissionAmount + processingFee;
      const netAmount = amount - totalPlatformFee;

      return {
        baseAmount: amount,
        commissionRate,
        commissionAmount,
        platformFee: commissionAmount,
        processingFee,
        totalPlatformFee,
        netAmount,
        breakdown: {
          commission: commissionAmount,
          processing: processingFee,
          platform: totalPlatformFee
        }
      };
    } catch (error) {
      this.logger.error('Failed to calculate fees', error.stack);
      throw error;
    }
  }

  /**
   * Update booking with commission information
   */
  async updateBookingCommission(
    bookingId: string,
    commissionData: Partial<CommissionCalculation>
  ): Promise<void> {
    try {
      await this.bookingModel.findByIdAndUpdate(
        bookingId,
        {
          $set: {
            'commissionInfo.isCommissionable': true,
            'commissionInfo.commissionRate': commissionData.commissionRate,
            'commissionInfo.commissionAmount': commissionData.commissionAmount,
            'commissionInfo.commissionReason': this.getCommissionReason(commissionData),
            'commissionInfo.calculatedAt': new Date()
          }
        }
      );

      this.logger.log(`Commission updated for booking ${bookingId}`);
    } catch (error) {
      this.logger.error('Failed to update booking commission', error.stack);
      throw error;
    }
  }

  /**
   * Calculate total commission for a tenant in a period
   */
  async calculateTenantCommission(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalRevenue: number;
    totalCommission: number;
    totalProcessingFees: number;
    netRevenue: number;
    bookingCount: number;
  }> {
    try {
      const result = await this.bookingModel.aggregate([
        {
          $match: {
            businessId: new Types.ObjectId(tenantId),
            status: { $in: ['confirmed', 'completed'] },
            createdAt: { $gte: startDate, $lte: endDate },
            'commissionInfo.isCommissionable': true
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$estimatedTotal' },
            totalCommission: { $sum: '$commissionInfo.commissionAmount' },
            bookingCount: { $sum: 1 }
          }
        }
      ]);

      if (result.length === 0) {
        return {
          totalRevenue: 0,
          totalCommission: 0,
          totalProcessingFees: 0,
          netRevenue: 0,
          bookingCount: 0
        };
      }

      const data = result[0];
      const totalProcessingFees = (data.totalRevenue * this.PROCESSING_FEE_RATE) + 
                                  (this.PROCESSING_FEE_FIXED * data.bookingCount);
      
      return {
        totalRevenue: data.totalRevenue,
        totalCommission: data.totalCommission,
        totalProcessingFees,
        netRevenue: data.totalRevenue - data.totalCommission - totalProcessingFees,
        bookingCount: data.bookingCount
      };
    } catch (error) {
      this.logger.error('Failed to calculate tenant commission', error.stack);
      throw error;
    }
  }

  /**
   * Get commission breakdown by source type
   */
  async getCommissionBreakdownBySource(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    try {
      return await this.bookingModel.aggregate([
        {
          $match: {
            businessId: new Types.ObjectId(tenantId),
            status: { $in: ['confirmed', 'completed'] },
            createdAt: { $gte: startDate, $lte: endDate },
            'commissionInfo.isCommissionable': true
          }
        },
        {
          $group: {
            _id: '$bookingSource.sourceType',
            totalRevenue: { $sum: '$estimatedTotal' },
            totalCommission: { $sum: '$commissionInfo.commissionAmount' },
            avgCommissionRate: { $avg: '$commissionInfo.commissionRate' },
            bookingCount: { $sum: 1 }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        }
      ]);
    } catch (error) {
      this.logger.error('Failed to get commission breakdown', error.stack);
      throw error;
    }
  }

  /**
   * Calculate commission preview for a booking (before confirmation)
   */
  calculateCommissionPreview(
    amount: number,
    sourceType: string
  ): {
    rate: number;
    amount: number;
    reason: string;
  } {
    let rate = this.DEFAULT_COMMISSION_RATE;
    let reason = 'Standard booking commission';

    if (sourceType === 'marketplace') {
      rate = this.MARKETPLACE_COMMISSION_RATE;
      reason = 'Marketplace booking - higher commission';
    } else if (sourceType === 'direct_link' || sourceType === 'qr_code') {
      rate = 0.10;
      reason = 'Direct booking - reduced commission';
    } else if (sourceType === 'business_website') {
      rate = 0.05;
      reason = 'Business website booking - minimal commission';
    }

    return {
      rate,
      amount: amount * rate,
      reason
    };
  }

  /**
   * Get tenant commission statistics
   */
  async getTenantCommissionStats(tenantId: string): Promise<any> {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const [currentMonth, lastMonth, allTime] = await Promise.all([
        this.calculateTenantCommission(tenantId, firstDayOfMonth, now),
        this.calculateTenantCommission(tenantId, firstDayOfLastMonth, lastDayOfLastMonth),
        this.calculateTenantCommission(tenantId, new Date(0), now)
      ]);

      const growth = lastMonth.totalRevenue > 0
        ? ((currentMonth.totalRevenue - lastMonth.totalRevenue) / lastMonth.totalRevenue) * 100
        : 0;

      return {
        currentMonth: {
          ...currentMonth,
          period: 'current_month'
        },
        lastMonth: {
          ...lastMonth,
          period: 'last_month'
        },
        allTime: {
          ...allTime,
          period: 'all_time'
        },
        growth: Math.round(growth * 100) / 100,
        avgCommissionRate: allTime.totalRevenue > 0
          ? (allTime.totalCommission / allTime.totalRevenue) * 100
          : 0
      };
    } catch (error) {
      this.logger.error('Failed to get commission stats', error.stack);
      throw error;
    }
  }

  /**
   * Validate commission calculation
   */
  validateCommission(
    amount: number,
    commissionRate: number,
    calculatedCommission: number
  ): boolean {
    const expectedCommission = amount * commissionRate;
    const tolerance = 0.01; // 1 cent tolerance

    return Math.abs(expectedCommission - calculatedCommission) <= tolerance;
  }

  // Helper methods
  private getCommissionReason(commissionData: Partial<CommissionCalculation>): string {
    if (commissionData.commissionRate === this.MARKETPLACE_COMMISSION_RATE) {
      return 'marketplace_booking';
    } else if (commissionData.commissionRate === 0.10) {
      return 'direct_booking';
    } else if (commissionData.commissionRate === 0.05) {
      return 'website_booking';
    } else if (commissionData.commissionRate === 0) {
      return 'no_commission';
    }
    return 'standard_booking';
  }

  /**
   * Get commission rate for a specific booking source
   */
  getCommissionRateForSource(sourceType: string): number {
    const rates: Record<string, number> = {
      marketplace: this.MARKETPLACE_COMMISSION_RATE,
      direct_link: 0.10,
      qr_code: 0.10,
      business_website: 0.05,
      google_search: this.DEFAULT_COMMISSION_RATE,
      social_media: this.DEFAULT_COMMISSION_RATE,
      referral: 0.12,
      walk_in: 0,
      phone: 0
    };

    return rates[sourceType] || this.DEFAULT_COMMISSION_RATE;
  }
}