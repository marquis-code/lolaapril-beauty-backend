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
export type BusinessHoursDocument = BusinessHours & Document;
export declare class TimeSlot {
    startTime: string;
    endTime: string;
    isBreak: boolean;
}
export declare class DaySchedule {
    dayOfWeek: number;
    isOpen: boolean;
    timeSlots: TimeSlot[];
    is24Hours: boolean;
}
export declare class BusinessHours {
    businessId: Types.ObjectId;
    weeklySchedule: DaySchedule[];
    holidays: Date[];
    specialOpenDays: Date[];
    defaultSlotDuration: number;
    bufferTime: number;
    operates24x7: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BusinessHoursSchema: import("mongoose").Schema<BusinessHours, import("mongoose").Model<BusinessHours, any, any, any, Document<unknown, any, BusinessHours, any, {}> & BusinessHours & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BusinessHours, Document<unknown, {}, import("mongoose").FlatRecord<BusinessHours>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<BusinessHours> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
