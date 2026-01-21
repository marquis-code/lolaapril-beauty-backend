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
exports.ResetPasswordDto = exports.VerifyResetOTPDto = exports.ForgotPasswordDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ForgotPasswordDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'business@example.com',
        description: 'Email address of the business account'
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
exports.ForgotPasswordDto = ForgotPasswordDto;
class VerifyResetOTPDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'business@example.com',
        description: 'Email address of the business account'
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyResetOTPDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123456',
        description: '6-digit OTP code'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(6, 6, { message: 'OTP must be exactly 6 digits' }),
    (0, class_validator_1.Matches)(/^\d{6}$/, { message: 'OTP must contain only numbers' }),
    __metadata("design:type", String)
], VerifyResetOTPDto.prototype, "otp", void 0);
exports.VerifyResetOTPDto = VerifyResetOTPDto;
class ResetPasswordDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'business@example.com',
        description: 'Email address of the business account'
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123456',
        description: '6-digit OTP code'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(6, 6, { message: 'OTP must be exactly 6 digits' }),
    (0, class_validator_1.Matches)(/^\d{6}$/, { message: 'OTP must contain only numbers' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'NewSecurePassword123!',
        description: 'New password (minimum 8 characters with uppercase, lowercase, number, and special character)'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
exports.ResetPasswordDto = ResetPasswordDto;
//# sourceMappingURL=password-reset.dto.js.map