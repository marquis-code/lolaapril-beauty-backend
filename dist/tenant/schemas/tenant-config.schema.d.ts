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
import { type Document, Types } from "mongoose";
export type TenantConfigDocument = TenantConfig & Document;
export declare class TenantConfig {
    businessId: Types.ObjectId;
    brandColors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    typography: {
        fontFamily: string;
        fontSize: string;
        headerFont: string;
    };
    customization: {
        showBusinessLogo: boolean;
        showPoweredBy: boolean;
        customCSS?: string;
        favicon?: string;
    };
    integrations: {
        emailProvider: string;
        emailConfig?: {
            apiKey?: string;
            host?: string;
            port?: number;
            username?: string;
            password?: string;
            fromEmail?: string;
            fromName?: string;
        };
        smsProvider: string;
        smsConfig?: {
            apiKey?: string;
            apiSecret?: string;
            senderId?: string;
        };
        paymentProvider: string;
        paymentConfig?: {
            publicKey?: string;
            secretKey?: string;
            webhookSecret?: string;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const TenantConfigSchema: import("mongoose").Schema<TenantConfig, import("mongoose").Model<TenantConfig, any, any, any, Document<unknown, any, TenantConfig, any, {}> & TenantConfig & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TenantConfig, Document<unknown, {}, import("mongoose").FlatRecord<TenantConfig>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<TenantConfig> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
