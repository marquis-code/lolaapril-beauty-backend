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
import type { Document } from "mongoose";
export type TeamMemberDocument = TeamMember & Document;
export declare class WorkingHours {
    day: string;
    startTime: string;
    endTime: string;
    isWorking: boolean;
}
export declare class Skills {
    services: string[];
    specializations: string[];
    experienceLevel: string;
}
export declare class Commission {
    serviceId: string;
    serviceName: string;
    commissionType: string;
    commissionValue: number;
}
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TeamMember, Document<unknown, {}, import("mongoose").FlatRecord<TeamMember>, {}> & import("mongoose").FlatRecord<TeamMember> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
