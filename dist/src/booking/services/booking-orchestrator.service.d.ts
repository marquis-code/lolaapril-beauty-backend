import { BookingService } from './booking.service';
import { AppointmentService } from '../../appointment/appointment.service';
import { PaymentService } from '../../payment/payment.service';
import { AvailabilityService } from '../../availability/availability.service';
import { NotificationService } from '../../notification/notification.service';
import { StaffService } from '../../staff/staff.service';
import { TenantService } from '../../tenant/tenant.service';
import { ServiceService } from '../../service/service.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
interface CreateBookingDto {
    businessId: string;
    clientId: string;
    serviceIds: string[];
    preferredDate: Date;
    preferredStartTime: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    specialRequests?: string;
}
interface BookingResult {
    bookingId: string;
    bookingNumber: string;
    estimatedTotal: number;
    expiresAt: Date;
    status: string;
    clientId: string;
    businessId: string;
    booking: any;
    availableSlots?: any[];
    message: string;
    requiresPayment?: boolean;
}
interface AppointmentResult {
    appointmentId: string;
    appointmentNumber: string;
    scheduledDate: Date;
    scheduledTime: string;
    status: string;
    clientId: string;
    businessId: string;
    booking: any;
    message: string;
    appointment: any;
    assignment: any;
}
interface PaymentResult {
    paymentId: string;
    success: boolean;
    message: string;
    transactionReference: string;
    amount: number;
    method: string;
    gateway: string;
    status: string;
    payment: any;
    appointment: any;
}
export declare class BookingOrchestrator {
    private readonly bookingService;
    private readonly appointmentService;
    private readonly paymentService;
    private readonly availabilityService;
    private readonly notificationService;
    private readonly staffService;
    private readonly tenantService;
    private readonly serviceService;
    private readonly eventEmitter;
    private readonly logger;
    constructor(bookingService: BookingService, appointmentService: AppointmentService, paymentService: PaymentService, availabilityService: AvailabilityService, notificationService: NotificationService, staffService: StaffService, tenantService: TenantService, serviceService: ServiceService, eventEmitter: EventEmitter2);
    createBookingWithValidation(createBookingDto: CreateBookingDto): Promise<BookingResult>;
    confirmBookingAndCreateAppointment(bookingId: string, staffId?: string): Promise<AppointmentResult>;
    handlePaymentAndComplete(bookingId: string, transactionReference: string, paymentData: {
        amount: number;
        method: string;
        gateway: string;
        clientId: string;
        businessId: string;
    }): Promise<PaymentResult>;
    private sendConfirmationNotifications;
    private checkAvailabilityForAllServices;
    private handlePaymentFailure;
    private handleUnavailableSlot;
    private getServicesDetails;
    private calculateTotalDuration;
    private calculateTotalPrice;
    private getServiceDurationInMinutes;
    private addMinutesToTime;
    private getPreferredStaff;
}
export {};
