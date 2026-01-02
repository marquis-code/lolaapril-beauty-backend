import { Model } from 'mongoose';
import { NoShowRecordDocument } from '../schemas/no-show-record.schema';
import { ClientReliabilityDocument } from '../schemas/client-reliability.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
interface ClientReliabilityCheck {
    requiresDeposit: boolean;
    reason: string;
    score: number;
}
export declare class NoShowManagementService {
    private noShowModel;
    private reliabilityModel;
    private eventEmitter;
    private readonly logger;
    constructor(noShowModel: Model<NoShowRecordDocument>, reliabilityModel: Model<ClientReliabilityDocument>, eventEmitter: EventEmitter2);
    recordNoShow(data: {
        clientId: string;
        businessId: string;
        appointmentId: string;
        bookingId?: string;
        appointmentDate: Date;
        scheduledTime: string;
        bookedAmount: number;
        depositAmount?: number;
        wasDeposited: boolean;
    }): Promise<void>;
    recordLateCancellation(data: {
        clientId: string;
        businessId: string;
        appointmentId: string;
        bookingId?: string;
        appointmentDate: Date;
        scheduledTime: string;
        bookedAmount: number;
        penaltyCharged: number;
        hoursNotice: number;
    }): Promise<void>;
    private updateReliabilityScore;
    getClientReliability(clientId: string, businessId: string): Promise<any>;
    shouldRequireDeposit(clientId: string, businessId: string): Promise<ClientReliabilityCheck>;
    private flagForReview;
    getNoShowStats(businessId: string, startDate?: Date, endDate?: Date): Promise<any>;
}
export {};
