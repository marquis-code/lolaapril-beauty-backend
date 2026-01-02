// marketplace.controller.ts
import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('verification/:tenantId')
  submitVerification(@Param('tenantId') tenantId: string, @Body() documents: any) {
    return this.marketplaceService.submitForVerification(tenantId, documents);
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

  @Get('verification/:tenantId')
  getVerificationStatus(@Param('tenantId') tenantId: string) {
    return this.marketplaceService.getVerificationStatus(tenantId);
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

  @Post('quality/:tenantId/update')
  updateQualityMetrics(@Param('tenantId') tenantId: string) {
    return this.marketplaceService.updateQualityMetrics(tenantId);
  }

  @Get('quality/:tenantId')
  getQualityScore(@Param('tenantId') tenantId: string) {
    return this.marketplaceService.getBusinessQualityScore(tenantId);
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