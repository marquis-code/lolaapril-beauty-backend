import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query 
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { BusinessService } from './business.service'
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto'
import { StorefrontResponseDto } from './dto/storefront.dto'
import { Public, ValidateBusiness, CurrentUser, BusinessId } from '../auth'
import type { RequestWithUser } from '../auth'

@ApiTags('Business Management')
@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  // ==================== BUSINESS WORKING HOURS ====================
  @Get("working-hours")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get business working hours" })
  @ApiResponse({ status: 200, description: "Business working hours retrieved" })
  async getBusinessWorkingHours(@BusinessId() businessId: string) {
    const hours = await this.businessService.getBusinessWorkingHours(businessId);
    return {
      success: true,
      data: hours,
      message: "Business working hours retrieved successfully"
    };
  }

  @ValidateBusiness()
  @Post("working-hours")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create business working hours" })
  @ApiResponse({ status: 201, description: "Business working hours created" })
  async createBusinessWorkingHours(
    @BusinessId() businessId: string,
    @Body() workingHours: any[]
  ) {
    const result = await this.businessService.createBusinessWorkingHours(businessId, workingHours);
    return {
      success: true,
      data: result,
      message: "Business working hours created successfully"
    };
  }

  @ValidateBusiness()
  @Put("working-hours")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update business working hours" })
  @ApiResponse({ status: 200, description: "Business working hours updated" })
  async updateBusinessWorkingHours(
    @BusinessId() businessId: string,
    @Body() workingHours: any[]
  ) {
    const result = await this.businessService.updateBusinessWorkingHours(businessId, workingHours);
    return {
      success: true,
      data: result,
      message: "Business working hours updated successfully"
    };
  }

  // ==================== PUBLIC ENDPOINTS ====================
  
  @Public()
  @Get('check-subdomain')
  @ApiOperation({ summary: 'Check if subdomain is available (Public)' })
  @ApiResponse({ status: 200, description: 'Subdomain availability checked' })
  async checkSubdomainAvailability(@Query('subdomain') subdomain: string) {
    const isAvailable = await this.businessService.isSubdomainAvailable(subdomain)
    return {
      success: true,
      data: { available: isAvailable, subdomain },
      message: isAvailable ? 'Subdomain is available' : 'Subdomain is already taken'
    }
  }

  @Public()
  @Get('subdomain/:subdomain')
  @ApiOperation({ summary: 'Get business by subdomain (Public)' })
  @ApiResponse({ status: 200, description: 'Business retrieved successfully' })
  async getBySubdomain(@Param('subdomain') subdomain: string) {
    const business = await this.businessService.getBySubdomain(subdomain)
    return {
      success: true,
      data: business,
      message: 'Business retrieved successfully'
    }
  }

  /**
   * PUBLIC STOREFRONT ENDPOINT
   * Returns all data needed for the booking widget at /book/{subdomain}
   * Includes: business info, theme/branding, categories, services, staff
   */
  @Public()
  @Get('storefront/:subdomain')
  @ApiOperation({ 
    summary: 'Get complete storefront data for booking widget (Public)',
    description: 'Returns business info, theme, services, categories, and staff for the public booking page'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Storefront data retrieved successfully',
    type: StorefrontResponseDto
  })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getStorefront(@Param('subdomain') subdomain: string) {
    return this.businessService.getPublicStorefront(subdomain)
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get business by ID (Public)' })
  @ApiResponse({ status: 200, description: 'Business retrieved successfully' })
  async getById(@Param('id') id: string) {
    const business = await this.businessService.getById(id)
    return {
      success: true,
      data: business,
      message: 'Business retrieved successfully'
    }
  }

  // ==================== AUTHENTICATED ENDPOINTS ====================
  
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all businesses for authenticated user' })
  @ApiResponse({ status: 200, description: 'Businesses retrieved successfully' })
  async getMyBusinesses(@CurrentUser() user: RequestWithUser['user']) {
    const businesses = await this.businessService.getBusinessesByUser(user.sub)
    return {
      success: true,
      data: businesses,
      message: 'Businesses retrieved successfully'
    }
  }

  // ==================== BUSINESS MANAGEMENT (VALIDATED) ====================
  
    // ...existing code...

  // ==================== ADMIN MANAGEMENT ====================
  
  @ValidateBusiness()
  @Post(':id/admin/:adminId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add business admin' })
  @ApiResponse({ status: 201, description: 'Admin added successfully' })
  async addAdmin(
    @Param('id') id: string,
    @Param('adminId') adminId: string,
    @BusinessId() businessId: string
  ) {
    if (businessId !== id) {
      return { success: false, error: 'Access denied' }
    }

    await this.businessService.addAdmin(id, adminId)
    return {
      success: true,
      message: 'Admin added successfully'
    }
  }

  @ValidateBusiness()
  @Delete(':id/admin/:adminId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove business admin' })
  @ApiResponse({ status: 200, description: 'Admin removed successfully' })
  async removeAdmin(
    @Param('id') id: string,
    @Param('adminId') adminId: string,
    @BusinessId() businessId: string
  ) {
    if (businessId !== id) {
      return { success: false, error: 'Access denied' }
    }

    await this.businessService.removeAdmin(id, adminId)
    return {
      success: true,
      message: 'Admin removed successfully'
    }
  }

  // ==================== BUSINESS SETTINGS ====================
  
  @Get(':id/settings')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get business settings' })
  async getSettings(@Param('id') id: string) {
    const settings = await this.businessService.getSettings(id)
    return {
      success: true,
      data: settings,
      message: 'Settings retrieved successfully'
    }
  }

  @ValidateBusiness()
  @Put(':id/settings')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update business settings' })
  async updateSettings(
    @Param('id') id: string,
    @BusinessId() businessId: string,
    @Body() settings: any
  ) {
    if (businessId !== id) {
      return { success: false, error: 'Access denied' }
    }

    const updated = await this.businessService.updateSettings(id, settings)
    return {
      success: true,
      data: updated,
      message: 'Settings updated successfully'
    }
  }

  // ==================== PAYSTACK SUBACCOUNT ENDPOINTS ====================
  
  @Post(':id/verify-kyc')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify business KYC and create Paystack subaccount (Admin only)' })
  @ApiResponse({ status: 200, description: 'KYC verified and subaccount created' })
  async verifyKYC(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    const result = await this.businessService.verifyBusinessKYC(id, user.sub);
    return {
      success: true,
      data: result,
      message: 'Business verified and subaccount created successfully'
    };
  }

  @Post(':id/reject-kyc')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject business KYC with reason (Admin only)' })
  @ApiResponse({ status: 200, description: 'KYC rejected' })
  async rejectKYC(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @CurrentUser() user: any
  ) {
    if (!body.reason) {
      return { success: false, error: 'Rejection reason is required' };
    }

    const result = await this.businessService.rejectBusinessKYC(id, body.reason, user.sub);
    return {
      success: true,
      data: result,
      message: 'KYC verification rejected'
    };
  }

  @Post(':id/create-subaccount')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Paystack subaccount for verified business' })
  @ApiResponse({ status: 200, description: 'Subaccount created successfully' })
  async createSubaccount(@Param('id') id: string) {
    const result = await this.businessService.createPaystackSubaccount(id);
    return {
      success: true,
      data: result,
      message: 'Subaccount created successfully'
    };
  }

  @ValidateBusiness()
  @Get(':id/subaccount')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get business subaccount details' })
  @ApiResponse({ status: 200, description: 'Subaccount details retrieved' })
  async getSubaccount(
    @Param('id') id: string,
    @BusinessId() businessId: string
  ) {
    if (businessId !== id) {
      return { success: false, error: 'Access denied' };
    }

    const subaccount = await this.businessService.getSubaccountDetails(id);
    return {
      success: true,
      data: subaccount,
      message: 'Subaccount details retrieved successfully'
    };
  }
}