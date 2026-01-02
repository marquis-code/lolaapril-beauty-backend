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
const branding_service_1 = require("./branding.service");
const create_theme_dto_1 = require("./dto/create-theme.dto");
let BrandingController = class BrandingController {
    constructor(brandingService) {
        this.brandingService = brandingService;
    }
    createOrUpdateTheme(tenantId, themeDto) {
        return this.brandingService.createOrUpdateTheme(tenantId, themeDto);
    }
    getTheme(tenantId) {
        return this.brandingService.getTheme(tenantId);
    }
    requestCustomDomain(tenantId, domain) {
        return this.brandingService.requestCustomDomain(tenantId, domain);
    }
    verifyDomain(domainId) {
        return this.brandingService.verifyCustomDomain(domainId);
    }
    getCustomDomains(tenantId) {
        return this.brandingService.getCustomDomains(tenantId);
    }
    createEmailTemplate(tenantId, body) {
        return this.brandingService.createEmailTemplate(tenantId, body.templateType, body.subject, body.htmlContent, body.textContent);
    }
    getEmailTemplate(tenantId, templateType) {
        return this.brandingService.getEmailTemplate(tenantId, templateType);
    }
    createWidget(tenantId, body) {
        return this.brandingService.createBookingWidget(tenantId, body.configuration, body.styling);
    }
    getWidget(tenantId, widgetId) {
        return this.brandingService.getBookingWidget(tenantId, widgetId);
    }
    trackImpression(widgetId) {
        return this.brandingService.trackWidgetImpression(widgetId);
    }
    trackConversion(widgetId) {
        return this.brandingService.trackWidgetConversion(widgetId);
    }
};
__decorate([
    (0, common_1.Post)('theme/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_theme_dto_1.CreateThemeDto]),
    __metadata("design:returntype", void 0)
], BrandingController.prototype, "createOrUpdateTheme", null);
__decorate([
    (0, common_1.Get)('theme/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandingController.prototype, "getTheme", null);
__decorate([
    (0, common_1.Post)('domain/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)('domain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BrandingController.prototype, "requestCustomDomain", null);
__decorate([
    (0, common_1.Post)('domain/:domainId/verify'),
    __param(0, (0, common_1.Param)('domainId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandingController.prototype, "verifyDomain", null);
__decorate([
    (0, common_1.Get)('domains/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandingController.prototype, "getCustomDomains", null);
__decorate([
    (0, common_1.Post)('email-template/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BrandingController.prototype, "createEmailTemplate", null);
__decorate([
    (0, common_1.Get)('email-template/:tenantId/:templateType'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('templateType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BrandingController.prototype, "getEmailTemplate", null);
__decorate([
    (0, common_1.Post)('widget/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BrandingController.prototype, "createWidget", null);
__decorate([
    (0, common_1.Get)('widget/:tenantId/:widgetId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BrandingController.prototype, "getWidget", null);
__decorate([
    (0, common_1.Post)('widget/:widgetId/impression'),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandingController.prototype, "trackImpression", null);
__decorate([
    (0, common_1.Post)('widget/:widgetId/conversion'),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandingController.prototype, "trackConversion", null);
BrandingController = __decorate([
    (0, common_1.Controller)('branding'),
    __metadata("design:paramtypes", [branding_service_1.BrandingService])
], BrandingController);
exports.BrandingController = BrandingController;
//# sourceMappingURL=branding.controller.js.map