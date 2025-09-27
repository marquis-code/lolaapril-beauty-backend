import { Model } from 'mongoose';
import { Business, BusinessDocument, BusinessAddress, BusinessContact } from './schemas/business.schema';
import { SubscriptionDocument } from './schemas/subscription.schema';
import { TenantConfig, TenantConfigDocument } from './schemas/tenant-config.schema';
export declare class TenantService {
    private businessModel;
    private subscriptionModel;
    private tenantConfigModel;
    constructor(businessModel: Model<BusinessDocument>, subscriptionModel: Model<SubscriptionDocument>, tenantConfigModel: Model<TenantConfigDocument>);
    createBusiness(createBusinessDto: {
        businessName: string;
        subdomain: string;
        businessType: string;
        address: BusinessAddress;
        contact: BusinessContact;
        ownerId: string;
    }): Promise<BusinessDocument>;
    getBusinessBySubdomain(subdomain: string): Promise<BusinessDocument>;
    getBusinessById(businessId: string): Promise<BusinessDocument>;
    updateBusiness(businessId: string, updateData: Partial<Business>): Promise<BusinessDocument>;
    checkSubscriptionLimits(businessId: string): Promise<{
        isValid: boolean;
        limits: any;
        usage: any;
        warnings: string[];
    }>;
    getTenantConfig(businessId: string): Promise<TenantConfigDocument>;
    updateTenantConfig(businessId: string, configData: Partial<TenantConfig>): Promise<TenantConfigDocument>;
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
