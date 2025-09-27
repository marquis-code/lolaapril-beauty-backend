import { BookingOrchestrator } from '../services/booking-orchestrator.service';
import { BookingResult, PaymentResult, AppointmentResult, BookingResponse } from '../types/booking.types';
export declare class BookingFlowController {
    private bookingOrchestrator;
    constructor(bookingOrchestrator: BookingOrchestrator);
    createBooking(createBookingDto: any, req: any): Promise<BookingResponse<BookingResult>>;
    confirmBooking(bookingId: string, staffId: string): Promise<BookingResponse<AppointmentResult>>;
    handlePayment(bookingId: string, paymentDto: {
        transactionReference: string;
        amount: number;
        method: string;
        gateway: string;
        clientId: string;
        businessId: string;
    }): Promise<BookingResponse<PaymentResult>>;
}
