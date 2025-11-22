export declare class CreateBookingDto {
    businessId: string;
    clientId: string;
    serviceIds: string[];
    preferredDate: Date;
    preferredStartTime: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    specialRequests?: string;
    autoConfirm?: boolean;
}
