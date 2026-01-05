import { BookingOrchestrator } from '../services/booking-orchestrator.service';
import { ConfirmBookingDto } from '../dto/confirm-booking.dto';
import { BookingResult, PaymentResult, AppointmentResult, BookingResponse } from '../types/booking.types';
export declare class BookingFlowController {
    private readonly bookingOrchestrator;
    constructor(bookingOrchestrator: BookingOrchestrator);
    createBooking(createBookingDto: any): Promise<BookingResponse<BookingResult>>;
    confirmBooking(bookingId: string, confirmDto: ConfirmBookingDto): Promise<BookingResponse<AppointmentResult>>;
    handlePayment(bookingId: string, paymentDto: {
        transactionReference: string;
        amount: number;
        method: string;
        gateway: string;
        clientId: string;
        businessId: string;
        paymentType?: 'full' | 'deposit' | 'remaining';
    }): Promise<BookingResponse<PaymentResult>>;
    private isValidObjectId;
}
