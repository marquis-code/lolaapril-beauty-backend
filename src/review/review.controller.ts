import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Param,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto, BusinessRespondDto } from './dto/review.dto';
import { CurrentUser, BusinessId } from '../auth';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Post()
    @ApiOperation({ summary: 'Create a review for a service/appointment' })
    @ApiResponse({ status: 201, description: 'Review created successfully' })
    async createReview(
        @CurrentUser() user: any,
        @Body(ValidationPipe) dto: CreateReviewDto,
    ) {
        const review = await this.reviewService.createReview(
            user?.sub || user?._id || user?.id,
            user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Customer',
            dto,
        );

        return {
            success: true,
            data: review,
            message: 'Thank you for your review!',
        };
    }

    @Get('business/:businessId')
    @ApiOperation({ summary: 'Get reviews for a business' })
    @ApiResponse({ status: 200, description: 'Reviews retrieved' })
    async getBusinessReviews(
        @Param('businessId') businessId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const result = await this.reviewService.getReviewsByBusiness(
            businessId,
            page || 1,
            limit || 20,
        );

        return {
            success: true,
            data: result,
        };
    }

    @Get('service/:serviceId')
    @ApiOperation({ summary: 'Get reviews for a service' })
    async getServiceReviews(@Param('serviceId') serviceId: string) {
        const reviews = await this.reviewService.getReviewsByService(serviceId);
        return {
            success: true,
            data: reviews,
        };
    }

    @Get('appointment/:appointmentId')
    @ApiOperation({ summary: 'Get review for a specific appointment' })
    async getAppointmentReview(@Param('appointmentId') appointmentId: string) {
        const review = await this.reviewService.getReviewByAppointment(appointmentId);
        return {
            success: true,
            data: review,
        };
    }

    @Patch(':id/respond')
    @ApiOperation({ summary: 'Business responds to a review' })
    async respondToReview(
        @Param('id') reviewId: string,
        @Body(ValidationPipe) dto: BusinessRespondDto,
    ) {
        const review = await this.reviewService.respondToReview(reviewId, dto);
        return {
            success: true,
            data: review,
            message: 'Response submitted successfully',
        };
    }
}
