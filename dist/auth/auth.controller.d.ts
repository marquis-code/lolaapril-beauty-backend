import { Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { BusinessRegisterDto, BusinessLoginDto, GoogleAuthDto } from "./dto/business-register.dto";
import { UpdateProfileDto, ChangePasswordDto, UpdateEmailDto, UserPreferencesDto } from "./dto/update-profile.dto";
import { ForgotPasswordDto, ResetPasswordDto, VerifyResetOTPDto } from "./dto/password-reset.dto";
import { RequestWithUser } from "./types/request-with-user.interface";
import type { BusinessContext as BusinessCtx } from "./decorators/business-context.decorator";
import { SwitchBusinessDto } from "./dto/switch-business.dto";
import { AddBusinessDto } from "./dto/add-business.dto";
import { FirebaseAuthDto } from "./dto/firebase-auth.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    firebaseAuth(firebaseAuthDto: FirebaseAuthDto): Promise<any>;
    googleLogin(): Promise<void>;
    googleCallback(req: RequestWithUser, res: Response, subdomain?: string): Promise<void>;
    googleTokenAuth(googleAuthDto: GoogleAuthDto): Promise<any>;
    registerBusiness(registerDto: BusinessRegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
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
        user: any;
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
        user: any;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
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
            role: import("./schemas/user.schema").UserRole;
            status: import("./schemas/user.schema").UserStatus;
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
    addBusiness(user: RequestWithUser['user'], addBusinessDto: AddBusinessDto): Promise<{
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
            trialEndsAt: Date;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyResetOTP(verifyOTPDto: VerifyResetOTPDto): Promise<{
        valid: boolean;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
