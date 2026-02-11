declare class PolicyRuleDto {
    hoursBeforeAppointment: number;
    refundPercentage: number;
    penaltyPercentage: number;
    description?: string;
}
export declare class CreateCancellationPolicyDto {
    policyName: string;
    requiresDeposit: boolean;
    depositPercentage: number;
    minimumDepositAmount?: number;
    cancellationWindowHours: number;
    rules: PolicyRuleDto[];
    allowSameDayCancellation: boolean;
    sameDayRefundPercentage: number;
    reminderHours?: number[];
    maxNoShowsBeforeDeposit?: number;
    description?: string;
    applicableServices?: string[];
}
declare const UpdateCancellationPolicyDto_base: import("@nestjs/common").Type<Partial<CreateCancellationPolicyDto>>;
export declare class UpdateCancellationPolicyDto extends UpdateCancellationPolicyDto_base {
}
export {};
