import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { SubscriptionService } from './subscription.service'
import { UpgradePlanDto, CancelSubscriptionDto } from './dto/subscription.dto'
import { Public, ValidateBusiness, CurrentUser, BusinessId } from '../auth'
import type { RequestWithUser } from '../auth'

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // ==================== PUBLIC - PLAN INFORMATION ====================
  
  @Public()
  @Get('plans')
  @ApiOperation({ summary: 'Get all available subscription plans (Public)' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
  async getAvailablePlans() {
    const plans = await this.subscriptionService.getAvailablePlans()
    return {
      success: true,
      data: plans,
      message: 'Plans retrieved successfully'
    }
  }

  @Public()
  @Get('plans/:planType')
  @ApiOperation({ summary: 'Get specific plan details (Public)' })
  async getPlanDetails(@Param('planType') planType: string) {
    const plan = await this.subscriptionService.getPlanByType(planType)
    return {
      success: true,
      data: plan,
      message: 'Plan details retrieved'
    }
  }

  // ==================== BUSINESS SUBSCRIPTION ====================
  
  @Get('business')
  @ValidateBusiness()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get business subscription details' })
  @ApiResponse({ status: 200, description: 'Subscription retrieved successfully' })
  async getBusinessSubscription(@BusinessId() businessId: string,) {
    const data = await this.subscriptionService.getSubscriptionWithBusiness(businessId)
    return {
      success: true,
      data,
      message: 'Subscription retrieved successfully'
    }
  }

  @Get('business/limits')
  @ValidateBusiness()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check subscription limits and usage' })
  @ApiResponse({ status: 200, description: 'Limits checked successfully' })
  async checkLimits(
    @BusinessId() businessId: string,
    @Query('context') context?: 'booking' | 'staff' | 'service'
  ) {
    const limits = await this.subscriptionService.checkLimits(businessId, context)
    return {
      success: true,
      data: limits,
      message: limits.canProceed 
        ? 'Within subscription limits' 
        : 'Subscription limit exceeded'
    }
  }

  @Get('business/usage')
  @ValidateBusiness()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current usage statistics' })
  async getUsage(@BusinessId() businessId: string,) {
    const usage = await this.subscriptionService.getCurrentUsage(businessId)
    return {
      success: true,
      data: usage,
      message: 'Usage statistics retrieved'
    }
  }

  @Get('business/trial-status')
  @ValidateBusiness()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get trial status and remaining days' })
  async getTrialStatus(@BusinessId() businessId: string) {
    const remainingDays = await this.subscriptionService.getRemainingTrialDays(businessId)
    const subscription = await this.subscriptionService.getBusinessSubscription(businessId)

    return {
      success: true,
      data: {
        isTrial: subscription.planType === 'trial',
        remainingDays,
        endDate: subscription.endDate
      }
    }
  }

  // ==================== SUBSCRIPTION MANAGEMENT ====================
  
  @ValidateBusiness()
  @Post('business/upgrade')
  @ValidateBusiness()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upgrade subscription plan' })
  @ApiResponse({ status: 200, description: 'Plan upgraded successfully' })
  async upgradePlan(
    @BusinessId() businessId: string,
    @BusinessId() activeBusinessId: string,
    @Body() dto: UpgradePlanDto
  ) {
    if (businessId !== activeBusinessId) {
      return { success: false, error: 'You can only upgrade your active business' }
    }

    const result = await this.subscriptionService.upgradePlan(
      businessId,
      dto.planType,
      dto.billingCycle || 'monthly'
    )

    return result
  }

  @ValidateBusiness()
  @Post('business/downgrade')
  @ValidateBusiness()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Downgrade subscription plan (effective at end of period)' })
  async downgradePlan(
    @BusinessId() businessId: string,
    @BusinessId() activeBusinessId: string,
    @Body() dto: UpgradePlanDto
  ) {
    if (businessId !== activeBusinessId) {
      return { success: false, error: 'Access denied' }
    }

    return this.subscriptionService.downgradePlan(businessId, dto.planType)
  }

  @ValidateBusiness()
  @Post('business/cancel')
  @ValidateBusiness()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled' })
  async cancelSubscription(
    @BusinessId() businessId: string,
    @BusinessId() activeBusinessId: string,
    @Body() dto: CancelSubscriptionDto
  ) {
    if (businessId !== activeBusinessId) {
      return { success: false, error: 'Access denied' }
    }

    return this.subscriptionService.cancelSubscription(
      businessId,
      dto.reason,
      dto.immediate || false
    )
  }

  @ValidateBusiness()
  @Post('business/reactivate')
  @ValidateBusiness()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reactivate cancelled subscription' })
  async reactivateSubscription(
    @BusinessId() businessId: string,
    @BusinessId() activeBusinessId: string
  ) {
    if (businessId !== activeBusinessId) {
      return { success: false, error: 'Access denied' }
    }

    return this.subscriptionService.reactivateSubscription(businessId)
  }

  @Get('business/history')
  @ValidateBusiness()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscription history' })
  async getHistory(@Param('businessId') businessId: string) {
    const history = await this.subscriptionService.getSubscriptionHistory(businessId)
    return {
      success: true,
      data: history,
      message: 'History retrieved successfully'
    }
  }
}
