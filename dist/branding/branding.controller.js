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
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const upload_service_1 = require("../upload/upload.service");
const branding_service_1 = require("./branding.service");
const create_theme_dto_1 = require("./dto/create-theme.dto");
const email_template_dto_1 = require("./dto/email-template.dto");
const widget_dto_1 = require("./dto/widget.dto");
const custom_domain_dto_1 = require("./dto/custom-domain.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const business_auth_guard_1 = require("../auth/guards/business-auth.guard");
const business_context_decorator_1 = require("../auth/decorators/business-context.decorator");
let BrandingController = class BrandingController {
    constructor(brandingService, uploadService) {
        this.brandingService = brandingService;
        this.uploadService = uploadService;
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
    async uploadLogo(businessId, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('Logo file too large. Maximum 2MB allowed.');
        }
        const result = await this.uploadService.uploadImage(businessId, file, 'branding/logos');
        return {
            success: true,
            data: {
                url: result.url,
                publicId: result.publicId,
                width: 200,
                height: 80
            },
            message: 'Logo uploaded successfully. Use the URL in your theme configuration.'
        };
    }
    async uploadFavicon(businessId, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const maxSize = 500 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('Favicon file too large. Maximum 500KB allowed.');
        }
        const result = await this.uploadService.uploadImage(businessId, file, 'branding/favicons');
        return {
            success: true,
            data: {
                url: result.url,
                publicId: result.publicId
            },
            message: 'Favicon uploaded successfully. Use the URL in your theme configuration.'
        };
    }
    async uploadEmailHeader(businessId, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const maxSize = 1 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('Email header file too large. Maximum 1MB allowed.');
        }
        const result = await this.uploadService.uploadImage(businessId, file, 'branding/email-headers');
        return {
            success: true,
            data: {
                url: result.url,
                publicId: result.publicId
            },
            message: 'Email header uploaded successfully. Use the URL in your email template.'
        };
    }
    async getStorefrontConfig(businessId) {
        return this.brandingService.getStorefrontConfig(businessId);
    }
    async updateFullStorefront(businessId, storefrontDto) {
        return this.brandingService.updateFullStorefront(businessId, storefrontDto);
    }
    async updateStorefrontLayout(businessId, layoutDto) {
        return this.brandingService.updateStorefrontLayout(businessId, layoutDto);
    }
    async updateHeroSection(businessId, heroDto) {
        return this.brandingService.updateHeroSection(businessId, heroDto);
    }
    async updateSectionsOrder(businessId, sectionsDto) {
        return this.brandingService.updateSectionsOrder(businessId, sectionsDto.sections);
    }
    async updateComponentStyles(businessId, stylesDto) {
        return this.brandingService.updateComponentStyles(businessId, stylesDto);
    }
    async updateNavbar(businessId, navbarDto) {
        return this.brandingService.updateNavbar(businessId, navbarDto);
    }
    async updateFooter(businessId, footerDto) {
        return this.brandingService.updateFooter(businessId, footerDto);
    }
    async updateSeo(businessId, seoDto) {
        return this.brandingService.updateSeo(businessId, seoDto);
    }
    async uploadHeroImage(businessId, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('Hero image file too large. Maximum 5MB allowed.');
        }
        const result = await this.uploadService.uploadImage(businessId, file, 'branding/hero');
        return {
            success: true,
            data: {
                url: result.url,
                publicId: result.publicId
            },
            message: 'Hero image uploaded successfully. Use the URL in your hero configuration.'
        };
    }
    async uploadGalleryImage(businessId, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const maxSize = 3 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('Gallery image file too large. Maximum 3MB allowed.');
        }
        const result = await this.uploadService.uploadImage(businessId, file, 'branding/gallery');
        return {
            success: true,
            data: {
                url: result.url,
                publicId: result.publicId
            },
            message: 'Gallery image uploaded successfully. Add the URL to your gallery images array.'
        };
    }
    async getStorefrontContent(businessId) {
        return this.brandingService.getStorefrontContent(businessId);
    }
    async addTestimonial(businessId, testimonialDto) {
        return this.brandingService.addTestimonial(businessId, testimonialDto);
    }
    async updateTestimonials(businessId, testimonialsDto) {
        return this.brandingService.updateTestimonials(businessId, testimonialsDto);
    }
    async deleteTestimonial(businessId, testimonialId) {
        return this.brandingService.deleteTestimonial(businessId, testimonialId);
    }
    async addFAQ(businessId, faqDto) {
        return this.brandingService.addFAQ(businessId, faqDto);
    }
    async updateFAQs(businessId, faqsDto) {
        return this.brandingService.updateFAQs(businessId, faqsDto);
    }
    async deleteFAQ(businessId, faqId) {
        return this.brandingService.deleteFAQ(businessId, faqId);
    }
    async importFAQsFromChat(businessId, importDto) {
        return this.brandingService.importFAQsFromChat(businessId, importDto?.replaceExisting);
    }
    async updateAboutContent(businessId, aboutDto) {
        return this.brandingService.updateAboutContent(businessId, aboutDto);
    }
    async addGalleryImageToContent(businessId, imageDto) {
        return this.brandingService.addGalleryImage(businessId, imageDto);
    }
    async updateGalleryImages(businessId, imagesDto) {
        return this.brandingService.updateGalleryImages(businessId, imagesDto);
    }
    async deleteGalleryImage(businessId, imageId) {
        return this.brandingService.deleteGalleryImage(businessId, imageId);
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
    async createPreviewSession(businessId, previewData) {
        const result = await this.brandingService.createPreviewSession(businessId, previewData);
        return {
            success: true,
            ...result,
            expiresIn: '1 hour',
            message: 'Preview session created. Use the previewId in the URL.'
        };
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
    (0, common_1.Post)('upload/logo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload logo image for branding',
        description: 'Upload logo first, then use the returned URL when creating/updating theme. Max 2MB, supports JPEG, PNG, WEBP, GIF.'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Logo image file (max 2MB)'
                }
            },
            required: ['file']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Logo uploaded successfully',
        schema: {
            example: {
                success: true,
                data: {
                    url: 'https://res.cloudinary.com/xxx/image/upload/v123/branding/businessId/logo_123.png',
                    publicId: 'branding/businessId/logo_123',
                    width: 200,
                    height: 80
                },
                message: 'Logo uploaded successfully. Use the URL in your theme configuration.'
            }
        }
    }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "uploadLogo", null);
__decorate([
    (0, common_1.Post)('upload/favicon'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload favicon for branding',
        description: 'Upload favicon first, then use the returned URL when creating/updating theme. Max 500KB, supports ICO, PNG, SVG.'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Favicon file (max 500KB)'
                }
            },
            required: ['file']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Favicon uploaded successfully',
        schema: {
            example: {
                success: true,
                data: {
                    url: 'https://res.cloudinary.com/xxx/image/upload/v123/branding/businessId/favicon_123.png',
                    publicId: 'branding/businessId/favicon_123'
                },
                message: 'Favicon uploaded successfully. Use the URL in your theme configuration.'
            }
        }
    }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "uploadFavicon", null);
__decorate([
    (0, common_1.Post)('upload/email-header'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload email header image for email templates',
        description: 'Upload email header first, then use the returned URL in email templates. Max 1MB.'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Email header image (max 1MB, recommended 600px width)'
                }
            },
            required: ['file']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Email header uploaded successfully',
        schema: {
            example: {
                success: true,
                data: {
                    url: 'https://res.cloudinary.com/xxx/image/upload/v123/branding/businessId/email-header_123.png',
                    publicId: 'branding/businessId/email-header_123'
                },
                message: 'Email header uploaded successfully. Use the URL in your email template.'
            }
        }
    }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "uploadEmailHeader", null);
__decorate([
    (0, common_1.Get)('storefront'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get storefront configuration',
        description: 'Retrieve the complete storefront layout configuration including hero, sections, display settings, etc.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storefront configuration retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "getStorefrontConfig", null);
__decorate([
    (0, common_1.Put)('storefront'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update complete storefront configuration',
        description: 'Update all storefront settings at once: layout, component styles, navbar, footer, and SEO'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storefront configuration updated successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateFullStorefront", null);
__decorate([
    (0, common_1.Patch)('storefront/layout'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update storefront layout',
        description: 'Partially update storefront layout including hero section, sections order, display settings, gallery, testimonials, contact, booking flow, and social proof'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storefront layout updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateStorefrontLayout", null);
__decorate([
    (0, common_1.Patch)('storefront/hero'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update hero section',
        description: 'Update the hero/banner section including cover image, headline, background type (image/video/gradient), and book button'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hero section updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateHeroSection", null);
__decorate([
    (0, common_1.Patch)('storefront/sections'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update sections order',
        description: 'Reorder storefront sections (for drag-and-drop functionality). Pass the complete sections array with updated order values.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sections order updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateSectionsOrder", null);
__decorate([
    (0, common_1.Patch)('storefront/styles'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update component styles',
        description: 'Update visual styling for buttons, cards, inputs, and spacing'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Component styles updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateComponentStyles", null);
__decorate([
    (0, common_1.Patch)('storefront/navbar'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update navbar configuration',
        description: 'Update navbar style, visibility options, book button, and menu items'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Navbar updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateNavbar", null);
__decorate([
    (0, common_1.Patch)('storefront/footer'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update footer configuration',
        description: 'Update footer visibility, social links, contact info, newsletter, and custom links'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Footer updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateFooter", null);
__decorate([
    (0, common_1.Patch)('storefront/seo'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update SEO configuration',
        description: 'Update meta title, description, keywords, and Open Graph image for the booking page'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SEO configuration updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateSeo", null);
__decorate([
    (0, common_1.Post)('upload/hero-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload hero/cover image for storefront',
        description: 'Upload a cover image for the hero section. Max 5MB, recommended 1920x1080.'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Hero image file (max 5MB, recommended 1920x1080)'
                }
            },
            required: ['file']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Hero image uploaded successfully',
        schema: {
            example: {
                success: true,
                data: {
                    url: 'https://res.cloudinary.com/xxx/image/upload/v123/branding/businessId/hero_123.jpg',
                    publicId: 'branding/businessId/hero_123'
                },
                message: 'Hero image uploaded successfully. Use the URL in your hero configuration.'
            }
        }
    }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "uploadHeroImage", null);
__decorate([
    (0, common_1.Post)('upload/gallery'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload gallery image for storefront',
        description: 'Upload an image for the gallery section. Max 3MB.'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Gallery image file (max 3MB)'
                }
            },
            required: ['file']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Gallery image uploaded successfully'
    }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "uploadGalleryImage", null);
__decorate([
    (0, common_1.Get)('content'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all storefront content',
        description: 'Get testimonials, FAQs, about content, and gallery images'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Content retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "getStorefrontContent", null);
__decorate([
    (0, common_1.Post)('content/testimonials'),
    (0, swagger_1.ApiOperation)({
        summary: 'Add a testimonial',
        description: 'Manually add a customer testimonial to display on storefront'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Testimonial added successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "addTestimonial", null);
__decorate([
    (0, common_1.Put)('content/testimonials'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update all testimonials',
        description: 'Replace all testimonials with new array (for reordering, bulk edit)'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Testimonials updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateTestimonials", null);
__decorate([
    (0, common_1.Patch)('content/testimonials/:testimonialId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a testimonial',
        description: 'Remove a specific testimonial by ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'testimonialId', description: 'Testimonial ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Testimonial deleted successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('testimonialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "deleteTestimonial", null);
__decorate([
    (0, common_1.Post)('content/faqs'),
    (0, swagger_1.ApiOperation)({
        summary: 'Add a FAQ',
        description: 'Add a frequently asked question to display on storefront'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'FAQ added successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "addFAQ", null);
__decorate([
    (0, common_1.Put)('content/faqs'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update all FAQs',
        description: 'Replace all FAQs with new array (for reordering, bulk edit)'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQs updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateFAQs", null);
__decorate([
    (0, common_1.Patch)('content/faqs/:faqId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a FAQ',
        description: 'Remove a specific FAQ by ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'faqId', description: 'FAQ ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQ deleted successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('faqId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "deleteFAQ", null);
__decorate([
    (0, common_1.Post)('content/faqs/import'),
    (0, swagger_1.ApiOperation)({
        summary: 'Import FAQs from chat',
        description: 'Import FAQs from the chat/support system into storefront'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQs imported successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "importFAQsFromChat", null);
__decorate([
    (0, common_1.Put)('content/about'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update about section content',
        description: 'Update the about section including description, founder info, highlights'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'About section updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateAboutContent", null);
__decorate([
    (0, common_1.Post)('content/gallery'),
    (0, swagger_1.ApiOperation)({
        summary: 'Add a gallery image',
        description: 'Add an image to the gallery section with optional caption and category'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Gallery image added successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "addGalleryImageToContent", null);
__decorate([
    (0, common_1.Put)('content/gallery'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update all gallery images',
        description: 'Replace all gallery images with new array (for reordering, bulk edit)'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery images updated successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "updateGalleryImages", null);
__decorate([
    (0, common_1.Patch)('content/gallery/:imageId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a gallery image',
        description: 'Remove a specific gallery image by ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'imageId', description: 'Gallery image ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gallery image deleted successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "deleteGalleryImage", null);
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
    (0, common_1.Post)('preview/session'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a preview session with short URL',
        description: 'Creates a temporary preview session and returns a short preview ID. Use this instead of encoding theme in URL.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Preview session created successfully',
        schema: {
            example: {
                success: true,
                previewId: 'a1b2c3d4e5f6',
                previewUrl: '/preview/book/{subdomain}?previewId=a1b2c3d4e5f6',
                expiresIn: '1 hour',
                message: 'Preview session created. Use the previewId in the URL.'
            }
        }
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_theme_dto_1.CreateThemeDto]),
    __metadata("design:returntype", Promise)
], BrandingController.prototype, "createPreviewSession", null);
BrandingController = __decorate([
    (0, swagger_1.ApiTags)('Branding & Customization'),
    (0, common_1.Controller)('branding'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, business_auth_guard_1.BusinessAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [branding_service_1.BrandingService,
        upload_service_1.UploadService])
], BrandingController);
exports.BrandingController = BrandingController;
//# sourceMappingURL=branding.controller.js.map