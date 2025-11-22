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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = exports.UserStatus = exports.UserRole = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["BUSINESS_OWNER"] = "business_owner";
    UserRole["BUSINESS_ADMIN"] = "business_admin";
    UserRole["STAFF"] = "staff";
    UserRole["CLIENT"] = "client";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["PENDING_VERIFICATION"] = "pending_verification";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
let User = class User {
};
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User first name" }),
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User last name" }),
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User email address", uniqueItems: true }),
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User phone number" }),
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Hashed password" }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User role", enum: UserRole }),
    (0, mongoose_1.Prop)({ type: String, enum: UserRole, default: UserRole.CLIENT }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User status", enum: UserStatus }),
    (0, mongoose_1.Prop)({ type: String, enum: UserStatus, default: UserStatus.ACTIVE }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Businesses owned by this user" }),
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: "Business", default: [] }),
    __metadata("design:type", Array)
], User.prototype, "ownedBusinesses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Businesses where user is admin" }),
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: "Business", default: [] }),
    __metadata("design:type", Array)
], User.prototype, "adminBusinesses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Business where user is staff member" }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Business" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], User.prototype, "staffBusinessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Current active business context" }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Business" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], User.prototype, "currentBusinessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Profile image URL" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User bio/description" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User date of birth" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User gender" }),
    (0, mongoose_1.Prop)({ enum: ["male", "female", "other", "prefer_not_to_say"] }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Last login timestamp" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Email verification status" }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Phone verification status" }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "phoneVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Email verification token" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Password reset token" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Password reset token expiry" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "resetPasswordExpires", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Refresh token for JWT" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Google OAuth ID" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Facebook OAuth ID" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "facebookId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "OAuth provider" }),
    (0, mongoose_1.Prop)({ enum: ["local", "google", "facebook"], default: "local" }),
    __metadata("design:type", String)
], User.prototype, "authProvider", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            language: { type: String, default: "en" },
            timezone: { type: String, default: "Africa/Lagos" },
            currency: { type: String, default: "NGN" },
            notifications: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: true },
                push: { type: Boolean, default: true },
            },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], User.prototype, "preferences", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.index({ email: 1 });
exports.UserSchema.index({ role: 1 });
exports.UserSchema.index({ status: 1 });
exports.UserSchema.index({ ownedBusinesses: 1 });
exports.UserSchema.index({ adminBusinesses: 1 });
exports.UserSchema.index({ staffBusinessId: 1 });
exports.UserSchema.index({ googleId: 1 });
exports.UserSchema.index({ facebookId: 1 });
//# sourceMappingURL=user.schema.js.map