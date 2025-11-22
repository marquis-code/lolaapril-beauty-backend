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
import { User, UserDocument, UserRole } from "./schemas/user.schema";
import { BusinessDocument } from "../tenant/schemas/business.schema";
import { SubscriptionDocument } from "../tenant/schemas/subscription.schema";
import { TenantConfigDocument } from "../tenant/schemas/tenant-config.schema";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { BusinessRegisterDto, BusinessLoginDto, GoogleAuthDto } from "./dto/business-register.dto";
export declare class AuthService {
    private userModel;
    private businessModel;
    private subscriptionModel;
    private tenantConfigModel;
    private jwtService;
    private configService;
    private googleClient;
    constructor(userModel: Model<UserDocument>, businessModel: Model<BusinessDocument>, subscriptionModel: Model<SubscriptionDocument>, tenantConfigModel: Model<TenantConfigDocument>, jwtService: JwtService, configService: ConfigService);
    registerBusiness(registerDto: BusinessRegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: unknown;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            status: import("./schemas/user.schema").UserStatus;
        };
        business: {
            id: unknown;
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
            id: unknown;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            status: import("./schemas/user.schema").UserStatus.ACTIVE;
        };
        business: {
            id: unknown;
            businessName: string;
            subdomain: string;
            businessType: string;
            status: string;
            trialEndsAt: Date;
            subscription: Types.ObjectId;
        };
        businesses: {
            id: unknown;
            businessName: string;
            subdomain: string;
            status: string;
        }[];
    }>;
    googleAuth(googleAuthDto: GoogleAuthDto): Promise<any>;
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: unknown;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            status: import("./schemas/user.schema").UserStatus;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: unknown;
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            status: import("./schemas/user.schema").UserStatus.ACTIVE;
        };
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    validateUser(userId: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    private createTrialSubscription;
    private createDefaultTenantConfig;
}
