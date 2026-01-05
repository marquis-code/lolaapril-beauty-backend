// ==================== branding.controller.ts ====================
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch,
  Body, 
  Param, 
  Query,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam 
} from '@nestjs/swagger';
import { BrandingService } from './branding.service';
import { CreateThemeDto, UpdateThemeDto } from './dto/create-theme.dto';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from './dto/email-template.dto';
import { CreateWidgetDto, UpdateWidgetDto } from './dto/widget.dto';
import { RequestCustomDomainDto } from './dto/custom-domain.dto';

// Import auth-related decorators and guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessAuthGuard, BusinessRolesGuard, RequireBusinessRoles } from '../auth/guards/business-auth.guard';
import { BusinessContext, BusinessId, CurrentUser } from '../auth/decorators/business-context.decorator';
import type { BusinessContext as BusinessCtx } from '../auth/decorators/business-context.decorator';
import { UserRole } from '../auth/schemas/user.schema';
import type { RequestWithUser } from '../auth/types/request-with-user.interface';

@ApiTags('Branding & Customization')
@Controller('branding')
@UseGuards(JwtAuthGuard, BusinessAuthGuard) // All routes require business authentication
@ApiBearerAuth()
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  // ==================== THEME MANAGEMENT ====================

  @Post('theme')
  @UseGuards(BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiOperation({ 
    summary: 'Create or update business theme',
    description: 'Requires business owner or admin role'
  })
  @ApiResponse({ status: 200, description: 'Theme created/updated successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @HttpCode(HttpStatus.OK)
  async createOrUpdateTheme(
    @BusinessId() businessId: string,
    @Body() themeDto: CreateThemeDto
  ) {
    return this.brandingService.createOrUpdateTheme(businessId, themeDto);
  }

  @Get('theme')
  @ApiOperation({ summary: 'Get business theme configuration' })
  @ApiResponse({ status: 200, description: 'Theme retrieved successfully' })
  async getTheme(@BusinessId() businessId: string) {
    return this.brandingService.getTheme(businessId);
  }

  @Patch('theme')
  @UseGuards(BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiOperation({ summary: 'Partially update theme' })
  @ApiResponse({ status: 200, description: 'Theme updated successfully' })
  async updateTheme(
    @BusinessId() businessId: string,
    @Body() themeDto: UpdateThemeDto
  ) {
    return this.brandingService.updateTheme(businessId, themeDto);
  }

  // ==================== CUSTOM DOMAIN MANAGEMENT ====================

  @Post('domain')
  @UseGuards(BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER)
  @ApiOperation({ 
    summary: 'Request custom domain setup',
    description: 'Only business owners can request custom domains'
  })
  @ApiResponse({ status: 201, description: 'Domain request created successfully' })
  @ApiResponse({ status: 400, description: 'Domain already exists or invalid' })
  @HttpCode(HttpStatus.CREATED)
  async requestCustomDomain(
    @BusinessContext() context: BusinessCtx,
    @Body() domainDto: RequestCustomDomainDto
  ) {
    return this.brandingService.requestCustomDomain(
      context.businessId, 
      domainDto.domain,
      context.userId
    );
  }

  @Post('domain/:domainId/verify')
  @UseGuards(BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiOperation({ summary: 'Verify custom domain DNS records' })
  @ApiParam({ name: 'domainId', description: 'Domain record ID' })
  @ApiResponse({ status: 200, description: 'Domain verification initiated' })
  @ApiResponse({ status: 404, description: 'Domain not found' })
  async verifyDomain(
    @BusinessId() businessId: string,
    @Param('domainId') domainId: string
  ) {
    return this.brandingService.verifyCustomDomain(businessId, domainId);
  }

  @Get('domains')
  @ApiOperation({ summary: 'Get all custom domains for business' })
  @ApiResponse({ status: 200, description: 'Domains retrieved successfully' })
  async getCustomDomains(@BusinessId() businessId: string) {
    return this.brandingService.getCustomDomains(businessId);
  }

  @Get('domain/:domainId')
  @ApiOperation({ summary: 'Get specific domain details' })
  @ApiParam({ name: 'domainId', description: 'Domain record ID' })
  async getDomain(
    @BusinessId() businessId: string,
    @Param('domainId') domainId: string
  ) {
    return this.brandingService.getDomain(businessId, domainId);
  }

  // ==================== EMAIL TEMPLATE MANAGEMENT ====================

  @Post('email-template')
  @UseGuards(BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiOperation({ summary: 'Create custom email template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async createEmailTemplate(
    @BusinessContext() context: BusinessCtx,
    @Body() templateDto: CreateEmailTemplateDto
  ) {
    return this.brandingService.createEmailTemplate(
      context.businessId,
      templateDto,
      context.userId
    );
  }

  @Get('email-template/:templateType')
  @ApiOperation({ summary: 'Get email template by type' })
  @ApiParam({ 
    name: 'templateType', 
    description: 'Template type',
    enum: ['booking_confirmation', 'reminder', 'cancellation', 'welcome']
  })
  async getEmailTemplate(
    @BusinessId() businessId: string,
    @Param('templateType') templateType: string
  ) {
    return this.brandingService.getEmailTemplate(businessId, templateType);
  }

  @Get('email-templates')
  @ApiOperation({ summary: 'Get all email templates for business' })
  async getAllEmailTemplates(@BusinessId() businessId: string) {
    return this.brandingService.getAllEmailTemplates(businessId);
  }

  @Patch('email-template/:templateId')
  @UseGuards(BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiOperation({ summary: 'Update email template' })
  async updateEmailTemplate(
    @BusinessId() businessId: string,
    @Param('templateId') templateId: string,
    @Body() templateDto: UpdateEmailTemplateDto
  ) {
    return this.brandingService.updateEmailTemplate(
      businessId, 
      templateId, 
      templateDto
    );
  }

  // ==================== BOOKING WIDGET MANAGEMENT ====================

  @Post('widget')
  @UseGuards(BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiOperation({ summary: 'Create booking widget' })
  @ApiResponse({ status: 201, description: 'Widget created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async createWidget(
    @BusinessContext() context: BusinessCtx,
    @Body() widgetDto: CreateWidgetDto
  ) {
    return this.brandingService.createBookingWidget(
      context.businessId,
      widgetDto,
      context.userId
    );
  }

  @Get('widget/:widgetId')
  @ApiOperation({ summary: 'Get widget by ID' })
  @ApiParam({ name: 'widgetId', description: 'Widget ID' })
  async getWidget(
    @BusinessId() businessId: string,
    @Param('widgetId') widgetId: string
  ) {
    return this.brandingService.getBookingWidget(businessId, widgetId);
  }

  @Get('widgets')
  @ApiOperation({ summary: 'Get all widgets for business' })
  async getAllWidgets(@BusinessId() businessId: string) {
    return this.brandingService.getAllWidgets(businessId);
  }

  @Patch('widget/:widgetId')
  @UseGuards(BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiOperation({ summary: 'Update widget configuration' })
  async updateWidget(
    @BusinessId() businessId: string,
    @Param('widgetId') widgetId: string,
    @Body() widgetDto: UpdateWidgetDto
  ) {
    return this.brandingService.updateWidget(businessId, widgetId, widgetDto);
  }

  // ==================== WIDGET ANALYTICS ====================

  @Post('widget/:widgetId/impression')
  @ApiOperation({ 
    summary: 'Track widget impression (public endpoint)',
    description: 'This endpoint does not require authentication'
  })
  @ApiParam({ name: 'widgetId', description: 'Widget ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackImpression(@Param('widgetId') widgetId: string) {
    await this.brandingService.trackWidgetImpression(widgetId);
  }

  @Post('widget/:widgetId/conversion')
  @ApiOperation({ 
    summary: 'Track widget conversion (public endpoint)',
    description: 'This endpoint does not require authentication'
  })
  @ApiParam({ name: 'widgetId', description: 'Widget ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackConversion(@Param('widgetId') widgetId: string) {
    await this.brandingService.trackWidgetConversion(widgetId);
  }

  @Get('widget/:widgetId/analytics')
  @ApiOperation({ summary: 'Get widget analytics' })
  @ApiParam({ name: 'widgetId', description: 'Widget ID' })
  async getWidgetAnalytics(
    @BusinessId() businessId: string,
    @Param('widgetId') widgetId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.brandingService.getWidgetAnalytics(
      businessId,
      widgetId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }

  // ==================== BRANDING OVERVIEW ====================

  @Get('overview')
  @ApiOperation({ 
    summary: 'Get complete branding overview',
    description: 'Returns theme, domains, templates, and widgets in one call'
  })
  @ApiResponse({ status: 200, description: 'Branding overview retrieved' })
  async getBrandingOverview(@BusinessContext() context: BusinessCtx) {
    return this.brandingService.getBrandingOverview(context.businessId);
  }

  // ==================== PREVIEW ENDPOINTS ====================

  @Get('preview/theme')
  @ApiOperation({ summary: 'Preview theme without saving' })
  async previewTheme(
    @BusinessId() businessId: string,
    @Query() previewData: CreateThemeDto
  ) {
    return this.brandingService.generateThemePreview(businessId, previewData);
  }
}

