import { Model } from 'mongoose';
import { BookingDocument } from '../../booking/schemas/booking.schema';
import { CommissionDocument } from '../schemas/commission.schema';
import { TrackingCodeDocument } from '../schemas/tracking-code.schema';
import { SourceTrackingService } from './source-tracking.service';
import { BookingSourceDto } from '../dto/booking-source.dto';
export interface CommissionCalculation {
    isCommissionable: boolean;
    commissionRate: number;
    commissionAmount: number;
    platformFee: number;
    businessPayout: number;
    reason: string;
    isFirstTimeClient: boolean;
}
export declare class CommissionCalculatorService {
    private commissionModel;
    private bookingModel;
    private trackingCodeModel;
    private sourceTrackingService;
    constructor(commissionModel: Model<CommissionDocument>, bookingModel: Model<BookingDocument>, trackingCodeModel: Model<TrackingCodeDocument>, sourceTrackingService: SourceTrackingService);
    calculateCommission(bookingId: string, bookingData: {
        businessId: string;
        clientId: string;
        totalAmount: number;
        sourceTracking: BookingSourceDto;
    }): Promise<CommissionCalculation>;
    createCommissionRecord(bookingId: string, paymentId: string, bookingData: any, calculation: CommissionCalculation): Promise<any>;
    private getCommissionRate;
    disputeCommission(commissionId: string, reason: string, disputedBy: string): Promise<void>;
    waiveCommission(commissionId: string, reason: string, waivedBy: string): Promise<void>;
    getCommissionByBooking(bookingId: string): Promise<any>;
    getBusinessCommissionSummary(businessId: string, startDate?: Date, endDate?: Date): Promise<any>;
    getSourceBreakdown(businessId: string, startDate: Date, endDate: Date): Promise<any>;
}
