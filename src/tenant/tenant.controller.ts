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
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
// import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto'; // Comment out for now if DTO doesn't exist
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Comment out if guard doesn't exist
import { Request } from 'express';

@ApiTags('tenant')
@Controller('api/tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 409, description: 'Subdomain already exists' })
  async createBusiness(@Body() createBusinessDto: CreateBusinessDto) { // Use any for now instead of CreateBusinessDto
    try {
      const business = await this.tenantService.createBusiness(createBusinessDto);
      return {
        success: true,
        data: business,
        message: 'Business created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.name
      };
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new business with owner' })
  async registerBusiness(@Body() registrationData: any) {
    // This would handle both user creation and business creation in one go
    try {
      // Implementation would depend on your auth service
      const result = await this.tenantService.registerBusinessWithOwner(registrationData);
      return {
        success: true,
        data: result,
        message: 'Business registered successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.name
      };
    }
  }

  @Get('check-subdomain')
  @ApiOperation({ summary: 'Check if subdomain is available' })
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

  @Get('businesses')
  // @UseGuards(JwtAuthGuard) // Comment out for now
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get businesses owned by current user' })
  async getBusinessesByOwner(@Req() req: Request) {
    try {
      // For now, get from query param since we don't have auth guard
      const userId = req.query.ownerId as string;
      if (!userId) {
        return {
          success: false,
          error: 'ownerId is required as query parameter'
        };
      }
      const businesses = await this.tenantService.getBusinessesByOwner(userId);
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

  @Get(':businessId')
  @ApiOperation({ summary: 'Get business by ID' })
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
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Update business' })
  async updateBusiness(
    @Param('businessId') businessId: string,
    @Body() updateBusinessDto: any // Use any for now instead of UpdateBusinessDto
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

  @Get(':businessId/config')
  @ApiOperation({ summary: 'Get tenant configuration' })
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
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tenant configuration' })
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

  @Get(':businessId/subscription/limits')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Check subscription limits' })
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
}