// import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
// import { InjectModel } from '@nestjs/mongoose'
// import { Model, Types } from 'mongoose'
// import { Subscription, SubscriptionDocument } from './schemas/subscription.schema'
// import { Business, BusinessDocument } from '../business/schemas/business.schema'

// @Injectable()
// export class SubscriptionService {
//   constructor(
//     @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
//     @InjectModel(Business.name) private businessModel: Model<BusinessDocument>
//   ) {}

//   // ==================== PLAN DEFINITIONS ====================
  
//   private readonly PLAN_DEFINITIONS = [
//     {
//       planType: 'trial',
//       planName: '14-Day Free Trial',
//       monthlyPrice: 0,
//       yearlyPrice: 0,
//       description: 'Try all basic features for 14 days',
//       limits: {
//         maxStaff: 3,
//         maxServices: 10,
//         maxAppointmentsPerMonth: 100,
//         maxStorageGB: 1,
//         features: {
//           onlineBooking: true,
//           analytics: false,
//           marketing: false,
//           inventory: false,
//           multiLocation: false,
//           apiAccess: false,
//           customBranding: false,
//           advancedReports: false
//         }
//       }
//     },
//     {
//       planType: 'basic',
//       planName: 'Basic Plan',
//       monthlyPrice: 2900, // in cents/kobo
//       yearlyPrice: 29000,
//       description: 'Perfect for small salons getting started',
//       limits: {
//         maxStaff: 5,
//         maxServices: 50,
//         maxAppointmentsPerMonth: 500,
//         maxStorageGB: 5,
//         features: {
//           onlineBooking: true,
//           analytics: true,
//           marketing: false,
//           inventory: false,
//           multiLocation: false,
//           apiAccess: false,
//           customBranding: false,
//           advancedReports: false
//         }
//       }
//     },
//     {
//       planType: 'standard',
//       planName: 'Standard Plan',
//       monthlyPrice: 7900,
//       yearlyPrice: 79000,
//       description: 'For growing businesses needing more features',
//       limits: {
//         maxStaff: 15,
//         maxServices: 200,
//         maxAppointmentsPerMonth: 2000,
//         maxStorageGB: 20,
//         features: {
//           onlineBooking: true,
//           analytics: true,
//           marketing: true,
//           inventory: true,
//           multiLocation: false,
//           apiAccess: true,
//           customBranding: true,
//           advancedReports: true
//         }
//       }
//     },
//     {
//       planType: 'premium',
//       planName: 'Premium Plan',
//       monthlyPrice: 19900,
//       yearlyPrice: 199000,
//       description: 'For established businesses with multiple locations',
//       limits: {
//         maxStaff: -1, // unlimited
//         maxServices: -1, // unlimited
//         maxAppointmentsPerMonth: -1, // unlimited
//         maxStorageGB: 100,
//         features: {
//           onlineBooking: true,
//           analytics: true,
//           marketing: true,
//           inventory: true,
//           multiLocation: true,
//           apiAccess: true,
//           customBranding: true,
//           advancedReports: true
//         }
//       }
//     },
//     {
//       planType: 'enterprise',
//       planName: 'Enterprise Plan',
//       monthlyPrice: 0, // custom pricing
//       yearlyPrice: 0,
//       description: 'Custom solution for large chains',
//       limits: {
//         maxStaff: -1,
//         maxServices: -1,
//         maxAppointmentsPerMonth: -1,
//         maxStorageGB: -1,
//         features: {
//           onlineBooking: true,
//           analytics: true,
//           marketing: true,
//           inventory: true,
//           multiLocation: true,
//           apiAccess: true,
//           customBranding: true,
//           advancedReports: true
//         }
//       }
//     }
//   ]

//   // ==================== PLAN INFORMATION ====================
  
//   async getAvailablePlans() {
//     return this.PLAN_DEFINITIONS.map(plan => ({
//       ...plan,
//       // Convert prices back to currency units
//       monthlyPriceDisplay: (plan.monthlyPrice / 100).toFixed(2),
//       yearlyPriceDisplay: (plan.yearlyPrice / 100).toFixed(2),
//       yearlySavings: plan.monthlyPrice > 0 
//         ? (((plan.monthlyPrice * 12) - plan.yearlyPrice) / 100).toFixed(2)
//         : '0.00'
//     }))
//   }

//   async getPlanByType(planType: string) {
//     const plan = this.PLAN_DEFINITIONS.find(p => p.planType === planType)
//     if (!plan) {
//       throw new NotFoundException(`Plan type '${planType}' not found`)
//     }
//     return plan
//   }

//   // ==================== SUBSCRIPTION LOOKUP ====================
  
//   async getBusinessSubscription(businessId: string): Promise<any> {
//     // NUCLEAR FIX: Break the chain and cast to any
//     const query = this.subscriptionModel
//       .findOne({
//         businessId: new Types.ObjectId(businessId),
//         status: { $in: ['active', 'past_due'] }
//       })
//       .lean()

//     const subscription: any = await query.exec()

//     if (!subscription) {
//       throw new NotFoundException('No active subscription found for this business')
//     }

//     return subscription
//   }

//   async getSubscriptionWithBusiness(businessId: string) {
//     const subscription = await this.getBusinessSubscription(businessId)
    
//     // NUCLEAR FIX: Break the chain and cast to any
//     const businessQuery = this.businessModel
//       .findById(businessId)
//       .select('businessName subdomain status')
//       .lean()
    
//     const business: any = await businessQuery.exec()

//     return {
//       subscription,
//       business
//     }
//   }

//   // ==================== LIMIT CHECKING ====================
  
//   async checkLimits(
//     businessId: string,
//     context?: 'booking' | 'staff' | 'service'
//   ): Promise<{
//     isValid: boolean
//     canProceed: boolean
//     limits: any
//     usage: any
//     warnings: string[]
//     blocked: string[]
//   }> {
//     try {
//       const subscription = await this.getBusinessSubscription(businessId)
//       const usage = await this.getCurrentUsage(businessId)
//       const limits = subscription.limits
//       const warnings: string[] = []
//       const blocked: string[] = []

//       // Check staff limit
//       if (context === 'staff' || !context) {
//         if (limits.maxStaff !== -1) {
//           if (usage.staffCount >= limits.maxStaff) {
//             blocked.push(`Staff limit reached (${limits.maxStaff}/${limits.maxStaff})`)
//           } else if (usage.staffCount >= limits.maxStaff * 0.9) {
//             warnings.push(`Approaching staff limit (${usage.staffCount}/${limits.maxStaff})`)
//           }
//         }
//       }

//       // Check services limit
//       if (context === 'service' || !context) {
//         if (limits.maxServices !== -1) {
//           if (usage.servicesCount >= limits.maxServices) {
//             blocked.push(`Services limit reached (${limits.maxServices}/${limits.maxServices})`)
//           } else if (usage.servicesCount >= limits.maxServices * 0.9) {
//             warnings.push(`Approaching services limit (${usage.servicesCount}/${limits.maxServices})`)
//           }
//         }
//       }

//       // Check appointments limit
//       if (context === 'booking' || !context) {
//         if (limits.maxAppointmentsPerMonth !== -1) {
//           if (usage.monthlyAppointments >= limits.maxAppointmentsPerMonth) {
//             blocked.push(`Monthly appointments limit reached (${limits.maxAppointmentsPerMonth}/${limits.maxAppointmentsPerMonth})`)
//           } else if (usage.monthlyAppointments >= limits.maxAppointmentsPerMonth * 0.9) {
//             warnings.push(`Approaching monthly appointments limit (${usage.monthlyAppointments}/${limits.maxAppointmentsPerMonth})`)
//           }
//         }
//       }

//       // Check storage limit
//       if (limits.maxStorageGB !== -1) {
//         if (usage.storageUsedGB >= limits.maxStorageGB) {
//           blocked.push(`Storage limit reached (${limits.maxStorageGB}GB/${limits.maxStorageGB}GB)`)
//         } else if (usage.storageUsedGB >= limits.maxStorageGB * 0.9) {
//           warnings.push(`Approaching storage limit (${usage.storageUsedGB}GB/${limits.maxStorageGB}GB)`)
//         }
//       }

//       return {
//         isValid: blocked.length === 0,
//         canProceed: blocked.length === 0,
//         limits,
//         usage,
//         warnings,
//         blocked
//       }
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error
//       }
//       throw new BadRequestException('Failed to check subscription limits')
//     }
//   }

//   async hasFeature(businessId: string, feature: string): Promise<boolean> {
//     try {
//       const subscription = await this.getBusinessSubscription(businessId)
//       return subscription.limits.features[feature] === true
//     } catch (error) {
//       return false
//     }
//   }

//   async getCurrentUsage(businessId: string): Promise<{
//     staffCount: number
//     servicesCount: number
//     monthlyAppointments: number
//     storageUsedGB: number
//   }> {
//     // NUCLEAR FIX: Cast to any
//     const business: any = await this.businessModel.findById(businessId).lean()

//     // Get current month appointments count
//     const startOfMonth = new Date()
//     startOfMonth.setDate(1)
//     startOfMonth.setHours(0, 0, 0, 0)

//     // TODO: Implement actual counts from your models
//     return {
//       staffCount: business?.staffIds?.length || 0,
//       servicesCount: 0, // TODO: Implement
//       monthlyAppointments: 0, // TODO: Implement
//       storageUsedGB: 0 // TODO: Implement
//     }
//   }

//   // ==================== SUBSCRIPTION MANAGEMENT ====================
  
//   async createTrialSubscription(businessId: string): Promise<any> {
//     const trialPlan = await this.getPlanByType('trial')
//     const startDate = new Date()
//     const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days

//     // NUCLEAR FIX: Cast to any
//     const subscription: any = await this.subscriptionModel.create({
//       businessId: new Types.ObjectId(businessId),
//       planType: trialPlan.planType,
//       planName: trialPlan.planName,
//       monthlyPrice: trialPlan.monthlyPrice,
//       yearlyPrice: trialPlan.yearlyPrice,
//       billingCycle: 'monthly',
//       startDate,
//       endDate,
//       nextBillingDate: endDate,
//       status: 'active',
//       limits: trialPlan.limits,
//       trialDays: 14
//     })

//     // Update business
//     await this.businessModel.findByIdAndUpdate(businessId, {
//       activeSubscription: subscription._id,
//       status: 'trial',
//       trialEndsAt: endDate
//     })

//     return subscription
//   }

//   async upgradePlan(
//     businessId: string,
//     planType: string,
//     billingCycle: 'monthly' | 'yearly' = 'monthly'
//   ) {
//     // Get current subscription
//     const currentSub = await this.getBusinessSubscription(businessId)
    
//     // Get new plan
//     const newPlan = await this.getPlanByType(planType)

//     // Check if it's actually an upgrade
//     const planHierarchy = { trial: 0, basic: 1, standard: 2, premium: 3, enterprise: 4 }
//     if (planHierarchy[planType] <= planHierarchy[currentSub.planType]) {
//       throw new BadRequestException('Can only upgrade to a higher plan')
//     }

//     // End current subscription
//     await this.subscriptionModel.findByIdAndUpdate(currentSub._id, {
//       status: 'cancelled',
//       cancellationDate: new Date(),
//       cancellationReason: 'Upgraded to higher plan',
//       updatedAt: new Date()
//     })

//     // Calculate dates
//     const startDate = new Date()
//     const daysToAdd = billingCycle === 'yearly' ? 365 : 30
//     const endDate = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)

//     // Create new subscription
//     const newSub: any = await this.subscriptionModel.create({
//       businessId: new Types.ObjectId(businessId),
//       planType: newPlan.planType,
//       planName: newPlan.planName,
//       monthlyPrice: newPlan.monthlyPrice,
//       yearlyPrice: newPlan.yearlyPrice,
//       billingCycle,
//       startDate,
//       endDate,
//       nextBillingDate: endDate,
//       status: 'active',
//       limits: newPlan.limits,
//       autoRenew: true
//     })

//     // Update business
//     await this.businessModel.findByIdAndUpdate(businessId, {
//       activeSubscription: newSub._id,
//       status: 'active'
//     })

//     return {
//       success: true,
//       message: `Successfully upgraded to ${newPlan.planName}`,
//       oldPlan: currentSub.planType,
//       newPlan: newSub.planType,
//       subscription: newSub
//     }
//   }

//   async downgradePlan(businessId: string, planType: string) {
//     const currentSub = await this.getBusinessSubscription(businessId)
//     const newPlan = await this.getPlanByType(planType)

//     // Check if it's actually a downgrade
//     const planHierarchy = { trial: 0, basic: 1, standard: 2, premium: 3, enterprise: 4 }
//     if (planHierarchy[planType] >= planHierarchy[currentSub.planType]) {
//       throw new BadRequestException('Can only downgrade to a lower plan')
//     }

//     // Schedule downgrade for end of current billing period
//     await this.subscriptionModel.findByIdAndUpdate(currentSub._id, {
//       $set: {
//         'metadata.scheduledDowngrade': {
//           planType: newPlan.planType,
//           effectiveDate: currentSub.endDate
//         }
//       },
//       updatedAt: new Date()
//     })

//     return {
//       success: true,
//       message: `Downgrade scheduled for ${currentSub.endDate.toDateString()}`,
//       currentPlan: currentSub.planType,
//       scheduledPlan: newPlan.planType,
//       effectiveDate: currentSub.endDate
//     }
//   }

//   async cancelSubscription(businessId: string, reason: string, immediate: boolean = false) {
//     const subscription = await this.getBusinessSubscription(businessId)

//     if (immediate) {
//       // Immediate cancellation
//       await this.subscriptionModel.findByIdAndUpdate(subscription._id, {
//         status: 'cancelled',
//         cancellationDate: new Date(),
//         cancellationReason: reason,
//         endDate: new Date(),
//         updatedAt: new Date()
//       })

//       await this.businessModel.findByIdAndUpdate(businessId, {
//         status: 'inactive'
//       })

//       return {
//         success: true,
//         message: 'Subscription cancelled immediately',
//         effectiveDate: new Date()
//       }
//     } else {
//       // Cancel at end of billing period
//       await this.subscriptionModel.findByIdAndUpdate(subscription._id, {
//         autoRenew: false,
//         cancellationReason: reason,
//         updatedAt: new Date()
//       })

//       return {
//         success: true,
//         message: 'Subscription will be cancelled at the end of billing period',
//         effectiveDate: subscription.endDate
//       }
//     }
//   }

//   async reactivateSubscription(businessId: string) {
//     // NUCLEAR FIX: Cast to any
//     const subscription: any = await this.subscriptionModel
//       .findOne({ businessId: new Types.ObjectId(businessId) })
//       .sort({ createdAt: -1 })
//       .exec()

//     if (!subscription) {
//       throw new NotFoundException('No subscription found')
//     }

//     if (subscription.status === 'active') {
//       throw new BadRequestException('Subscription is already active')
//     }

//     // Reactivate with new billing period
//     const startDate = new Date()
//     const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)

//     await this.subscriptionModel.findByIdAndUpdate(subscription._id, {
//       status: 'active',
//       startDate,
//       endDate,
//       nextBillingDate: endDate,
//       autoRenew: true,
//       updatedAt: new Date()
//     })

//     await this.businessModel.findByIdAndUpdate(businessId, {
//       status: 'active',
//       activeSubscription: subscription._id
//     })

//     return {
//       success: true,
//       message: 'Subscription reactivated successfully',
//       subscription
//     }
//   }

//   // ==================== SUBSCRIPTION HISTORY ====================
  
//   async getSubscriptionHistory(businessId: string) {
//     // NUCLEAR FIX: Break chain and cast
//     const query = this.subscriptionModel
//       .find({ businessId: new Types.ObjectId(businessId) })
//       .sort({ createdAt: -1 })
//       .lean()
    
//     const result: any = await query.exec()
//     return result
//   }

//   // ==================== UTILITY METHODS ====================
  
//   async isSubscriptionActive(businessId: string): Promise<boolean> {
//     try {
//       const subscription = await this.getBusinessSubscription(businessId)
//       return subscription.status === 'active' && new Date() < new Date(subscription.endDate)
//     } catch {
//       return false
//     }
//   }

//   async getRemainingTrialDays(businessId: string): Promise<number> {
//     try {
//       const subscription = await this.getBusinessSubscription(businessId)
//       if (subscription.planType !== 'trial') {
//         return 0
//       }

//       const now = new Date()
//       const endDate = new Date(subscription.endDate)
//       const remainingMs = endDate.getTime() - now.getTime()
//       const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000))

//       return Math.max(0, remainingDays)
//     } catch {
//       return 0
//     }
//   }
// }


import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Subscription, SubscriptionDocument } from './schemas/subscription.schema'
import { Business, BusinessDocument } from '../business/schemas/business.schema'

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>
  ) {}

  // ==================== PLAN DEFINITIONS ====================
  
  private readonly PLAN_DEFINITIONS = [
    {
      planType: 'trial',
      planName: '14-Day Free Trial',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Try all basic features for 14 days',
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
      }
    },
    {
      planType: 'basic',
      planName: 'Basic Plan',
      monthlyPrice: 2900, // in cents/kobo
      yearlyPrice: 29000,
      description: 'Perfect for small salons getting started',
      limits: {
        maxStaff: 5,
        maxServices: 50,
        maxAppointmentsPerMonth: 500,
        maxStorageGB: 5,
        features: {
          onlineBooking: true,
          analytics: true,
          marketing: false,
          inventory: false,
          multiLocation: false,
          apiAccess: false,
          customBranding: false,
          advancedReports: false
        }
      }
    },
    {
      planType: 'standard',
      planName: 'Standard Plan',
      monthlyPrice: 7900,
      yearlyPrice: 79000,
      description: 'For growing businesses needing more features',
      limits: {
        maxStaff: 15,
        maxServices: 200,
        maxAppointmentsPerMonth: 2000,
        maxStorageGB: 20,
        features: {
          onlineBooking: true,
          analytics: true,
          marketing: true,
          inventory: true,
          multiLocation: false,
          apiAccess: true,
          customBranding: true,
          advancedReports: true
        }
      }
    },
    {
      planType: 'premium',
      planName: 'Premium Plan',
      monthlyPrice: 19900,
      yearlyPrice: 199000,
      description: 'For established businesses with multiple locations',
      limits: {
        maxStaff: -1, // unlimited
        maxServices: -1, // unlimited
        maxAppointmentsPerMonth: -1, // unlimited
        maxStorageGB: 100,
        features: {
          onlineBooking: true,
          analytics: true,
          marketing: true,
          inventory: true,
          multiLocation: true,
          apiAccess: true,
          customBranding: true,
          advancedReports: true
        }
      }
    },
    {
      planType: 'enterprise',
      planName: 'Enterprise Plan',
      monthlyPrice: 0, // custom pricing
      yearlyPrice: 0,
      description: 'Custom solution for large chains',
      limits: {
        maxStaff: -1,
        maxServices: -1,
        maxAppointmentsPerMonth: -1,
        maxStorageGB: -1,
        features: {
          onlineBooking: true,
          analytics: true,
          marketing: true,
          inventory: true,
          multiLocation: true,
          apiAccess: true,
          customBranding: true,
          advancedReports: true
        }
      }
    }
  ]

  // ==================== PLAN INFORMATION ====================
  
  async getAvailablePlans() {
    return this.PLAN_DEFINITIONS.map(plan => ({
      ...plan,
      // Convert prices back to currency units
      monthlyPriceDisplay: (plan.monthlyPrice / 100).toFixed(2),
      yearlyPriceDisplay: (plan.yearlyPrice / 100).toFixed(2),
      yearlySavings: plan.monthlyPrice > 0 
        ? (((plan.monthlyPrice * 12) - plan.yearlyPrice) / 100).toFixed(2)
        : '0.00'
    }))
  }

  async getPlanByType(planType: string) {
    const plan = this.PLAN_DEFINITIONS.find(p => p.planType === planType)
    if (!plan) {
      throw new NotFoundException(`Plan type '${planType}' not found`)
    }
    return plan
  }

  // ==================== SUBSCRIPTION LOOKUP ====================
  
  async getBusinessSubscription(businessId: string): Promise<any> {
    // SCORCHED EARTH FIX: Cast model to any first
    const model: any = this.subscriptionModel
    const subscription: any = await model
      .findOne({
        businessId: new Types.ObjectId(businessId),
        status: { $in: ['active', 'past_due'] }
      })
      .lean()
      .exec()

    if (!subscription) {
      throw new NotFoundException('No active subscription found for this business')
    }

    return subscription
  }

  async getSubscriptionWithBusiness(businessId: string) {
    const subscription = await this.getBusinessSubscription(businessId)
    
    // SCORCHED EARTH FIX: Cast model to any first
    const businessModel: any = this.businessModel
    const business: any = await businessModel
      .findById(businessId)
      .select('businessName subdomain status')
      .lean()
      .exec()

    return {
      subscription,
      business
    }
  }

  // ==================== LIMIT CHECKING ====================
  
  async checkLimits(
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
    try {
      const subscription = await this.getBusinessSubscription(businessId)
      const usage = await this.getCurrentUsage(businessId)
      const limits = subscription.limits
      const warnings: string[] = []
      const blocked: string[] = []

      // Check staff limit
      if (context === 'staff' || !context) {
        if (limits.maxStaff !== -1) {
          if (usage.staffCount >= limits.maxStaff) {
            blocked.push(`Staff limit reached (${limits.maxStaff}/${limits.maxStaff})`)
          } else if (usage.staffCount >= limits.maxStaff * 0.9) {
            warnings.push(`Approaching staff limit (${usage.staffCount}/${limits.maxStaff})`)
          }
        }
      }

      // Check services limit
      if (context === 'service' || !context) {
        if (limits.maxServices !== -1) {
          if (usage.servicesCount >= limits.maxServices) {
            blocked.push(`Services limit reached (${limits.maxServices}/${limits.maxServices})`)
          } else if (usage.servicesCount >= limits.maxServices * 0.9) {
            warnings.push(`Approaching services limit (${usage.servicesCount}/${limits.maxServices})`)
          }
        }
      }

      // Check appointments limit
      if (context === 'booking' || !context) {
        if (limits.maxAppointmentsPerMonth !== -1) {
          if (usage.monthlyAppointments >= limits.maxAppointmentsPerMonth) {
            blocked.push(`Monthly appointments limit reached (${limits.maxAppointmentsPerMonth}/${limits.maxAppointmentsPerMonth})`)
          } else if (usage.monthlyAppointments >= limits.maxAppointmentsPerMonth * 0.9) {
            warnings.push(`Approaching monthly appointments limit (${usage.monthlyAppointments}/${limits.maxAppointmentsPerMonth})`)
          }
        }
      }

      // Check storage limit
      if (limits.maxStorageGB !== -1) {
        if (usage.storageUsedGB >= limits.maxStorageGB) {
          blocked.push(`Storage limit reached (${limits.maxStorageGB}GB/${limits.maxStorageGB}GB)`)
        } else if (usage.storageUsedGB >= limits.maxStorageGB * 0.9) {
          warnings.push(`Approaching storage limit (${usage.storageUsedGB}GB/${limits.maxStorageGB}GB)`)
        }
      }

      return {
        isValid: blocked.length === 0,
        canProceed: blocked.length === 0,
        limits,
        usage,
        warnings,
        blocked
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException('Failed to check subscription limits')
    }
  }

  async hasFeature(businessId: string, feature: string): Promise<boolean> {
    try {
      const subscription = await this.getBusinessSubscription(businessId)
      return subscription.limits.features[feature] === true
    } catch (error) {
      return false
    }
  }

  async getCurrentUsage(businessId: string): Promise<{
    staffCount: number
    servicesCount: number
    monthlyAppointments: number
    storageUsedGB: number
  }> {
    // SCORCHED EARTH FIX: Cast model to any
    const model: any = this.businessModel
    const business: any = await model.findById(businessId).lean().exec()

    // Get current month appointments count
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    // TODO: Implement actual counts from your models
    return {
      staffCount: business?.staffIds?.length || 0,
      servicesCount: 0, // TODO: Implement
      monthlyAppointments: 0, // TODO: Implement
      storageUsedGB: 0 // TODO: Implement
    }
  }

  // ==================== SUBSCRIPTION MANAGEMENT ====================
  
  async createTrialSubscription(businessId: string): Promise<any> {
    const trialPlan = await this.getPlanByType('trial')
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days

    // NUCLEAR FIX: Cast to any
    const subscription: any = await this.subscriptionModel.create({
      businessId: new Types.ObjectId(businessId),
      planType: trialPlan.planType,
      planName: trialPlan.planName,
      monthlyPrice: trialPlan.monthlyPrice,
      yearlyPrice: trialPlan.yearlyPrice,
      billingCycle: 'monthly',
      startDate,
      endDate,
      nextBillingDate: endDate,
      status: 'active',
      limits: trialPlan.limits,
      trialDays: 14
    })

    // Update business
    await this.businessModel.findByIdAndUpdate(businessId, {
      activeSubscription: subscription._id,
      status: 'trial',
      trialEndsAt: endDate
    })

    return subscription
  }

  async upgradePlan(
    businessId: string,
    planType: string,
    billingCycle: 'monthly' | 'yearly' = 'monthly'
  ) {
    // Get current subscription
    const currentSub = await this.getBusinessSubscription(businessId)
    
    // Get new plan
    const newPlan = await this.getPlanByType(planType)

    // Check if it's actually an upgrade
    const planHierarchy = { trial: 0, basic: 1, standard: 2, premium: 3, enterprise: 4 }
    if (planHierarchy[planType] <= planHierarchy[currentSub.planType]) {
      throw new BadRequestException('Can only upgrade to a higher plan')
    }

    // End current subscription
    await this.subscriptionModel.findByIdAndUpdate(currentSub._id, {
      status: 'cancelled',
      cancellationDate: new Date(),
      cancellationReason: 'Upgraded to higher plan',
      updatedAt: new Date()
    })

    // Calculate dates
    const startDate = new Date()
    const daysToAdd = billingCycle === 'yearly' ? 365 : 30
    const endDate = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)

    // Create new subscription
    const newSub: any = await this.subscriptionModel.create({
      businessId: new Types.ObjectId(businessId),
      planType: newPlan.planType,
      planName: newPlan.planName,
      monthlyPrice: newPlan.monthlyPrice,
      yearlyPrice: newPlan.yearlyPrice,
      billingCycle,
      startDate,
      endDate,
      nextBillingDate: endDate,
      status: 'active',
      limits: newPlan.limits,
      autoRenew: true
    })

    // Update business
    await this.businessModel.findByIdAndUpdate(businessId, {
      activeSubscription: newSub._id,
      status: 'active'
    })

    return {
      success: true,
      message: `Successfully upgraded to ${newPlan.planName}`,
      oldPlan: currentSub.planType,
      newPlan: newSub.planType,
      subscription: newSub
    }
  }

  async downgradePlan(businessId: string, planType: string) {
    const currentSub = await this.getBusinessSubscription(businessId)
    const newPlan = await this.getPlanByType(planType)

    // Check if it's actually a downgrade
    const planHierarchy = { trial: 0, basic: 1, standard: 2, premium: 3, enterprise: 4 }
    if (planHierarchy[planType] >= planHierarchy[currentSub.planType]) {
      throw new BadRequestException('Can only downgrade to a lower plan')
    }

    // Schedule downgrade for end of current billing period
    await this.subscriptionModel.findByIdAndUpdate(currentSub._id, {
      $set: {
        'metadata.scheduledDowngrade': {
          planType: newPlan.planType,
          effectiveDate: currentSub.endDate
        }
      },
      updatedAt: new Date()
    })

    return {
      success: true,
      message: `Downgrade scheduled for ${currentSub.endDate.toDateString()}`,
      currentPlan: currentSub.planType,
      scheduledPlan: newPlan.planType,
      effectiveDate: currentSub.endDate
    }
  }

  async cancelSubscription(businessId: string, reason: string, immediate: boolean = false) {
    const subscription = await this.getBusinessSubscription(businessId)

    if (immediate) {
      // Immediate cancellation
      await this.subscriptionModel.findByIdAndUpdate(subscription._id, {
        status: 'cancelled',
        cancellationDate: new Date(),
        cancellationReason: reason,
        endDate: new Date(),
        updatedAt: new Date()
      })

      await this.businessModel.findByIdAndUpdate(businessId, {
        status: 'inactive'
      })

      return {
        success: true,
        message: 'Subscription cancelled immediately',
        effectiveDate: new Date()
      }
    } else {
      // Cancel at end of billing period
      await this.subscriptionModel.findByIdAndUpdate(subscription._id, {
        autoRenew: false,
        cancellationReason: reason,
        updatedAt: new Date()
      })

      return {
        success: true,
        message: 'Subscription will be cancelled at the end of billing period',
        effectiveDate: subscription.endDate
      }
    }
  }

  async reactivateSubscription(businessId: string) {
    // SCORCHED EARTH FIX: Cast model to any
    const model: any = this.subscriptionModel
    const subscription: any = await model
      .findOne({ businessId: new Types.ObjectId(businessId) })
      .sort({ createdAt: -1 })
      .exec()

    if (!subscription) {
      throw new NotFoundException('No subscription found')
    }

    if (subscription.status === 'active') {
      throw new BadRequestException('Subscription is already active')
    }

    // Reactivate with new billing period
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)

    await this.subscriptionModel.findByIdAndUpdate(subscription._id, {
      status: 'active',
      startDate,
      endDate,
      nextBillingDate: endDate,
      autoRenew: true,
      updatedAt: new Date()
    })

    await this.businessModel.findByIdAndUpdate(businessId, {
      status: 'active',
      activeSubscription: subscription._id
    })

    return {
      success: true,
      message: 'Subscription reactivated successfully',
      subscription
    }
  }

  // ==================== SUBSCRIPTION HISTORY ====================
  
  async getSubscriptionHistory(businessId: string) {
    // SCORCHED EARTH FIX: Cast model to any
    const model: any = this.subscriptionModel
    const result: any = await model
      .find({ businessId: new Types.ObjectId(businessId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec()
    
    return result
  }

  // ==================== UTILITY METHODS ====================
  
  async isSubscriptionActive(businessId: string): Promise<boolean> {
    try {
      const subscription = await this.getBusinessSubscription(businessId)
      return subscription.status === 'active' && new Date() < new Date(subscription.endDate)
    } catch {
      return false
    }
  }

  async getRemainingTrialDays(businessId: string): Promise<number> {
    try {
      const subscription = await this.getBusinessSubscription(businessId)
      if (subscription.planType !== 'trial') {
        return 0
      }

      const now = new Date()
      const endDate = new Date(subscription.endDate)
      const remainingMs = endDate.getTime() - now.getTime()
      const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000))

      return Math.max(0, remainingDays)
    } catch {
      return 0
    }
  }
}