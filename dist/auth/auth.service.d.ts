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
import { Model, Types } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User, UserDocument, UserRole, UserStatus } from "./schemas/user.schema";
import { BusinessDocument } from "../business/schemas/business.schema";
import { SubscriptionDocument } from "../business/schemas/subscription.schema";
import { RegisterDto } from "./dto/register.dto";
import { UpdateEmailDto } from "./dto/update-profile.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateProfileDto, ChangePasswordDto } from "./dto/update-profile.dto";
import { BusinessRegisterDto, BusinessLoginDto, GoogleAuthDto } from "./dto/business-register.dto";
import { AddBusinessDto } from "./dto/add-business.dto";
export declare class AuthService {
    private userModel;
    private businessModel;
    private subscriptionModel;
    private jwtService;
    private configService;
    private googleClient;
    constructor(userModel: Model<UserDocument>, businessModel: Model<BusinessDocument>, subscriptionModel: Model<SubscriptionDocument>, jwtService: JwtService, configService: ConfigService);
    registerBusiness(registerDto: BusinessRegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            status: UserStatus;
        };
        business: {
            id: Types.ObjectId;
            businessName: string;
            subdomain: string;
            businessType: string;
            status: string;
            trialEndsAt: Date;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            status: UserStatus;
        };
    }>;
    handleGoogleCallback(googleUser: any, subdomain?: string): Promise<any>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    validateUser(userId: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private createTrialSubscription;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            status: UserStatus.ACTIVE;
            authProvider: string;
        };
    }>;
    googleAuth(googleAuthDto: GoogleAuthDto): Promise<any>;
    loginBusiness(loginDto: BusinessLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            status: UserStatus.ACTIVE;
        };
        business: {
            id: any;
            businessName: any;
            subdomain: any;
            businessType: any;
            status: any;
            trialEndsAt: any;
            subscription: any;
        };
        businesses: {
            id: any;
            businessName: any;
            subdomain: any;
            status: any;
        }[];
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            role: UserRole;
            status: UserStatus;
            profileImage: string;
            bio: string;
            dateOfBirth: Date;
            gender: string;
            emailVerified: boolean;
            phoneVerified: boolean;
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
        };
    }>;
    updatePreferences(userId: string, preferences: any): Promise<{
        success: boolean;
        message: string;
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
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateEmail(userId: string, updateEmailDto: UpdateEmailDto): Promise<{
        success: boolean;
        message: string;
        newEmail: string;
    }>;
    deleteAccount(userId: string, password?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    switchBusiness(userId: string, businessId: string): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
        message: string;
        business: {
            id: Types.ObjectId;
            businessName: string;
            subdomain: string;
            businessType: string;
            status: string;
        };
    }>;
    getUserBusinesses(userId: string): Promise<{
        businesses: {
            id: any;
            businessName: any;
            subdomain: any;
            businessType: any;
            status: any;
            trialEndsAt: any;
            isOwner: boolean;
            isCurrent: boolean;
        }[];
        currentBusinessId: Types.ObjectId;
    }>;
    clearBusinessContext(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
        message: string;
    }>;
    addBusinessToUser(userId: string, addBusinessDto: AddBusinessDto): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
        message: string;
        business: {
            id: Types.ObjectId;
            businessName: string;
            subdomain: string;
            businessType: string;
            status: string;
            trialEndsAt: Date;
        };
    }>;
}
