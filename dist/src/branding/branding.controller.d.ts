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
import { BrandingService } from './branding.service';
import { CreateThemeDto, UpdateThemeDto } from './dto/create-theme.dto';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from './dto/email-template.dto';
import { CreateWidgetDto, UpdateWidgetDto } from './dto/widget.dto';
import { RequestCustomDomainDto } from './dto/custom-domain.dto';
import type { BusinessContext as BusinessCtx } from '../auth/decorators/business-context.decorator';
export declare class BrandingController {
    private readonly brandingService;
    constructor(brandingService: BrandingService);
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
    previewTheme(businessId: string, previewData: CreateThemeDto): Promise<{
        preview: boolean;
        theme: CreateThemeDto;
        previewUrl: string;
        message: string;
        expires: Date;
    }>;
}
