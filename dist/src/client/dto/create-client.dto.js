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
exports.CreateClientDto = exports.ClientSettingsDto = exports.AdditionalInfoDto = exports.ClientProfileDto = exports.EmergencyContactDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const common_dto_1 = require("../../common/dto/common.dto");
class EmergencyContactDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "John Hancock Sr." }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Parent" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "relationship", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "emergency1@domain.com" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: common_dto_1.PhoneDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => common_dto_1.PhoneDto),
    __metadata("design:type", common_dto_1.PhoneDto)
], EmergencyContactDto.prototype, "phone", void 0);
exports.EmergencyContactDto = EmergencyContactDto;
class ClientProfileDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "John" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClientProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Hancock" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClientProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "example@domain.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ClientProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: common_dto_1.PhoneDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => common_dto_1.PhoneDto),
    __metadata("design:type", common_dto_1.PhoneDto)
], ClientProfileDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: "object",
        properties: {
            dayAndMonth: { type: "string", example: "01-15" },
            year: { type: "string", example: "1990" },
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], ClientProfileDto.prototype, "birthday", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Male" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClientProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "He/Him" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClientProfileDto.prototype, "pronouns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "example+1@domain.com" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ClientProfileDto.prototype, "additionalEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: common_dto_1.PhoneDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => common_dto_1.PhoneDto),
    __metadata("design:type", common_dto_1.PhoneDto)
], ClientProfileDto.prototype, "additionalPhone", void 0);
exports.ClientProfileDto = ClientProfileDto;
class AdditionalInfoDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Walk-In" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdditionalInfoDto.prototype, "clientSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: "object",
        properties: {
            clientId: { type: "string", example: "12345" },
            clientName: { type: "string", example: "Jane Smith" },
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], AdditionalInfoDto.prototype, "referredBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "English" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdditionalInfoDto.prototype, "preferredLanguage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Software Engineer" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdditionalInfoDto.prototype, "occupation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Nigeria" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdditionalInfoDto.prototype, "country", void 0);
exports.AdditionalInfoDto = AdditionalInfoDto;
class ClientSettingsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: "object",
        properties: {
            emailNotifications: { type: "boolean", default: true },
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], ClientSettingsDto.prototype, "appointmentNotifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: "object",
        properties: {
            clientAcceptsEmailMarketing: { type: "boolean", default: false },
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], ClientSettingsDto.prototype, "marketingNotifications", void 0);
exports.ClientSettingsDto = ClientSettingsDto;
class CreateClientDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClientProfileDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ClientProfileDto),
    __metadata("design:type", ClientProfileDto)
], CreateClientDto.prototype, "profile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: AdditionalInfoDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AdditionalInfoDto),
    __metadata("design:type", AdditionalInfoDto)
], CreateClientDto.prototype, "additionalInfo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: "object",
        properties: {
            primary: { $ref: "#/components/schemas/EmergencyContactDto" },
            secondary: { $ref: "#/components/schemas/EmergencyContactDto" },
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], CreateClientDto.prototype, "emergencyContacts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: common_dto_1.AddressDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => common_dto_1.AddressDto),
    __metadata("design:type", common_dto_1.AddressDto)
], CreateClientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ClientSettingsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ClientSettingsDto),
    __metadata("design:type", ClientSettingsDto)
], CreateClientDto.prototype, "settings", void 0);
exports.CreateClientDto = CreateClientDto;
//# sourceMappingURL=create-client.dto.js.map