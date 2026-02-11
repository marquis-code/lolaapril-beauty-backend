export declare class MobileSpaServiceDto {
    serviceId: string;
    quantity?: number;
}
export declare class MobileSpaLocationDto {
    address: string;
    lat: number;
    lng: number;
    placeId?: string;
    additionalDirections?: string;
}
export declare class CreateMobileSpaDto {
    businessId: string;
    services: MobileSpaServiceDto[];
    numberOfPeople: number;
    location: MobileSpaLocationDto;
    requestedDate: string;
    requestedTime?: string;
    clientNotes?: string;
}
export declare class AcceptMobileSpaDto {
    paymentLink?: string;
    businessNotes?: string;
}
export declare class SuggestTimeMobileSpaDto {
    suggestedDate: string;
    suggestedTime: string;
    businessNotes?: string;
}
export declare class RejectMobileSpaDto {
    reason?: string;
}
