import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { PricingService } from './pricing.service'
import { CreatePricingTierDto } from './dto/create-pricing-tier.dto'
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto'
import { Public, ValidateBusiness, BusinessId } from '../auth'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRole } from '../auth/schemas/user.schema'

@ApiTags('Pricing & Fees')
@ApiBearerAuth()
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('tiers')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create pricing tier (Super Admin only)' })
  async createTier(@Body() createDto: CreatePricingTierDto) {
    return this.pricingService.createTier(createDto)
  }

  @Public()
  @Get('tiers')
  @ApiOperation({ summary: 'Get all active pricing tiers' })
  async getActiveTiers() {
    return this.pricingService.getActiveTiers()
  }

  @Get('fee-structure')
  @ApiOperation({ summary: 'Get business fee structure' })
  async getBusinessFeeStructure(@BusinessId() businessId: string) {
    return this.pricingService.getBusinessFeeStructure(businessId)
  }

  @Post('fee-structure')
  @ApiOperation({ summary: 'Create or update business fee structure' })
  async createFeeStructure(
    @BusinessId() businessId: string,
    @Body() createDto: CreateFeeStructureDto
  ) {
    return this.pricingService.createFeeStructure(businessId, createDto)
  }

  @Post('calculate-fees')
  @ApiOperation({ summary: 'Calculate fees for a transaction' })
  async calculateFees(
    @BusinessId() businessId: string,
    @Body('amount') amount: number
  ) {
    return this.pricingService.calculateFees(businessId, amount)
  }

  @Post('change-plan')
  @ApiOperation({ summary: 'Change business pricing plan' })
  async changePlan(
    @BusinessId() businessId: string,
    @Body() body: { newTierId: string; changedBy: string; reason: string },
  ) {
    return this.pricingService.changePlan(
      businessId,
      body.newTierId,
      body.reason,
    )
  }

  @Get('history')
  @ApiOperation({ summary: 'Get pricing history for business' })
  async getPricingHistory(@BusinessId() businessId: string) {
    return this.pricingService.getPricingHistory(businessId)
  }
}