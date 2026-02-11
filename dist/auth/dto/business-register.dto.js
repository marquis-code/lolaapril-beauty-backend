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
exports.GoogleAuthDto = exports.BusinessLoginDto = exports.BusinessRegisterDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class BusinessOwnerDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Owner first name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessOwnerDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Owner last name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessOwnerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Owner email address' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], BusinessOwnerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Owner phone number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessOwnerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Password', minLength: 6 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], BusinessOwnerDto.prototype, "password", void 0);
class BusinessAddressDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "postalCode", void 0);
class BusinessContactDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessContactDto.prototype, "primaryPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], BusinessContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessContactDto.prototype, "website", void 0);
class BusinessRegisterDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business owner details', type: BusinessOwnerDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BusinessOwnerDto),
    __metadata("design:type", BusinessOwnerDto)
], BusinessRegisterDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessRegisterDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique subdomain for the business' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessRegisterDto.prototype, "subdomain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of business',
        enum: ['salon', 'spa', 'barbershop', 'beauty_clinic', 'wellness_center', 'other']
    }),
    (0, class_validator_1.IsEnum)(['salon', 'spa', 'barbershop', 'beauty_clinic', 'wellness_center', 'other']),
    __metadata("design:type", String)
], BusinessRegisterDto.prototype, "businessType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessRegisterDto.prototype, "businessDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business address', type: BusinessAddressDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BusinessAddressDto),
    __metadata("design:type", BusinessAddressDto)
], BusinessRegisterDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business contact', type: BusinessContactDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BusinessContactDto),
    __metadata("design:type", BusinessContactDto)
], BusinessRegisterDto.prototype, "contact", void 0);
exports.BusinessRegisterDto = BusinessRegisterDto;
class BusinessLoginDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business owner email address' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], BusinessLoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Password' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessLoginDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business subdomain (optional for login)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessLoginDto.prototype, "subdomain", void 0);
exports.BusinessLoginDto = BusinessLoginDto;
class GoogleAuthDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Google OAuth ID token' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GoogleAuthDto.prototype, "idToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Business subdomain (for business login)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GoogleAuthDto.prototype, "subdomain", void 0);
exports.GoogleAuthDto = GoogleAuthDto;
//# sourceMappingURL=business-register.dto.js.map