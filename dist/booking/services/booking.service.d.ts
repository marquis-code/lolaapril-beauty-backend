import { Model } from 'mongoose';
import { BookingDocument } from '../schemas/booking.schema';
import { GetBookingsDto } from '../dto/get-bookings.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class BookingService {
    private bookingModel;
    private eventEmitter;
    private readonly logger;
    constructor(bookingModel: Model<BookingDocument>, eventEmitter: EventEmitter2);
    createBooking(createBookingData: any): Promise<BookingDocument>;
    private generateBookingNumber;
    getBookingById(bookingId: string): Promise<BookingDocument>;
    getBookings(query: GetBookingsDto & {
        businessId: string;
    }): Promise<{
        bookings: BookingDocument[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateBookingStatus(bookingId: string, status: string, updatedBy?: string, reason?: string): Promise<BookingDocument>;
    confirmBooking(bookingId: string, staffId: string, confirmedBy: string): Promise<BookingDocument>;
    rejectBooking(bookingId: string, reason: string, rejectedBy: string): Promise<void>;
    cancelBooking(bookingId: string, reason: string, cancelledBy: string): Promise<void>;
    getClientBookings(clientId: string, status?: string): Promise<BookingDocument[]>;
    getTodayBookings(businessId: string): Promise<BookingDocument[]>;
    getPendingBookings(businessId: string): Promise<BookingDocument[]>;
    getUpcomingBookings(businessId: string, days?: number): Promise<BookingDocument[]>;
    linkAppointment(bookingId: string, appointmentId: string): Promise<void>;
    extendBookingExpiry(bookingId: string, additionalMinutes?: number): Promise<BookingDocument>;
    getBookingStats(businessId: string, startDate?: Date, endDate?: Date): Promise<any>;
    cleanupExpiredBookings(): Promise<void>;
    sendPaymentReminders(): Promise<void>;
    private calculateConversionRate;
}
