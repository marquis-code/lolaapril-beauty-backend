import { ReviewService } from './review.service';
import { CreateReviewDto, BusinessRespondDto } from './dto/review.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    createReview(user: any, dto: CreateReviewDto): Promise<{
        success: boolean;
        data: import("./schemas/review.schema").Review;
        message: string;
    }>;
    getBusinessReviews(businessId: string, page?: number, limit?: number): Promise<{
        success: boolean;
        data: {
            reviews: import("./schemas/review.schema").Review[];
            total: number;
            averageRating: number;
        };
    }>;
    getServiceReviews(serviceId: string): Promise<{
        success: boolean;
        data: import("./schemas/review.schema").Review[];
    }>;
    getAppointmentReview(appointmentId: string): Promise<{
        success: boolean;
        data: import("./schemas/review.schema").Review;
    }>;
    respondToReview(reviewId: string, dto: BusinessRespondDto): Promise<{
        success: boolean;
        data: import("./schemas/review.schema").Review;
        message: string;
    }>;
}
