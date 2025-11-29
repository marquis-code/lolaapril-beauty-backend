export declare class CheckAvailabilityDto {
    businessId?: string;
    date: string;
    startTime: string;
    serviceId?: string;
    serviceIds?: string[];
    duration?: number;
    bufferTime?: number;
    bookingType?: 'sequential' | 'parallel';
}
