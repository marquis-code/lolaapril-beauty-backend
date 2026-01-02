// pricing.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { PricingTier, PricingTierSchema } from './schemas/pricing-tier.schema';
import { FeeStructure, FeeStructureSchema } from './schemas/fee-structure.schema';
import { PricingHistory, PricingHistorySchema } from './schemas/pricing-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PricingTier.name, schema: PricingTierSchema },
      { name: FeeStructure.name, schema: FeeStructureSchema },
      { name: PricingHistory.name, schema: PricingHistorySchema },
    ]),
  ],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}