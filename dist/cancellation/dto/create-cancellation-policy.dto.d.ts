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
    description?: string;
}
export {};
