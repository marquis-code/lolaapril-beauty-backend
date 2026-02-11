import type { BusinessContext as BusinessCtx } from '../../auth/decorators/business-context.decorator';
import { CancellationPolicyService } from '../services/cancellation-policy.service';
import { NoShowManagementService } from '../services/no-show-management.service';
import { AppointmentService } from '../../appointment/appointment.service';
import { CancelAppointmentDto } from '../dto/cancel-appointment.dto';
import { RecordNoShowDto } from '../dto/record-no-show.dto';
import { CreateCancellationPolicyDto, UpdateCancellationPolicyDto } from '../dto/create-cancellation-policy.dto';
import { CalculateRefundDto } from '../dto/calculate-refund.dto';
export declare class CancellationController {
    private cancellationPolicyService;
    private noShowManagementService;
    private appointmentService;
    constructor(cancellationPolicyService: CancellationPolicyService, noShowManagementService: NoShowManagementService, appointmentService: AppointmentService);
    getPolicy(businessId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getPolicyForService(businessId: string, serviceId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    createOrUpdatePolicy(context: BusinessCtx, createDto: CreateCancellationPolicyDto): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    updatePolicy(businessId: string, updateDto: UpdateCancellationPolicyDto): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    cancelAppointment(context: BusinessCtx, appointmentId: string, cancelDto: CancelAppointmentDto): Promise<{
        success: boolean;
        message: string;
        data: import("../services/cancellation-policy.service").RefundCalculation;
    } | {
        success: boolean;
        data: {
            appointment: {
                id: string;
                status: string;
                cancelledAt: Date;
                cancelReason: string;
            };
            refund: import("../services/cancellation-policy.service").RefundCalculation;
        };
        message: string;
    }>;
    calculateRefund(businessId: string, body: CalculateRefundDto): Promise<{
        success: boolean;
        data: import("../services/cancellation-policy.service").RefundCalculation;
        message: string;
    }>;
    recordNoShow(context: BusinessCtx, appointmentId: string, noShowDto: RecordNoShowDto): Promise<{
        success: boolean;
        message: string;
        data: {
            appointmentId: string;
            status: string;
            depositForfeited: boolean;
            recordedAt: Date;
        };
    }>;
    getClientReliability(businessId: string, clientId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getClientHistory(businessId: string, clientId: string, limit?: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    checkDepositRequirement(businessId: string, clientId: string): Promise<{
        success: boolean;
        data: {
            requiresDeposit: boolean;
            reason: string;
            score: number;
            riskLevel: string;
        };
        message: string;
    }>;
    getNoShowAnalytics(businessId: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getAnalyticsSummary(businessId: string, period?: string): Promise<{
        success: boolean;
        data: {
            period: {
                days: number;
                startDate: Date;
                endDate: Date;
            };
            stats: any;
            policy: {
                name: any;
                requiresDeposit: any;
                depositPercentage: any;
            };
            reliability: any;
        };
        message: string;
    }>;
    getCancellationTrends(businessId: string, startDate: string, endDate: string, groupBy?: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    calculateDeposit(businessId: string, body: {
        totalAmount: number;
        clientId?: string;
        serviceIds?: string[];
    }): Promise<{
        success: boolean;
        data: {
            requiresDeposit: any;
            depositAmount: number;
            depositPercentage: number;
            reason: any;
            policyBased: boolean;
            clientHistoryBased: any;
            clientScore: any;
        };
        message: string;
    }>;
}
