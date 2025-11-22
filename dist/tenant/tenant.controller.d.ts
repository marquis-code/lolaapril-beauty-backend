import { TenantService } from './tenant.service';
import { CreateBusinessDto } from './dto/business.dto';
import { Request } from 'express';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    createBusiness(createBusinessDto: CreateBusinessDto): Promise<{
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: any;
        data?: undefined;
        message?: undefined;
    }>;
    registerBusiness(registrationData: any): Promise<{
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: any;
        data?: undefined;
        message?: undefined;
    }>;
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
    getBusinessesByOwner(req: Request): Promise<{
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
}
