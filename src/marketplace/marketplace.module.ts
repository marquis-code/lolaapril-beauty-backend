// marketplace.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { BusinessVerification, BusinessVerificationSchema } from './schemas/business-verification.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { QualityMetric, QualityMetricSchema } from './schemas/quality-metric.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessVerification.name, schema: BusinessVerificationSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: QualityMetric.name, schema: QualityMetricSchema },
    ]),
  ],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}