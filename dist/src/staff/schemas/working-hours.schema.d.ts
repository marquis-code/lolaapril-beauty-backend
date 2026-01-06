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
export type WorkingHoursDocument = WorkingHours & Document;
export declare class TimeSlot {
    startTime: string;
    endTime: string;
    isBreak: boolean;
    breakType: string;
}
export declare class WorkingHours {
    staffId: Types.ObjectId;
    businessId: Types.ObjectId;
    date: Date;
    scheduledHours: TimeSlot[];
    actualHours: TimeSlot[];
    scheduledMinutes: number;
    actualMinutes: number;
    breakMinutes: number;
    overtimeMinutes: number;
    attendanceStatus: string;
    notes: string;
    checkedInBy: Types.ObjectId;
    checkedOutBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const WorkingHoursSchema: import("mongoose").Schema<WorkingHours, import("mongoose").Model<WorkingHours, any, any, any, Document<unknown, any, WorkingHours, any, {}> & WorkingHours & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WorkingHours, Document<unknown, {}, import("mongoose").FlatRecord<WorkingHours>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<WorkingHours> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
