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
export type UserDocument = User & Document;
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    BUSINESS_OWNER = "business_owner",
    BUSINESS_ADMIN = "business_admin",
    STAFF = "staff",
    CLIENT = "client"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING_VERIFICATION = "pending_verification"
}
export declare class User {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password?: string;
    role: UserRole;
    status: UserStatus;
    ownedBusinesses: Types.ObjectId[];
    adminBusinesses: Types.ObjectId[];
    staffBusinessId?: Types.ObjectId;
    currentBusinessId?: Types.ObjectId;
    profileImage?: string;
    bio?: string;
    dateOfBirth?: Date;
    gender?: string;
    lastLogin?: Date;
    emailVerified: boolean;
    phoneVerified: boolean;
    emailVerificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    refreshToken?: string;
    googleId?: string;
    facebookId?: string;
    authProvider: string;
    preferences: {
        language: string;
        timezone: string;
        currency: string;
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
