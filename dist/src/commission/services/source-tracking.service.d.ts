import { Model } from 'mongoose';
import { BookingDocument } from '../../booking/schemas/booking.schema';
import { TrackingCodeDocument } from '../schemas/tracking-code.schema';
export declare class SourceTrackingService {
    private bookingModel;
    private trackingCodeModel;
    private readonly logger;
    constructor(bookingModel: Model<BookingDocument>, trackingCodeModel: Model<TrackingCodeDocument>);
    generateTrackingCode(businessId: string, codeType: 'qr_code' | 'direct_link' | 'social_media' | 'email_campaign', name: string, options?: {
        description?: string;
        expiresAt?: Date;
        metadata?: any;
    }): Promise<string>;
    resolveTrackingCode(code: string): Promise<{
        isValid: boolean;
        businessId?: string;
        codeType?: string;
        trackingData?: any;
    }>;
    recordConversion(code: string): Promise<void>;
    isClientAcquiredByBusiness(clientId: string, businessId: string, currentSourceType: string): Promise<boolean>;
    shouldChargeCommission(sourceType: string, clientId: string, businessId: string, sourceIdentifier?: string): Promise<{
        shouldCharge: boolean;
        reason: string;
        isFirstTime: boolean;
    }>;
    getTrackingAnalytics(businessId: string, startDate?: Date, endDate?: Date): Promise<any>;
    private createUniqueCode;
    validateSourceData(sourceData: any): {
        isValid: boolean;
        errors: string[];
    };
}
