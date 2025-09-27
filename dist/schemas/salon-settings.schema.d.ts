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
import type { Document } from "mongoose";
export type SalonSettingsDocument = SalonSettings & Document;
export declare class SalonSettings {
    salonName: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    description?: string;
    logo?: string;
    images: string[];
    openingTime: string;
    closingTime: string;
    workingDays: string[];
    defaultBookingDuration: number;
    bufferTime: number;
    cancellationPolicy: number;
    cancellationFeePercentage: number;
    currency: string;
    taxRate: number;
    allowOnlineBooking: boolean;
    requireEmailVerification: boolean;
    sendReminders: boolean;
    reminderHours: number;
    socialMedia: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        tiktok?: string;
    };
    paymentSettings?: {
        stripePublishableKey?: string;
        stripeSecretKey?: string;
        acceptCash?: boolean;
        acceptCard?: boolean;
        requireDeposit?: boolean;
        depositPercentage?: number;
    };
}
export declare const SalonSettingsSchema: import("mongoose").Schema<SalonSettings, import("mongoose").Model<SalonSettings, any, any, any, Document<unknown, any, SalonSettings, any, {}> & SalonSettings & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SalonSettings, Document<unknown, {}, import("mongoose").FlatRecord<SalonSettings>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<SalonSettings> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
