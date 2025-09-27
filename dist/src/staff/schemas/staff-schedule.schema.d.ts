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
export type StaffScheduleDocument = StaffSchedule & Document;
export declare class TimeSlot {
    startTime: string;
    endTime: string;
    isBreak: boolean;
    breakType?: string;
}
export declare class DailySchedule {
    dayOfWeek: number;
    isWorkingDay: boolean;
    workingHours: TimeSlot[];
    breaks: TimeSlot[];
    maxHoursPerDay: number;
}
export declare class StaffSchedule {
    staffId: Types.ObjectId;
    businessId: Types.ObjectId;
    effectiveDate: Date;
    endDate: Date;
    weeklySchedule: DailySchedule[];
    scheduleType: string;
    reason: string;
    isActive: boolean;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const StaffScheduleSchema: import("mongoose").Schema<StaffSchedule, import("mongoose").Model<StaffSchedule, any, any, any, Document<unknown, any, StaffSchedule, any, {}> & StaffSchedule & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StaffSchedule, Document<unknown, {}, import("mongoose").FlatRecord<StaffSchedule>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<StaffSchedule> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
