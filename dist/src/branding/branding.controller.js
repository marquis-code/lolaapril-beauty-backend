"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const branding_service_1 = require("./branding.service");
const create_theme_dto_1 = require("./dto/create-theme.dto");
const email_template_dto_1 = require("./dto/email-template.dto");
const widget_dto_1 = require("./dto/widget.dto");
const custom_domain_dto_1 = require("./dto/custom-domain.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const business_auth_guard_1 = require("../auth/guards/business-auth.guard");
const business_context_decorator_1 = require("../auth/decorators/business-context.decorator");
let BrandingController = class BrandingController {
    constructor(brandingService) {
        this.brandingService = brandingService;
    }
    async createOrUpdateTheme(businessId, themeDto) {
        return this.brandingService.createOrUpdateTheme(businessId, themeDto);
    }
    async getTheme(businessId) {
        return this.brandingService.getTheme(businessId);
    }
    async updateTheme(businessId, themeDto) {
        return this.brandingService.updateTheme(businessId, themeDto);
    }
    async requestCustomDomain(context, domainDto) {
        return this.brandingService.requestCustomDomain(context.businessId, domainDto.domain, context.userId);
    }
    async verifyDomain(businessId, domainId) {
        return this.brandingService.verifyCustomDomain(businessId, domainId);
    }
    async getCustomDomains(businessId) {
        return this.brandingService.getCustomDomains(businessId);
    }
    async getDomain(businessId, domainId) {
        return this.brandingService.getDomain(businessId, domainId);
    }
    async createEmailTemplate(context, templateDto) {
        return this.brandingService.createEmailTemplate(context.businessId, templateDto, context.userId);
    }
    async getEmailTemplate(businessId, templateType) {
        return this.brandingService.getEmailTemplate(businessId, templateType);
    }
    async getAllEmailTemplates(businessId) {
        return this.brandingService.getAllEmailTemplates(businessId);
    }
    async updateEmailTemplate(businessId, templateId, templateDto) {
        return this.brandingService.updateEmailTemplate(businessId, templateId, templateDto);
    }
    async createWidget(context, widgetDto) {
        return this.brandingService.createBookingWidget(context.businessId, widgetDto, context.userId);
    }
    async getWidget(businessId, widgetId) {
        return this.brandingService.getBookingWidget(businessId, widgetId);
    }
    async getAllWidgets(businessId) {
        return this.brandingService.getAllWidgets(businessId);
    }
    async updateWidget(businessId, widgetId, widgetDto) {
        return this.brandingService.updateWidget(businessId, widgetId, widgetDto);
    }
    async trackImpression(widgetId) {
        await this.brandingService.trackWidgetImpression(widgetId);
    }
    async trackConversion(widgetId) {
        await this.brandingService.trackWidgetConversion(widgetId);
    }
    async getWidgetAnalytics(businessId, widgetId, startDate, endDate) {
        return this.brandingService.getWidgetAnalytics(businessId, widgetId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async getBrandingOverview(context) {
        return this.brandingService.getBrandingOverview(context.businessId);
    }
    async previewTheme(businessId, previewData) {
        return this.brandingService.generateThemePreview(businessId, previewData);
    }
};
__decorate([
    (0, common_1.Post)('theme'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update business theme',
        description: 'Requires business owner or admin role'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Theme created/updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_theme_dto_1.CreateThemeDto]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "createOrUpdateTheme", null);
__decorate([
    (0, common_1.Get)('theme'),
    (0, swagger_1.ApiOperation)({ summary: 'Get business theme configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Theme retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "getTheme", null);
__decorate([
    (0, common_1.Patch)('theme'),
    (0, swagger_1.ApiOperation)({ summary: 'Partially update theme' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Theme updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_theme_dto_1.UpdateThemeDto]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateTheme", null);
__decorate([
    (0, common_1.Post)('domain'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request custom domain setup',
        description: 'Only business owners can request custom domains'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Domain request created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Domain already exists or invalid' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, custom_domain_dto_1.RequestCustomDomainDto]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "requestCustomDomain", null);
__decorate([
    (0, common_1.Post)('domain/:domainId/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify custom domain DNS records' }),
    (0, swagger_1.ApiParam)({ name: 'domainId', description: 'Domain record ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Domain verification initiated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Domain not found' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('domainId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "verifyDomain", null);
__decorate([
    (0, common_1.Get)('domains'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all custom domains for business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Domains retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "getCustomDomains", null);
__decorate([
    (0, common_1.Get)('domain/:domainId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific domain details' }),
    (0, swagger_1.ApiParam)({ name: 'domainId', description: 'Domain record ID' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('domainId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "getDomain", null);
__decorate([
    (0, common_1.Post)('email-template'),
    (0, swagger_1.ApiOperation)({ summary: 'Create custom email template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Template created successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, email_template_dto_1.CreateEmailTemplateDto]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "createEmailTemplate", null);
__decorate([
    (0, common_1.Get)('email-template/:templateType'),
    (0, swagger_1.ApiOperation)({ summary: 'Get email template by type' }),
    (0, swagger_1.ApiParam)({
        name: 'templateType',
        description: 'Template type',
        enum: ['booking_confirmation', 'reminder', 'cancellation', 'welcome']
    }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('templateType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "getEmailTemplate", null);
__decorate([
    (0, common_1.Get)('email-templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all email templates for business' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "getAllEmailTemplates", null);
__decorate([
    (0, common_1.Patch)('email-template/:templateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update email template' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('templateId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, email_template_dto_1.UpdateEmailTemplateDto]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateEmailTemplate", null);
__decorate([
    (0, common_1.Post)('widget'),
    (0, swagger_1.ApiOperation)({ summary: 'Create booking widget' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Widget created successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, widget_dto_1.CreateWidgetDto]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "createWidget", null);
__decorate([
    (0, common_1.Get)('widget/:widgetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get widget by ID' }),
    (0, swagger_1.ApiParam)({ name: 'widgetId', description: 'Widget ID' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "getWidget", null);
__decorate([
    (0, common_1.Get)('widgets'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all widgets for business' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "getAllWidgets", null);
__decorate([
    (0, common_1.Patch)('widget/:widgetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update widget configuration' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('widgetId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, widget_dto_1.UpdateWidgetDto]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateWidget", null);
__decorate([
    (0, common_1.Post)('widget/:widgetId/impression'),
    (0, swagger_1.ApiOperation)({
        summary: 'Track widget impression (public endpoint)',
        description: 'This endpoint does not require authentication'
    }),
    (0, swagger_1.ApiParam)({ name: 'widgetId', description: 'Widget ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "trackImpression", null);
__decorate([
    (0, common_1.Post)('widget/:widgetId/conversion'),
    (0, swagger_1.ApiOperation)({
        summary: 'Track widget conversion (public endpoint)',
        description: 'This endpoint does not require authentication'
    }),
    (0, swagger_1.ApiParam)({ name: 'widgetId', description: 'Widget ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "trackConversion", null);
__decorate([
    (0, common_1.Get)('widget/:widgetId/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get widget analytics' }),
    (0, swagger_1.ApiParam)({ name: 'widgetId', description: 'Widget ID' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('widgetId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "getWidgetAnalytics", null);
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get complete branding overview',
        description: 'Returns theme, domains, templates, and widgets in one call'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Branding overview retrieved' }),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "getBrandingOverview", null);
__decorate([
    (0, common_1.Get)('preview/theme'),
    (0, swagger_1.ApiOperation)({ summary: 'Preview theme without saving' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_theme_dto_1.CreateThemeDto]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "previewTheme", null);
BrandingController = __decorate([
    (0, swagger_1.ApiTags)('Branding & Customization'),
    (0, common_1.Controller)('branding'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, business_auth_guard_1.BusinessAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [branding_service_1.BrandingService])
], BrandingController);
exports.BrandingController = BrandingController;
//# sourceMappingURL=branding.controller.js.map