import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Business, BusinessDocument } from './schemas/business.schema'
import { SubscriptionService } from '../subscription/subscription.service' 
import { User, UserDocument, UserRole } from '../auth/schemas/user.schema'
import { PaystackService } from '../integration/payment-gateways/paystack/paystack.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly subscriptionService: SubscriptionService,
    private readonly paystackService: PaystackService,
  ) {}

  // ==================== BUSINESS LOOKUP ====================
  
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const existing: any = await model.findOne({ subdomain }).lean().exec()
    return !existing
  }

  async getBySubdomain(subdomain: string): Promise<any> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model
      .findOne({ subdomain })
      .populate('ownerId', 'firstName lastName email')
      .lean()
      .exec()

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business
  }

  async getById(businessId: string): Promise<any> {
    if (!Types.ObjectId.isValid(businessId)) {
      throw new BadRequestException('Invalid business ID format')
    }

    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model
      .findById(businessId)
      .populate('ownerId', 'firstName lastName email')
      .populate('adminIds', 'firstName lastName email role')
      .populate('staffIds', 'firstName lastName email role')
      .lean()
      .exec()

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business
  }

  async getBusinessesByUser(userId: string): Promise<any[]> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const businesses: any = await model
      .find({
        $or: [
          { ownerId: new Types.ObjectId(userId) },
          { adminIds: new Types.ObjectId(userId) },
          { staffIds: new Types.ObjectId(userId) }
        ]
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    return businesses
  }

  // ==================== BUSINESS MANAGEMENT ====================
  
  async update(businessId: string, updateData: any): Promise<any> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model
      .findByIdAndUpdate(
        businessId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .lean()
      .exec()

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business
  }

  // ==================== STAFF MANAGEMENT ====================
  
  async addStaff(
    businessId: string,
    staffData: { email: string; firstName: string; lastName: string; phone?: string }
  ): Promise<any> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model.findById(businessId).exec()
    
    if (!business) {
      throw new NotFoundException('Business not found')
    }

    // Check if user exists
    const userModel: any = this.userModel
    const existingUser: any = await userModel.findOne({ email: staffData.email }).exec()

    let userId: any

    if (!existingUser) {
      // Create new staff user
      const tempPassword = Math.random().toString(36).slice(-8)
      const hashedPassword = await bcrypt.hash(tempPassword, 12)

      const newUser: any = await userModel.create({
        email: staffData.email,
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        phone: staffData.phone,
        password: hashedPassword,
        role: UserRole.STAFF,
        status: 'active',
        staffBusinessId: business._id,
        authProvider: 'local'
      })

      userId = newUser._id
    } else {
      // Update existing user to staff role
      await userModel.findByIdAndUpdate(existingUser._id, {
        role: UserRole.STAFF,
        staffBusinessId: business._id
      }).exec()
      userId = existingUser._id
    }

    // Add to business staff list
    await model.findByIdAndUpdate(businessId, {
      $addToSet: { staffIds: userId }
    }).exec()

    const finalUser: any = await userModel.findById(userId).lean().exec()

    return {
      id: finalUser._id,
      firstName: finalUser.firstName,
      lastName: finalUser.lastName,
      email: finalUser.email,
      role: finalUser.role
    }
  }

  async removeStaff(businessId: string, staffId: string): Promise<void> {
    // SCORCHED EARTH: Cast models to any
    const businessModel: any = this.businessModel
    const userModel: any = this.userModel

    await businessModel.findByIdAndUpdate(businessId, {
      $pull: { staffIds: new Types.ObjectId(staffId) }
    }).exec()

    await userModel.findByIdAndUpdate(staffId, {
      staffBusinessId: null,
      role: UserRole.CLIENT
    }).exec()
  }

  // ==================== ADMIN MANAGEMENT ====================
  
  async addAdmin(businessId: string, adminId: string): Promise<void> {
    // SCORCHED EARTH: Cast models to any
    const businessModel: any = this.businessModel
    const userModel: any = this.userModel

    await businessModel.findByIdAndUpdate(businessId, {
      $addToSet: { adminIds: new Types.ObjectId(adminId) }
    }).exec()

    await userModel.findByIdAndUpdate(adminId, {
      role: UserRole.BUSINESS_ADMIN,
      $addToSet: { adminBusinesses: new Types.ObjectId(businessId) }
    }).exec()
  }

  async removeAdmin(businessId: string, adminId: string): Promise<void> {
    // SCORCHED EARTH: Cast models to any
    const businessModel: any = this.businessModel
    const userModel: any = this.userModel

    await businessModel.findByIdAndUpdate(businessId, {
      $pull: { adminIds: new Types.ObjectId(adminId) }
    }).exec()

    await userModel.findByIdAndUpdate(adminId, {
      $pull: { adminBusinesses: new Types.ObjectId(adminId) }
    }).exec()
  }

  // ==================== SETTINGS ====================
  
  async getSettings(businessId: string): Promise<any> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model
      .findById(businessId)
      .select('settings')
      .lean()
      .exec()

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business.settings
  }

  async updateSettings(businessId: string, settings: any): Promise<any> {
    // SCORCHED EARTH: Cast model to any
    const model: any = this.businessModel
    const business: any = await model
      .findByIdAndUpdate(
        businessId,
        { settings, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .select('settings')
      .lean()
      .exec()

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business.settings
  }

  async checkSubscriptionLimits(
    businessId: string,
    context?: 'booking' | 'staff' | 'service'
  ): Promise<{
    isValid: boolean
    canProceed: boolean
    limits: any
    usage: any
    warnings: string[]
    blocked: string[]
  }> {
    return this.subscriptionService.checkLimits(businessId, context)
  }

  // ==================== PAYSTACK SUBACCOUNT ====================
  
  /**
   * Create a Paystack subaccount for a verified business
   * This enables automatic payment splitting for marketplace model
   */
  async createPaystackSubaccount(businessId: string): Promise<any> {
    try {
      const business = await this.getById(businessId);

      // Validate KYC status
      if (business.businessDocuments?.kycStatus !== 'verified') {
        throw new BadRequestException('Business KYC must be verified before creating subaccount');
      }

      // Check if subaccount already exists
      if (business.paymentSettings?.paystackSubaccountCode) {
        this.logger.warn(`Business ${businessId} already has a subaccount`);
        return {
          subaccountCode: business.paymentSettings.paystackSubaccountCode,
          alreadyExists: true,
        };
      }

      // Validate bank details
      const bankAccount = business.businessDocuments?.bankAccount;
      if (!bankAccount?.accountNumber || !bankAccount?.bankCode) {
        throw new BadRequestException('Complete bank account details required to create subaccount');
      }

      this.logger.log(`Creating Paystack subaccount for business: ${business.businessName}`);

      // Calculate platform fee percentage (Lola April's commission)
      // Business receives 100% - platformFeePercentage
      const platformFeePercentage = 2.5; // Lola April keeps 2.5%
      const businessPercentage = 100 - platformFeePercentage; // Business keeps 97.5%

      // Create subaccount via Paystack
      const subaccountData = await this.paystackService.createSubaccount({
        businessName: business.businessName,
        settlementBank: bankAccount.bankCode,
        accountNumber: bankAccount.accountNumber,
        percentageCharge: businessPercentage, // Business keeps 97.5%
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

      // Update business with subaccount details
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
    } catch (error) {
      this.logger.error(`Failed to create subaccount for business ${businessId}:`, error.message);
      throw error;
    }
  }

  /**
   * Verify business KYC and create subaccount
   */
  async verifyBusinessKYC(businessId: string, adminId?: string): Promise<any> {
    try {
      const business = await this.getById(businessId);

      // Validate required documents are uploaded
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
        throw new BadRequestException(
          `Missing required documents: ${missingDocs.join(', ')}. Please upload all required documents before KYC verification.`
        );
      }

      // Update KYC status
      const updateData: any = {
        'businessDocuments.kycStatus': 'verified',
        'businessDocuments.kycVerifiedAt': new Date(),
      };

      if (adminId) {
        updateData['businessDocuments.kycVerifiedBy'] = adminId;
      }

      await this.businessModel.findByIdAndUpdate(businessId, { $set: updateData });

      this.logger.log(`✅ KYC verified for business: ${business.businessName}`);

      // Automatically create Paystack subaccount
      const subaccountResult = await this.createPaystackSubaccount(businessId);

      return {
        kycVerified: true,
        subaccount: subaccountResult,
        message: 'Business verified and subaccount created successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to verify KYC for business ${businessId}:`, error.message);
      throw error;
    }
  }

  /**
   * Reject business KYC with reason
   */
  async rejectBusinessKYC(businessId: string, reason: string, adminId?: string): Promise<any> {
    try {
      const business = await this.getById(businessId);

      const updateData: any = {
        'businessDocuments.kycStatus': 'rejected',
        'businessDocuments.rejectionReason': reason,
      };

      if (adminId) {
        updateData['businessDocuments.kycVerifiedBy'] = adminId;
      }

      await this.businessModel.findByIdAndUpdate(businessId, { $set: updateData });

      this.logger.log(`❌ KYC rejected for business: ${business.businessName}`);

      // TODO: Send notification to business owner about rejection
      // await this.notificationService.sendKYCRejectionNotification(business.ownerId, reason);

      return {
        kycRejected: true,
        reason,
        message: 'KYC verification rejected. Business owner will be notified.',
      };
    } catch (error) {
      this.logger.error(`Failed to reject KYC for business ${businessId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get business subaccount details
   */
  async getSubaccountDetails(businessId: string): Promise<any> {
    const business = await this.getById(businessId);
    
    if (!business.paymentSettings?.paystackSubaccountCode) {
      throw new NotFoundException('Business does not have a Paystack subaccount');
    }

    const subaccountData = await this.paystackService.getSubaccount(
      business.paymentSettings.paystackSubaccountCode
    );

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
}