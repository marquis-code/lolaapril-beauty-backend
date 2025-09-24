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
import { Types, Document } from "mongoose";
export type TeamMemberDocument = TeamMember & Document;
export declare enum TeamRole {
    ADMIN = "admin",
    MANAGER = "manager",
    STYLIST = "stylist",
    THERAPIST = "therapist",
    RECEPTIONIST = "receptionist",
    CLEANER = "cleaner"
}
export declare enum TeamStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    ON_LEAVE = "on_leave"
}
export declare enum EmploymentType {
    FULL_TIME = "full_time",
    PART_TIME = "part_time",
    CONTRACT = "contract",
    FREELANCE = "freelance"
}
export declare enum CommissionType {
    PERCENTAGE = "percentage",
    FIXED = "fixed"
}
export declare class WorkingHours {
    day: string;
    startTime: string;
    endTime: string;
    isWorking: boolean;
}
export declare const WorkingHoursSchema: import("mongoose").Schema<WorkingHours, import("mongoose").Model<WorkingHours, any, any, any, Document<unknown, any, WorkingHours, any> & WorkingHours & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WorkingHours, Document<unknown, {}, import("mongoose").FlatRecord<WorkingHours>, {}> & import("mongoose").FlatRecord<WorkingHours> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Skills {
    services: Types.ObjectId[];
    specializations: string[];
    experienceLevel: string;
}
export declare const SkillsSchema: import("mongoose").Schema<Skills, import("mongoose").Model<Skills, any, any, any, Document<unknown, any, Skills, any> & Skills & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Skills, Document<unknown, {}, import("mongoose").FlatRecord<Skills>, {}> & import("mongoose").FlatRecord<Skills> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Commission {
    serviceId: Types.ObjectId;
    serviceName: string;
    commissionType: string;
    commissionValue: number;
}
export declare const CommissionSchema: import("mongoose").Schema<Commission, import("mongoose").Model<Commission, any, any, any, Document<unknown, any, Commission, any> & Commission & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Commission, Document<unknown, {}, import("mongoose").FlatRecord<Commission>, {}> & import("mongoose").FlatRecord<Commission> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class TeamMember {
    firstName: string;
    lastName: string;
    email: string;
    phone: {
        countryCode: string;
        number: string;
    };
    role: string;
    employmentType: string;
    hireDate: Date;
    salary: number;
    workingHours: WorkingHours[];
    skills: Skills;
    commissions: Commission[];
    profileImage: string;
    bio: string;
    isActive: boolean;
    canBookOnline: boolean;
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const TeamMemberSchema: import("mongoose").Schema<TeamMember, import("mongoose").Model<TeamMember, any, any, any, Document<unknown, any, TeamMember, any> & TeamMember & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TeamMember, Document<unknown, {}, import("mongoose").FlatRecord<TeamMember>, {}> & import("mongoose").FlatRecord<TeamMember> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
