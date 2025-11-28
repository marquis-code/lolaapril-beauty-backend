import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { BusinessRegisterDto, BusinessLoginDto, GoogleAuthDto } from "./dto/business-register.dto";
interface RequestWithUser extends Request {
    user: {
        sub: string;
        email: string;
        role: string;
        businessId?: string;
        subdomain?: string;
        [key: string]: any;
    };
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerBusiness(registerDto: BusinessRegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: unknown;
            firstName: string;
            lastName: string;
            email: string;
            role: import("./schemas/user.schema").UserRole;
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
            role: import("./schemas/user.schema").UserRole;
            status: import("./schemas/user.schema").UserStatus.ACTIVE;
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
    googleAuth(googleAuthDto: GoogleAuthDto): Promise<any>;
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: unknown;
            firstName: string;
            lastName: string;
            email: string;
            role: import("./schemas/user.schema").UserRole;
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
            role: import("./schemas/user.schema").UserRole;
            status: import("./schemas/user.schema").UserStatus.ACTIVE;
        };
    }>;
    logout(req: RequestWithUser): Promise<{
        message: string;
    }>;
    getProfile(req: RequestWithUser): Promise<any>;
    refreshTokens(body: {
        userId: string;
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
export {};
