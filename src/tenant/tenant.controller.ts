import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Req
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
    businessId?: string;
    subdomain?: string;
  };
}

@ApiTags('tenant')
@Controller('api/tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  // ==================== SUBDOMAIN CHECK ====================
  @Get('check-subdomain')
  @ApiOperation({ summary: 'Check if subdomain is available' })
  @ApiResponse({ status: 200, description: 'Subdomain availability checked' })
  async checkSubdomainAvailability(@Query('subdomain') subdomain: string) {
    try {
      const isAvailable = await this.tenantService.isSubdomainAvailable(subdomain);
      return {
        success: true,
        data: { available: isAvailable, subdomain },
        message: isAvailable ? 'Subdomain is available' : 'Subdomain is already taken'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ==================== BUSINESS MANAGEMENT ====================
  @Get('businesses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get businesses by user' })
  @ApiResponse({ status: 200, description: 'Businesses retrieved successfully' })
  async getBusinessesByUser(@Req() req: RequestWithUser) {
    try {
      const userId = req.user.sub;
      const businesses = await this.tenantService.getBusinessesByUser(userId);
      return {
        success: true,
        data: businesses,
        message: 'Businesses retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('subdomain/:subdomain')
  @ApiOperation({ summary: 'Get business by subdomain' })
  @ApiResponse({ status: 200, description: 'Business retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getBusinessBySubdomain(@Param('subdomain') subdomain: string) {
    try {
      const business = await this.tenantService.getBusinessBySubdomain(subdomain);
      return {
        success: true,
        data: business,
        message: 'Business retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get(':businessId')
  @ApiOperation({ summary: 'Get business by ID' })
  @ApiResponse({ status: 200, description: 'Business retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getBusinessById(@Param('businessId') businessId: string) {
    try {
      const business = await this.tenantService.getBusinessById(businessId);
      return {
        success: true,
        data: business,
        message: 'Business retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Put(':businessId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update business' })
  @ApiResponse({ status: 200, description: 'Business updated successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async updateBusiness(
    @Param('businessId') businessId: string,
    @Body() updateBusinessDto: any
  ) {
    try {
      const business = await this.tenantService.updateBusiness(businessId, updateBusinessDto);
      return {
        success: true,
        data: business,
        message: 'Business updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ==================== STAFF MANAGEMENT ====================
  @Post(':businessId/staff')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Add staff member to business' })
  @ApiResponse({ status: 201, description: 'Staff member added successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async addStaffMember(
    @Param('businessId') businessId: string,
    @Body() staffData: { email: string; firstName: string; lastName: string; phone?: string }
  ) {
    try {
      const staff = await this.tenantService.addStaffMember(businessId, staffData);
      return {
        success: true,
        data: staff,
        message: 'Staff member added successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Delete(':businessId/staff/:staffId')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove staff member from business' })
  @ApiResponse({ status: 200, description: 'Staff member removed successfully' })
  @ApiResponse({ status: 404, description: 'Business or staff not found' })
  async removeStaffMember(
    @Param('businessId') businessId: string,
    @Param('staffId') staffId: string
  ) {
    try {
      await this.tenantService.removeStaffMember(businessId, staffId);
      return {
        success: true,
        message: 'Staff member removed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ==================== ADMIN MANAGEMENT ====================
  @Post(':businessId/admin/:adminId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add business admin' })
  @ApiResponse({ status: 201, description: 'Admin added successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async addBusinessAdmin(
    @Param('businessId') businessId: string,
    @Param('adminId') adminId: string
  ) {
    try {
      await this.tenantService.addBusinessAdmin(businessId, adminId);
      return {
        success: true,
        message: 'Admin added successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Delete(':businessId/admin/:adminId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove business admin' })
  @ApiResponse({ status: 200, description: 'Admin removed successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async removeBusinessAdmin(
    @Param('businessId') businessId: string,
    @Param('adminId') adminId: string
  ) {
    try {
      await this.tenantService.removeBusinessAdmin(businessId, adminId);
      return {
        success: true,
        message: 'Admin removed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ==================== TENANT CONFIG ====================
  @Get(':businessId/config')
  @ApiOperation({ summary: 'Get tenant configuration' })
  @ApiResponse({ status: 200, description: 'Tenant configuration retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async getTenantConfig(@Param('businessId') businessId: string) {
    try {
      const config = await this.tenantService.getTenantConfig(businessId);
      return {
        success: true,
        data: config,
        message: 'Tenant configuration retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Put(':businessId/config')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tenant configuration' })
  @ApiResponse({ status: 200, description: 'Tenant configuration updated successfully' })
  async updateTenantConfig(
    @Param('businessId') businessId: string,
    @Body() configData: any
  ) {
    try {
      const config = await this.tenantService.updateTenantConfig(businessId, configData);
      return {
        success: true,
        data: config,
        message: 'Tenant configuration updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ==================== SUBSCRIPTION ====================
  @Get(':businessId/subscription/limits')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check subscription limits' })
  @ApiResponse({ status: 200, description: 'Subscription limits retrieved successfully' })
  async checkSubscriptionLimits(@Param('businessId') businessId: string) {
    try {
      const limits = await this.tenantService.checkSubscriptionLimits(businessId);
      return {
        success: true,
        data: limits,
        message: 'Subscription limits retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ==================== BUSINESS STATUS ====================
  @Put(':businessId/suspend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend business' })
  @ApiResponse({ status: 200, description: 'Business suspended successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async suspendBusiness(
    @Param('businessId') businessId: string,
    @Body() body: { reason: string }
  ) {
    try {
      await this.tenantService.suspendBusiness(businessId, body.reason);
      return {
        success: true,
        message: 'Business suspended successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Put(':businessId/reactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reactivate business' })
  @ApiResponse({ status: 200, description: 'Business reactivated successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async reactivateBusiness(@Param('businessId') businessId: string) {
    try {
      await this.tenantService.reactivateBusiness(businessId);
      return {
        success: true,
        message: 'Business reactivated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}