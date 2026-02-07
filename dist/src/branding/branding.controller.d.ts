/// <reference types="multer" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { UploadService } from '../upload/upload.service';
import { BrandingService } from './branding.service';
import { CreateThemeDto, UpdateThemeDto } from './dto/create-theme.dto';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from './dto/email-template.dto';
import { CreateWidgetDto, UpdateWidgetDto } from './dto/widget.dto';
import { RequestCustomDomainDto } from './dto/custom-domain.dto';
import type { BusinessContext as BusinessCtx } from '../auth/decorators/business-context.decorator';
export declare class BrandingController {
    private readonly brandingService;
    private readonly uploadService;
    constructor(brandingService: BrandingService, uploadService: UploadService);
    createOrUpdateTheme(businessId: string, themeDto: CreateThemeDto): Promise<{
        success: boolean;
        message: string;
        theme: import("mongoose").Document<unknown, {}, import(".").ThemeDocument, {}, {}> & import(".").Theme & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getTheme(businessId: string): Promise<{
        isDefault: boolean;
        theme: {
            colors: {
                primary: string;
                secondary: string;
                accent: string;
                background: string;
                text: string;
                error: string;
                success: string;
            };
            typography: {
                fontFamily: string;
                headingFont: string;
                bodyFont: string;
            };
            logo: any;
            favicon: any;
            customCss: {
                enabled: boolean;
                cssCode: string;
            };
        };
    } | {
        isDefault: boolean;
        theme: import("mongoose").Document<unknown, {}, import(".").ThemeDocument, {}, {}> & import(".").Theme & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    updateTheme(businessId: string, themeDto: UpdateThemeDto): Promise<{
        success: boolean;
        message: string;
        theme: import("mongoose").Document<unknown, {}, import(".").ThemeDocument, {}, {}> & import(".").Theme & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    uploadLogo(businessId: string, file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            url: string;
            publicId: string;
            width: number;
            height: number;
        };
        message: string;
    }>;
    uploadFavicon(businessId: string, file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            url: string;
            publicId: string;
        };
        message: string;
    }>;
    uploadEmailHeader(businessId: string, file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            url: string;
            publicId: string;
        };
        message: string;
    }>;
    getStorefrontConfig(businessId: string): Promise<{
        success: boolean;
        isDefault: boolean;
        storefront: any;
        componentStyles: any;
        navbar: any;
        footer: any;
        seo: any;
    }>;
    updateFullStorefront(businessId: string, storefrontDto: any): Promise<any>;
    updateStorefrontLayout(businessId: string, layoutDto: any): Promise<{
        success: boolean;
        message: string;
        storefront: any;
    }>;
    updateHeroSection(businessId: string, heroDto: any): Promise<{
        success: boolean;
        message: string;
        storefront: any;
    }>;
    updateSectionsOrder(businessId: string, sectionsDto: {
        sections: any[];
    }): Promise<{
        success: boolean;
        message: string;
        storefront: any;
    }>;
    updateComponentStyles(businessId: string, stylesDto: any): Promise<{
        success: boolean;
        message: string;
        componentStyles: any;
    }>;
    updateNavbar(businessId: string, navbarDto: any): Promise<{
        success: boolean;
        message: string;
        navbar: any;
    }>;
    updateFooter(businessId: string, footerDto: any): Promise<{
        success: boolean;
        message: string;
        footer: any;
    }>;
    updateSeo(businessId: string, seoDto: any): Promise<{
        success: boolean;
        message: string;
        seo: any;
    }>;
    uploadHeroImage(businessId: string, file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            url: string;
            publicId: string;
        };
        message: string;
    }>;
    uploadGalleryImage(businessId: string, file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            url: string;
            publicId: string;
        };
        message: string;
    }>;
    getStorefrontContent(businessId: string): Promise<{
        success: boolean;
        content: any;
    }>;
    addTestimonial(businessId: string, testimonialDto: any): Promise<{
        success: boolean;
        message: string;
        testimonial: {
            id: string;
            clientName: any;
            clientPhoto: any;
            clientTitle: any;
            content: any;
            rating: any;
            date: any;
            serviceName: any;
            isVisible: boolean;
            order: any;
        };
        totalTestimonials: any;
    }>;
    updateTestimonials(businessId: string, testimonialsDto: {
        testimonials: any[];
    }): Promise<{
        success: boolean;
        message: string;
        testimonials: any;
    }>;
    deleteTestimonial(businessId: string, testimonialId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addFAQ(businessId: string, faqDto: any): Promise<{
        success: boolean;
        message: string;
        faq: {
            id: string;
            question: any;
            answer: any;
            category: any;
            isVisible: boolean;
            order: any;
        };
        totalFAQs: any;
    }>;
    updateFAQs(businessId: string, faqsDto: {
        faqs: any[];
    }): Promise<{
        success: boolean;
        message: string;
        faqs: any;
    }>;
    deleteFAQ(businessId: string, faqId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    importFAQsFromChat(businessId: string, importDto: {
        replaceExisting?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    updateAboutContent(businessId: string, aboutDto: any): Promise<{
        success: boolean;
        message: string;
        about: any;
    }>;
    addGalleryImageToContent(businessId: string, imageDto: any): Promise<{
        success: boolean;
        message: string;
        image: {
            id: string;
            url: any;
            thumbnail: any;
            caption: any;
            category: any;
            serviceName: any;
            isVisible: boolean;
            order: any;
        };
        totalImages: any;
    }>;
    updateGalleryImages(businessId: string, imagesDto: {
        images: any[];
    }): Promise<{
        success: boolean;
        message: string;
        images: any;
    }>;
    deleteGalleryImage(businessId: string, imageId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    requestCustomDomain(context: BusinessCtx, domainDto: RequestCustomDomainDto): Promise<{
        success: boolean;
        message: string;
        domain: import("mongoose").Document<unknown, {}, import(".").CustomDomainDocument, {}, {}> & import(".").CustomDomain & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        instructions: {
            step1: string;
            step2: string;
            step3: string;
            step4: string;
        };
    }>;
    verifyDomain(businessId: string, domainId: string): Promise<{
        success: boolean;
        message: string;
        domain: import("mongoose").Document<unknown, {}, import(".").CustomDomainDocument, {}, {}> & import(".").CustomDomain & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getCustomDomains(businessId: string): Promise<{
        count: any;
        domains: any;
    }>;
    getDomain(businessId: string, domainId: string): Promise<import("mongoose").Document<unknown, {}, import(".").CustomDomainDocument, {}, {}> & import(".").CustomDomain & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createEmailTemplate(context: BusinessCtx, templateDto: CreateEmailTemplateDto): Promise<{
        success: boolean;
        message: string;
        template: import("mongoose").Document<unknown, {}, import(".").EmailTemplateDocument, {}, {}> & import(".").EmailTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getEmailTemplate(businessId: string, templateType: string): Promise<{
        isCustom: boolean;
        template: any;
    }>;
    getAllEmailTemplates(businessId: string): Promise<{
        count: any;
        templates: any;
        availableDefaults: {
            type: string;
            subject: any;
        }[];
    }>;
    updateEmailTemplate(businessId: string, templateId: string, templateDto: UpdateEmailTemplateDto): Promise<{
        success: boolean;
        message: string;
        template: import("mongoose").Document<unknown, {}, import(".").EmailTemplateDocument, {}, {}> & import(".").EmailTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    createWidget(context: BusinessCtx, widgetDto: CreateWidgetDto): Promise<{
        success: boolean;
        message: string;
        widget: {
            id: import("mongoose").Types.ObjectId;
            widgetId: string;
            name: string;
            embedCode: string;
            configuration: {
                displayType: string;
                buttonText: string;
                buttonColor: string;
                showBranding: boolean;
                allowedOrigins: string[];
            };
            styling: {
                theme: string;
                primaryColor: string;
                borderRadius: string;
                fontSize: string;
            };
        };
    }>;
    getWidget(businessId: string, widgetId: string): Promise<import("mongoose").Document<unknown, {}, import(".").BookingWidgetDocument, {}, {}> & import(".").BookingWidget & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllWidgets(businessId: string): Promise<{
        count: any;
        widgets: any;
    }>;
    updateWidget(businessId: string, widgetId: string, widgetDto: UpdateWidgetDto): Promise<{
        success: boolean;
        message: string;
        widget: import("mongoose").Document<unknown, {}, import(".").BookingWidgetDocument, {}, {}> & import(".").BookingWidget & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    trackImpression(widgetId: string): Promise<void>;
    trackConversion(widgetId: string): Promise<void>;
    getWidgetAnalytics(businessId: string, widgetId: string, startDate?: string, endDate?: string): Promise<{
        widgetId: string;
        name: string;
        analytics: {
            totalImpressions: number;
            totalConversions: number;
            conversionRate: string;
            period: {
                start: Date;
                end: Date;
            };
        };
        performance: {
            averageImpressions: number;
            averageConversions: number;
        };
    }>;
    getBrandingOverview(context: BusinessCtx): Promise<{
        theme: {
            isCustomized: boolean;
            colors: any;
            hasLogo: boolean;
            hasFavicon: boolean;
            customCssEnabled: any;
        };
        customDomains: {
            total: any;
            verified: any;
            pending: any;
            domains: any;
        };
        emailTemplates: {
            total: any;
            custom: any;
            templates: any;
        };
        widgets: {
            total: any;
            totalImpressions: any;
            totalConversions: any;
            widgets: any;
        };
        summary: {
            brandingComplete: boolean;
            setupProgress: number;
        };
    }>;
    createPreviewSession(businessId: string, previewData: CreateThemeDto): Promise<{
        expiresIn: string;
        message: string;
        previewId: string;
        previewUrl: string;
        success: boolean;
    }>;
}
