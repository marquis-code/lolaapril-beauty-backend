import { Model } from 'mongoose';
import { BookingDocument } from '../schemas/booking.schema';
import { BookingSourceDto } from '../dto/create-booking.dto';
export declare class SourceTrackingService {
    private bookingModel;
    private readonly logger;
    constructor(bookingModel: Model<BookingDocument>);
    calculateCommission(bookingSource: any, businessId: string, clientId: string, totalAmount: number): Promise<{
        isCommissionable: boolean;
        commissionRate: number;
        commissionAmount: number;
        reason: string;
    }>;
    private isClientAcquiredByBusiness;
    generateTrackingId(businessId: string, channel: string): string;
    validateSourceData(sourceData: BookingSourceDto): {
        isValid: boolean;
        errors: string[];
    };
}
