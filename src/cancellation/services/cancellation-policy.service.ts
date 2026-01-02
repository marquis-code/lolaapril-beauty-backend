import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { 
  CancellationPolicy, 
  CancellationPolicyDocument 
} from '../schemas/cancellation-policy.schema'

export interface DepositCalculation {
  requiresDeposit: boolean
  depositAmount: number
  depositPercentage: number
  reason: string
}

@Injectable()
export class CancellationPolicyService {
  private readonly logger = new Logger(CancellationPolicyService.name)

  constructor(
    @InjectModel(CancellationPolicy.name)
    private policyModel: Model<CancellationPolicyDocument>
  ) {}

  // ✅ FIX: This method was missing
  async getBusinessPolicy(
    businessId: string,
    serviceId?: string
  ): Promise<any> {
    const query: any = {
      businessId: new Types.ObjectId(businessId),
      isActive: true
    }

    if (serviceId) {
      query.applicableServices = new Types.ObjectId(serviceId)
    }

    const policy = await this.policyModel.findOne(query)

    if (policy) {
      return policy
    }

    const defaultPolicy = await this.policyModel.findOne({
      businessId: new Types.ObjectId(businessId),
      isActive: true,
      applicableServices: { $size: 0 }
    })

    if (defaultPolicy) {
      return defaultPolicy
    }

    return await this.createDefaultPolicy(businessId)
  }

  // ✅ FIX: This method was missing
  async createOrUpdatePolicy(
    businessId: string,
    policyDto: any
  ): Promise<any> {
    const existingPolicy = await this.policyModel.findOne({
      businessId: new Types.ObjectId(businessId),
      isActive: true
    })

    if (existingPolicy) {
      Object.assign(existingPolicy, policyDto)
      await existingPolicy.save()
      
      this.logger.log(`Updated policy ${existingPolicy._id} for business ${businessId}`)
      return existingPolicy
    }

    const newPolicy = await this.policyModel.create({
      ...policyDto,
      businessId: new Types.ObjectId(businessId),
      isActive: true
    })

    this.logger.log(`Created new policy ${newPolicy._id} for business ${businessId}`)
    return newPolicy
  }

  async calculateDepositAmount(
    businessId: string,
    totalAmount: number,
    serviceIds?: string[]
  ): Promise<DepositCalculation> {
    const policy = await this.getBusinessPolicy(businessId, serviceIds?.[0])

    if (!policy || !policy.requiresDeposit) {
      return {
        requiresDeposit: false,
        depositAmount: 0,
        depositPercentage: 0,
        reason: 'Business does not require deposits'
      }
    }

    const depositAmount = Math.max(
      (totalAmount * policy.depositPercentage) / 100,
      policy.minimumDepositAmount || 0
    )

    return {
      requiresDeposit: true,
      depositAmount: Math.round(depositAmount),
      depositPercentage: policy.depositPercentage,
      reason: `${policy.depositPercentage}% deposit required by business policy`
    }
  }

  // ✅ FIX: This method was missing
  async calculateRefund(
    businessId: string,
    appointmentDate: Date,
    paidAmount: number,
    depositAmount: number = 0
  ): Promise<{
    canCancel: boolean
    refundAmount: number
    penaltyAmount: number
    refundPercentage: number
    reason: string
    hoursNotice: number
  }> {
    const policy = await this.getBusinessPolicy(businessId)
    
    const hoursUntilAppointment = 
      (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60)

    const applicableRule = policy.rules
      ?.sort((a, b) => b.hoursBeforeAppointment - a.hoursBeforeAppointment)
      .find(rule => hoursUntilAppointment >= rule.hoursBeforeAppointment)

    if (!applicableRule) {
      if (!policy.allowSameDayCancellation) {
        return {
          canCancel: false,
          refundAmount: 0,
          penaltyAmount: paidAmount,
          refundPercentage: 0,
          reason: 'Same-day cancellations not allowed',
          hoursNotice: hoursUntilAppointment
        }
      }

      const refundAmount = (paidAmount * policy.sameDayRefundPercentage) / 100
      return {
        canCancel: true,
        refundAmount: Math.round(refundAmount),
        penaltyAmount: Math.round(paidAmount - refundAmount),
        refundPercentage: policy.sameDayRefundPercentage,
        reason: 'Same-day cancellation - reduced refund',
        hoursNotice: hoursUntilAppointment
      }
    }

    const refundAmount = (paidAmount * applicableRule.refundPercentage) / 100
    const penaltyAmount = (paidAmount * applicableRule.penaltyPercentage) / 100

    return {
      canCancel: true,
      refundAmount: Math.round(refundAmount),
      penaltyAmount: Math.round(penaltyAmount),
      refundPercentage: applicableRule.refundPercentage,
      reason: applicableRule.description || 
        `Cancelled ${hoursUntilAppointment.toFixed(1)} hours before appointment`,
      hoursNotice: hoursUntilAppointment
    }
  }

  private async createDefaultPolicy(businessId: string): Promise<any> {
    const defaultPolicy = await this.policyModel.create({
      businessId: new Types.ObjectId(businessId),
      policyName: 'Default Cancellation Policy',
      requiresDeposit: true,
      depositPercentage: 20,
      minimumDepositAmount: 1000,
      cancellationWindowHours: 24,
      rules: [
        {
          hoursBeforeAppointment: 48,
          refundPercentage: 100,
          penaltyPercentage: 0,
          description: 'Full refund for cancellations 48+ hours before'
        },
        {
          hoursBeforeAppointment: 24,
          refundPercentage: 50,
          penaltyPercentage: 50,
          description: '50% refund for 24-48 hours notice'
        }
      ],
      allowSameDayCancellation: true,
      sameDayRefundPercentage: 0,
      sendReminders: true,
      reminderHours: [24, 4, 1],
      maxNoShowsBeforeDeposit: 2,
      isActive: true,
      applicableServices: [],
      description: 'Standard cancellation policy'
    })

    this.logger.log(`Created default policy for business ${businessId}`)
    return defaultPolicy
  }
}

