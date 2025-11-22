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
import { TimeSlot } from "./business-hours.schema";
export type StaffAvailabilityDocument = StaffAvailability & Document;
export declare class StaffAvailability {
    staffId: Types.ObjectId;
    businessId: Types.ObjectId;
    date: Date;
    availableSlots: TimeSlot[];
    blockedSlots: TimeSlot[];
    status: string;
    reason: string;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const StaffAvailabilitySchema: import("mongoose").Schema<StaffAvailability, import("mongoose").Model<StaffAvailability, any, any, any, Document<unknown, any, StaffAvailability, any, {}> & StaffAvailability & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StaffAvailability, Document<unknown, {}, import("mongoose").FlatRecord<StaffAvailability>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<StaffAvailability> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
