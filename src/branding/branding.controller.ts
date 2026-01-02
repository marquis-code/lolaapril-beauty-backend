
// branding.controller.ts
import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { BrandingService } from './branding.service';
import { CreateThemeDto } from './dto/create-theme.dto';

@Controller('branding')
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Post('theme/:tenantId')
  createOrUpdateTheme(@Param('tenantId') tenantId: string, @Body() themeDto: CreateThemeDto) {
    return this.brandingService.createOrUpdateTheme(tenantId, themeDto);
  }

  @Get('theme/:tenantId')
  getTheme(@Param('tenantId') tenantId: string) {
    return this.brandingService.getTheme(tenantId);
  }

  @Post('domain/:tenantId')
  requestCustomDomain(@Param('tenantId') tenantId: string, @Body('domain') domain: string) {
    return this.brandingService.requestCustomDomain(tenantId, domain);
  }

  @Post('domain/:domainId/verify')
  verifyDomain(@Param('domainId') domainId: string) {
    return this.brandingService.verifyCustomDomain(domainId);
  }

  @Get('domains/:tenantId')
  getCustomDomains(@Param('tenantId') tenantId: string) {
    return this.brandingService.getCustomDomains(tenantId);
  }

  @Post('email-template/:tenantId')
  createEmailTemplate(
    @Param('tenantId') tenantId: string,
    @Body() body: { templateType: string; subject: string; htmlContent: string; textContent?: string },
  ) {
    return this.brandingService.createEmailTemplate(
      tenantId,
      body.templateType,
      body.subject,
      body.htmlContent,
      body.textContent,
    );
  }

  @Get('email-template/:tenantId/:templateType')
  getEmailTemplate(@Param('tenantId') tenantId: string, @Param('templateType') templateType: string) {
    return this.brandingService.getEmailTemplate(tenantId, templateType);
  }

  @Post('widget/:tenantId')
  createWidget(
    @Param('tenantId') tenantId: string,
    @Body() body: { configuration: any; styling: any },
  ) {
    return this.brandingService.createBookingWidget(tenantId, body.configuration, body.styling);
  }

  @Get('widget/:tenantId/:widgetId')
  getWidget(@Param('tenantId') tenantId: string, @Param('widgetId') widgetId: string) {
    return this.brandingService.getBookingWidget(tenantId, widgetId);
  }

  @Post('widget/:widgetId/impression')
  trackImpression(@Param('widgetId') widgetId: string) {
    return this.brandingService.trackWidgetImpression(widgetId);
  }

  @Post('widget/:widgetId/conversion')
  trackConversion(@Param('widgetId') widgetId: string) {
    return this.brandingService.trackWidgetConversion(widgetId);
  }
}
