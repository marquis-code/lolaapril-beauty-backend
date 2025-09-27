// src/modules/tenant/tenant.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Business, BusinessDocument, BusinessAddress, BusinessContact } from './schemas/business.schema'
import { Subscription, SubscriptionDocument } from './schemas/subscription.schema'
import { TenantConfig, TenantConfigDocument } from './schemas/tenant-config.schema'

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Business.name)
    private businessModel: Model<BusinessDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(TenantConfig.name)
    private tenantConfigModel: Model<TenantConfigDocument>,
  ) {}

  // async createBusiness(createBusinessDto: {
  //   businessName: string
  //   subdomain: string
  //   businessType: string
  //   address: BusinessAddress
  //   contact: BusinessContact
  //   ownerId: string
  // }): Promise<BusinessDocument> {
  //   // Check if subdomain is available
  //   const existingBusiness = await this.businessModel.findOne({
  //     subdomain: createBusinessDto.subdomain
  //   })

  //   if (existingBusiness) {
  //     throw new BadRequestException('Subdomain already taken')
  //   }

  //   // Create business with trial subscription
  //   const business = new this.businessModel({
  //     ...createBusinessDto,
  //     ownerId: new Types.ObjectId(createBusinessDto.ownerId),
  //     status: 'trial',
  //     trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
  //   })

  //   const savedBusiness = await business.save()

  //   // Create default tenant configuration
  //   await this.createDefaultTenantConfig(savedBusiness._id.toString())

  //   // Create trial subscription
  //   await this.createTrialSubscription(savedBusiness._id.toString())

  //   return savedBusiness
  // }

  async createBusiness(createBusinessDto: {
  businessName: string
  subdomain: string
  businessType: string
  address: BusinessAddress
  contact: BusinessContact
  ownerId: string
}): Promise<BusinessDocument> {
  // Check if subdomain is available
  const existingBusiness = await this.businessModel.findOne({
    subdomain: createBusinessDto.subdomain
  })

  if (existingBusiness) {
    throw new BadRequestException('Subdomain already taken')
  }

  // Create business with trial subscription - explicit typing to avoid union type complexity
  const businessData = {
    businessName: createBusinessDto.businessName,
    subdomain: createBusinessDto.subdomain,
    businessType: createBusinessDto.businessType,
    address: createBusinessDto.address,
    contact: createBusinessDto.contact,
    ownerId: new Types.ObjectId(createBusinessDto.ownerId),
    status: 'trial' as const,
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
  }

  const business = new this.businessModel(businessData)
  const savedBusiness = await business.save()

  // Create default tenant configuration
  await this.createDefaultTenantConfig(savedBusiness._id.toString())

  // Create trial subscription
  await this.createTrialSubscription(savedBusiness._id.toString())

  return savedBusiness
}

  async getBusinessBySubdomain(subdomain: string): Promise<BusinessDocument> {
    const business = await this.businessModel
      .findOne({ subdomain })
      .populate('activeSubscription')
      .populate('ownerId', 'firstName lastName email')

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business
  }

  async getBusinessById(businessId: string): Promise<BusinessDocument> {
    const business = await this.businessModel
      .findById(businessId)
      .populate('activeSubscription')
      .populate('ownerId', 'firstName lastName email')
      .populate('adminIds', 'firstName lastName email role')

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business
  }

  async updateBusiness(
    businessId: string,
    updateData: Partial<Business>
  ): Promise<BusinessDocument> {
    const business = await this.businessModel.findByIdAndUpdate(
      businessId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    )

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business
  }

  async checkSubscriptionLimits(businessId: string): Promise<{
    isValid: boolean
    limits: any
    usage: any
    warnings: string[]
  }> {
    const business = await this.businessModel
      .findById(businessId)
      .populate('activeSubscription')

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    const subscription = business.activeSubscription as any
    if (!subscription) {
      return {
        isValid: false,
        limits: null,
        usage: null,
        warnings: ['No active subscription']
      }
    }

    // Check current usage against limits
    const usage = await this.getCurrentUsage(businessId)
    const limits = subscription.limits
    const warnings: string[] = []

    // Check staff limit
    if (usage.staffCount >= limits.maxStaff) {
      warnings.push(`Staff limit reached (${limits.maxStaff})`)
    }

    // Check services limit
    if (usage.servicesCount >= limits.maxServices) {
      warnings.push(`Services limit reached (${limits.maxServices})`)
    }

    // Check monthly appointments limit
    if (usage.monthlyAppointments >= limits.maxAppointmentsPerMonth) {
      warnings.push(`Monthly appointments limit reached (${limits.maxAppointmentsPerMonth})`)
    }

    // Check storage limit
    if (usage.storageUsedGB >= limits.maxStorageGB) {
      warnings.push(`Storage limit reached (${limits.maxStorageGB}GB)`)
    }

    return {
      isValid: warnings.length === 0,
      limits,
      usage,
      warnings
    }
  }

  async getTenantConfig(businessId: string): Promise<TenantConfigDocument> {
    const config = await this.tenantConfigModel.findOne({ businessId })
    
    if (!config) {
      // Create default config if not exists
      return await this.createDefaultTenantConfig(businessId)
    }

    return config
  }

  async updateTenantConfig(
    businessId: string,
    configData: Partial<TenantConfig>
  ): Promise<TenantConfigDocument> {
    const config = await this.tenantConfigModel.findOneAndUpdate(
      { businessId: new Types.ObjectId(businessId) },
      { ...configData, updatedAt: new Date() },
      { new: true, upsert: true }
    )

    return config
  }

  async createSubscription(
    businessId: string,
    subscriptionData: {
      planType: string
      planName: string
      monthlyPrice: number
      yearlyPrice: number
      billingCycle: string
      limits: any
    }
  ): Promise<SubscriptionDocument> {
    const startDate = new Date()
    const endDate = new Date()
    
    if (subscriptionData.billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1)
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    const subscription = new this.subscriptionModel({
      businessId: new Types.ObjectId(businessId),
      ...subscriptionData,
      startDate,
      endDate,
      nextBillingDate: endDate,
      status: 'active'
    })

    const savedSubscription = await subscription.save()

    // Update business with active subscription
    await this.businessModel.findByIdAndUpdate(businessId, {
      activeSubscription: savedSubscription._id,
      status: 'active'
    })

    return savedSubscription
  }

  async cancelSubscription(
    subscriptionId: string,
    reason: string
  ): Promise<void> {
    const subscription = await this.subscriptionModel.findById(subscriptionId)
    
    if (!subscription) {
      throw new NotFoundException('Subscription not found')
    }

    subscription.status = 'cancelled'
    subscription.cancellationDate = new Date()
    subscription.cancellationReason = reason
    subscription.autoRenew = false

    await subscription.save()

    // Update business status
    await this.businessModel.findByIdAndUpdate(subscription.businessId, {
      status: 'inactive'
    })
  }

  async getBusinessesByOwner(ownerId: string): Promise<BusinessDocument[]> {
    return await this.businessModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .populate('activeSubscription')
      .sort({ createdAt: -1 })
  }

  async addBusinessAdmin(
    businessId: string,
    adminId: string
  ): Promise<void> {
    await this.businessModel.findByIdAndUpdate(businessId, {
      $addToSet: { adminIds: new Types.ObjectId(adminId) }
    })
  }

  async removeBusinessAdmin(
    businessId: string,
    adminId: string
  ): Promise<void> {
    await this.businessModel.findByIdAndUpdate(businessId, {
      $pull: { adminIds: new Types.ObjectId(adminId) }
    })
  }

  async suspendBusiness(
    businessId: string,
    reason: string
  ): Promise<void> {
    await this.businessModel.findByIdAndUpdate(businessId, {
      status: 'suspended',
      updatedAt: new Date()
    })

    // Log suspension reason (you might want to create a separate model for this)
  }

  async reactivateBusiness(businessId: string): Promise<void> {
    const business = await this.businessModel.findById(businessId)
    
    if (!business) {
      throw new NotFoundException('Business not found')
    }

    // Check if has active subscription
    const hasActiveSubscription = await this.subscriptionModel.findOne({
      businessId: new Types.ObjectId(businessId),
      status: 'active',
      endDate: { $gt: new Date() }
    })

    const newStatus = hasActiveSubscription ? 'active' : 'trial'

    await this.businessModel.findByIdAndUpdate(businessId, {
      status: newStatus,
      updatedAt: new Date()
    })
  }

  private async createDefaultTenantConfig(businessId: string): Promise<TenantConfigDocument> {
    const config = new this.tenantConfigModel({
      businessId: new Types.ObjectId(businessId),
      brandColors: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#28a745',
        background: '#ffffff',
        text: '#333333'
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        headerFont: 'Inter, sans-serif'
      },
      customization: {
        showBusinessLogo: true,
        showPoweredBy: true
      },
      integrations: {
        emailProvider: 'smtp',
        smsProvider: 'twilio',
        paymentProvider: 'paystack'
      }
    })

    return await config.save()
  }

  private async createTrialSubscription(businessId: string): Promise<SubscriptionDocument> {
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days

    const subscription = new this.subscriptionModel({
      businessId: new Types.ObjectId(businessId),
      planType: 'trial',
      planName: 'Trial Plan',
      monthlyPrice: 0,
      yearlyPrice: 0,
      billingCycle: 'monthly',
      startDate,
      endDate,
      nextBillingDate: endDate,
      status: 'active',
      limits: {
        maxStaff: 3,
        maxServices: 10,
        maxAppointmentsPerMonth: 100,
        maxStorageGB: 1,
        features: {
          onlineBooking: true,
          analytics: false,
          marketing: false,
          inventory: false,
          multiLocation: false,
          apiAccess: false,
          customBranding: false,
          advancedReports: false
        }
      },
      trialDays: 14
    })

    const savedSubscription = await subscription.save()

    // Update business with trial subscription
    await this.businessModel.findByIdAndUpdate(businessId, {
      activeSubscription: savedSubscription._id
    })

    return savedSubscription
  }

  private async getCurrentUsage(businessId: string): Promise<{
    staffCount: number
    servicesCount: number
    monthlyAppointments: number
    storageUsedGB: number
  }> {
    // These would be actual queries to your models
    // For now, returning mock data
    return {
      staffCount: 0,
      servicesCount: 0,
      monthlyAppointments: 0,
      storageUsedGB: 0
    }
  }
}