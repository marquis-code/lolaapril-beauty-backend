import { TenantService } from './tenant.service';
import { Business, BusinessAddress, BusinessContact } from './schemas/business.schema';
import { TenantConfig } from './schemas/tenant-config.schema';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    createBusiness(createDto: {
        businessName: string;
        subdomain: string;
        businessType: string;
        address: BusinessAddress;
        contact: BusinessContact;
        ownerId: string;
    }): Promise<import("./schemas/business.schema").BusinessDocument>;
    getBusiness(businessId: string): Promise<import("./schemas/business.schema").BusinessDocument>;
    updateBusiness(businessId: string, updateData: Partial<Business>): Promise<import("./schemas/business.schema").BusinessDocument>;
    getTenantConfig(businessId: string): Promise<import("./schemas/tenant-config.schema").TenantConfigDocument>;
    updateTenantConfig(businessId: string, configData: Partial<TenantConfig>): Promise<import("./schemas/tenant-config.schema").TenantConfigDocument>;
    checkLimits(businessId: string): Promise<{
        isValid: boolean;
        limits: any;
        usage: any;
        warnings: string[];
    }>;
    createSubscription(businessId: string, subscriptionData: {
        planType: string;
        planName: string;
        monthlyPrice: number;
        yearlyPrice: number;
        billingCycle: string;
        limits: any;
    }): Promise<import("./schemas/subscription.schema").SubscriptionDocument>;
    cancelSubscription(subscriptionId: string, reason: string): Promise<void>;
    getBusinessesByOwner(ownerId: string): Promise<import("./schemas/business.schema").BusinessDocument[]>;
}
