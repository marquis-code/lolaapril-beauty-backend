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
export type ScheduledReminderDocument = ScheduledReminder & Document;
export declare class ScheduledReminder {
    type: string;
    userId: Types.ObjectId;
    userEmail: string;
    userName: string;
    businessId: Types.ObjectId;
    businessName: string;
    appointmentId: Types.ObjectId;
    serviceName: string;
    scheduledFor: Date;
    sent: boolean;
    sentAt: Date;
    retries: number;
    error: string;
}
export declare const ScheduledReminderSchema: import("mongoose").Schema<ScheduledReminder, import("mongoose").Model<ScheduledReminder, any, any, any, Document<unknown, any, ScheduledReminder, any, {}> & ScheduledReminder & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ScheduledReminder, Document<unknown, {}, import("mongoose").FlatRecord<ScheduledReminder>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ScheduledReminder> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
