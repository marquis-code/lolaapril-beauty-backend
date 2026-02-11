import { Model } from 'mongoose';
import { SubscriptionDocument } from './schemas/subscription.schema';
import { BusinessDocument } from '../business/schemas/business.schema';
export declare class SubscriptionService {
    private subscriptionModel;
    private businessModel;
    constructor(subscriptionModel: Model<SubscriptionDocument>, businessModel: Model<BusinessDocument>);
    private readonly PLAN_DEFINITIONS;
    getAvailablePlans(): Promise<{
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
    }[]>;
    getPlanByType(planType: string): Promise<{
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
    }>;
    getBusinessSubscription(businessId: string): Promise<any>;
    getSubscriptionWithBusiness(businessId: string): Promise<{
        subscription: any;
        business: any;
    }>;
    checkLimits(businessId: string, context?: 'booking' | 'staff' | 'service'): Promise<{
        isValid: boolean;
        canProceed: boolean;
        limits: any;
        usage: any;
        warnings: string[];
        blocked: string[];
    }>;
    hasFeature(businessId: string, feature: string): Promise<boolean>;
    getCurrentUsage(businessId: string): Promise<{
        staffCount: number;
        servicesCount: number;
        monthlyAppointments: number;
        storageUsedGB: number;
    }>;
    createTrialSubscription(businessId: string): Promise<any>;
    upgradePlan(businessId: string, planType: string, billingCycle?: 'monthly' | 'yearly'): Promise<{
        success: boolean;
        message: string;
        oldPlan: any;
        newPlan: any;
        subscription: any;
    }>;
    downgradePlan(businessId: string, planType: string): Promise<{
        success: boolean;
        message: string;
        currentPlan: any;
        scheduledPlan: string;
        effectiveDate: any;
    }>;
    cancelSubscription(businessId: string, reason: string, immediate?: boolean): Promise<{
        success: boolean;
        message: string;
        effectiveDate: any;
    }>;
    reactivateSubscription(businessId: string): Promise<{
        success: boolean;
        message: string;
        subscription: any;
    }>;
    getSubscriptionHistory(businessId: string): Promise<any>;
    isSubscriptionActive(businessId: string): Promise<boolean>;
    getRemainingTrialDays(businessId: string): Promise<number>;
}
