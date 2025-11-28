export declare class ServiceBookingDto {
    serviceId: string;
    bufferTime?: number;
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
    additionalBufferTime?: number;
}
