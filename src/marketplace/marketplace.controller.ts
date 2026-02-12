// marketplace.controller.ts
import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { BusinessId } from '../auth/decorators/business-context.decorator';
import { MarketplaceService } from './marketplace.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) { }


  @Post('verification')
  submitVerification(@BusinessId() businessId: string, @Body() documents: any) {
    return this.marketplaceService.submitForVerification(businessId, documents);
  }

  @Put('verification/:id/status')
  updateVerificationStatus(
    @Param('id') id: string,
    @Body() body: { status: string; verifiedBy: string; notes?: string },
  ) {
    return this.marketplaceService.updateVerificationStatus(
      id,
      body.status,
      body.verifiedBy,
      body.notes,
    );
  }


  @Get('verification/:id')
  getVerification(@Param('id') id: string) {
    return this.marketplaceService.getVerification(id);
  }

  @Get('verification')
  getVerificationStatus(@BusinessId() businessId: string) {
    return this.marketplaceService.getVerificationStatus(businessId);
  }

  @Get('quality/:id')
  getQualityScoreById(@Param('id') id: string) {
    return this.marketplaceService.getBusinessQualityScore(id);
  }

  @Get('quality')
  getQualityScore(@BusinessId() businessId: string) {
    return this.marketplaceService.getBusinessQualityScore(businessId);
  }

  @Get('verification/pending')
  getPendingVerifications(@Query('page') page: number, @Query('limit') limit: number) {
    return this.marketplaceService.getPendingVerifications(page, limit);
  }

  @Post('reviews')
  createReview(@Body() createDto: CreateReviewDto) {
    return this.marketplaceService.createReview(createDto);
  }

  @Get('reviews/business/:businessId')
  getBusinessReviews(
    @Param('businessId') businessId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.marketplaceService.getBusinessReviews(businessId, page, limit);
  }

  @Put('reviews/:id/moderate')
  moderateReview(
    @Param('id') id: string,
    @Body() body: { status: string; moderatorId: string; reason?: string },
  ) {
    return this.marketplaceService.moderateReview(id, body.status, body.moderatorId, body.reason);
  }

  @Post('reviews/:id/respond')
  respondToReview(@Param('id') id: string, @Body() body: { text: string; responderId: string }) {
    return this.marketplaceService.respondToReview(id, body.text, body.responderId);
  }

  @Post('reviews/:id/helpful')
  markHelpful(@Param('id') id: string, @Body('helpful') helpful: boolean) {
    return this.marketplaceService.markReviewHelpful(id, helpful);
  }


  @Post('quality/update')
  updateQualityMetrics(@BusinessId() businessId: string) {
    return this.marketplaceService.updateQualityMetrics(businessId);
  }


  @Get('quality')
  getQualityScore(@BusinessId() businessId: string) {
    return this.marketplaceService.getBusinessQualityScore(businessId);
  }

  @Get('search')
  searchBusinesses(@Query() filters: any) {
    return this.marketplaceService.searchBusinesses(filters);
  }

  @Get('stats')
  getMarketplaceStats() {
    return this.marketplaceService.getMarketplaceStats();
  }
}