export declare class BookingServiceDto {
    serviceId: string;
    serviceName: string;
    duration: number;
    price: number;
    staffId?: string;
    staffName?: string;
}
export declare class CreateBookingDto {
    clientId: string;
    services: BookingServiceDto[];
    bookingDate: Date;
    startTime: string;
    endTime: string;
    totalDuration: number;
    totalAmount: number;
    status?: string;
    bookingSource?: string;
    specialRequests?: string;
    internalNotes?: string;
    createdBy?: string;
}
