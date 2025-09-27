import { BookingOrchestrator } from '../services/booking-orchestrator.service';
import { BookingService } from '../services/booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { ProcessPaymentDto } from '../dto/process-payment.dto';
import { UpdateBookingStatusDto } from '../dto/update-booking.dto';
import { GetBookingsDto } from '../dto/get-bookings.dto';
import { BookingResult, PaymentResult, AppointmentResult, BookingResponse } from '../types/booking.types';
export declare class BookingController {
    private readonly bookingOrchestrator;
    private readonly bookingService;
    constructor(bookingOrchestrator: BookingOrchestrator, bookingService: BookingService);
    createAutomatedBooking(createBookingDto: CreateBookingDto, req: any): Promise<BookingResponse<BookingResult>>;
    processPaymentAndCreateAppointment(processPaymentDto: ProcessPaymentDto): Promise<BookingResponse<PaymentResult>>;
    confirmBookingManually(bookingId: string, staffId: string, req: any): Promise<BookingResponse<AppointmentResult>>;
    getBookings(getBookingsDto: GetBookingsDto, req: any): Promise<BookingResponse<any>>;
    getBookingById(bookingId: string): Promise<BookingResponse<any>>;
    updateBookingStatus(bookingId: string, updateStatusDto: UpdateBookingStatusDto): Promise<BookingResponse<any>>;
    cancelBooking(bookingId: string, reason: string, req: any): Promise<BookingResponse<void>>;
    getClientBookings(clientId: string, status?: string): Promise<BookingResponse<any>>;
    getTodayBookings(req: any): Promise<BookingResponse<any>>;
    rejectBooking(bookingId: string, reason: string, req: any): Promise<BookingResponse<void>>;
}
