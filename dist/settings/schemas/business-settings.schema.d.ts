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
import { Document } from "mongoose";
export type BusinessSettingsDocument = BusinessSettings & Document;
export interface BusinessHours {
    day: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
}
export interface AppointmentStatus {
    statusName: string;
    statusIcon: string;
    statusColor: string;
    characterLimit?: number;
    isActive: boolean;
}
export interface CancellationReason {
    name: string;
    reasonType: "client_initiated" | "business_initiated" | "external_factors";
    isActive: boolean;
}
export interface Resource {
    name: string;
    description: string;
    isActive: boolean;
}
export interface BlockedTimeType {
    type: string;
    typeIcon: string;
    duration: string;
    compensation: "Paid" | "Unpaid";
    isActive: boolean;
}
export interface PaymentMethod {
    name: string;
    paymentType: "cash" | "credit_card" | "debit_card" | "bank_transfer" | "digital_wallet";
    enabled: boolean;
}
export interface ServiceCharge {
    basicInfo: {
        name: string;
        description: string;
    };
    settings: {
        applyServiceChargeOn: string;
        automaticallyApplyDuringCheckout: boolean;
    };
    rateType: {
        type: "Flat rate" | "Percentage" | "Both";
        amount?: {
            currency: string;
            value: number;
        };
        percentage?: number;
        flatRate?: {
            currency: string;
            value: number;
        };
    };
    taxRate: {
        tax: string;
        rate: number;
    };
    isActive: boolean;
}
export interface Tax {
    taxName: string;
    taxRate: number;
    isActive: boolean;
}
export interface ClosedPeriod {
    startDate: string;
    endDate: string;
    description: string;
    businessClosed: boolean;
    onlineBookingBlocked: boolean;
}
export declare class BusinessSettings {
    businessName: string;
    businessEmail: string;
    businessPhone: {
        countryCode: string;
        number: string;
    };
    businessAddress: {
        street: string;
        city: string;
        region: string;
        postcode: string;
        country: string;
    };
    businessHours: BusinessHours[];
    appointmentStatuses: AppointmentStatus[];
    cancellationReasons: CancellationReason[];
    resources: Resource[];
    blockedTimeTypes: BlockedTimeType[];
    paymentMethods: PaymentMethod[];
    serviceCharges: ServiceCharge[];
    taxes: Tax[];
    closedPeriods: ClosedPeriod[];
    defaultCurrency: string;
    timezone: string;
    defaultAppointmentDuration: number;
    bookingWindowHours: number;
    allowOnlineBooking: boolean;
    requireClientConfirmation: boolean;
}
export declare const BusinessSettingsSchema: import("mongoose").Schema<BusinessSettings, import("mongoose").Model<BusinessSettings, any, any, any, Document<unknown, any, BusinessSettings, any, {}> & BusinessSettings & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BusinessSettings, Document<unknown, {}, import("mongoose").FlatRecord<BusinessSettings>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<BusinessSettings> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
