// marketplace.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BusinessVerification, BusinessVerificationDocument } from './schemas/business-verification.schema';
import { Review, ReviewDocument } from './schemas/review.schema';
import { QualityMetric, QualityMetricDocument } from './schemas/quality-metric.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectModel(BusinessVerification.name)
    private verificationModel: Model<BusinessVerificationDocument>,
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
    @InjectModel(QualityMetric.name)
    private qualityMetricModel: Model<QualityMetricDocument>,
  ) { }

  // ========== BUSINESS VERIFICATION ==========
  async submitForVerification(businessId: string, documents: any) {
    const existing = await this.verificationModel.findOne({
      businessId: new Types.ObjectId(businessId)
    });
    if (existing) {
      throw new BadRequestException('Verification already submitted');
    }
    const verification = new this.verificationModel({
      businessId: new Types.ObjectId(businessId),
      status: 'pending',
      verificationLevel: 'basic',
      businessDocuments: documents,
    });
    return verification.save();
  }

  async updateVerificationStatus(
    verificationId: string,
    status: string,
    verifiedBy: string,
    notes?: string,
  ) {
    const verification = await this.verificationModel.findById(verificationId);

    if (!verification) {
      throw new NotFoundException('Verification not found');
    }

    verification.status = status;

    if (status === 'verified') {
      verification.verifiedBy = new Types.ObjectId(verifiedBy);
      verification.verifiedAt = new Date();
    }

    if (status === 'rejected' && notes) {
      verification.rejectionReason = notes;
    }

    if (notes) {
      verification.verificationNotes.push(notes);
    }

    return verification.save();
  }

  async getVerificationStatus(businessId: string) {
    return this.verificationModel
      .findOne({ businessId: new Types.ObjectId(businessId) })
      .populate('verifiedBy', 'firstName lastName')
      .exec();
  }

  async getVerification(id: string) {
    return this.verificationModel
      .findById(id)
      .populate('verifiedBy', 'firstName lastName')
      .exec();
  }

  async getPendingVerifications(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Fix: Execute queries separately to avoid complex union type inference
    const verifications = await this.verificationModel
      .find({ status: { $in: ['pending', 'in_review'] } })
      .populate('tenantId', 'businessName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.verificationModel.countDocuments({
      status: { $in: ['pending', 'in_review'] }
    });

    return {
      verifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // ========== REVIEW MANAGEMENT ==========
  async createReview(createDto: CreateReviewDto) {
    // Check if review already exists for this booking
    const existing = await this.reviewModel.findOne({
      bookingId: new Types.ObjectId(createDto.bookingId),
    });

    if (existing) {
      throw new BadRequestException('Review already exists for this booking');
    }

    const review = new this.reviewModel({
      businessId: new Types.ObjectId(createDto.businessId),
      clientId: new Types.ObjectId(createDto.clientId),
      bookingId: new Types.ObjectId(createDto.bookingId),
      rating: createDto.rating,
      reviewText: createDto.reviewText,
      ratings: createDto.ratings,
      moderationStatus: 'pending',
      isVerifiedBooking: true,
    });

    const savedReview = await review.save();

    // Update business average rating
    await this.updateBusinessRating(createDto.businessId);

    return savedReview;
  }

  async getBusinessReviews(businessId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Fix: Execute queries separately to avoid complex union type inference
    const reviews = await this.reviewModel
      .find({
        businessId: new Types.ObjectId(businessId),
        moderationStatus: 'approved',
      })
      .populate('clientId', 'firstName lastName profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.reviewModel.countDocuments({
      businessId: new Types.ObjectId(businessId),
      moderationStatus: 'approved',
    });

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async moderateReview(reviewId: string, status: string, moderatorId: string, reason?: string) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.moderationStatus = status;
    review.moderatedBy = new Types.ObjectId(moderatorId);
    review.moderatedAt = new Date();

    if (reason) {
      review.moderationReason = reason;
    }

    return review.save();
  }

  async respondToReview(reviewId: string, responseText: string, responderId: string) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.businessResponse = {
      text: responseText,
      respondedAt: new Date(),
      respondedBy: new Types.ObjectId(responderId),
    };

    return review.save();
  }

  async markReviewHelpful(reviewId: string, helpful: boolean) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (helpful) {
      review.helpfulCount += 1;
    } else {
      review.notHelpfulCount += 1;
    }

    return review.save();
  }

  private async updateBusinessRating(businessId: string) {
    const stats = await this.reviewModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId),
          moderationStatus: 'approved',
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          avgService: { $avg: '$ratings.service' },
          avgCleanliness: { $avg: '$ratings.cleanliness' },
          avgProfessionalism: { $avg: '$ratings.professionalism' },
          avgValueForMoney: { $avg: '$ratings.valueForMoney' },
        },
      },
    ]);

    // Update tenant's rating (you'd need to add this to your Tenant schema)
    // await this.tenantModel.updateOne(
    //   { _id: new Types.ObjectId(businessId) },
    //   {
    //     'rating.average': stats[0]?.avgRating || 0,
    //     'rating.total': stats[0]?.totalReviews || 0,
    //   },
    // );

    return stats[0] || null;
  }

  // ========== QUALITY METRICS ==========
  async updateQualityMetrics(businessId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate various metrics
    // This would typically query your booking/appointment data

    const metrics = {
      responseRate: 95, // Placeholder
      avgResponseTime: 15, // Minutes
      completionRate: 98,
      cancellationRate: 2,
      onTimeRate: 96,
    };

    // Update verification record with quality metrics
    await this.verificationModel.updateOne(
      { businessId: new Types.ObjectId(businessId) },
      { qualityMetrics: metrics },
    );

    // Store historical metric
    const metric = new this.qualityMetricModel({
      businessId: new Types.ObjectId(businessId),
      metricType: 'overall_quality',
      value: Object.values(metrics).reduce((a, b) => a + b, 0) / Object.keys(metrics).length,
      period: 'monthly',
      date: now,
      details: metrics,
    });

    await metric.save();

    return metrics;
  }

  async getBusinessQualityScore(businessId: string) {
    const verification = await this.verificationModel.findOne({
      businessId: new Types.ObjectId(businessId),
    });
    if (!verification || !verification.qualityMetrics) {
      return null;
    }
    return {
      score: this.calculateQualityScore(verification.qualityMetrics),
      metrics: verification.qualityMetrics,
      verificationLevel: verification.verificationLevel,
      isVerified: verification.status === 'verified',
    };
  }

  private calculateQualityScore(metrics: any): number {
    // Weighted average of quality metrics
    const weights = {
      responseRate: 0.2,
      avgResponseTime: 0.15,
      completionRate: 0.3,
      cancellationRate: -0.2, // Negative impact
      onTimeRate: 0.15,
    };

    let score = 0;
    score += metrics.responseRate * weights.responseRate;
    score += (100 - metrics.avgResponseTime) * weights.avgResponseTime; // Lower is better
    score += metrics.completionRate * weights.completionRate;
    score += (100 - metrics.cancellationRate) * Math.abs(weights.cancellationRate);
    score += metrics.onTimeRate * weights.onTimeRate;

    return Math.round(score);
  }

  // // ========== MARKETPLACE DISCOVERY ==========
  // async searchBusinesses(filters: {
  //   location?: string;
  //   category?: string;
  //   minRating?: number;
  //   verifiedOnly?: boolean;
  //   page?: number;
  //   limit?: number;
  // }) {
  //   const page = filters.page || 1;
  //   const limit = filters.limit || 20;
  //   const skip = (page - 1) * limit;

  //   const query: any = {};

  //   // Build query based on filters
  //   // This would typically join with your Tenant collection

  //   // Fix: Use exec() and add type assertion to avoid complex union type
  //   const verifiedBusinessIds = await this.verificationModel
  //     .find({ status: 'verified' })
  //     .select('tenantId')
  //     .lean()
  //     .exec() as any[];

  //   return {
  //     businesses: [], // Populate from Tenant collection
  //     pagination: {
  //       page,
  //       limit,
  //       total: 0,
  //       pages: 0,
  //     },
  //   };
  // }

  async searchBusinesses(filters: {
    location?: string;
    category?: string;
    minRating?: number;
    verifiedOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    // ✅ FIX: Remove .lean().exec() and just use .lean()
    const verifiedBusinessIds = await this.verificationModel
      .find({ status: 'verified' })
      .select('tenantId')
      .lean() as any  // ✅ Type assertion instead of chaining .exec()

    return {
      businesses: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0,
      },
    };
  }

  // ========== ANALYTICS ==========
  async getMarketplaceStats() {
    // Fix: Execute queries separately to avoid complex union type inference
    const totalBusinesses = await this.verificationModel.countDocuments();
    const verifiedBusinesses = await this.verificationModel.countDocuments({ status: 'verified' });
    const totalReviews = await this.reviewModel.countDocuments({ moderationStatus: 'approved' });
    const avgRating = await this.reviewModel.aggregate([
      { $match: { moderationStatus: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);

    return {
      totalBusinesses,
      verifiedBusinesses,
      verificationRate: totalBusinesses > 0 ? (verifiedBusinesses / totalBusinesses) * 100 : 0,
      totalReviews,
      avgRating: avgRating[0]?.avgRating || 0,
    };
  }
}