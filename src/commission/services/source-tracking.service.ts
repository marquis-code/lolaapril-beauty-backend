
// import { Injectable, Logger, BadRequestException } from '@nestjs/common'
// import { InjectModel } from '@nestjs/mongoose'
// import { Model, Types } from 'mongoose'
// import { Booking, BookingDocument } from '../../booking/schemas/booking.schema'
// import { TrackingCode, TrackingCodeDocument } from '../schemas/tracking-code.schema'

// @Injectable()
// export class SourceTrackingService {
//   private readonly logger = new Logger(SourceTrackingService.name)

//   constructor(
//     @InjectModel(Booking.name)
//     private bookingModel: Model<BookingDocument>,
//     @InjectModel(TrackingCode.name)
//     private trackingCodeModel: Model<TrackingCodeDocument>
//   ) {}

//   /**
//    * Generate unique tracking code for business's marketing channels
//    */
//   async generateTrackingCode(
//     businessId: string,
//     codeType: 'qr_code' | 'direct_link' | 'social_media' | 'email_campaign',
//     name: string,
//     options?: {
//       description?: string
//       expiresAt?: Date
//       metadata?: any
//     }
//   ): Promise<string> {
//     const code = this.createUniqueCode(businessId, codeType)

//     await this.trackingCodeModel.create({
//       businessId: new Types.ObjectId(businessId),
//       code,
//       codeType,
//       name,
//       description: options?.description,
//       targetUrl: `${process.env.APP_URL}/book/${businessId}?track=${code}`,
//       expiresAt: options?.expiresAt,
//       metadata: options?.metadata,
//       isActive: true
//     })

//     this.logger.log(`Generated tracking code: ${code} for ${name}`)
//     return code
//   }

//   /**
//    * Validate and resolve tracking code
//    */
//   async resolveTrackingCode(code: string): Promise<{
//     isValid: boolean
//     businessId?: string
//     codeType?: string
//     trackingData?: any
//   }> {
//     const trackingCode = await this.trackingCodeModel
//       .findOne({ code, isActive: true })
//       .lean()
//       .exec()

//     if (!trackingCode) {
//       return { isValid: false }
//     }

//     // Check expiry
//     if (trackingCode.expiresAt && new Date() > trackingCode.expiresAt) {
//       return { isValid: false }
//     }

//     // Increment click count
//     await this.trackingCodeModel.updateOne(
//       { code },
//       { $inc: { clickCount: 1 } }
//     ).exec()

//     return {
//       isValid: true,
//       businessId: trackingCode.businessId.toString(),
//       codeType: trackingCode.codeType,
//       trackingData: trackingCode.metadata
//     }
//   }

//   /**
//    * Record booking conversion for tracking code
//    */
//   async recordConversion(code: string): Promise<void> {
//     const result = await this.trackingCodeModel.updateOne(
//       { code },
//       { 
//         $inc: { bookingCount: 1 }
//       }
//     ).exec()

//     // Calculate conversion rate
//     const trackingCode = await this.trackingCodeModel.findOne({ code }).exec()
//     if (trackingCode) {
//       trackingCode.conversionRate = trackingCode.clickCount > 0
//         ? (trackingCode.bookingCount / trackingCode.clickCount) * 100
//         : 0
//       await trackingCode.save()
//     }
//   }

//   /**
//    * Check if client was acquired by business's own marketing
//    */
//   async isClientAcquiredByBusiness(
//     clientId: string,
//     businessId: string,
//     currentSourceType: string
//   ): Promise<boolean> {
//     // Check first booking for this client at this business
//     const firstBooking = await this.bookingModel
//       .findOne({
//         clientId: new Types.ObjectId(clientId),
//         businessId: new Types.ObjectId(businessId)
//       })
//       .sort({ createdAt: 1 })
//       .lean()
//       .exec()

//     if (!firstBooking) {
//       // This is the first booking - check current source type
//       const businessOwnedSources = [
//         'direct_link',
//         'qr_code',
//         'business_website',
//         'google_search',
//         'social_media',
//         'referral',
//         'walk_in',
//         'phone'
//       ]

//       return businessOwnedSources.includes(currentSourceType)
//     }

//     // Returning client - was acquired by business previously
//     return true
//   }

//   /**
//    * Determine if booking source qualifies for commission
//    */
//   async shouldChargeCommission(
//     sourceType: string,
//     clientId: string,
//     businessId: string,
//     sourceIdentifier?: string
//   ): Promise<{
//     shouldCharge: boolean
//     reason: string
//     isFirstTime: boolean
//   }> {
//     // CRITICAL: Only marketplace bookings are commissionable
//     if (sourceType !== 'marketplace') {
//       return {
//         shouldCharge: false,
//         reason: 'Non-marketplace booking - business owns this channel',
//         isFirstTime: false
//       }
//     }

//     // Check if client was acquired through business's own efforts
//     const isBusinessClient = await this.isClientAcquiredByBusiness(
//       clientId,
//       businessId,
//       sourceType
//     )

//     if (isBusinessClient) {
//       return {
//         shouldCharge: false,
//         reason: 'Client was acquired by business through their own marketing',
//         isFirstTime: false
//       }
//     }

//     // True marketplace acquisition - charge commission
//     return {
//       shouldCharge: true,
//       reason: 'Genuine marketplace booking - new client acquisition',
//       isFirstTime: true
//     }
//   }

//   /**
//    * Get tracking analytics for business
//    */
//   async getTrackingAnalytics(
//     businessId: string,
//     startDate?: Date,
//     endDate?: Date
//   ): Promise<any> {
//     const matchStage: any = {
//       businessId: new Types.ObjectId(businessId)
//     }

//     if (startDate && endDate) {
//       matchStage.createdAt = { $gte: startDate, $lte: endDate }
//     }

//     const trackingCodes = await this.trackingCodeModel
//       .find(matchStage)
//       .lean()
//       .exec()

//     const summary = trackingCodes.reduce((acc, code) => {
//       if (!acc[code.codeType]) {
//         acc[code.codeType] = {
//           totalCodes: 0,
//           totalClicks: 0,
//           totalBookings: 0,
//           avgConversionRate: 0
//         }
//       }

//       acc[code.codeType].totalCodes++
//       acc[code.codeType].totalClicks += code.clickCount
//       acc[code.codeType].totalBookings += code.bookingCount
//       acc[code.codeType].avgConversionRate += code.conversionRate

//       return acc
//     }, {})

//     // Calculate averages
//     Object.keys(summary).forEach(type => {
//       summary[type].avgConversionRate /= summary[type].totalCodes
//     })

//     return {
//       trackingCodes,
//       summary,
//       totalClicks: trackingCodes.reduce((sum, c) => sum + c.clickCount, 0),
//       totalBookings: trackingCodes.reduce((sum, c) => sum + c.bookingCount, 0)
//     }
//   }

//   /**
//    * Create unique tracking code
//    */
//   private createUniqueCode(businessId: string, type: string): string {
//     const timestamp = Date.now().toString(36)
//     const random = Math.random().toString(36).substring(2, 8)
//     const businessPrefix = businessId.substring(0, 6)
//     const typePrefix = type.substring(0, 2).toUpperCase()

//     return `${typePrefix}-${businessPrefix}-${timestamp}-${random}`.toUpperCase()
//   }

//   /**
//    * Validate source tracking data
//    */
//   validateSourceData(sourceData: any): {
//     isValid: boolean
//     errors: string[]
//   } {
//     const errors: string[] = []

//     if (!sourceData.sourceType) {
//       errors.push('Source type is required')
//     }

//     // QR codes and direct links must have identifiers/tracking codes
//     if (['qr_code', 'direct_link'].includes(sourceData.sourceType)) {
//       if (!sourceData.sourceIdentifier && !sourceData.trackingCode) {
//         errors.push('Tracking identifier required for QR codes and direct links')
//       }
//     }

//     // Referrals must have referral code
//     if (sourceData.sourceType === 'referral' && !sourceData.referralCode) {
//       errors.push('Referral code required for referral bookings')
//     }

//     return {
//       isValid: errors.length === 0,
//       errors
//     }
//   }
// }

import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Booking, BookingDocument } from '../../booking/schemas/booking.schema'
import { TrackingCode, TrackingCodeDocument } from '../schemas/tracking-code.schema'

interface TrackingSummary {
  [key: string]: {
    totalCodes: number
    totalClicks: number
    totalBookings: number
    avgConversionRate: number
  }
}

@Injectable()
export class SourceTrackingService {
  private readonly logger = new Logger(SourceTrackingService.name)

  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    @InjectModel(TrackingCode.name)
    private trackingCodeModel: Model<TrackingCodeDocument>
  ) {}

  /**
   * Generate unique tracking code for business's marketing channels
   */
  async generateTrackingCode(
    businessId: string,
    codeType: 'qr_code' | 'direct_link' | 'social_media' | 'email_campaign',
    name: string,
    options?: {
      description?: string
      expiresAt?: Date
      metadata?: any
    }
  ): Promise<string> {
    const code = this.createUniqueCode(businessId, codeType)

    await this.trackingCodeModel.create({
      businessId: new Types.ObjectId(businessId),
      code,
      codeType,
      name,
      description: options?.description,
      targetUrl: `${process.env.APP_URL}/book/${businessId}?track=${code}`,
      expiresAt: options?.expiresAt,
      metadata: options?.metadata,
      isActive: true
    })

    this.logger.log(`Generated tracking code: ${code} for ${name}`)
    return code
  }

  /**
   * Validate and resolve tracking code
   */
  async resolveTrackingCode(code: string): Promise<{
    isValid: boolean
    businessId?: string
    codeType?: string
    trackingData?: any
  }> {
    const trackingCode = await this.trackingCodeModel
      .findOne({ code, isActive: true })
      .exec()

    if (!trackingCode) {
      return { isValid: false }
    }

    // Check expiry
    if (trackingCode.expiresAt && new Date() > trackingCode.expiresAt) {
      return { isValid: false }
    }

    // Increment click count
    await this.trackingCodeModel.updateOne(
      { code },
      { $inc: { clickCount: 1 } }
    ).exec()

    return {
      isValid: true,
      businessId: trackingCode.businessId.toString(),
      codeType: trackingCode.codeType,
      trackingData: trackingCode.metadata
    }
  }

  /**
   * Record booking conversion for tracking code
   */
  async recordConversion(code: string): Promise<void> {
    await this.trackingCodeModel.updateOne(
      { code },
      { 
        $inc: { bookingCount: 1 }
      }
    ).exec()

    // Calculate conversion rate
    const trackingCode = await this.trackingCodeModel.findOne({ code }).exec()
    if (trackingCode) {
      trackingCode.conversionRate = trackingCode.clickCount > 0
        ? (trackingCode.bookingCount / trackingCode.clickCount) * 100
        : 0
      await trackingCode.save()
    }
  }

  /**
   * Check if client was acquired by business's own marketing
   */
  async isClientAcquiredByBusiness(
    clientId: string,
    businessId: string,
    currentSourceType: string
  ): Promise<boolean> {
    // Check first booking for this client at this business
    const firstBooking = await this.bookingModel
      .findOne({
        clientId: new Types.ObjectId(clientId),
        businessId: new Types.ObjectId(businessId)
      })
      .sort({ createdAt: 1 })
      .exec()

    if (!firstBooking) {
      // This is the first booking - check current source type
      const businessOwnedSources = [
        'direct_link',
        'qr_code',
        'business_website',
        'google_search',
        'social_media',
        'referral',
        'walk_in',
        'phone'
      ]

      return businessOwnedSources.includes(currentSourceType)
    }

    // Returning client - was acquired by business previously
    return true
  }

  /**
   * Determine if booking source qualifies for commission
   */
  async shouldChargeCommission(
    sourceType: string,
    clientId: string,
    businessId: string,
    sourceIdentifier?: string
  ): Promise<{
    shouldCharge: boolean
    reason: string
    isFirstTime: boolean
  }> {
    // CRITICAL: Only marketplace bookings are commissionable
    if (sourceType !== 'marketplace') {
      return {
        shouldCharge: false,
        reason: 'Non-marketplace booking - business owns this channel',
        isFirstTime: false
      }
    }

    // Check if client was acquired through business's own efforts
    const isBusinessClient = await this.isClientAcquiredByBusiness(
      clientId,
      businessId,
      sourceType
    )

    if (isBusinessClient) {
      return {
        shouldCharge: false,
        reason: 'Client was acquired by business through their own marketing',
        isFirstTime: false
      }
    }

    // True marketplace acquisition - charge commission
    return {
      shouldCharge: true,
      reason: 'Genuine marketplace booking - new client acquisition',
      isFirstTime: true
    }
  }

  /**
   * Get tracking analytics for business
   */
  async getTrackingAnalytics(
    businessId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    const matchStage: any = {
      businessId: new Types.ObjectId(businessId)
    }

    if (startDate && endDate) {
      matchStage.createdAt = { $gte: startDate, $lte: endDate }
    }

    const trackingCodes = await this.trackingCodeModel
      .find(matchStage)
      .exec()

    const summary: TrackingSummary = {}
    
    for (const code of trackingCodes) {
      const type = code.codeType
      
      if (!summary[type]) {
        summary[type] = {
          totalCodes: 0,
          totalClicks: 0,
          totalBookings: 0,
          avgConversionRate: 0
        }
      }

      summary[type].totalCodes++
      summary[type].totalClicks += code.clickCount || 0
      summary[type].totalBookings += code.bookingCount || 0
      summary[type].avgConversionRate += code.conversionRate || 0
    }

    // Calculate averages
    for (const type in summary) {
      if (summary[type].totalCodes > 0) {
        summary[type].avgConversionRate = summary[type].avgConversionRate / summary[type].totalCodes
      }
    }

    let totalClicks = 0
    let totalBookings = 0
    
    for (const code of trackingCodes) {
      totalClicks += code.clickCount || 0
      totalBookings += code.bookingCount || 0
    }

    const plainTrackingCodes: any[] = []
    for (const code of trackingCodes) {
      plainTrackingCodes.push({
        _id: code._id,
        businessId: code.businessId,
        code: code.code,
        codeType: code.codeType,
        name: code.name,
        description: code.description,
        targetUrl: code.targetUrl,
        clickCount: code.clickCount,
        bookingCount: code.bookingCount,
        conversionRate: code.conversionRate,
        isActive: code.isActive,
        expiresAt: code.expiresAt,
        metadata: code.metadata,
        // createdAt: code.createdAt,
        // updatedAt: code.updatedAt
      })
    }

    return {
      trackingCodes: plainTrackingCodes,
      summary,
      totalClicks,
      totalBookings
    }
  }

  /**
   * Create unique tracking code
   */
  private createUniqueCode(businessId: string, type: string): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    const businessPrefix = businessId.substring(0, 6)
    const typePrefix = type.substring(0, 2).toUpperCase()

    return `${typePrefix}-${businessPrefix}-${timestamp}-${random}`.toUpperCase()
  }

  /**
   * Validate source tracking data
   */
  validateSourceData(sourceData: any): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!sourceData.sourceType) {
      errors.push('Source type is required')
    }

    // QR codes and direct links must have identifiers/tracking codes
    if (['qr_code', 'direct_link'].includes(sourceData.sourceType)) {
      if (!sourceData.sourceIdentifier && !sourceData.trackingCode) {
        errors.push('Tracking identifier required for QR codes and direct links')
      }
    }

    // Referrals must have referral code
    if (sourceData.sourceType === 'referral' && !sourceData.referralCode) {
      errors.push('Referral code required for referral bookings')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}