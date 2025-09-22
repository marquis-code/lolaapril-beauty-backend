import type { BookingService } from "./booking.service";
import type { CreateBookingDto } from "./dto/create-booking.dto";
import type { UpdateBookingDto } from "./dto/update-booking.dto";
import type { BookingQueryDto } from "./dto/booking-query.dto";
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(createBookingDto: CreateBookingDto): Promise<import("./schemas/booking.schema").Booking>;
    findAll(query: BookingQueryDto): Promise<{
        bookings: (import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").BookingDocument, {}> & import("./schemas/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
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
    getStats(): Promise<{
        overview: any;
        bySource: any[];
        revenue: any;
    }>;
    getByDate(date: string): Promise<import("./schemas/booking.schema").Booking[]>;
    findOne(id: string): Promise<import("./schemas/booking.schema").Booking>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<import("./schemas/booking.schema").Booking>;
    updateStatus(id: string, body: {
        status: string;
        cancellationReason?: string;
    }): Promise<import("./schemas/booking.schema").Booking>;
    remove(id: string): Promise<void>;
}
