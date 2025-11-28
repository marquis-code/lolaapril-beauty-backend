import { BookingOrchestrator } from '../services/booking-orchestrator.service';
import { TenantRequest } from '../../tenant/middleware/tenant.middleware';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { ConfirmBookingDto } from "../dto/confirm-booking.dto";
import { BookingResult, PaymentResult, AppointmentResult, BookingResponse } from '../types/booking.types';
export declare class BookingFlowController {
    private bookingOrchestrator;
    constructor(bookingOrchestrator: BookingOrchestrator);
    createBooking(createBookingDto: CreateBookingDto, req: TenantRequest): Promise<BookingResponse<BookingResult>>;
    confirmBooking(bookingId: string, confirmDto: ConfirmBookingDto, req: TenantRequest): Promise<BookingResponse<AppointmentResult>>;
    handlePayment(bookingId: string, paymentDto: {
        transactionReference: string;
        amount: number;
        method: string;
        gateway: string;
        clientId: string;
        businessId: string;
    }): Promise<BookingResponse<PaymentResult>>;
    private isValidObjectId;
}
