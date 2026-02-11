export declare class GetAvailableSlotsDto {
    businessId?: string;
    subdomain?: string;
    date: string;
    serviceIds: string[];
    staffId?: string;
    durationOverride?: number;
    bufferTime?: number;
    bookingType?: 'sequential' | 'parallel';
}
