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
import { Public, ValidateBusiness, CurrentUser, BusinessId } from '../auth'
import type { RequestWithUser } from '../auth'

@ApiTags('Business Management')
@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

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
  
  @ValidateBusiness()
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update business' })
  @ApiResponse({ status: 200, description: 'Business updated successfully' })
  async update(
    @Param('id') id: string,
    @BusinessId() businessId: string,
    @Body() updateDto: UpdateBusinessDto
  ) {
    if (businessId !== id) {
      return { success: false, error: 'You can only update your active business' }
    }

    const business = await this.businessService.update(id, updateDto)
    return {
      success: true,
      data: business,
      message: 'Business updated successfully'
    }
  }

  // ==================== STAFF MANAGEMENT ====================
  
  @ValidateBusiness()
  @Post(':id/staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add staff member to business' })
  @ApiResponse({ status: 201, description: 'Staff member added successfully' })
  async addStaff(
    @Param('id') id: string,
    @BusinessId() businessId: string,
    @Body() staffDto: { email: string; firstName: string; lastName: string; phone?: string }
  ) {
    if (businessId !== id) {
      return { success: false, error: 'Access denied' }
    }

    const staff = await this.businessService.addStaff(id, staffDto)
    return {
      success: true,
      data: staff,
      message: 'Staff member added successfully'
    }
  }

  @ValidateBusiness()
  @Delete(':id/staff/:staffId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove staff member from business' })
  @ApiResponse({ status: 200, description: 'Staff member removed successfully' })
  async removeStaff(
    @Param('id') id: string,
    @Param('staffId') staffId: string,
    @BusinessId() businessId: string
  ) {
    if (businessId !== id) {
      return { success: false, error: 'Access denied' }
    }

    await this.businessService.removeStaff(id, staffId)
    return {
      success: true,
      message: 'Staff member removed successfully'
    }
  }

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