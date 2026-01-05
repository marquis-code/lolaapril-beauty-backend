import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Business, BusinessDocument } from './schemas/business.schema'
import { SubscriptionService } from '../subscription/subscription.service' 
import { User, UserDocument, UserRole } from '../auth/schemas/user.schema'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly subscriptionService: SubscriptionService
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
}