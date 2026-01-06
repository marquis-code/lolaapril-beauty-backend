import { CommissionCalculatorService } from '../services/commission-calculator.service';
import { SourceTrackingService } from '../services/source-tracking.service';
import { CreateTrackingCodeDto } from '../dto/create-tracking-code.dto';
import { DisputeCommissionDto } from '../dto/dispute-commission.dto';
import { GetCommissionsDto } from '../dto/get-commissions.dto';
export declare class CommissionController {
    private commissionCalculatorService;
    private sourceTrackingService;
    constructor(commissionCalculatorService: CommissionCalculatorService, sourceTrackingService: SourceTrackingService);
    createTrackingCode(createDto: CreateTrackingCodeDto, businessId: string): Promise<{
        success: boolean;
        data: {
            code: string;
            trackingUrl: string;
            qrCodeUrl: string;
            name: string;
            codeType: "direct_link" | "qr_code" | "social_media" | "email_campaign";
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    getTrackingCodes(businessId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    validateTrackingCode(code: string): Promise<{
        success: boolean;
        data: {
            isValid: boolean;
            businessId?: string;
            codeType?: string;
            trackingData?: any;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    getBookingCommission(bookingId: string, businessId: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    getCommissionSummary(query: GetCommissionsDto, businessId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    disputeCommission(commissionId: string, disputeDto: DisputeCommissionDto, businessId: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
    }>;
    getSourceBreakdown(startDate: string, endDate: string, businessId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
}
