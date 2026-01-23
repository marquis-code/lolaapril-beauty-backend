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
exports.UpdateEmailDto = exports.ChangePasswordDto = exports.UpdateProfileDto = exports.UserPreferencesDto = exports.NotificationPreferencesDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class NotificationPreferencesDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationPreferencesDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationPreferencesDto.prototype, "sms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationPreferencesDto.prototype, "push", void 0);
exports.NotificationPreferencesDto = NotificationPreferencesDto;
class UserPreferencesDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'en' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserPreferencesDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Africa/Lagos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserPreferencesDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'NGN' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserPreferencesDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: NotificationPreferencesDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => NotificationPreferencesDto),
    __metadata("design:type", NotificationPreferencesDto)
], UserPreferencesDto.prototype, "notifications", void 0);
exports.UserPreferencesDto = UserPreferencesDto;
class UpdateProfileDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'John' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Doe' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '+2348012345678' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'https://example.com/profile.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Passionate about creating beautiful experiences' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '1990-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['male', 'female', 'other', 'prefer_not_to_say'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['male', 'female', 'other', 'prefer_not_to_say']),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: UserPreferencesDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UserPreferencesDto),
    __metadata("design:type", UserPreferencesDto)
], UpdateProfileDto.prototype, "preferences", void 0);
exports.UpdateProfileDto = UpdateProfileDto;
class ChangePasswordDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 'currentPassword123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 'newPassword123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 'newPassword123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "confirmPassword", void 0);
exports.ChangePasswordDto = ChangePasswordDto;
class UpdateEmailDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 'newemail@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateEmailDto.prototype, "newEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 'currentPassword123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UpdateEmailDto.prototype, "password", void 0);
exports.UpdateEmailDto = UpdateEmailDto;
//# sourceMappingURL=update-profile.dto.js.map