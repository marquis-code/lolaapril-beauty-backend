export declare class ServiceBookingDto {
    serviceId: string;
    bufferTime?: number;
}
export declare class BookingSourceDto {
    sourceType: string;
    sourceIdentifier?: string;
    trackingCode?: string;
    referralCode?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    ipAddress?: string;
    userAgent?: string;
    referrerUrl?: string;
}
export declare class CreateBookingDto {
    businessId: string;
    clientId: string;
    services: ServiceBookingDto[];
    preferredDate: string;
    preferredStartTime: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    specialRequests?: string;
}
export declare class CreateBookingWithSourceDto extends CreateBookingDto {
    bookingSource: BookingSourceDto;
}
