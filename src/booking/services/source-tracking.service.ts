// import { Injectable, Logger } from '@nestjs/common'
// import { InjectModel } from '@nestjs/mongoose'
// import { Model, Types } from 'mongoose'
// import { Booking, BookingDocument } from '../schemas/booking.schema'
// import { BookingSourceDto } from "../dto/create-booking.dto"

// @Injectable()
// export class SourceTrackingService {
//   private readonly logger = new Logger(SourceTrackingService.name)

//   constructor(
//     @InjectModel(Booking.name)
//     private bookingModel: Model<BookingDocument>
//   ) {}

//   /**
//    * Determine commission applicability based on booking source
//    */
//   async calculateCommission(
//     bookingSource: any,
//     businessId: string,
//     clientId: string,
//     totalAmount: number
//   ): Promise<{
//     isCommissionable: boolean
//     commissionRate: number
//     commissionAmount: number
//     reason: string
//   }> {
//     // CRITICAL: Only charge commission for TRUE marketplace bookings
//     const isMarketplaceBooking = bookingSource.sourceType === 'marketplace'

//     // Check if client was acquired through business's own efforts
//     const isOwnClient = await this.isClientAcquiredByBusiness(
//       clientId,
//       businessId,
//       bookingSource
//     )

//     if (!isMarketplaceBooking || isOwnClient) {
//       return {
//         isCommissionable: false,
//         commissionRate: 0,
//         commissionAmount: 0,
//         reason: 'Non-marketplace booking or business-acquired client'
//       }
//     }

//     // Apply commission for genuine marketplace bookings
//     const commissionRate = 20 // 20% for marketplace
//     const commissionAmount = (totalAmount * commissionRate) / 100

//     return {
//       isCommissionable: true,
//       commissionRate,
//       commissionAmount,
//       reason: 'Marketplace booking - new client acquisition'
//     }
//   }

//   /**
//    * Check if client was acquired by business's own marketing
//    */
//   private async isClientAcquiredByBusiness(
//     clientId: string,
//     businessId: string,
//     currentSource: any
//   ): Promise<boolean> {
//     // Check previous bookings to see if client came from business's own channels
//     const previousBooking = await this.bookingModel
//       .findOne({
//         clientId: new Types.ObjectId(clientId),
//         businessId: new Types.ObjectId(businessId),
//         createdAt: { $lt: new Date() }
//       })
//       .sort({ createdAt: 1 })
//       .lean()
//       .exec()

//     if (!previousBooking) {
//       // First booking - check if using business's direct links/QR
//       const businessOwnedSources = [
//         'direct_link',
//         'qr_code',
//         'business_website',
//         'google_search',
//         'social_media',
//         'referral'
//       ]

//       return businessOwnedSources.includes(currentSource.sourceType)
//     }

//     // Returning client - no commission
//     return true
//   }

//   /**
//    * Generate unique tracking identifier for direct links
//    */
//   generateTrackingId(businessId: string, channel: string): string {
//     const timestamp = Date.now()
//     const random = Math.random().toString(36).substring(7)
//     return `${businessId}-${channel}-${timestamp}-${random}`
//   }

//   /**
//    * Validate source tracking data
// //    */
// //   validateSourceData(sourceData: any): boolean {
// //     if (!sourceData.sourceType) return false

// //     // QR codes and direct links must have identifiers
// //     if (['qr_code', 'direct_link'].includes(sourceData.sourceType)) {
// //       return !!sourceData.sourceIdentifier
// //     }

// //     return true
// //   }
// validateSourceData(sourceData: BookingSourceDto): {
//   isValid: boolean
//   errors: string[]
// } {
//   const errors: string[] = []

//   if (!sourceData.sourceType) {
//     errors.push('Source type is required')
//   }

//   // QR codes and direct links must have identifiers/tracking codes
//   if (['qr_code', 'direct_link'].includes(sourceData.sourceType)) {
//     if (!sourceData.sourceIdentifier && !sourceData.trackingCode) {
//       errors.push('Tracking identifier required for QR codes and direct links')
//     }
//   }

//   // Referrals must have referral code
//   if (sourceData.sourceType === 'referral' && !sourceData.referralCode) {
//     errors.push('Referral code required for referral bookings')
//   }

//   return {
//     isValid: errors.length === 0,
//     errors
//   }
// }
// }

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { BookingSourceDto } from '../dto/create-booking.dto';

@Injectable()
export class SourceTrackingService {
  private readonly logger = new Logger(SourceTrackingService.name);

  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>
  ) {}

  /**
   * Determine commission applicability based on booking source
   */
  async calculateCommission(
    bookingSource: any,
    businessId: string,
    clientId: string,
    totalAmount: number
  ): Promise<{
    isCommissionable: boolean;
    commissionRate: number;
    commissionAmount: number;
    reason: string;
  }> {
    // CRITICAL: Only charge commission for TRUE marketplace bookings
    const isMarketplaceBooking = bookingSource.sourceType === 'marketplace';

    // Check if client was acquired through business's own efforts
    const isOwnClient = await this.isClientAcquiredByBusiness(
      clientId,
      businessId,
      bookingSource
    );

    if (!isMarketplaceBooking || isOwnClient) {
      return {
        isCommissionable: false,
        commissionRate: 0,
        commissionAmount: 0,
        reason: 'Non-marketplace booking or business-acquired client'
      };
    }

    // Apply commission for genuine marketplace bookings
    const commissionRate = 20; // 20% for marketplace
    const commissionAmount = (totalAmount * commissionRate) / 100;

    return {
      isCommissionable: true,
      commissionRate,
      commissionAmount,
      reason: 'Marketplace booking - new client acquisition'
    };
  }

  /**
   * Check if client was acquired by business's own marketing
   */
  private async isClientAcquiredByBusiness(
    clientId: string,
    businessId: string,
    currentSource: any
  ): Promise<boolean> {
    // NUCLEAR FIX: Use lean() directly in the query to get plain object
    const query = {
      clientId: new Types.ObjectId(clientId),
      businessId: new Types.ObjectId(businessId),
      createdAt: { $lt: new Date() }
    };

    // Use lean() to get plain object directly, avoiding toObject() complexity
    const previousBooking = await this.bookingModel
      .findOne(query)
      .sort({ createdAt: 1 })
      .lean<any>() // Force type to any to avoid union complexity
      .exec();

    if (!previousBooking) {
      // First booking - check if using business's direct links/QR
      const businessOwnedSources = [
        'direct_link',
        'qr_code',
        'business_website',
        'google_search',
        'social_media',
        'referral'
      ];

      return businessOwnedSources.includes(currentSource.sourceType);
    }

    // Returning client - no commission
    return true;
  }

  /**
   * Generate unique tracking identifier for direct links
   */
  generateTrackingId(businessId: string, channel: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${businessId}-${channel}-${timestamp}-${random}`;
  }

  /**
   * Validate source tracking data
   */
  validateSourceData(sourceData: BookingSourceDto): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!sourceData.sourceType) {
      errors.push('Source type is required');
    }

    // QR codes and direct links must have identifiers/tracking codes
    if (['qr_code', 'direct_link'].includes(sourceData.sourceType)) {
      if (!sourceData.sourceIdentifier && !sourceData.trackingCode) {
        errors.push('Tracking identifier required for QR codes and direct links');
      }
    }

    // Referrals must have referral code
    if (sourceData.sourceType === 'referral' && !sourceData.referralCode) {
      errors.push('Referral code required for referral bookings');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}