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
import { CreateThemeDto } from './dto/create-theme.dto';
export declare class BrandingController {
    private readonly brandingService;
    constructor(brandingService: BrandingService);
    createOrUpdateTheme(tenantId: string, themeDto: CreateThemeDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/theme.schema").ThemeDocument, {}, {}> & import("./schemas/theme.schema").Theme & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getTheme(tenantId: string): Promise<{
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
    }>;
    requestCustomDomain(tenantId: string, domain: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/custom-domain.schema").CustomDomainDocument, {}, {}> & import("./schemas/custom-domain.schema").CustomDomain & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    verifyDomain(domainId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/custom-domain.schema").CustomDomainDocument, {}, {}> & import("./schemas/custom-domain.schema").CustomDomain & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getCustomDomains(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/custom-domain.schema").CustomDomainDocument, {}, {}> & import("./schemas/custom-domain.schema").CustomDomain & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createEmailTemplate(tenantId: string, body: {
        templateType: string;
        subject: string;
        htmlContent: string;
        textContent?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/email-template.schema").EmailTemplateDocument, {}, {}> & import("./schemas/email-template.schema").EmailTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getEmailTemplate(tenantId: string, templateType: string): Promise<any>;
    createWidget(tenantId: string, body: {
        configuration: any;
        styling: any;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/booking-widget.schema").BookingWidgetDocument, {}, {}> & import("./schemas/booking-widget.schema").BookingWidget & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getWidget(tenantId: string, widgetId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/booking-widget.schema").BookingWidgetDocument, {}, {}> & import("./schemas/booking-widget.schema").BookingWidget & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    trackImpression(widgetId: string): Promise<void>;
    trackConversion(widgetId: string): Promise<void>;
}
