import { Model } from 'mongoose';
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
export declare class CancellationPolicyService {
    private policyModel;
    private readonly logger;
    constructor(policyModel: Model<CancellationPolicyDocument>);
    getBusinessPolicy(businessId: string, serviceId?: string): Promise<any>;
    createOrUpdatePolicy(businessId: string, policyDto: any): Promise<any>;
    updatePolicy(businessId: string, updateDto: any): Promise<any>;
    getPolicyById(policyId: string): Promise<any>;
    deactivatePolicy(businessId: string, policyId: string): Promise<any>;
    calculateDepositAmount(businessId: string, totalAmount: number, serviceIds?: string[]): Promise<DepositCalculation>;
    calculateRefund(businessId: string, appointmentDate: Date, paidAmount: number, depositAmount?: number): Promise<RefundCalculation>;
    private createDefaultPolicy;
}
