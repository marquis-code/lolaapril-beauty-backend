// pricing.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { CreatePricingTierDto } from './dto/create-pricing-tier.dto';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('tiers')
  createTier(@Body() createDto: CreatePricingTierDto) {
    return this.pricingService.createTier(createDto);
  }

  @Get('tiers')
  getActiveTiers() {
    return this.pricingService.getActiveTiers();
  }

  @Get('tenant/:tenantId/fee-structure')
  getTenantFeeStructure(@Param('tenantId') tenantId: string) {
    return this.pricingService.getTenantFeeStructure(tenantId);
  }

  @Post('tenant/:tenantId/calculate-fees')
  calculateFees(@Param('tenantId') tenantId: string, @Body('amount') amount: number) {
    return this.pricingService.calculateFees(tenantId, amount);
  }

  @Post('tenant/:tenantId/change-plan')
  changePlan(
    @Param('tenantId') tenantId: string,
    @Body() body: { newTierId: string; changedBy: string; reason: string },
  ) {
    return this.pricingService.changeTenantPlan(
      tenantId,
      body.newTierId,
      body.changedBy,
      body.reason,
    );
  }

  @Post('tenant/:tenantId/grandfather')
  grandfatherPricing(@Param('tenantId') tenantId: string, @Body('reason') reason: string) {
    return this.pricingService.grandfatherTenantPricing(tenantId, reason);
  }

  @Get('tenant/:tenantId/history')
  getPricingHistory(@Param('tenantId') tenantId: string) {
    return this.pricingService.getPricingHistory(tenantId);
  }
}
