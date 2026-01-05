// ==================== cancellation-policy.service.ts ====================
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { CancellationPolicyDocument } from '../schemas/cancellation-policy.schema';

export interface DepositCalculation {
  requiresDeposit: boolean;
  depositAmount: number;
  depositPercentage: number;
  reason: string;
}

export interface RefundCalculation {
  canCancel: boolean;
  refundAmount: number;
  penaltyAmount: number;
  refundPercentage: number;
  reason: string;
  hoursNotice: number;
}

// NUCLEAR FIX: Explicit type for lean policy
type LeanPolicy = {
  _id: any;
  businessId: any;
  policyName: string;
  requiresDeposit: boolean;
  depositPercentage: number;
  minimumDepositAmount?: number;
  cancellationWindowHours: number;
  rules?: Array<{
    hoursBeforeAppointment: number;
    refundPercentage: number;
    penaltyPercentage: number;
    description?: string;
  }>;
  allowSameDayCancellation: boolean;
  sameDayRefundPercentage: number;
  sendReminders: boolean;
  reminderHours?: number[];
  maxNoShowsBeforeDeposit?: number;
  isActive: boolean;
  applicableServices: any[];
  description?: string;
  [key: string]: any;
};

@Injectable()
export class CancellationPolicyService {
  private readonly logger = new Logger(CancellationPolicyService.name);

  constructor(
    @InjectModel('CancellationPolicy')
    private policyModel: Model<CancellationPolicyDocument>
  ) {}

  async getBusinessPolicy(
    businessId: string,
    serviceId?: string
  ): Promise<any> {
    const query: any = {
      businessId: new Types.ObjectId(businessId),
      isActive: true
    };

    if (serviceId) {
      query.applicableServices = new Types.ObjectId(serviceId);
    }

    // NUCLEAR FIX: Break the chain completely
    const policyQuery = this.policyModel.findOne(query).lean<LeanPolicy>();
    const policy = await policyQuery.exec();

    if (policy) {
      return policy;
    }

    // Try default policy
    const defaultQuery = this.policyModel.findOne({
      businessId: new Types.ObjectId(businessId),
      isActive: true,
      applicableServices: { $size: 0 }
    }).lean<LeanPolicy>();
    
    const defaultPolicy = await defaultQuery.exec();

    if (defaultPolicy) {
      return defaultPolicy;
    }

    return this.createDefaultPolicy(businessId);
  }

  async createOrUpdatePolicy(
    businessId: string,
    policyDto: any
  ): Promise<any> {
    const existingPolicy: any = await this.policyModel.findOne({
      businessId: new Types.ObjectId(businessId),
      isActive: true
    }).exec();

    if (existingPolicy) {
      Object.assign(existingPolicy, policyDto);
      const saved: any = await existingPolicy.save();
      
      this.logger.log(`Updated policy ${saved._id} for business ${businessId}`);
      return saved.toObject();
    }

    const newPolicy: any = await this.policyModel.create({
      ...policyDto,
      businessId: new Types.ObjectId(businessId),
      isActive: true
    });

    this.logger.log(`Created new policy ${newPolicy._id} for business ${businessId}`);
    return newPolicy.toObject();
  }

  async updatePolicy(
    businessId: string,
    updateDto: any
  ): Promise<any> {
    const policy = await this.policyModel.findOne({
      businessId: new Types.ObjectId(businessId),
      isActive: true
    }).exec();

    if (!policy) {
      throw new NotFoundException('No active policy found for this business');
    }

    Object.assign(policy, updateDto);
    const saved = await policy.save();

    this.logger.log(`Updated policy ${saved._id} for business ${businessId}`);
    return saved.toObject();
  }

  async getPolicyById(policyId: string): Promise<any> {
    // NUCLEAR FIX: Break the chain
    const query = this.policyModel.findById(policyId).lean<LeanPolicy>();
    const policy = await query.exec();
    
    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    return policy;
  }

  async deactivatePolicy(businessId: string, policyId: string): Promise<any> {
    const policy = await this.policyModel.findOne({
      _id: policyId,
      businessId: new Types.ObjectId(businessId)
    }).exec();

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    policy.isActive = false;
    const saved = await policy.save();

    this.logger.log(`Deactivated policy ${policyId} for business ${businessId}`);
    return saved.toObject();
  }

  async calculateDepositAmount(
    businessId: string,
    totalAmount: number,
    serviceIds?: string[]
  ): Promise<DepositCalculation> {
    const policy = await this.getBusinessPolicy(businessId, serviceIds?.[0]);

    if (!policy || !policy.requiresDeposit) {
      return {
        requiresDeposit: false,
        depositAmount: 0,
        depositPercentage: 0,
        reason: 'Business does not require deposits'
      };
    }

    const depositAmount = Math.max(
      (totalAmount * policy.depositPercentage) / 100,
      policy.minimumDepositAmount || 0
    );

    return {
      requiresDeposit: true,
      depositAmount: Math.round(depositAmount),
      depositPercentage: policy.depositPercentage,
      reason: `${policy.depositPercentage}% deposit required by business policy`
    };
  }

  async calculateRefund(
    businessId: string,
    appointmentDate: Date,
    paidAmount: number,
    depositAmount: number = 0
  ): Promise<RefundCalculation> {
    const policy = await this.getBusinessPolicy(businessId);
    
    if (!policy) {
      throw new NotFoundException('No policy found for business');
    }

    const hoursUntilAppointment = 
      (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);

    const applicableRule = policy.rules
      ?.sort((a: any, b: any) => b.hoursBeforeAppointment - a.hoursBeforeAppointment)
      .find((rule: any) => hoursUntilAppointment >= rule.hoursBeforeAppointment);

    if (!applicableRule) {
      if (!policy.allowSameDayCancellation) {
        return {
          canCancel: false,
          refundAmount: 0,
          penaltyAmount: paidAmount,
          refundPercentage: 0,
          reason: 'Same-day cancellations not allowed',
          hoursNotice: hoursUntilAppointment
        };
      }

      const refundAmount = (paidAmount * policy.sameDayRefundPercentage) / 100;
      return {
        canCancel: true,
        refundAmount: Math.round(refundAmount),
        penaltyAmount: Math.round(paidAmount - refundAmount),
        refundPercentage: policy.sameDayRefundPercentage,
        reason: 'Same-day cancellation - reduced refund',
        hoursNotice: hoursUntilAppointment
      };
    }

    const refundAmount = (paidAmount * applicableRule.refundPercentage) / 100;
    const penaltyAmount = (paidAmount * applicableRule.penaltyPercentage) / 100;

    return {
      canCancel: true,
      refundAmount: Math.round(refundAmount),
      penaltyAmount: Math.round(penaltyAmount),
      refundPercentage: applicableRule.refundPercentage,
      reason: applicableRule.description || 
        `Cancelled ${hoursUntilAppointment.toFixed(1)} hours before appointment`,
      hoursNotice: hoursUntilAppointment
    };
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
    });

    this.logger.log(`Created default policy for business ${businessId}`);
    return defaultPolicy.toObject();
  }
}
