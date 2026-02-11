import { NotificationService } from '../../notification/notification.service';
import { ChatService } from '../../notification/services/chat.service';
export declare class BookingEventHandler {
    private readonly notificationService;
    private readonly chatService;
    private readonly logger;
    constructor(notificationService: NotificationService, chatService: ChatService);
    handleBookingCreated(payload: any): Promise<void>;
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
    private sendAutomatedChatMessage;
    handleAppointmentCreated(data: {
        appointment: any;
        booking: any;
        payment: any;
        staffAssignment: any;
    }): Promise<void>;
}
