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
export type AvailabilityDocument = Availability & Document;
export declare enum DayOfWeek {
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday",
    SUNDAY = "sunday"
}
export declare class Availability {
    staffId: Types.ObjectId;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    breakStartTime?: string;
    breakEndTime?: string;
    notes?: string;
}
export declare const AvailabilitySchema: import("mongoose").Schema<Availability, import("mongoose").Model<Availability, any, any, any, Document<unknown, any, Availability, any, {}> & Availability & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Availability, Document<unknown, {}, import("mongoose").FlatRecord<Availability>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Availability> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
