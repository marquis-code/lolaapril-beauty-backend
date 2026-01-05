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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("./schemas/user.schema");
const business_schema_1 = require("../business/schemas/business.schema");
const subscription_schema_1 = require("../business/schemas/subscription.schema");
const google_auth_library_1 = require("google-auth-library");
let AuthService = class AuthService {
    constructor(userModel, businessModel, subscriptionModel, jwtService, configService) {
        this.userModel = userModel;
        this.businessModel = businessModel;
        this.subscriptionModel = subscriptionModel;
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
            status: user_schema_1.UserStatus.ACTIVE,
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
            settings: {
                timezone: "Africa/Lagos",
                currency: "NGN",
                language: "en",
                defaultAppointmentDuration: 30,
                bufferTimeBetweenAppointments: 15,
                cancellationPolicyHours: 24,
                advanceBookingDays: 7,
                allowOnlineBooking: true,
                requireEmailVerification: true,
                requirePhoneVerification: false,
                taxRate: 10,
                serviceCharge: 0,
                notificationSettings: {
                    booking_confirmation: true,
                    payment_reminders: true,
                    appointment_reminders: true,
                    marketing: false,
                },
            },
        });
        const savedBusiness = await business.save();
        await this.userModel.findByIdAndUpdate(savedUser._id, {
            $push: { ownedBusinesses: savedBusiness._id },
            currentBusinessId: savedBusiness._id,
        });
        await this.createTrialSubscription(savedBusiness._id.toString());
        const tokens = await this.generateTokens(savedUser._id.toString(), savedUser.email, savedUser.role, savedBusiness._id.toString(), subdomain);
        await this.userModel.findByIdAndUpdate(savedUser._id, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        });
        return {
            user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                role: savedUser.role,
                status: savedUser.status,
            },
            business: {
                id: savedBusiness._id,
                businessName: savedBusiness.businessName,
                subdomain: savedBusiness.subdomain,
                businessType: savedBusiness.businessType,
                status: savedBusiness.status,
                trialEndsAt: savedBusiness.trialEndsAt,
            },
            ...tokens,
        };
    }
    async register(registerDto) {
        const { email, password, ...userData } = registerDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new this.userModel({
            ...userData,
            email,
            password: hashedPassword,
            authProvider: "local",
        });
        await user.save();
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        await this.userModel.findByIdAndUpdate(user._id, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        });
        return {
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
            },
            ...tokens,
        };
    }
    async handleGoogleCallback(googleUser, subdomain) {
        const { googleId, email, firstName, lastName, picture } = googleUser;
        if (!email) {
            throw new common_1.UnauthorizedException("Email not provided by Google");
        }
        let user = await this.userModel.findOne({
            $or: [{ email }, { googleId }]
        });
        if (!user) {
            const newUser = new this.userModel();
            newUser.firstName = firstName || "User";
            newUser.lastName = lastName || "";
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
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role, business?._id?.toString(), business?.subdomain);
        await this.userModel.findByIdAndUpdate(user._id, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
            currentBusinessId: business?._id,
        });
        const response = {
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
                profileImage: user.profileImage,
                emailVerified: user.emailVerified,
                authProvider: user.authProvider,
            },
            ...tokens,
        };
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
        return {
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
                authProvider: user.authProvider,
            },
            ...tokens,
        };
    }
    async googleAuth(googleAuthDto) {
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
            const tokens = await this.generateTokens(user._id.toString(), user.email, user.role, business?._id?.toString(), business?.subdomain);
            await this.userModel.findByIdAndUpdate(user._id, {
                refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
                currentBusinessId: business?._id,
            });
            const response = {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    profileImage: user.profileImage,
                    emailVerified: user.emailVerified,
                },
                ...tokens,
            };
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
        return {
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
            },
            business: {
                id: business._id,
                businessName: business.businessName,
                subdomain: business.subdomain,
                businessType: business.businessType,
                status: business.status,
                trialEndsAt: business.trialEndsAt,
                subscription: business.activeSubscription,
            },
            businesses: businesses.map((b) => ({
                id: b._id,
                businessName: b.businessName,
                subdomain: b.subdomain,
                status: b.status,
            })),
            ...tokens,
        };
    }
    async updateProfile(userId, updateProfileDto) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const allowedUpdates = ['firstName', 'lastName', 'phone', 'profileImage', 'bio', 'dateOfBirth', 'gender'];
            const updates = {};
            Object.keys(updateProfileDto).forEach(key => {
                if (allowedUpdates.includes(key) && updateProfileDto[key] !== undefined) {
                    if (key === 'dateOfBirth' && updateProfileDto[key]) {
                        updates[key] = new Date(updateProfileDto[key]);
                    }
                    else {
                        updates[key] = updateProfileDto[key];
                    }
                }
            });
            if (Object.keys(updates).length === 0) {
                throw new common_1.BadRequestException('No valid fields to update');
            }
            const updatedUser = await this.userModel.findByIdAndUpdate(userId, { ...updates, updatedAt: new Date() }, { new: true, runValidators: true }).select('-password -refreshToken');
            return {
                success: true,
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser._id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    role: updatedUser.role,
                    status: updatedUser.status,
                    profileImage: updatedUser.profileImage,
                    bio: updatedUser.bio,
                    dateOfBirth: updatedUser.dateOfBirth,
                    gender: updatedUser.gender,
                    emailVerified: updatedUser.emailVerified,
                    phoneVerified: updatedUser.phoneVerified,
                    authProvider: updatedUser.authProvider,
                    preferences: updatedUser.preferences,
                }
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Profile update error:', error);
            throw new common_1.BadRequestException('Failed to update profile');
        }
    }
    async updatePreferences(userId, preferences) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
                preferences: { ...user.preferences, ...preferences },
                updatedAt: new Date()
            }, { new: true, runValidators: true }).select('-password -refreshToken');
            return {
                success: true,
                message: 'Preferences updated successfully',
                preferences: updatedUser.preferences
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('Preferences update error:', error);
            throw new common_1.BadRequestException('Failed to update preferences');
        }
    }
    async changePassword(userId, changePasswordDto) {
        try {
            const { currentPassword, newPassword, confirmPassword } = changePasswordDto;
            if (newPassword !== confirmPassword) {
                throw new common_1.BadRequestException('New password and confirmation do not match');
            }
            if (currentPassword === newPassword) {
                throw new common_1.BadRequestException('New password must be different from current password');
            }
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (user.authProvider !== 'local' && !user.password) {
                throw new common_1.BadRequestException(`Cannot change password for ${user.authProvider} authenticated accounts`);
            }
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Current password is incorrect');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            await this.userModel.findByIdAndUpdate(userId, {
                password: hashedPassword,
                updatedAt: new Date()
            });
            await this.userModel.findByIdAndUpdate(userId, {
                refreshToken: null
            });
            return {
                success: true,
                message: 'Password changed successfully. Please login again with your new password.'
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error('Password change error:', error);
            throw new common_1.BadRequestException('Failed to change password');
        }
    }
    async updateEmail(userId, updateEmailDto) {
        try {
            const { newEmail, password } = updateEmailDto;
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (user.authProvider !== 'local' && !user.password) {
                throw new common_1.BadRequestException(`Cannot change email for ${user.authProvider} authenticated accounts. Please contact support.`);
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Password is incorrect');
            }
            const existingUser = await this.userModel.findOne({ email: newEmail });
            if (existingUser && existingUser._id.toString() !== userId) {
                throw new common_1.ConflictException('Email is already in use by another account');
            }
            if (user.email === newEmail) {
                throw new common_1.BadRequestException('New email must be different from current email');
            }
            await this.userModel.findByIdAndUpdate(userId, {
                email: newEmail,
                emailVerified: false,
                updatedAt: new Date()
            });
            await this.userModel.findByIdAndUpdate(userId, {
                refreshToken: null
            });
            return {
                success: true,
                message: 'Email updated successfully. Please verify your new email address and login again.',
                newEmail
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            console.error('Email update error:', error);
            throw new common_1.BadRequestException('Failed to update email');
        }
    }
    async deleteAccount(userId, password) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (user.authProvider === 'local' && user.password) {
                if (!password) {
                    throw new common_1.BadRequestException('Password is required to delete account');
                }
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new common_1.UnauthorizedException('Password is incorrect');
                }
            }
            await this.userModel.findByIdAndUpdate(userId, {
                status: user_schema_1.UserStatus.INACTIVE,
                refreshToken: null,
                updatedAt: new Date()
            });
            return {
                success: true,
                message: 'Account deleted successfully'
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Account deletion error:', error);
            throw new common_1.BadRequestException('Failed to delete account');
        }
    }
    async switchBusiness(userId, businessId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const hasAccess = user.ownedBusinesses.some(id => id.toString() === businessId) ||
            user.adminBusinesses.some(id => id.toString() === businessId) ||
            user.staffBusinessId?.toString() === businessId;
        if (!hasAccess) {
            throw new common_1.ForbiddenException('You do not have access to this business');
        }
        const business = await this.businessModel.findById(businessId);
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        if (business.status === 'suspended') {
            throw new common_1.UnauthorizedException('Business account is suspended');
        }
        if (business.status === 'expired') {
            throw new common_1.UnauthorizedException('Business subscription has expired');
        }
        await this.userModel.findByIdAndUpdate(userId, {
            currentBusinessId: business._id,
        });
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role, business._id.toString(), business.subdomain);
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        });
        return {
            success: true,
            message: 'Business context switched successfully',
            business: {
                id: business._id,
                businessName: business.businessName,
                subdomain: business.subdomain,
                businessType: business.businessType,
                status: business.status,
            },
            ...tokens,
        };
    }
    async getUserBusinesses(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const businessIds = [
            ...user.ownedBusinesses,
            ...user.adminBusinesses,
        ];
        if (user.staffBusinessId) {
            businessIds.push(user.staffBusinessId);
        }
        const uniqueBusinessIds = [...new Set(businessIds.map(id => id.toString()))];
        const businesses = await this.businessModel
            .find({ _id: { $in: uniqueBusinessIds } })
            .select('businessName subdomain businessType status trialEndsAt ownerId')
            .exec()
            .then((docs) => docs.map((doc) => doc.toObject()));
        return {
            businesses: businesses.map((b) => ({
                id: b._id,
                businessName: b.businessName,
                subdomain: b.subdomain,
                businessType: b.businessType,
                status: b.status,
                trialEndsAt: b.trialEndsAt,
                isOwner: b.ownerId?.toString() === userId,
                isCurrent: b._id?.toString() === user.currentBusinessId?.toString(),
            })),
            currentBusinessId: user.currentBusinessId,
        };
    }
    async clearBusinessContext(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.userModel.findByIdAndUpdate(userId, {
            currentBusinessId: null,
        });
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        });
        return {
            success: true,
            message: 'Business context cleared successfully',
            ...tokens,
        };
    }
    async addBusinessToUser(userId, addBusinessDto) {
        const { businessName, subdomain, businessType, businessDescription, address, contact } = addBusinessDto;
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingBusiness = await this.businessModel.findOne({ subdomain });
        if (existingBusiness) {
            throw new common_1.ConflictException('Subdomain already taken');
        }
        const business = new this.businessModel({
            businessName,
            subdomain,
            businessType,
            businessDescription,
            address,
            contact,
            ownerId: user._id,
            status: 'trial',
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            settings: {
                timezone: 'Africa/Lagos',
                currency: 'NGN',
                language: 'en',
                defaultAppointmentDuration: 30,
                bufferTimeBetweenAppointments: 15,
                cancellationPolicyHours: 24,
                advanceBookingDays: 7,
                allowOnlineBooking: true,
                requireEmailVerification: true,
                requirePhoneVerification: false,
                taxRate: 10,
                serviceCharge: 0,
                notificationSettings: {
                    booking_confirmation: true,
                    payment_reminders: true,
                    appointment_reminders: true,
                    marketing: false,
                },
            },
        });
        const savedBusiness = await business.save();
        await this.userModel.findByIdAndUpdate(userId, {
            $push: { ownedBusinesses: savedBusiness._id },
        });
        await this.createTrialSubscription(savedBusiness._id.toString());
        const tokens = await this.generateTokens(user._id.toString(), user.email, user.role, savedBusiness._id.toString(), subdomain);
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
            currentBusinessId: savedBusiness._id,
        });
        return {
            success: true,
            message: 'Business added successfully',
            business: {
                id: savedBusiness._id,
                businessName: savedBusiness.businessName,
                subdomain: savedBusiness.subdomain,
                businessType: savedBusiness.businessType,
                status: savedBusiness.status,
                trialEndsAt: savedBusiness.trialEndsAt,
            },
            ...tokens,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(business_schema_1.Business.name)),
    __param(2, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map