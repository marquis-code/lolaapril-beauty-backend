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
import { Document, Types, Schema as MongooseSchema } from "mongoose";
export type BookingDocument = Booking & Document;
export declare class BookingSource {
    sourceType: string;
    sourceIdentifier: string;
    referralCode: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    trackedAt: Date;
    ipAddress: string;
    userAgent: string;
}
export declare class CommissionInfo {
    isCommissionable: boolean;
    commissionRate: number;
    commissionAmount: number;
    commissionReason: string;
    calculatedAt: Date;
}
export declare class BookedService {
    serviceId: Types.ObjectId;
    serviceName: string;
    duration: number;
    bufferTime: number;
    price: number;
}
export declare class BookingMetadata {
    userAgent: string;
    ipAddress: string;
    referrer: string;
    platform: string;
}
export declare class Booking {
    requiresDeposit: boolean;
    depositAmount: number;
    depositPaid: boolean;
    depositTransactionId: string;
    depositReason: string;
    remainingAmount: number;
    bookingSource: BookingSource;
    commissionInfo: CommissionInfo;
    firstTimeClient: boolean;
    clientReliabilityScore: number;
    commissionPreview: any;
    clientId: Types.ObjectId;
    businessId: Types.ObjectId;
    totalBufferTime: number;
    bookingNumber: string;
    services: BookedService[];
    preferredDate: Date;
    preferredStartTime: string;
    estimatedEndTime: string;
    totalDuration: number;
    estimatedTotal: number;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    businessName: string;
    businessPhone: string;
    specialRequests: string;
    bookingNotes?: string;
    status: string;
    cancellationReason: string;
    rejectionReason: string;
    cancellationDate: Date;
    expiresAt: Date;
    processedBy: Types.ObjectId;
    appointmentId: Types.ObjectId;
    metadata: BookingMetadata;
    remindersSent: number;
    lastReminderAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BookingSchema: MongooseSchema<Booking, import("mongoose").Model<Booking, any, any, any, Document<unknown, any, Booking, any, {}> & Booking & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Booking, Document<unknown, {}, import("mongoose").FlatRecord<Booking>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Booking> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
