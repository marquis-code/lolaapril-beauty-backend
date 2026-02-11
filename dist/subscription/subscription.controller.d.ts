import { SubscriptionService } from './subscription.service';
import { UpgradePlanDto, CancelSubscriptionDto } from './dto/subscription.dto';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getAvailablePlans(): Promise<{
        success: boolean;
        data: {
            monthlyPriceDisplay: string;
            yearlyPriceDisplay: string;
            yearlySavings: string;
            planType: string;
            planName: string;
            monthlyPrice: number;
            yearlyPrice: number;
            description: string;
            limits: {
                maxStaff: number;
                maxServices: number;
                maxAppointmentsPerMonth: number;
                maxStorageGB: number;
                features: {
                    onlineBooking: boolean;
                    analytics: boolean;
                    marketing: boolean;
                    inventory: boolean;
                    multiLocation: boolean;
                    apiAccess: boolean;
                    customBranding: boolean;
                    advancedReports: boolean;
                };
            };
        }[];
        message: string;
    }>;
    getPlanDetails(planType: string): Promise<{
        success: boolean;
        data: {
            planType: string;
            planName: string;
            monthlyPrice: number;
            yearlyPrice: number;
            description: string;
            limits: {
                maxStaff: number;
                maxServices: number;
                maxAppointmentsPerMonth: number;
                maxStorageGB: number;
                features: {
                    onlineBooking: boolean;
                    analytics: boolean;
                    marketing: boolean;
                    inventory: boolean;
                    multiLocation: boolean;
                    apiAccess: boolean;
                    customBranding: boolean;
                    advancedReports: boolean;
                };
            };
        };
        message: string;
    }>;
    getBusinessSubscription(businessId: string): Promise<{
        success: boolean;
        data: {
            subscription: any;
            business: any;
        };
        message: string;
    }>;
    getHistory(businessId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    checkLimits(businessId: string, context?: 'booking' | 'staff' | 'service'): Promise<{
        success: boolean;
        data: {
            isValid: boolean;
            canProceed: boolean;
            limits: any;
            usage: any;
            warnings: string[];
            blocked: string[];
        };
        message: string;
    }>;
    getUsage(businessId: string): Promise<{
        success: boolean;
        data: {
            staffCount: number;
            servicesCount: number;
            monthlyAppointments: number;
            storageUsedGB: number;
        };
        message: string;
    }>;
    getTrialStatus(businessId: string): Promise<{
        success: boolean;
        data: {
            isTrial: boolean;
            remainingDays: number;
            endDate: any;
        };
    }>;
    upgradePlan(businessId: string, dto: UpgradePlanDto): Promise<{
        success: boolean;
        message: string;
        oldPlan: any;
        newPlan: any;
        subscription: any;
    }>;
    downgradePlan(businessId: string, dto: UpgradePlanDto): Promise<{
        success: boolean;
        message: string;
        currentPlan: any;
        scheduledPlan: string;
        effectiveDate: any;
    }>;
    cancelSubscription(businessId: string, dto: CancelSubscriptionDto): Promise<{
        success: boolean;
        message: string;
        effectiveDate: any;
    }>;
    reactivateSubscription(businessId: string): Promise<{
        success: boolean;
        message: string;
        subscription: any;
    }>;
}
