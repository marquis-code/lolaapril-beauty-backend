// src/modules/tenant/tenant.service.ts
import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Business, BusinessDocument } from "./schemas/business.schema"
import { Subscription, SubscriptionDocument } from "./schemas/subscription.schema"
import { TenantConfig, TenantConfigDocument } from "./schemas/tenant-config.schema"
import { User, UserDocument, UserRole } from "../auth/schemas/user.schema"

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(TenantConfig.name) private tenantConfigModel: Model<TenantConfigDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  // ==================== BUSINESS MANAGEMENT ====================
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    const existingBusiness = await this.businessModel.findOne({ subdomain })
    return !existingBusiness
  }

  async getBusinessBySubdomain(subdomain: string): Promise<BusinessDocument> {
    const business = (await this.businessModel
      .findOne({ subdomain })
      .populate("activeSubscription")
      .populate("ownerId", "firstName lastName email")
      .exec()) as any

    if (!business) {
      throw new NotFoundException("Business not found")
    }

    return business
  }

  // async getBusinessById(businessId: string): Promise<any> {
  //   const business = (await this.businessModel
  //     .findById(businessId)
  //     .populate("activeSubscription")
  //     .populate("ownerId", "firstName lastName email")
  //     .populate("adminIds", "firstName lastName email role")
  //     .populate("staffIds", "firstName lastName email role")
  //     .exec()) as any

  //   if (!business) {
  //     throw new NotFoundException("Business not found")
  //   }

  //   return business
  // }

  async updateBusiness(businessId: string, updateData: any): Promise<BusinessDocument> {
    const business = (await this.businessModel
      .findByIdAndUpdate(businessId, { ...updateData, updatedAt: new Date() }, { new: true })
      .exec()) as any

    if (!business) {
      throw new NotFoundException("Business not found")
    }

    return business
  }

  async getBusinessesByOwner(ownerId: string): Promise<BusinessDocument[]> {
    return (await this.businessModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .populate("activeSubscription")
      .sort({ createdAt: -1 })
      .exec()) as any
  }

  async getBusinessesByUser(userId: string): Promise<BusinessDocument[]> {
    return (await this.businessModel
      .find({
        $or: [{ ownerId: new Types.ObjectId(userId) }, { adminIds: new Types.ObjectId(userId) }, { staffIds: new Types.ObjectId(userId) }],
      })
      .populate("activeSubscription")
      .sort({ createdAt: -1 })
      .exec()) as any
  }

  // ==================== STAFF MANAGEMENT ====================
  // async addStaffMember(businessId: string, staffData: { email: string; firstName: string; lastName: string; phone?: string }): Promise<any> {
  //   const business = await this.businessModel.findById(businessId)
  //   if (!business) {
  //     throw new NotFoundException("Business not found")
  //   }

  //   // Check if user exists
  //   let user = await this.userModel.findOne({ email: staffData.email })

  //   if (!user) {
  //     // Create staff user
  //     const bcrypt = require("bcryptjs")
  //     const tempPassword = Math.random().toString(36).slice(-8)

  //     user = new this.userModel({
  //       ...staffData,
  //       password: await bcrypt.hash(tempPassword, 12),
  //       role: UserRole.STAFF,
  //       status: "active",
  //       staffBusinessId: business._id,
  //     })

  //     await user.save()
  //   } else {
  //     // Update existing user to staff role
  //     await this.userModel.findByIdAndUpdate(user._id, {
  //       role: UserRole.STAFF,
  //       staffBusinessId: business._id,
  //     })
  //   }

  //   // Add to business staff list
  //   await this.businessModel.findByIdAndUpdate(businessId, {
  //     $addToSet: { staffIds: user._id },
  //   })

  //   return {
  //     id: user._id,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     email: user.email,
  //     role: user.role,
  //   }
  // }

  // src/modules/tenant/tenant.service.ts
// Replace the addStaffMember method with this fixed version

async addStaffMember(businessId: string, staffData: { email: string; firstName: string; lastName: string; phone?: string }): Promise<any> {
  const business = await this.businessModel.findById(businessId)
  if (!business) {
    throw new NotFoundException("Business not found")
  }

  // Check if user exists
  const existingUser = await this.userModel.findOne({ email: staffData.email })

  let userId: any

  if (!existingUser) {
    // Create staff user
    const bcrypt = require("bcryptjs")
    const tempPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await bcrypt.hash(tempPassword, 12)

    const newUser = (await this.userModel.create({
      email: staffData.email,
      firstName: staffData.firstName,
      lastName: staffData.lastName,
      phone: staffData.phone,
      password: hashedPassword,
      role: UserRole.STAFF,
      status: "active",
      staffBusinessId: business._id,
    } as any)) as any

    userId = newUser._id
  } else {
    // Update existing user to staff role
    await this.userModel.findByIdAndUpdate(existingUser._id, {
      role: UserRole.STAFF,
      staffBusinessId: business._id,
    })

    userId = existingUser._id
  }

  // Add to business staff list
  await this.businessModel.findByIdAndUpdate(businessId, {
    $addToSet: { staffIds: userId },
  })

  // Fetch the final user data
  const finalUser = await this.userModel.findById(userId)

  return {
    id: finalUser._id,
    firstName: finalUser.firstName,
    lastName: finalUser.lastName,
    email: finalUser.email,
    role: finalUser.role,
  }
}

  async removeStaffMember(businessId: string, staffId: string): Promise<void> {
    await this.businessModel.findByIdAndUpdate(businessId, {
      $pull: { staffIds: new Types.ObjectId(staffId) },
    })

    // Update user
    await this.userModel.findByIdAndUpdate(staffId, {
      staffBusinessId: null,
      role: UserRole.CLIENT,
    })
  }

  async addBusinessAdmin(businessId: string, adminId: string): Promise<void> {
    await this.businessModel.findByIdAndUpdate(businessId, {
      $addToSet: { adminIds: new Types.ObjectId(adminId) },
    })

    // Update user role
    await this.userModel.findByIdAndUpdate(adminId, {
      role: UserRole.BUSINESS_ADMIN,
      $addToSet: { adminBusinesses: new Types.ObjectId(businessId) },
    })
  }

  async removeBusinessAdmin(businessId: string, adminId: string): Promise<void> {
    await this.businessModel.findByIdAndUpdate(businessId, {
      $pull: { adminIds: new Types.ObjectId(adminId) },
    })

    // Update user
    await this.userModel.findByIdAndUpdate(adminId, {
      $pull: { adminBusinesses: new Types.ObjectId(businessId) },
    })
  }

  // ==================== SUBSCRIPTION MANAGEMENT ====================
  // async checkSubscriptionLimits(
  //   businessId: string
  // ): Promise<{
  //   isValid: boolean
  //   limits: any
  //   usage: any
  //   warnings: string[]
  // }> {
  //   const business = await this.businessModel.findById(businessId).populate("activeSubscription").exec()

  //   if (!business) {
  //     throw new NotFoundException("Business not found")
  //   }

  //   const subscription = business.activeSubscription as any
  //   if (!subscription) {
  //     return {
  //       isValid: false,
  //       limits: null,
  //       usage: null,
  //       warnings: ["No active subscription"],
  //     }
  //   }

  //   const usage = await this.getCurrentUsage(businessId)
  //   const limits = subscription.limits
  //   const warnings: string[] = []

  //   if (usage.staffCount >= limits.maxStaff) {
  //     warnings.push(`Staff limit reached (${limits.maxStaff})`)
  //   }

  //   if (usage.servicesCount >= limits.maxServices) {
  //     warnings.push(`Services limit reached (${limits.maxServices})`)
  //   }

  //   if (usage.monthlyAppointments >= limits.maxAppointmentsPerMonth) {
  //     warnings.push(`Monthly appointments limit reached (${limits.maxAppointmentsPerMonth})`)
  //   }

  //   if (usage.storageUsedGB >= limits.maxStorageGB) {
  //     warnings.push(`Storage limit reached (${limits.maxStorageGB}GB)`)
  //   }

  //   return {
  //     isValid: warnings.length === 0,
  //     limits,
  //     usage,
  //     warnings,
  //   }
  // }

  async checkSubscriptionLimits(
  businessId: string,
  context?: 'booking' | 'staff' | 'service'
): Promise<{
  isValid: boolean
  limits: any
  usage: any
  warnings: string[]
}> {
  const business = await this.businessModel.findById(businessId).populate("activeSubscription").exec()

  if (!business) {
    throw new NotFoundException("Business not found")
  }

  const subscription = business.activeSubscription as any
  if (!subscription) {
    return {
      isValid: false,
      limits: null,
      usage: null,
      warnings: ["No active subscription"],
    }
  }

  const usage = await this.getCurrentUsage(businessId)
  const limits = subscription.limits
  const warnings: string[] = []

  // Only check relevant limits based on context
  if (context === 'staff' || !context) {
    if (usage.staffCount >= limits.maxStaff) {
      warnings.push(`Staff limit reached (${limits.maxStaff})`)
    }
  }

  if (context === 'service' || !context) {
    if (usage.servicesCount >= limits.maxServices) {
      warnings.push(`Services limit reached (${limits.maxServices})`)
    }
  }

  if (context === 'booking' || !context) {
    if (usage.monthlyAppointments >= limits.maxAppointmentsPerMonth) {
      warnings.push(`Monthly appointments limit reached (${limits.maxAppointmentsPerMonth})`)
    }
  }

  if (usage.storageUsedGB >= limits.maxStorageGB) {
    warnings.push(`Storage limit reached (${limits.maxStorageGB}GB)`)
  }

  return {
    isValid: warnings.length === 0,
    limits,
    usage,
    warnings,
  }
}

  // ==================== TENANT CONFIG ====================
  // async getTenantConfig(businessId: string): Promise<TenantConfigDocument> {
  //   const config = (await this.tenantConfigModel.findOne({ businessId }).exec()) as any

  //   if (!config) {
  //     throw new NotFoundException("Tenant configuration not found")
  //   }

  //   return config
  // }

  // Replace the getTenantConfig method in tenant.service.ts with this:

async getTenantConfig(businessId: string): Promise<TenantConfigDocument> {
  // Convert string to ObjectId for proper querying
  const config = (await this.tenantConfigModel
    .findOne({ businessId: new Types.ObjectId(businessId) })
    .exec()) as any

  if (!config) {
    throw new NotFoundException("Tenant configuration not found")
  }

  return config
}

// Also update the getBusinessById method to handle the conversion properly:

async getBusinessById(businessId: string): Promise<any> {
  // Validate if businessId is a valid ObjectId
  if (!Types.ObjectId.isValid(businessId)) {
    throw new BadRequestException("Invalid business ID format")
  }

  const business = (await this.businessModel
    .findById(businessId)
    .populate("activeSubscription")
    .populate("ownerId", "firstName lastName email")
    .populate("adminIds", "firstName lastName email role")
    .populate("staffIds", "firstName lastName email role")
    .exec()) as any

  if (!business) {
    throw new NotFoundException("Business not found")
  }

  return business
}

  async updateTenantConfig(businessId: string, configData: any): Promise<TenantConfigDocument> {
    const config = (await this.tenantConfigModel
      .findOneAndUpdate({ businessId: new Types.ObjectId(businessId) }, { ...configData, updatedAt: new Date() }, { new: true, upsert: true })
      .exec()) as any

    return config!
  }

  // ==================== BUSINESS STATUS ====================
  async suspendBusiness(businessId: string, reason: string): Promise<void> {
    await this.businessModel.findByIdAndUpdate(businessId, {
      status: "suspended",
      updatedAt: new Date(),
    })
  }

  async reactivateBusiness(businessId: string): Promise<void> {
    const business = await this.businessModel.findById(businessId)

    if (!business) {
      throw new NotFoundException("Business not found")
    }

    const hasActiveSubscription = await this.subscriptionModel.findOne({
      businessId: new Types.ObjectId(businessId),
      status: "active",
      endDate: { $gt: new Date() },
    })

    const newStatus = hasActiveSubscription ? "active" : "trial"

    await this.businessModel.findByIdAndUpdate(businessId, {
      status: newStatus,
      updatedAt: new Date(),
    })
  }

  // ==================== HELPER METHODS ====================
  private async getCurrentUsage(businessId: string): Promise<{
    staffCount: number
    servicesCount: number
    monthlyAppointments: number
    storageUsedGB: number
  }> {
    const business = await this.businessModel.findById(businessId)

    return {
      staffCount: business?.staffIds?.length || 0,
      servicesCount: 0, // Implement based on your services model
      monthlyAppointments: 0, // Implement based on appointments model
      storageUsedGB: 0, // Implement based on file uploads
    }
  }
}