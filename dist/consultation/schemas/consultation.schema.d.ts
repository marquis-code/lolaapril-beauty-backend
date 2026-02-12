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
export type ConsultationPackageDocument = ConsultationPackage & Document;
export type ConsultationBookingDocument = ConsultationBooking & Document;
export type ConsultationAvailabilityDocument = ConsultationAvailability & Document;
export declare class ConsultationPackage {
    businessId: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    duration: number;
    isActive: boolean;
}
export declare const ConsultationPackageSchema: import("mongoose").Schema<ConsultationPackage, import("mongoose").Model<ConsultationPackage, any, any, any, Document<unknown, any, ConsultationPackage, any, {}> & ConsultationPackage & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ConsultationPackage, Document<unknown, {}, import("mongoose").FlatRecord<ConsultationPackage>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ConsultationPackage> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class ConsultationBooking {
    businessId: Types.ObjectId;
    clientId: Types.ObjectId;
    packageId: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    status: string;
    paymentStatus: string;
    meetingLink: string;
    calendarEventId?: string;
    paymentReference?: string;
    reminderSentCount: number;
    thankYouSent: boolean;
    notes: string;
}
export declare const ConsultationBookingSchema: import("mongoose").Schema<ConsultationBooking, import("mongoose").Model<ConsultationBooking, any, any, any, Document<unknown, any, ConsultationBooking, any, {}> & ConsultationBooking & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ConsultationBooking, Document<unknown, {}, import("mongoose").FlatRecord<ConsultationBooking>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ConsultationBooking> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare class ConsultationTimeSlot {
    startTime: string;
    endTime: string;
}
declare class ConsultationDaySchedule {
    dayOfWeek: number;
    isOpen: boolean;
    timeSlots: ConsultationTimeSlot[];
}
export declare class ConsultationAvailability {
    businessId: Types.ObjectId;
    weeklySchedule: ConsultationDaySchedule[];
}
export declare const ConsultationAvailabilitySchema: import("mongoose").Schema<ConsultationAvailability, import("mongoose").Model<ConsultationAvailability, any, any, any, Document<unknown, any, ConsultationAvailability, any, {}> & ConsultationAvailability & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ConsultationAvailability, Document<unknown, {}, import("mongoose").FlatRecord<ConsultationAvailability>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ConsultationAvailability> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
