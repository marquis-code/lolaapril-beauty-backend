export declare class UpgradePlanDto {
    planType: string;
    billingCycle?: 'monthly' | 'yearly';
}
export declare class CancelSubscriptionDto {
    reason: string;
    immediate?: boolean;
}
export declare class CheckLimitDto {
    context?: 'booking' | 'staff' | 'service';
}
