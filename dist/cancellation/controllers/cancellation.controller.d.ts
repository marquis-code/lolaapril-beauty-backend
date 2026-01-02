import { CancellationPolicyService } from '../services/cancellation-policy.service';
import { NoShowManagementService } from '../services/no-show-management.service';
import { AppointmentService } from '../../appointment/appointment.service';
import { CancelAppointmentDto } from '../dto/cancel-appointment.dto';
import { RecordNoShowDto } from '../dto/record-no-show.dto';
import { CreateCancellationPolicyDto } from '../dto/create-cancellation-policy.dto';
export declare class CancellationController {
    private cancellationPolicyService;
    private noShowManagementService;
    private appointmentService;
    constructor(cancellationPolicyService: CancellationPolicyService, noShowManagementService: NoShowManagementService, appointmentService: AppointmentService);
    getPolicy(req: any): Promise<{
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
    createOrUpdatePolicy(createDto: CreateCancellationPolicyDto, req: any): Promise<{
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
    cancelAppointment(appointmentId: string, cancelDto: CancelAppointmentDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            canCancel: boolean;
            refundAmount: number;
            penaltyAmount: number;
            refundPercentage: number;
            reason: string;
            hoursNotice: number;
        };
        error?: undefined;
    } | {
        success: boolean;
        data: {
            appointment: import("../../appointment/schemas/appointment.schema").Appointment;
            refund: {
                canCancel: boolean;
                refundAmount: number;
                penaltyAmount: number;
                refundPercentage: number;
                reason: string;
                hoursNotice: number;
            };
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    recordNoShow(appointmentId: string, noShowDto: RecordNoShowDto, req: any): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
    }>;
    getClientReliability(clientId: string, req: any): Promise<any>;
    getNoShowAnalytics(startDate: string, endDate: string, req: any): Promise<{
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
    calculateRefund(body: {
        appointmentDate: string;
        paidAmount: number;
        depositAmount?: number;
    }, req: any): Promise<{
        success: boolean;
        data: {
            canCancel: boolean;
            refundAmount: number;
            penaltyAmount: number;
            refundPercentage: number;
            reason: string;
            hoursNotice: number;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
}
