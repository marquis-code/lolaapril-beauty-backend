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
exports.CreateBusinessSettingsDto = exports.ClosedPeriodDto = exports.PaymentMethodDto = exports.BlockedTimeTypeDto = exports.ResourceDto = exports.CancellationReasonDto = exports.AppointmentStatusDto = exports.BusinessHoursDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class BusinessHoursDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Monday" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessHoursDto.prototype, "day", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "09:00" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessHoursDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "17:00" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessHoursDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BusinessHoursDto.prototype, "isOpen", void 0);
exports.BusinessHoursDto = BusinessHoursDto;
class AppointmentStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Confirmed" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AppointmentStatusDto.prototype, "statusName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "play" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AppointmentStatusDto.prototype, "statusIcon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "#40E0D0" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AppointmentStatusDto.prototype, "statusColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AppointmentStatusDto.prototype, "characterLimit", void 0);
exports.AppointmentStatusDto = AppointmentStatusDto;
class CancellationReasonDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Client Emergency" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CancellationReasonDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "client_initiated",
        enum: ["client_initiated", "business_initiated", "external_factors"],
    }),
    (0, class_validator_1.IsEnum)(["client_initiated", "business_initiated", "external_factors"]),
    __metadata("design:type", String)
], CancellationReasonDto.prototype, "reasonType", void 0);
exports.CancellationReasonDto = CancellationReasonDto;
class ResourceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Massage Room 1" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResourceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Spacious private room equipped with premium massage table, aromatherapy diffuser, and ambient lighting.",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResourceDto.prototype, "description", void 0);
exports.ResourceDto = ResourceDto;
class BlockedTimeTypeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Lunch Break" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BlockedTimeTypeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "utensils" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BlockedTimeTypeDto.prototype, "typeIcon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "1 hour" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BlockedTimeTypeDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Paid", enum: ["Paid", "Unpaid"] }),
    (0, class_validator_1.IsEnum)(["Paid", "Unpaid"]),
    __metadata("design:type", String)
], BlockedTimeTypeDto.prototype, "compensation", void 0);
exports.BlockedTimeTypeDto = BlockedTimeTypeDto;
class PaymentMethodDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Mastercard" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "credit_card",
        enum: ["cash", "credit_card", "debit_card", "bank_transfer", "digital_wallet"],
    }),
    (0, class_validator_1.IsEnum)(["cash", "credit_card", "debit_card", "bank_transfer", "digital_wallet"]),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "paymentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PaymentMethodDto.prototype, "enabled", void 0);
exports.PaymentMethodDto = PaymentMethodDto;
class ClosedPeriodDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-12-25" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ClosedPeriodDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-12-26" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ClosedPeriodDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Christmas Holiday" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ClosedPeriodDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ClosedPeriodDto.prototype, "businessClosed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ClosedPeriodDto.prototype, "onlineBookingBlocked", void 0);
exports.ClosedPeriodDto = ClosedPeriodDto;
class CreateBusinessSettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Lola April Wellness Spa" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessSettingsDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "info@lolaaprils.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateBusinessSettingsDto.prototype, "businessEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: "object",
        properties: {
            countryCode: { type: "string", example: "+234" },
            number: { type: "string", example: "+234 123 456 7890" },
        },
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], CreateBusinessSettingsDto.prototype, "businessPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: "object",
        properties: {
            street: { type: "string", example: "11 Rasheed Alaba Williams Street" },
            city: { type: "string", example: "Lagos" },
            region: { type: "string", example: "Lagos State" },
            postcode: { type: "string", example: "101241" },
            country: { type: "string", example: "Nigeria" },
        },
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], CreateBusinessSettingsDto.prototype, "businessAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BusinessHoursDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BusinessHoursDto),
    __metadata("design:type", Array)
], CreateBusinessSettingsDto.prototype, "businessHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [AppointmentStatusDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AppointmentStatusDto),
    __metadata("design:type", Array)
], CreateBusinessSettingsDto.prototype, "appointmentStatuses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CancellationReasonDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CancellationReasonDto),
    __metadata("design:type", Array)
], CreateBusinessSettingsDto.prototype, "cancellationReasons", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ResourceDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ResourceDto),
    __metadata("design:type", Array)
], CreateBusinessSettingsDto.prototype, "resources", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [BlockedTimeTypeDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BlockedTimeTypeDto),
    __metadata("design:type", Array)
], CreateBusinessSettingsDto.prototype, "blockedTimeTypes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [PaymentMethodDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentMethodDto),
    __metadata("design:type", Array)
], CreateBusinessSettingsDto.prototype, "paymentMethods", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ClosedPeriodDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ClosedPeriodDto),
    __metadata("design:type", Array)
], CreateBusinessSettingsDto.prototype, "closedPeriods", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "NGN" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessSettingsDto.prototype, "defaultCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Africa/Lagos" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBusinessSettingsDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 15 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBusinessSettingsDto.prototype, "defaultAppointmentDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBusinessSettingsDto.prototype, "bookingWindowHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBusinessSettingsDto.prototype, "allowOnlineBooking", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBusinessSettingsDto.prototype, "requireClientConfirmation", void 0);
exports.CreateBusinessSettingsDto = CreateBusinessSettingsDto;
//# sourceMappingURL=create-business-settings.dto.js.map