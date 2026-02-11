import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto, BusinessRespondDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    ) { }

    async createReview(clientId: string, clientName: string, dto: CreateReviewDto): Promise<Review> {
        // Check for duplicate review on same appointment
        if (dto.appointmentId) {
            const existing = await this.reviewModel.findOne({
                appointmentId: new Types.ObjectId(dto.appointmentId),
            });
            if (existing) {
                throw new ConflictException('You have already reviewed this appointment');
            }
        }

        const review = new this.reviewModel({
            clientId: new Types.ObjectId(clientId),
            clientName,
            businessId: new Types.ObjectId(dto.businessId),
            appointmentId: dto.appointmentId ? new Types.ObjectId(dto.appointmentId) : undefined,
            serviceId: dto.serviceId ? new Types.ObjectId(dto.serviceId) : undefined,
            serviceName: dto.serviceName,
            rating: dto.rating,
            comment: dto.comment,
            isVerified: !!dto.appointmentId, // Verified if linked to an appointment
        });

        return review.save();
    }

    async getReviewsByBusiness(
        businessId: string,
        page = 1,
        limit = 20,
    ): Promise<{ reviews: Review[]; total: number; averageRating: number }> {
        const filter = { businessId: new Types.ObjectId(businessId), isVisible: true };
        const skip = (page - 1) * limit;

        const [reviews, total, ratingAgg] = await Promise.all([
            this.reviewModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.reviewModel.countDocuments(filter),
            this.reviewModel.aggregate([
                { $match: filter },
                { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
            ]),
        ]);

        return {
            reviews,
            total,
            averageRating: ratingAgg[0]?.avg || 0,
        };
    }

    async getReviewsByService(serviceId: string): Promise<Review[]> {
        return this.reviewModel.find({
            serviceId: new Types.ObjectId(serviceId),
            isVisible: true,
        }).sort({ createdAt: -1 }).lean();
    }

    async respondToReview(reviewId: string, dto: BusinessRespondDto): Promise<Review> {
        const review = await this.reviewModel.findByIdAndUpdate(
            reviewId,
            {
                businessResponse: dto.response,
                businessRespondedAt: new Date(),
            },
            { new: true },
        );

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return review;
    }

    async getReviewByAppointment(appointmentId: string): Promise<Review | null> {
        return this.reviewModel.findOne({
            appointmentId: new Types.ObjectId(appointmentId),
        }).lean();
    }
}
