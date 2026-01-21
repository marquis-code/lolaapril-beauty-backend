import { Model } from 'mongoose';
import { BusinessDocument } from './schemas/business.schema';
import { SubscriptionService } from '../subscription/subscription.service';
import { UserDocument } from '../auth/schemas/user.schema';
import { PaystackService } from '../integration/payment-gateways/paystack/paystack.service';
export declare class BusinessService {
    private businessModel;
    private userModel;
    private readonly subscriptionService;
    private readonly paystackService;
    private readonly logger;
    constructor(businessModel: Model<BusinessDocument>, userModel: Model<UserDocument>, subscriptionService: SubscriptionService, paystackService: PaystackService);
    isSubdomainAvailable(subdomain: string): Promise<boolean>;
    getBySubdomain(subdomain: string): Promise<any>;
    getById(businessId: string): Promise<any>;
    getBusinessesByUser(userId: string): Promise<any[]>;
    update(businessId: string, updateData: any): Promise<any>;
    addStaff(businessId: string, staffData: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }): Promise<any>;
    removeStaff(businessId: string, staffId: string): Promise<void>;
    addAdmin(businessId: string, adminId: string): Promise<void>;
    removeAdmin(businessId: string, adminId: string): Promise<void>;
    getSettings(businessId: string): Promise<any>;
    updateSettings(businessId: string, settings: any): Promise<any>;
    checkSubscriptionLimits(businessId: string, context?: 'booking' | 'staff' | 'service'): Promise<{
        isValid: boolean;
        canProceed: boolean;
        limits: any;
        usage: any;
        warnings: string[];
        blocked: string[];
    }>;
    createPaystackSubaccount(businessId: string): Promise<any>;
    verifyBusinessKYC(businessId: string, adminId?: string): Promise<any>;
    rejectBusinessKYC(businessId: string, reason: string, adminId?: string): Promise<any>;
    getSubaccountDetails(businessId: string): Promise<any>;
}
