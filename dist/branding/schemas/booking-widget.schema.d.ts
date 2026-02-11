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
export type BookingWidgetDocument = BookingWidget & Document;
export declare class BookingWidget {
    tenantId: Types.ObjectId;
    widgetId: string;
    name: string;
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
    embedCode: string;
    impressions: number;
    conversions: number;
    isActive: boolean;
    createdBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BookingWidgetSchema: import("mongoose").Schema<BookingWidget, import("mongoose").Model<BookingWidget, any, any, any, Document<unknown, any, BookingWidget, any, {}> & BookingWidget & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BookingWidget, Document<unknown, {}, import("mongoose").FlatRecord<BookingWidget>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<BookingWidget> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
