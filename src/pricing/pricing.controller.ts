import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { PricingService } from './pricing.service'
import { CreatePricingTierDto } from './dto/create-pricing-tier.dto'
import { Public, ValidateBusiness, BusinessId } from '../auth'

@ApiTags('Pricing & Fees')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('tiers')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create pricing tier (Admin only)' })
  async createTier(@Body() createDto: CreatePricingTierDto) {
    return this.pricingService.createTier(createDto)
  }

  @Public()
  @Get('tiers')
  async getActiveTiers() {
    return this.pricingService.getActiveTiers()
  }

  @Get('business/:businessId/fee-structure')
  async getBusisinessFeeStructure(@Param('businessId') businessId: string) {
    return this.pricingService.getBusinessFeeStructure(businessId)
  }

  @Post('business/:businessId/calculate-fees')
  async calculateFees(
    @Param('businessId') businessId: string, 
    @Body('amount') amount: number
  ) {
    return this.pricingService.calculateFees(businessId, amount)
  }

  @Post('business/:businessId/change-plan')
  async changePlan(
    @Param('businessId') businessId: string,
    @Body() body: { newTierId: string; changedBy: string; reason: string },
  ) {
    return this.pricingService.changePlan(
      businessId,
      body.newTierId,
      body.reason,
    )
  }

  @Get('business/:businessId/history')
  async getPricingHistory(@Param('businessId') businessId: string) {
    return this.pricingService.getPricingHistory(businessId)
  }
}