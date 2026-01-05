import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { NoShowRecordDocument } from '../schemas/no-show-record.schema';
import { ClientReliabilityDocument } from '../schemas/client-reliability.schema';
export interface RecordNoShowInput {
    clientId: string;
    businessId: string;
    appointmentId: string;
    bookingId: string;
    appointmentDate: Date;
    scheduledTime: string;
    bookedAmount: number;
    depositAmount?: number;
    wasDeposited?: boolean;
}
export interface RecordLateCancellationInput {
    clientId: string;
    businessId: string;
    appointmentId: string;
    bookingId: string;
    appointmentDate: Date;
    scheduledTime: string;
    bookedAmount: number;
    penaltyCharged: number;
    hoursNotice: number;
}
export declare class NoShowManagementService {
    private noShowModel;
    private reliabilityModel;
    private eventEmitter;
    private readonly logger;
    constructor(noShowModel: Model<NoShowRecordDocument>, reliabilityModel: Model<ClientReliabilityDocument>, eventEmitter: EventEmitter2);
    recordNoShow(input: RecordNoShowInput): Promise<NoShowRecordDocument>;
    recordLateCancellation(input: RecordLateCancellationInput): Promise<NoShowRecordDocument>;
    getClientReliability(clientId: string, businessId: string): Promise<ClientReliabilityDocument | null>;
    shouldRequireDeposit(clientId: string, businessId: string): Promise<{
        requiresDeposit: boolean;
        reason: string;
        score: number;
        riskLevel: string;
    }>;
    getNoShowStats(businessId: string, startDate?: Date, endDate?: Date): Promise<any>;
    updateReliabilityScore(clientId: string, businessId: string, incidentType: 'no_show' | 'late_cancellation' | 'same_day_cancellation' | 'completed'): Promise<void>;
    getClientHistory(clientId: string, businessId: string, limit?: number): Promise<any>;
    getReliabilityMetrics(businessId: string): Promise<any>;
    getCancellationTrends(businessId: string, startDate: Date, endDate: Date, groupBy?: 'day' | 'week' | 'month'): Promise<any>;
    recordCompletedAppointment(clientId: string, businessId: string, appointmentId: string): Promise<void>;
    blacklistClient(clientId: string, businessId: string, reason: string, adminId: string): Promise<void>;
    unblacklistClient(clientId: string, businessId: string, adminId: string): Promise<void>;
}
