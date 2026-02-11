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
import { Document, Types } from "mongoose";
export type BusinessDocument = Business & Document;
export declare class BusinessAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
}
export declare class BusinessContact {
    primaryPhone: string;
    secondaryPhone: string;
    email: string;
    website: string;
    socialMedia: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        tiktok?: string;
    };
}
export declare class BusinessSettings {
    timezone: string;
    currency: string;
    language: string;
    defaultAppointmentDuration: number;
    bufferTimeBetweenAppointments: number;
    cancellationPolicyHours: number;
    advanceBookingDays: number;
    allowOnlineBooking: boolean;
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
    taxRate: number;
    serviceCharge: number;
    notificationSettings: {
        booking_confirmation: boolean;
        payment_reminders: boolean;
        appointment_reminders: boolean;
        marketing: boolean;
    };
}
export declare class BusinessHours {
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    breaks: Array<{
        openTime: string;
        closeTime: string;
    }>;
}
export declare class Business {
    businessName: string;
    subdomain: string;
    businessDescription: string;
    businessType: string;
    logo: string;
    images: string[];
    address: BusinessAddress;
    contact: BusinessContact;
    settings: BusinessSettings;
    businessHours: BusinessHours[];
    ownerId: Types.ObjectId;
    adminIds: Types.ObjectId[];
    staffIds: Types.ObjectId[];
    status: string;
    trialEndsAt: Date;
    activeSubscription: Types.ObjectId;
    businessDocuments: {
        businessRegistration?: {
            number?: string;
            documentUrl?: string;
            uploadedAt?: Date;
        };
        taxIdentification?: {
            number?: string;
            documentUrl?: string;
            uploadedAt?: Date;
        };
        proofOfAddress?: {
            documentUrl?: string;
            uploadedAt?: Date;
        };
        governmentId?: {
            type?: string;
            number?: string;
            documentUrl?: string;
            uploadedAt?: Date;
        };
        bankAccount?: {
            accountName?: string;
            accountNumber?: string;
            bankName?: string;
            bankCode?: string;
            bankStatementUrl?: string;
        };
        kycStatus?: string;
        kycVerifiedAt?: Date;
        kycVerifiedBy?: Types.ObjectId;
        rejectionReason?: string;
    };
    paymentSettings: {
        paystackSubaccountCode?: string;
        paystackRecipientCode?: string;
        percentageCharge?: number;
        subaccountCreatedAt?: Date;
    };
    totalAppointments: number;
    totalRevenue: number;
    totalClients: number;
    averageRating: number;
    totalReviews: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BusinessSchema: import("mongoose").Schema<Business, import("mongoose").Model<Business, any, any, any, Document<unknown, any, Business, any, {}> & Business & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Business, Document<unknown, {}, import("mongoose").FlatRecord<Business>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Business> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
