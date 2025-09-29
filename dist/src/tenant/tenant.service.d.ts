import { Model } from 'mongoose';
import { BusinessDocument } from './schemas/business.schema';
import { SubscriptionDocument } from './schemas/subscription.schema';
import { TenantConfigDocument } from './schemas/tenant-config.schema';
export declare class TenantService {
    private businessModel;
    private subscriptionModel;
    private tenantConfigModel;
    constructor(businessModel: Model<BusinessDocument>, subscriptionModel: Model<SubscriptionDocument>, tenantConfigModel: Model<TenantConfigDocument>);
    createBusiness(createBusinessDto: any): Promise<any>;
    isSubdomainAvailable(subdomain: string): Promise<boolean>;
    registerBusinessWithOwner(registrationData: any): Promise<any>;
    getBusinessBySubdomain(subdomain: string): Promise<BusinessDocument>;
    getBusinessById(businessId: string): Promise<any>;
    updateBusiness(businessId: string, updateData: any): Promise<BusinessDocument>;
    checkSubscriptionLimits(businessId: string): Promise<{
        isValid: boolean;
        limits: any;
        usage: any;
        warnings: string[];
    }>;
    getTenantConfig(businessId: string): Promise<TenantConfigDocument>;
    updateTenantConfig(businessId: string, configData: any): Promise<TenantConfigDocument>;
    createSubscription(businessId: string, subscriptionData: {
        planType: string;
        planName: string;
        monthlyPrice: number;
        yearlyPrice: number;
        billingCycle: string;
        limits: any;
    }): Promise<SubscriptionDocument>;
    cancelSubscription(subscriptionId: string, reason: string): Promise<void>;
    getBusinessesByOwner(ownerId: string): Promise<BusinessDocument[]>;
    addBusinessAdmin(businessId: string, adminId: string): Promise<void>;
    removeBusinessAdmin(businessId: string, adminId: string): Promise<void>;
    suspendBusiness(businessId: string, reason: string): Promise<void>;
    reactivateBusiness(businessId: string): Promise<void>;
    private createDefaultTenantConfig;
    private createTrialSubscription;
    private getCurrentUsage;
}
