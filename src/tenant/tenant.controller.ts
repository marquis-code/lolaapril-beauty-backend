// import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common'

// @Controller('tenant')
// export class TenantController {
//   constructor(private readonly tenantService: TenantService) {}

//   @Post('business')
//   async createBusiness(@Body() createDto: {
//     businessName: string
//     subdomain: string
//     businessType: string
//     address: BusinessAddress
//     contact: BusinessContact
//     ownerId: string
//   }) {
//     return await this.tenantService.createBusiness(createDto)
//   }

//   @Get('business/:businessId')
//   async getBusiness(@Param('businessId') businessId: string) {
//     return await this.tenantService.getBusinessById(businessId)
//   }

//   @Put('business/:businessId')
//   async updateBusiness(
//     @Param('businessId') businessId: string,
//     @Body() updateData: Partial<Business>
//   ) {
//     return await this.tenantService.updateBusiness(businessId, updateData)
//   }

//   @Get('config/:businessId')
//   async getTenantConfig(@Param('businessId') businessId: string) {
//     return await this.tenantService.getTenantConfig(businessId)
//   }

//   @Put('config/:businessId')
//   async updateTenantConfig(
//     @Param('businessId') businessId: string,
//     @Body() configData: Partial<TenantConfig>
//   ) {
//     return await this.tenantService.updateTenantConfig(businessId, configData)
//   }

//   @Get('subscription/limits/:businessId')
//   async checkLimits(@Param('businessId') businessId: string) {
//     return await this.tenantService.checkSubscriptionLimits(businessId)
//   }

//   @Post('subscription/:businessId')
//   async createSubscription(
//     @Param('businessId') businessId: string,
//     @Body() subscriptionData: any
//   ) {
//     return await this.tenantService.createSubscription(businessId, subscriptionData)
//   }

//   @Put('subscription/:subscriptionId/cancel')
//   async cancelSubscription(
//     @Param('subscriptionId') subscriptionId: string,
//     @Body('reason') reason: string
//   ) {
//     return await this.tenantService.cancelSubscription(subscriptionId, reason)
//   }

//   @Get('businesses/owner/:ownerId')
//   async getBusinessesByOwner(@Param('ownerId') ownerId: string) {
//     return await this.tenantService.getBusinessesByOwner(ownerId)
//   }
// }

// src/modules/tenant/tenant.controller.ts
import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common'
import { TenantService } from './tenant.service'
import { Business, BusinessAddress, BusinessContact } from './schemas/business.schema'
import { TenantConfig } from './schemas/tenant-config.schema'

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('business')
  async createBusiness(@Body() createDto: {
    businessName: string
    subdomain: string
    businessType: string
    address: BusinessAddress
    contact: BusinessContact
    ownerId: string
  }) {
    return await this.tenantService.createBusiness(createDto)
  }

  @Get('business/:businessId')
  async getBusiness(@Param('businessId') businessId: string) {
    return await this.tenantService.getBusinessById(businessId)
  }

  @Put('business/:businessId')
  async updateBusiness(
    @Param('businessId') businessId: string,
    @Body() updateData: Partial<Business>
  ) {
    return await this.tenantService.updateBusiness(businessId, updateData)
  }

  @Get('config/:businessId')
  async getTenantConfig(@Param('businessId') businessId: string) {
    return await this.tenantService.getTenantConfig(businessId)
  }

  @Put('config/:businessId')
  async updateTenantConfig(
    @Param('businessId') businessId: string,
    @Body() configData: Partial<TenantConfig>
  ) {
    return await this.tenantService.updateTenantConfig(businessId, configData)
  }

  @Get('subscription/limits/:businessId')
  async checkLimits(@Param('businessId') businessId: string) {
    return await this.tenantService.checkSubscriptionLimits(businessId)
  }

  @Post('subscription/:businessId')
  async createSubscription(
    @Param('businessId') businessId: string,
    @Body() subscriptionData: {
      planType: string
      planName: string
      monthlyPrice: number
      yearlyPrice: number
      billingCycle: string
      limits: any
    }
  ) {
    return await this.tenantService.createSubscription(businessId, subscriptionData)
  }

  @Put('subscription/:subscriptionId/cancel')
  async cancelSubscription(
    @Param('subscriptionId') subscriptionId: string,
    @Body('reason') reason: string
  ) {
    return await this.tenantService.cancelSubscription(subscriptionId, reason)
  }

  @Get('businesses/owner/:ownerId')
  async getBusinessesByOwner(@Param('ownerId') ownerId: string) {
    return await this.tenantService.getBusinessesByOwner(ownerId)
  }
}