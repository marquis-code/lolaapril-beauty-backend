export declare class GetAvailableSlotsDto {
    businessId?: string;
    date: string;
    serviceIds: string[];
    durationOverride?: number;
    bufferTime?: number;
    bookingType?: 'sequential' | 'parallel';
}
