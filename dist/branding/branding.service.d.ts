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
import { CreateThemeDto } from './dto/create-theme.dto';
export declare class BrandingService {
    private themeModel;
    private customDomainModel;
    private emailTemplateModel;
    private bookingWidgetModel;
    constructor(themeModel: Model<ThemeDocument>, customDomainModel: Model<CustomDomainDocument>, emailTemplateModel: Model<EmailTemplateDocument>, bookingWidgetModel: Model<BookingWidgetDocument>);
    createOrUpdateTheme(tenantId: string, themeDto: CreateThemeDto): Promise<import("mongoose").Document<unknown, {}, ThemeDocument, {}, {}> & Theme & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
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
    private getDefaultTheme;
    requestCustomDomain(tenantId: string, domain: string): Promise<import("mongoose").Document<unknown, {}, CustomDomainDocument, {}, {}> & CustomDomain & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    verifyCustomDomain(domainId: string): Promise<import("mongoose").Document<unknown, {}, CustomDomainDocument, {}, {}> & CustomDomain & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getCustomDomains(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, CustomDomainDocument, {}, {}> & CustomDomain & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createEmailTemplate(tenantId: string, templateType: string, subject: string, htmlContent: string, textContent?: string): Promise<import("mongoose").Document<unknown, {}, EmailTemplateDocument, {}, {}> & EmailTemplate & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getEmailTemplate(tenantId: string, templateType: string): Promise<any>;
    private getDefaultEmailTemplate;
    private extractVariables;
    private stripHtml;
    createBookingWidget(tenantId: string, configuration: any, styling: any): Promise<import("mongoose").Document<unknown, {}, BookingWidgetDocument, {}, {}> & BookingWidget & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getBookingWidget(tenantId: string, widgetId: string): Promise<import("mongoose").Document<unknown, {}, BookingWidgetDocument, {}, {}> & BookingWidget & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    trackWidgetImpression(widgetId: string): Promise<void>;
    trackWidgetConversion(widgetId: string): Promise<void>;
    private generateEmbedCode;
}
