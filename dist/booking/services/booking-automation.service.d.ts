import { BookingService } from './booking.service';
import { AppointmentService } from '../../appointment/appointment.service';
import { PaymentService } from '../../payment/payment.service';
import { NotificationService } from '../../notification/notification.service';
import { StaffService } from '../../staff/staff.service';
import { AvailabilityService } from '../../availability/availability.service';
import { TenantService } from '../../tenant/tenant.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
interface AutomatedBookingResult {
    booking: any;
    appointment?: any;
    payment?: any;
    staffAssignment?: any;
    message: string;
    requiresPayment: boolean;
}
export declare class BookingAutomationService {
    private readonly bookingService;
    private readonly appointmentService;
    private readonly paymentService;
    private readonly notificationService;
    private readonly staffService;
    private readonly availabilityService;
    private readonly tenantService;
    private readonly eventEmitter;
    private readonly logger;
    constructor(bookingService: BookingService, appointmentService: AppointmentService, paymentService: PaymentService, notificationService: NotificationService, staffService: StaffService, availabilityService: AvailabilityService, tenantService: TenantService, eventEmitter: EventEmitter2);
    createAutomatedBooking(bookingData: {
        businessId: string;
        clientId: string;
        serviceIds: string[];
        preferredDate: Date | string;
        preferredStartTime: string;
        clientName: string;
        clientEmail: string;
        clientPhone: string;
        specialRequests?: string;
        autoConfirm?: boolean;
    }): Promise<AutomatedBookingResult>;
    processPaymentAndCreateAppointment(bookingId: string, paymentData: {
        transactionReference: string;
        amount: number;
        paymentMethod: string;
        gateway: string;
        status: 'successful' | 'failed';
    }): Promise<AutomatedBookingResult>;
    private parseDate;
    private processAutoConfirmedBooking;
    private validateTenantLimits;
    private checkAvailabilityForAllServices;
    private autoAssignStaffToAppointment;
    private sendAppointmentConfirmationNotifications;
    private handlePaymentFailure;
    private handleUnavailableSlot;
    private getServicesDetails;
    private calculateBookingTotals;
    private getServiceDurationInMinutes;
    private addMinutesToTime;
}
export {};
