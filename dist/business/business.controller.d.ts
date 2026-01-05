import { BusinessService } from './business.service';
import { UpdateBusinessDto } from './dto/business.dto';
import type { RequestWithUser } from '../auth';
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    checkSubdomainAvailability(subdomain: string): Promise<{
        success: boolean;
        data: {
            available: boolean;
            subdomain: string;
        };
        message: string;
    }>;
    getBySubdomain(subdomain: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getById(id: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getMyBusinesses(user: RequestWithUser['user']): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    update(id: string, businessId: string, updateDto: UpdateBusinessDto): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
    }>;
    addStaff(id: string, businessId: string, staffDto: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
    }>;
    removeStaff(id: string, staffId: string, businessId: string): Promise<{
        success: boolean;
        error: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    }>;
    addAdmin(id: string, adminId: string, businessId: string): Promise<{
        success: boolean;
        error: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    }>;
    removeAdmin(id: string, adminId: string, businessId: string): Promise<{
        success: boolean;
        error: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    }>;
    getSettings(id: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    updateSettings(id: string, businessId: string, settings: any): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
    }>;
}
