"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const business_register_dto_1 = require("./dto/business-register.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const google_auth_guard_1 = require("./guards/google-auth.guard");
const business_context_decorator_1 = require("./decorators/business-context.decorator");
const switch_business_dto_1 = require("./dto/switch-business.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async googleLogin() {
    }
    async googleCallback(req, res, subdomain) {
        try {
            const result = await this.authService.handleGoogleCallback(req.user, subdomain);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
            const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
            return res.redirect(redirectUrl);
        }
        catch (error) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
            return res.redirect(`${frontendUrl}/auth/error?message=${encodeURIComponent(error.message)}`);
        }
    }
    async googleTokenAuth(googleAuthDto) {
        return this.authService.googleAuth(googleAuthDto);
    }
    async registerBusiness(registerDto) {
        return this.authService.registerBusiness(registerDto);
    }
    async loginBusiness(loginDto) {
        return this.authService.loginBusiness(loginDto);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async logout(user) {
        return this.authService.logout(user.sub);
    }
    async getProfile(user) {
        const userProfile = await this.authService.validateUser(user.sub);
        const response = { user: userProfile };
        if (user.businessId && user.subdomain) {
            response.businessContext = {
                businessId: user.businessId,
                subdomain: user.subdomain,
            };
        }
        return response;
    }
    async refreshTokens(body) {
        return this.authService.refreshTokens(body.userId, body.refreshToken);
    }
    async updateProfile(user, updateProfileDto) {
        return this.authService.updateProfile(user.sub, updateProfileDto);
    }
    async updatePreferences(user, preferences) {
        return this.authService.updatePreferences(user.sub, preferences);
    }
    async changePassword(user, changePasswordDto) {
        return this.authService.changePassword(user.sub, changePasswordDto);
    }
    async updateEmail(user, updateEmailDto) {
        return this.authService.updateEmail(user.sub, updateEmailDto);
    }
    async deleteAccount(user, body) {
        return this.authService.deleteAccount(user.sub, body.password);
    }
    async getBusinessContext(context) {
        return {
            message: 'Business context retrieved successfully',
            businessId: context.businessId,
            subdomain: context.subdomain,
            userId: context.userId,
            userEmail: context.userEmail,
            userRole: context.userRole
        };
    }
    async getBusinessInfo(businessId) {
        return {
            message: 'Business ID extracted',
            businessId
        };
    }
    async switchBusiness(user, switchBusinessDto) {
        return this.authService.switchBusiness(user.sub, switchBusinessDto.businessId);
    }
    async getUserBusinesses(user) {
        return this.authService.getUserBusinesses(user.sub);
    }
    async clearBusinessContext(user) {
        return this.authService.clearBusinessContext(user.sub);
    }
};
__decorate([
    (0, common_1.Get)("google"),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Initiate Google OAuth login" }),
    (0, swagger_1.ApiResponse)({ status: 302, description: "Redirects to Google login page" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Get)("google/callback"),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Google OAuth callback" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Google authentication successful" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('subdomain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
__decorate([
    (0, common_1.Post)("google/token"),
    (0, swagger_1.ApiOperation)({ summary: "Authenticate with Google ID Token (for mobile/SPA)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Google authentication successful" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Google authentication failed" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [business_register_dto_1.GoogleAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleTokenAuth", null);
__decorate([
    (0, common_1.Post)("business/register"),
    (0, swagger_1.ApiOperation)({ summary: "Register a new business with owner account" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Business registered successfully" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Business subdomain or user email already exists" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [business_register_dto_1.BusinessRegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerBusiness", null);
__decorate([
    (0, common_1.Post)("business/login"),
    (0, swagger_1.ApiOperation)({ summary: "Login as business owner" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Business login successful" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid credentials" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [business_register_dto_1.BusinessLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginBusiness", null);
__decorate([
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({ summary: "Register a new user" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "User registered successfully" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "User already exists" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, swagger_1.ApiOperation)({ summary: "Login user" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User logged in successfully" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid credentials" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged out successfully' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid update data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('preferences'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user preferences (language, timezone, notifications, etc.)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferences updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UserPreferencesDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change user password' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password changed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid password data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Current password is incorrect' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Patch)('email'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user email address' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid email data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Password is incorrect' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already in use' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateEmail", null);
__decorate([
    (0, common_1.Delete)('account'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user account (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Account deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Password is incorrect or unauthorized' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.Get)('business/context'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get business context (example endpoint)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business context retrieved' }),
    __param(0, (0, business_context_decorator_1.BusinessContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getBusinessContext", null);
__decorate([
    (0, common_1.Get)('business/info'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get business info using BusinessId' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getBusinessInfo", null);
__decorate([
    (0, common_1.Post)('switch-business'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Switch active business context',
        description: 'Change the current business context and get new tokens'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business context switched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized for this business' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, switch_business_dto_1.SwitchBusinessDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "switchBusiness", null);
__decorate([
    (0, common_1.Get)('businesses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all businesses user has access to',
        description: 'Returns list of businesses where user is owner, admin, or staff'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Businesses retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserBusinesses", null);
__decorate([
    (0, common_1.Post)('clear-business-context'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Clear business context (switch to client mode)',
        description: 'Remove business context from session and get new tokens'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business context cleared successfully' }),
    __param(0, (0, business_context_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "clearBusinessContext", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)("Authentication"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map