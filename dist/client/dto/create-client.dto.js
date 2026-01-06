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
exports.CreateClientDto = exports.EmergencyContactsDto = exports.ClientSettingsDto = exports.MarketingNotificationsDto = exports.AppointmentNotificationsDto = exports.AdditionalInfoDto = exports.ClientProfileDto = exports.EmergencyContactDto = exports.ReferredByDto = exports.BirthdayDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const common_dto_1 = require("../../common/dto/common.dto");
class BirthdayDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "01-15" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BirthdayDto.prototype, "dayAndMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "1990" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BirthdayDto.prototype, "year", void 0);
exports.BirthdayDto = BirthdayDto;
class ReferredByDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "12345" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReferredByDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Jane Smith" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReferredByDto.prototype, "clientName", void 0);
exports.ReferredByDto = ReferredByDto;
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
    (0, swagger_1.ApiPropertyOptional)({ type: BirthdayDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BirthdayDto),
    __metadata("design:type", BirthdayDto)
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
    (0, swagger_1.ApiPropertyOptional)({ type: ReferredByDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ReferredByDto),
    __metadata("design:type", ReferredByDto)
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
class AppointmentNotificationsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AppointmentNotificationsDto.prototype, "emailNotifications", void 0);
exports.AppointmentNotificationsDto = AppointmentNotificationsDto;
class MarketingNotificationsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MarketingNotificationsDto.prototype, "clientAcceptsEmailMarketing", void 0);
exports.MarketingNotificationsDto = MarketingNotificationsDto;
class ClientSettingsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: AppointmentNotificationsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AppointmentNotificationsDto),
    __metadata("design:type", AppointmentNotificationsDto)
], ClientSettingsDto.prototype, "appointmentNotifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: MarketingNotificationsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MarketingNotificationsDto),
    __metadata("design:type", MarketingNotificationsDto)
], ClientSettingsDto.prototype, "marketingNotifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true, description: 'Enable Grok Code Fast 1 for the client' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ClientSettingsDto.prototype, "grokCodeFast1Enabled", void 0);
exports.ClientSettingsDto = ClientSettingsDto;
class EmergencyContactsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: EmergencyContactDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EmergencyContactDto),
    __metadata("design:type", EmergencyContactDto)
], EmergencyContactsDto.prototype, "primary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: EmergencyContactDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EmergencyContactDto),
    __metadata("design:type", EmergencyContactDto)
], EmergencyContactsDto.prototype, "secondary", void 0);
exports.EmergencyContactsDto = EmergencyContactsDto;
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
    (0, swagger_1.ApiPropertyOptional)({ type: EmergencyContactsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EmergencyContactsDto),
    __metadata("design:type", EmergencyContactsDto)
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