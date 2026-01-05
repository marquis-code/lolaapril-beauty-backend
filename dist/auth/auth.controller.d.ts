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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { BusinessRegisterDto, BusinessLoginDto, GoogleAuthDto } from "./dto/business-register.dto";
import { UpdateProfileDto, ChangePasswordDto, UpdateEmailDto, UserPreferencesDto } from "./dto/update-profile.dto";
import { RequestWithUser } from "./types/request-with-user.interface";
import type { BusinessContext as BusinessCtx } from "./decorators/business-context.decorator";
import { SwitchBusinessDto } from "./dto/switch-business.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleLogin(): Promise<void>;
    googleCallback(req: RequestWithUser, res: Response, subdomain?: string): Promise<void>;
    googleTokenAuth(googleAuthDto: GoogleAuthDto): Promise<any>;
    registerBusiness(registerDto: BusinessRegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: import(".").UserRole;
            status: import(".").UserStatus;
        };
        business: {
            id: import("mongoose").Types.ObjectId;
            businessName: string;
            subdomain: string;
            businessType: string;
            status: string;
            trialEndsAt: Date;
        };
    }>;
    loginBusiness(loginDto: BusinessLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: import(".").UserRole;
            status: import(".").UserStatus.ACTIVE;
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
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: import(".").UserRole;
            status: import(".").UserStatus;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: import(".").UserRole;
            status: import(".").UserStatus.ACTIVE;
            authProvider: string;
        };
    }>;
    logout(user: RequestWithUser['user']): Promise<{
        message: string;
    }>;
    getProfile(user: RequestWithUser['user']): Promise<any>;
    refreshTokens(body: {
        userId: string;
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateProfile(user: RequestWithUser['user'], updateProfileDto: UpdateProfileDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            role: import(".").UserRole;
            status: import(".").UserStatus;
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
    updatePreferences(user: RequestWithUser['user'], preferences: UserPreferencesDto): Promise<{
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
    changePassword(user: RequestWithUser['user'], changePasswordDto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateEmail(user: RequestWithUser['user'], updateEmailDto: UpdateEmailDto): Promise<{
        success: boolean;
        message: string;
        newEmail: string;
    }>;
    deleteAccount(user: RequestWithUser['user'], body: {
        password?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getBusinessContext(context: BusinessCtx): Promise<{
        message: string;
        businessId: string;
        subdomain: string;
        userId: string;
        userEmail: string;
        userRole: string;
    }>;
    getBusinessInfo(businessId: string): Promise<{
        message: string;
        businessId: string;
    }>;
    switchBusiness(user: RequestWithUser['user'], switchBusinessDto: SwitchBusinessDto): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
        message: string;
        business: {
            id: import("mongoose").Types.ObjectId;
            businessName: string;
            subdomain: string;
            businessType: string;
            status: string;
        };
    }>;
    getUserBusinesses(user: RequestWithUser['user']): Promise<{
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
        currentBusinessId: import("mongoose").Types.ObjectId;
    }>;
    clearBusinessContext(user: RequestWithUser['user']): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
        message: string;
    }>;
}
