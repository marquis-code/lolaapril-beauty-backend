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
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Model, Types } from 'mongoose';
import { Theme, ThemeDocument } from './schemas/theme.schema';
import { CustomDomain, CustomDomainDocument } from './schemas/custom-domain.schema';
import { EmailTemplate, EmailTemplateDocument } from './schemas/email-template.schema';
import { BookingWidget, BookingWidgetDocument } from './schemas/booking-widget.schema';
import { CreateThemeDto, UpdateThemeDto } from './dto/create-theme.dto';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from './dto/email-template.dto';
import { CreateWidgetDto, UpdateWidgetDto } from './dto/widget.dto';
export declare class BrandingService {
    private themeModel;
    private customDomainModel;
    private emailTemplateModel;
    private bookingWidgetModel;
    constructor(themeModel: Model<ThemeDocument>, customDomainModel: Model<CustomDomainDocument>, emailTemplateModel: Model<EmailTemplateDocument>, bookingWidgetModel: Model<BookingWidgetDocument>);
    createOrUpdateTheme(businessId: string, themeDto: CreateThemeDto): Promise<{
        success: boolean;
        message: string;
        theme: import("mongoose").Document<unknown, {}, ThemeDocument, {}, {}> & Theme & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    updateTheme(businessId: string, themeDto: UpdateThemeDto): Promise<{
        success: boolean;
        message: string;
        theme: import("mongoose").Document<unknown, {}, ThemeDocument, {}, {}> & Theme & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
        theme: import("mongoose").Document<unknown, {}, ThemeDocument, {}, {}> & Theme & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteTheme(businessId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private getDefaultTheme;
    requestCustomDomain(businessId: string, domain: string, userId: string): Promise<{
        success: boolean;
        message: string;
        domain: import("mongoose").Document<unknown, {}, CustomDomainDocument, {}, {}> & CustomDomain & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    verifyCustomDomain(businessId: string, domainId: string): Promise<{
        success: boolean;
        message: string;
        domain: import("mongoose").Document<unknown, {}, CustomDomainDocument, {}, {}> & CustomDomain & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getCustomDomains(businessId: string): Promise<{
        count: any;
        domains: any;
    }>;
    getDomain(businessId: string, domainId: string): Promise<import("mongoose").Document<unknown, {}, CustomDomainDocument, {}, {}> & CustomDomain & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteCustomDomain(businessId: string, domainId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private isValidDomain;
    private verifyDNSRecords;
    createEmailTemplate(businessId: string, templateDto: CreateEmailTemplateDto, userId: string): Promise<{
        success: boolean;
        message: string;
        template: import("mongoose").Document<unknown, {}, EmailTemplateDocument, {}, {}> & EmailTemplate & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
        template: import("mongoose").Document<unknown, {}, EmailTemplateDocument, {}, {}> & EmailTemplate & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteEmailTemplate(businessId: string, templateId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private getDefaultEmailTemplate;
    private getAvailableTemplateTypes;
    private extractVariables;
    private stripHtml;
    createBookingWidget(businessId: string, widgetDto: CreateWidgetDto, userId: string): Promise<{
        success: boolean;
        message: string;
        widget: {
            id: Types.ObjectId;
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
    getBookingWidget(businessId: string, widgetId: string): Promise<import("mongoose").Document<unknown, {}, BookingWidgetDocument, {}, {}> & BookingWidget & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
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
        widget: import("mongoose").Document<unknown, {}, BookingWidgetDocument, {}, {}> & BookingWidget & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteWidget(businessId: string, widgetId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    trackWidgetImpression(widgetId: string): Promise<void>;
    trackWidgetConversion(widgetId: string): Promise<void>;
    getWidgetAnalytics(businessId: string, widgetId: string, startDate?: Date, endDate?: Date): Promise<{
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
    private generateEmbedCode;
    private getDaysSinceCreation;
    getBrandingOverview(businessId: string): Promise<{
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
    private calculateSetupProgress;
    generateThemePreview(businessId: string, themeData: CreateThemeDto): Promise<{
        preview: boolean;
        theme: CreateThemeDto;
        previewUrl: string;
        message: string;
        expires: Date;
    }>;
    exportBrandingConfig(businessId: string): Promise<{
        exportedAt: Date;
        businessId: string;
        configuration: {
            theme: any;
            domains: any;
            templates: any;
            widgets: any;
        };
        summary: {
            brandingComplete: boolean;
            setupProgress: number;
        };
    }>;
    importBrandingConfig(businessId: string, config: any, userId: string): Promise<{
        success: boolean;
        message: string;
        results: {
            theme: any;
            domains: any[];
            templates: any[];
            widgets: any[];
        };
    }>;
}
