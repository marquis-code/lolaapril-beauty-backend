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

  async createBusiness(createBusinessDto: any): Promise<any> {
    // Check if subdomain is available
    const existingBusiness = await this.businessModel.findOne({
      subdomain: createBusinessDto.subdomain
    }).exec()

    if (existingBusiness) {
      throw new BadRequestException('Subdomain already taken')
    }

    // Create business with trial subscription - simplified data creation
    const businessData: any = {
      businessName: createBusinessDto.businessName,
      subdomain: createBusinessDto.subdomain,
      businessType: createBusinessDto.businessType,
      ownerId: new Types.ObjectId(createBusinessDto.ownerId),
      status: createBusinessDto.status || 'trial',
      trialEndsAt: createBusinessDto.trialEndsAt ? new Date(createBusinessDto.trialEndsAt) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    }

    // Add optional fields if provided
    if (createBusinessDto.address) businessData.address = createBusinessDto.address
    if (createBusinessDto.contact) businessData.contact = createBusinessDto.contact
    if (createBusinessDto.businessDescription) businessData.businessDescription = createBusinessDto.businessDescription
    if (createBusinessDto.logo) businessData.logo = createBusinessDto.logo
    if (createBusinessDto.images) businessData.images = createBusinessDto.images
    if (createBusinessDto.settings) businessData.settings = createBusinessDto.settings
    if (createBusinessDto.businessDocuments) businessData.businessDocuments = createBusinessDto.businessDocuments
    
    // Handle adminIds
    if (createBusinessDto.adminIds && createBusinessDto.adminIds.length > 0) {
      businessData.adminIds = createBusinessDto.adminIds.map(id => new Types.ObjectId(id))
    }

    // Create and save business using create() method instead of new + save
    const savedBusiness = await this.businessModel.create(businessData)

    // Get the created business ID as string
    const businessIdString = savedBusiness._id.toString()

    // Create default tenant configuration
    try {
      await this.createDefaultTenantConfig(businessIdString)
    } catch (error: any) {
      console.log('Warning: Failed to create default tenant config:', error.message)
    }

    // Create trial subscription
    try {
      await this.createTrialSubscription(businessIdString)
    } catch (error: any) {
      console.log('Warning: Failed to create trial subscription:', error.message)
    }

    // Return the saved business as plain object using JSON serialization
    return JSON.parse(JSON.stringify(savedBusiness))
  }

  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    const existingBusiness = await this.businessModel.findOne({ subdomain })
    return !existingBusiness
  }

  async registerBusinessWithOwner(registrationData: any): Promise<any> {
    // This would be implemented based on your auth service
    // For now, just create the business
    return await this.createBusiness(registrationData)
  }

  async getBusinessBySubdomain(subdomain: string): Promise<BusinessDocument> {
    const business = await this.businessModel
      .findOne({ subdomain })
      .populate('activeSubscription')
      .populate('ownerId', 'firstName lastName email')
      .exec() as any

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business
  }

  async getBusinessById(businessId: string): Promise<any> {
    const business = await this.businessModel
      .findById(businessId)
      .populate('activeSubscription')
      .populate('ownerId', 'firstName lastName email')
      .populate('adminIds', 'firstName lastName email role')
      .exec() as any

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    return business
  }

  async updateBusiness(
    businessId: string,
    updateData: any // Changed to any to avoid complex type issues
  ): Promise<BusinessDocument> {
    const business = await this.businessModel.findByIdAndUpdate(
      businessId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).exec() as any

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
      .exec()

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
    const config = await this.tenantConfigModel.findOne({ businessId }).exec() as any
    
    if (!config) {
      // Create default config if not exists
      return await this.createDefaultTenantConfig(businessId)
    }

    return config
  }

  async updateTenantConfig(
    businessId: string,
    configData: any // Changed to any to avoid complex type issues
  ): Promise<TenantConfigDocument> {
    const config = await this.tenantConfigModel.findOneAndUpdate(
      { businessId: new Types.ObjectId(businessId) },
      { ...configData, updatedAt: new Date() },
      { new: true, upsert: true }
    ).exec() as any

    return config!
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

    const savedSubscription = await subscription.save() as any

    // Update business with active subscription
    await this.businessModel.findByIdAndUpdate(businessId, {
      activeSubscription: savedSubscription._id,
      status: 'active'
    }).exec() as any

    return savedSubscription
  }

  async cancelSubscription(
    subscriptionId: string,
    reason: string
  ): Promise<void> {
    const subscription = await this.subscriptionModel.findById(subscriptionId).exec()
    
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
    }).exec()
  }

  async getBusinessesByOwner(ownerId: string): Promise<BusinessDocument[]> {
    return await this.businessModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .populate('activeSubscription')
      .sort({ createdAt: -1 })
      .exec() as any
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
    }) as any

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

    const savedSubscription = await subscription.save() as any

    // Update business with trial subscription
    await this.businessModel.findByIdAndUpdate(businessId, {
      activeSubscription: savedSubscription._id
    }).exec() as any

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