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
import { Document, Types } from 'mongoose';
export type ThemeDocument = Theme & Document;
export declare class Theme {
    tenantId: Types.ObjectId;
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
    logo?: {
        url: string;
        width: number;
        height: number;
        alt: string;
    };
    favicon?: {
        url: string;
    };
    customCss: {
        enabled: boolean;
        cssCode: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const ThemeSchema: import("mongoose").Schema<Theme, import("mongoose").Model<Theme, any, any, any, Document<unknown, any, Theme, any, {}> & Theme & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Theme, Document<unknown, {}, import("mongoose").FlatRecord<Theme>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Theme> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
