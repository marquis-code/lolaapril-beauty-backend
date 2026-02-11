export declare class CreateReviewDto {
    businessId: string;
    clientId: string;
    bookingId: string;
    rating: number;
    reviewText?: string;
    ratings?: {
        service: number;
        cleanliness: number;
        professionalism: number;
        valueForMoney: number;
    };
}
