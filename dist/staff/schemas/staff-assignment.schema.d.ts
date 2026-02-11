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
export type StaffAssignmentDocument = StaffAssignment & Document;
export declare class AssignmentDetails {
    startTime: string;
    endTime: string;
    assignmentType: string;
    estimatedDuration: number;
    specialInstructions: string;
    serviceId: Types.ObjectId;
    serviceName: string;
    roomNumber: string;
    requiredEquipment: string[];
    clientPreferences: string;
    setupTimeMinutes: number;
    cleanupTimeMinutes: number;
}
export declare class AssignmentNotes {
    note: string;
    addedBy: Types.ObjectId;
    addedAt: Date;
    noteType: string;
}
export declare class AssignmentHistory {
    action: string;
    performedBy: Types.ObjectId;
    performedAt: Date;
    reason: string;
    previousValue: string;
    newValue: string;
}
export declare class StaffAssignment {
    staffId: Types.ObjectId;
    businessId: Types.ObjectId;
    appointmentId: Types.ObjectId;
    clientId: Types.ObjectId;
    assignmentDate: Date;
    assignmentDetails: AssignmentDetails;
    status: string;
    actualStartTime: string;
    actualEndTime: string;
    completionNotes: string;
    rating: number;
    clientFeedback: string;
    staffFeedback: string;
    assignmentMethod: string;
    assignedBy: Types.ObjectId;
    reassignmentReason: string;
    previousStaffId: Types.ObjectId;
    reassignmentCount: number;
    notes: AssignmentNotes[];
    history: AssignmentHistory[];
    servicePrice: number;
    commissionAmount: number;
    commissionType: string;
    commissionRate: number;
    commissionPaid: boolean;
    paymentDate: Date;
    checkedInAt: Date;
    checkedOutAt: Date;
    actualDurationMinutes: number;
    overtimeMinutes: number;
    breakTimeMinutes: number;
    qualityCheckCompleted: boolean;
    qualityCheckNotes: string;
    qualityCheckedBy: Types.ObjectId;
    qualityCheckDate: Date;
    reminderSent: boolean;
    reminderSentAt: Date;
    confirmationSent: boolean;
    confirmationSentAt: Date;
    followUpRequired: boolean;
    followUpDate: Date;
    followUpNotes: string;
    followUpCompleted: boolean;
    cancellationReason: string;
    cancellationDate: Date;
    cancelledBy: Types.ObjectId;
    cancellationFeeApplied: boolean;
    cancellationFeeAmount: number;
    noShowReportedAt: Date;
    noShowReportedBy: Types.ObjectId;
    noShowFeeApplied: boolean;
    noShowFeeAmount: number;
    originalDate: Date;
    originalStartTime: string;
    rescheduleReason: string;
    rescheduledAt: Date;
    rescheduledBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const StaffAssignmentSchema: import("mongoose").Schema<StaffAssignment, import("mongoose").Model<StaffAssignment, any, any, any, Document<unknown, any, StaffAssignment, any, {}> & StaffAssignment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StaffAssignment, Document<unknown, {}, import("mongoose").FlatRecord<StaffAssignment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<StaffAssignment> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
