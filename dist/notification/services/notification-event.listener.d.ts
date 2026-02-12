import { RealtimeGateway } from '../gateways/realtime.gateway';
import { SalesService } from '../../sales/sales.service';
export declare class NotificationEventListener {
    private realtimeGateway;
    private salesService;
    private readonly logger;
    constructor(realtimeGateway: RealtimeGateway, salesService: SalesService);
    handleBookingCompleted(payload: {
        booking: any;
        completedBy?: string;
    }): Promise<void>;
    handleAuditCreated(payload: {
        businessId: string;
        auditLog: any;
    }): void;
    handleBookingCreated(payload: {
        businessId: string;
        booking: any;
    }): void;
    handleBookingStatusChanged(payload: {
        businessId: string;
        booking: any;
        oldStatus: string;
        newStatus: string;
    }): void;
    handlePaymentReceived(payload: {
        businessId: string;
        payment: any;
    }): void;
    handleClientCreated(payload: {
        businessId: string;
        client: any;
    }): void;
    handleAppointmentReminder(payload: {
        businessId: string;
        appointment: any;
    }): void;
    handleStaffAvailabilityChanged(payload: {
        businessId: string;
        staff: any;
        isAvailable: boolean;
    }): void;
    handleLowStockAlert(payload: {
        businessId: string;
        product: any;
    }): void;
    handleSystemAlert(payload: {
        businessId: string;
        alert: any;
    }): void;
}
