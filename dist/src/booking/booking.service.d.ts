import type { Model } from "mongoose";
import type { Booking, BookingDocument } from "./schemas/booking.schema";
import type { CreateBookingDto } from "./dto/create-booking.dto";
import type { UpdateBookingDto } from "./dto/update-booking.dto";
import type { BookingQueryDto } from "./dto/booking-query.dto";
export declare class BookingService {
    private bookingModel;
    constructor(bookingModel: Model<BookingDocument>);
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
    findAll(query: BookingQueryDto): Promise<{
        bookings: (import("mongoose").Document<unknown, {}, BookingDocument, {}> & Booking & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: string, cancellationReason?: string): Promise<Booking>;
    getBookingsByDate(date: Date): Promise<Booking[]>;
    getBookingStats(): Promise<{
        overview: any;
        bySource: any[];
        revenue: any;
    }>;
}
