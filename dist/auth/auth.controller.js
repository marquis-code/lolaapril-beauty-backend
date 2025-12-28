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
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const google_auth_guard_1 = require("./guards/google-auth.guard");
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
    async logout(req) {
        return this.authService.logout(req.user.sub);
    }
    async getProfile(req) {
        const user = await this.authService.validateUser(req.user.sub);
        const response = { user };
        if (req.user.businessId) {
            response.businessContext = {
                businessId: req.user.businessId,
                subdomain: req.user.subdomain,
            };
        }
        return response;
    }
    async refreshTokens(body) {
        return this.authService.refreshTokens(body.userId, body.refreshToken);
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged out successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
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
AuthController = __decorate([
    (0, swagger_1.ApiTags)("Authentication"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map