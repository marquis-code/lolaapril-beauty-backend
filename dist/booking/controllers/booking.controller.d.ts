import { BookingService } from '../services/booking.service';
import { BookingOrchestrator } from '../services/booking-orchestrator.service';
import { CreateBookingWithSourceDto } from '../dto/create-booking-with-source.dto';
import { GetBookingsDto } from '../dto/get-bookings.dto';
import { ConfirmBookingDto } from '../dto/confirm-booking.dto';
import { ProcessPaymentDto } from '../dto/process-payment.dto';
import { UpdateBookingStatusDto } from '../dto/update-booking.dto';
import type { BusinessContext as BusinessCtx, RequestWithUser } from '../../auth';
import type { BookingResult, PaymentResult, AppointmentResult } from '../types/booking.types';
export declare class BookingController {
    private readonly bookingService;
    private readonly bookingOrchestrator;
    constructor(bookingService: BookingService, bookingOrchestrator: BookingOrchestrator);
    createBooking(createBookingDto: CreateBookingWithSourceDto): Promise<BookingResult>;
    getBookings(businessId: string, query: GetBookingsDto): Promise<{
        bookings: import("../schemas/booking.schema").BookingDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    getBookingById(id: string, user: RequestWithUser['user']): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: import("../schemas/booking.schema").BookingDocument;
        message?: undefined;
    }>;
    getMyBookings(user: RequestWithUser['user'], status?: string): Promise<import("../schemas/booking.schema").BookingDocument[]>;
    getTodayBookings(businessId: string): Promise<import("../schemas/booking.schema").BookingDocument[]>;
    getPendingBookings(businessId: string): Promise<import("../schemas/booking.schema").BookingDocument[]>;
    getUpcomingBookings(businessId: string, days?: number): Promise<import("../schemas/booking.schema").BookingDocument[]>;
    confirmBooking(bookingId: string, context: BusinessCtx, confirmDto: ConfirmBookingDto): Promise<AppointmentResult>;
    processPayment(bookingId: string, paymentDto: ProcessPaymentDto): Promise<PaymentResult>;
    updateBookingStatus(bookingId: string, context: BusinessCtx, statusDto: UpdateBookingStatusDto): Promise<import("../schemas/booking.schema").BookingDocument | {
        success: boolean;
        message: string;
    }>;
    rejectBooking(bookingId: string, context: BusinessCtx, body: {
        reason: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    cancelBooking(bookingId: string, user: RequestWithUser['user'], body: {
        reason: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    extendBooking(bookingId: string, context: BusinessCtx, body: {
        additionalMinutes?: number;
    }): Promise<import("../schemas/booking.schema").BookingDocument | {
        success: boolean;
        message: string;
    }>;
    getBookingStats(businessId: string, startDate?: string, endDate?: string): Promise<any>;
    resetBookingForRetry(bookingId: string, context: BusinessCtx): Promise<{
        success: boolean;
        message: string;
    }>;
}
