import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto, BusinessRespondDto } from './dto/review.dto';
export declare class ReviewService {
    private reviewModel;
    constructor(reviewModel: Model<ReviewDocument>);
    createReview(clientId: string, clientName: string, dto: CreateReviewDto): Promise<Review>;
    getReviewsByBusiness(businessId: string, page?: number, limit?: number): Promise<{
        reviews: Review[];
        total: number;
        averageRating: number;
    }>;
    getReviewsByService(serviceId: string): Promise<Review[]>;
    respondToReview(reviewId: string, dto: BusinessRespondDto): Promise<Review>;
    getReviewByAppointment(appointmentId: string): Promise<Review | null>;
}
