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
export type AppointmentDocument = Appointment & Document;
export declare class BusinessInfo {
    businessId: string;
    businessName: string;
    rating: number;
    reviewCount: number;
    address: string;
}
export declare class SelectedOption {
    optionId: string;
    optionName: string;
    duration: {
        hours: number;
        minutes: number;
    };
    description: string;
    price: {
        currency: string;
        amount: number;
    };
}
export declare class AdditionalService {
    serviceId: string;
    serviceName: string;
    duration: {
        hours: number;
        minutes: number;
    };
    description: string;
    price: {
        currency: string;
        amount: number;
    };
}
export declare class SelectedService {
    serviceId: string;
    serviceName: string;
    serviceType: string;
    selectedOption: SelectedOption;
    additionalServices: AdditionalService[];
}
export declare class AppointmentDetails {
    date: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    duration: string;
}
export declare class ServiceDetails {
    serviceName: string;
    serviceDescription: string;
    price: {
        currency: string;
        amount: number;
    };
}
export declare class PaymentDetails {
    paymentMethod: string;
    subtotal: {
        currency: string;
        amount: number;
    };
    tax: {
        currency: string;
        amount: number;
        rate: number;
    };
    total: {
        currency: string;
        amount: number;
    };
    paymentStatus: {
        payNow: {
            currency: string;
            amount: number;
        };
        payAtVenue: {
            currency: string;
            amount: number;
        };
    };
}
export declare class PaymentInstructions {
    paymentUrl: string;
    confirmationPolicy: string;
}
export declare class Appointment {
    clientId: Types.ObjectId;
    businessInfo: BusinessInfo;
    selectedServices: SelectedService[];
    totalDuration: {
        hours: number;
        minutes: number;
    };
    selectedDate: Date;
    selectedTime: string;
    appointmentDetails: AppointmentDetails;
    serviceDetails: ServiceDetails;
    paymentDetails: PaymentDetails;
    paymentInstructions: PaymentInstructions;
    customerNotes: string;
    status: string;
    assignedStaff: Types.ObjectId;
    cancellationReason: string;
    cancellationDate: Date;
    checkInTime: Date;
    checkOutTime: Date;
    actualStartTime: Date;
    actualEndTime: Date;
    appointmentNumber: string;
    reminderSent: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const AppointmentSchema: import("mongoose").Schema<Appointment, import("mongoose").Model<Appointment, any, any, any, Document<unknown, any, Appointment, any, {}> & Appointment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Appointment, Document<unknown, {}, import("mongoose").FlatRecord<Appointment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Appointment> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
