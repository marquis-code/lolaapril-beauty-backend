import { TenantService } from './tenant.service';
import { Request } from 'express';
interface RequestWithUser extends Request {
    user: {
        sub: string;
        email: string;
        role: string;
        businessId?: string;
        subdomain?: string;
    };
}
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    checkSubdomainAvailability(subdomain: string): Promise<{
        success: boolean;
        data: {
            available: boolean;
            subdomain: string;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    getBusinessesByUser(req: RequestWithUser): Promise<{
        success: boolean;
        data: import("./schemas/business.schema").BusinessDocument[];
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    getBusinessBySubdomain(subdomain: string): Promise<{
        success: boolean;
        data: import("./schemas/business.schema").BusinessDocument;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    getBusinessById(businessId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    updateBusiness(businessId: string, updateBusinessDto: any): Promise<{
        success: boolean;
        data: import("./schemas/business.schema").BusinessDocument;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    addStaffMember(businessId: string, staffData: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }): Promise<{
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    removeStaffMember(businessId: string, staffId: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    addBusinessAdmin(businessId: string, adminId: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    removeBusinessAdmin(businessId: string, adminId: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    getTenantConfig(businessId: string): Promise<{
        success: boolean;
        data: import("./schemas/tenant-config.schema").TenantConfigDocument;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    updateTenantConfig(businessId: string, configData: any): Promise<{
        success: boolean;
        data: import("./schemas/tenant-config.schema").TenantConfigDocument;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    checkSubscriptionLimits(businessId: string): Promise<{
        success: boolean;
        data: {
            isValid: boolean;
            limits: any;
            usage: any;
            warnings: string[];
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    suspendBusiness(businessId: string, body: {
        reason: string;
    }): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    reactivateBusiness(businessId: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
}
export {};
