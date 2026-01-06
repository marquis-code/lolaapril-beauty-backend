import { NotificationService } from '../../notification/notification.service';
export declare class BookingEventHandler {
    private readonly notificationService;
    private readonly logger;
    constructor(notificationService: NotificationService);
    handleBookingCreated(booking: any): Promise<void>;
    handleBookingConfirmed(data: {
        booking: any;
        staffId: string;
        confirmedBy: string;
    }): Promise<void>;
    handleBookingCancelled(data: {
        booking: any;
        reason: string;
        cancelledBy: string;
    }): Promise<void>;
    handleBookingExpired(booking: any): Promise<void>;
    handlePaymentReminder(booking: any): Promise<void>;
    handleAppointmentCreated(data: {
        appointment: any;
        booking: any;
        payment: any;
        staffAssignment: any;
    }): Promise<void>;
}
