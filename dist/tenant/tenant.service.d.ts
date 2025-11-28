import { Model } from "mongoose";
import { BusinessDocument } from "./schemas/business.schema";
import { SubscriptionDocument } from "./schemas/subscription.schema";
import { TenantConfigDocument } from "./schemas/tenant-config.schema";
import { UserDocument } from "../auth/schemas/user.schema";
export declare class TenantService {
    private businessModel;
    private subscriptionModel;
    private tenantConfigModel;
    private userModel;
    constructor(businessModel: Model<BusinessDocument>, subscriptionModel: Model<SubscriptionDocument>, tenantConfigModel: Model<TenantConfigDocument>, userModel: Model<UserDocument>);
    isSubdomainAvailable(subdomain: string): Promise<boolean>;
    getBusinessBySubdomain(subdomain: string): Promise<BusinessDocument>;
    updateBusiness(businessId: string, updateData: any): Promise<BusinessDocument>;
    getBusinessesByOwner(ownerId: string): Promise<BusinessDocument[]>;
    getBusinessesByUser(userId: string): Promise<BusinessDocument[]>;
    addStaffMember(businessId: string, staffData: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }): Promise<any>;
    removeStaffMember(businessId: string, staffId: string): Promise<void>;
    addBusinessAdmin(businessId: string, adminId: string): Promise<void>;
    removeBusinessAdmin(businessId: string, adminId: string): Promise<void>;
    checkSubscriptionLimits(businessId: string, context?: 'booking' | 'staff' | 'service'): Promise<{
        isValid: boolean;
        limits: any;
        usage: any;
        warnings: string[];
    }>;
    getTenantConfig(businessId: string): Promise<TenantConfigDocument>;
    getBusinessById(businessId: string): Promise<any>;
    updateTenantConfig(businessId: string, configData: any): Promise<TenantConfigDocument>;
    suspendBusiness(businessId: string, reason: string): Promise<void>;
    reactivateBusiness(businessId: string): Promise<void>;
    private getCurrentUsage;
}
