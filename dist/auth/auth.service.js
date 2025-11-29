"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const user_schema_1 = require("./schemas/user.schema");
const business_schema_1 = require("../tenant/schemas/business.schema");
const subscription_schema_1 = require("../tenant/schemas/subscription.schema");
const tenant_config_schema_1 = require("../tenant/schemas/tenant-config.schema");
const google_auth_library_1 = require("google-auth-library");
let AuthService = class AuthService {
    constructor(userModel, businessModel, subscriptionModel, tenantConfigModel, jwtService, configService) {
        this.userModel = userModel;
        this.businessModel = businessModel;
        this.subscriptionModel = subscriptionModel;
        this.tenantConfigModel = tenantConfigModel;
        this.jwtService = jwtService;
        this.configService = configService;
        this.googleClient = new google_auth_library_1.OAuth2Client(this.configService.get("GOOGLE_CLIENT_ID"));
    }
    async registerBusiness(registerDto) {
        const { owner, businessName, subdomain, businessType, businessDescription, address, contact } = registerDto;
        const existingBusiness = await this.businessModel.findOne({ subdomain });
        if (existingBusiness) {
            throw new common_1.ConflictException("Subdomain already taken");
        }
        const existingUser = await this.userModel.findOne({ email: owner.email });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const hashedPassword = await bcrypt.hash(owner.password, 12);
        const user = new this.userModel({
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email,
            phone: owner.phone,
            password: hashedPassword,
            role: user_schema_1.UserRole.BUSINESS_OWNER,
            status: "active",
            authProvider: "local",
        });
        const savedUser = await user.save();
        const business = new this.businessModel({
            businessName,
            subdomain,
            businessType,
            businessDescription,
            address,
            contact,
            ownerId: savedUser._id,
            status: "trial",
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        });
        const savedBusiness = await business.save();
        await this.userModel.findByIdAndUpdate(savedUser._id, {
            $push: { ownedBusinesses: savedBusiness._id },
            currentBusinessId: savedBusiness._id,
        });
        await this.createTrialSubscription(savedBusiness._id.toString());
        await this.createDefaultTenantConfig(savedBusiness._id.toString());
        const tokens = await this.generateTokens(savedUser._id.toString(), savedUser.email, savedUser.role, savedBusiness._id.toString(), subdomain);
        await this.userModel.findByIdAndUpdate(savedUser._id, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        });
        return Object.assign({ user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                role: savedUser.role,
                status: savedUser.status,
            }, business: {
                id: savedBusiness._id,
                businessName: savedBusiness.businessName,
                subdomain: savedBusiness.subdomain,
                businessType: savedBusiness.businessType,
                status: savedBusiness.status,
                trialEndsAt: savedBusiness.trialEndsAt,
            } }, tokens);
    }
    async register(registerDto) {
        const { email, password } = registerDto, userData = __rest(registerDto, ["email", "password"]);
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new this.userModel(Object.assign(Object.assign({}, userData), { email, password: hashedPassword, authProvider: "local" }));
        await user.save();
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        await this.userModel.findByIdAndUpdate(user._id, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        });
        return Object.assign({ user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
            } }, tokens);
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.userModel.findById(userId);
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException("Access denied");
        }
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.UnauthorizedException("Access denied");
        }
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        await this.userModel.findByIdAndUpdate(user._id, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        });
        return tokens;
    }
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: null,
        });
        return { message: "Logged out successfully" };
    }
    async generateTokens(userId, email, role, businessId, subdomain) {
        const payload = { sub: userId, email, role };
        if (businessId) {
            payload.businessId = businessId;
        }
        if (subdomain) {
            payload.subdomain = subdomain;
        }
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: "15m",
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: "7d",
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async validateUser(userId) {
        return await this.userModel.findById(userId).select("-password -refreshToken");
    }
    async createTrialSubscription(businessId) {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
        const subscription = new this.subscriptionModel({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            planType: "trial",
            planName: "Trial Plan",
            monthlyPrice: 0,
            yearlyPrice: 0,
            billingCycle: "monthly",
            startDate,
            endDate,
            nextBillingDate: endDate,
            status: "active",
            limits: {
                maxStaff: 3,
                maxServices: 10,
                maxAppointmentsPerMonth: 100,
                maxStorageGB: 1,
                features: {
                    onlineBooking: true,
                    analytics: false,
                    marketing: false,
                    inventory: false,
                    multiLocation: false,
                    apiAccess: false,
                    customBranding: false,
                    advancedReports: false,
                },
            },
            trialDays: 14,
        });
        const savedSubscription = await subscription.save();
        await this.businessModel.findByIdAndUpdate(businessId, {
            activeSubscription: savedSubscription._id,
        });
    }
    async createDefaultTenantConfig(businessId) {
        const config = new this.tenantConfigModel({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            brandColors: {
                primary: "#007bff",
                secondary: "#6c757d",
                accent: "#28a745",
                background: "#ffffff",
                text: "#333333",
            },
            typography: {
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                headerFont: "Inter, sans-serif",
            },
            customization: {
                showBusinessLogo: true,
                showPoweredBy: true,
            },
            integrations: {
                emailProvider: "smtp",
                smsProvider: "twilio",
                paymentProvider: "paystack",
            },
        });
        await config.save();
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        if (user.authProvider !== 'local' && !user.password) {
            throw new common_1.UnauthorizedException(`This account uses ${user.authProvider} authentication. Please sign in with ${user.authProvider}.`);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        if (user.status !== "active") {
            throw new common_1.UnauthorizedException("Account is not active");
        }
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        await this.userModel.findByIdAndUpdate(user._id, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
            lastLogin: new Date(),
        });
        return Object.assign({ user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
                authProvider: user.authProvider,
            } }, tokens);
    }
    async googleAuth(googleAuthDto) {
        var _a;
        const { idToken, subdomain } = googleAuthDto;
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: this.configService.get("GOOGLE_CLIENT_ID"),
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new common_1.UnauthorizedException("Invalid Google token");
            }
            const { email, given_name, family_name, picture, sub: googleId } = payload;
            if (!email) {
                throw new common_1.UnauthorizedException("Email not provided by Google");
            }
            let user = await this.userModel.findOne({
                $or: [{ email }, { googleId }]
            });
            if (!user) {
                const newUser = new this.userModel();
                newUser.firstName = given_name || "User";
                newUser.lastName = family_name || "";
                newUser.email = email;
                newUser.role = user_schema_1.UserRole.CLIENT;
                newUser.status = user_schema_1.UserStatus.ACTIVE;
                newUser.profileImage = picture;
                newUser.emailVerified = true;
                newUser.googleId = googleId;
                newUser.authProvider = "google";
                user = await newUser.save();
            }
            else {
                const updateData = {
                    lastLogin: new Date(),
                };
                if (!user.googleId) {
                    updateData.googleId = googleId;
                    updateData.emailVerified = true;
                }
                if (picture && !user.profileImage) {
                    updateData.profileImage = picture;
                }
                await this.userModel.findByIdAndUpdate(user._id, updateData);
                user = await this.userModel.findById(user._id);
            }
            const businesses = await this.businessModel.find({
                $or: [{ ownerId: user._id }, { adminIds: user._id }],
            });
            let business = null;
            if (subdomain && businesses.length > 0) {
                const found = businesses.find((b) => b.subdomain === subdomain);
                if (found) {
                    business = found;
                }
                else {
                    throw new common_1.UnauthorizedException("Business not found or access denied");
                }
            }
            else if (businesses.length > 0) {
                business = businesses[0];
            }
            const tokens = await this.generateTokens(user._id.toString(), user.email, user.role, (_a = business === null || business === void 0 ? void 0 : business._id) === null || _a === void 0 ? void 0 : _a.toString(), business === null || business === void 0 ? void 0 : business.subdomain);
            await this.userModel.findByIdAndUpdate(user._id, {
                refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
                currentBusinessId: business === null || business === void 0 ? void 0 : business._id,
            });
            const response = Object.assign({ user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    profileImage: user.profileImage,
                    emailVerified: user.emailVerified,
                } }, tokens);
            if (business) {
                response.business = {
                    id: business._id,
                    businessName: business.businessName,
                    subdomain: business.subdomain,
                    businessType: business.businessType,
                    status: business.status,
                    trialEndsAt: business.trialEndsAt,
                };
            }
            if (businesses.length > 0) {
                response.businesses = businesses.map((b) => ({
                    id: b._id,
                    businessName: b.businessName,
                    subdomain: b.subdomain,
                    status: b.status,
                }));
            }
            return response;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error("Google authentication error:", error);
            throw new common_1.UnauthorizedException("Google authentication failed");
        }
    }
    async loginBusiness(loginDto) {
        const { email, password, subdomain } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        if (user.status !== "active") {
            throw new common_1.UnauthorizedException("Account is not active");
        }
        if (![user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.BUSINESS_ADMIN].includes(user.role)) {
            throw new common_1.UnauthorizedException("Not authorized to access business portal");
        }
        const businesses = await this.businessModel
            .find({
            $or: [{ ownerId: user._id }, { adminIds: user._id }],
        })
            .populate("activeSubscription");
        if (!businesses || businesses.length === 0) {
            throw new common_1.UnauthorizedException("No business account found for this user");
        }
        let business;
        if (subdomain) {
            business = businesses.find((b) => b.subdomain === subdomain);
            if (!business) {
                throw new common_1.UnauthorizedException("Business not found or access denied");
            }
        }
        else {
            business = businesses[0];
        }
        if (business.status === "suspended") {
            throw new common_1.UnauthorizedException("Business account is suspended");
        }
        if (business.status === "expired") {
            throw new common_1.UnauthorizedException("Business subscription has expired");
        }
        await this.userModel.findByIdAndUpdate(user._id, {
            currentBusinessId: business._id,
        });
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role, business._id.toString(), business.subdomain);
        await this.userModel.findByIdAndUpdate(user._id, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
            lastLogin: new Date(),
        });
        return Object.assign({ user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
            }, business: {
                id: business._id,
                businessName: business.businessName,
                subdomain: business.subdomain,
                businessType: business.businessType,
                status: business.status,
                trialEndsAt: business.trialEndsAt,
                subscription: business.activeSubscription,
            }, businesses: businesses.map((b) => ({
                id: b._id,
                businessName: b.businessName,
                subdomain: b.subdomain,
                status: b.status,
            })) }, tokens);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(business_schema_1.Business.name)),
    __param(2, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __param(3, (0, mongoose_1.InjectModel)(tenant_config_schema_1.TenantConfig.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map