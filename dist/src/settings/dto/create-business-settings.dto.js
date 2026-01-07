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
exports.CreateBusinessSettingsDto = exports.ClosedPeriodDto = exports.TaxDto = exports.ServiceChargeDto = exports.TaxRateDto = exports.RateTypeDto = exports.AmountDto = exports.ServiceChargeSettingsDto = exports.ServiceChargeBasicInfoDto = exports.PaymentMethodDto = exports.BlockedTimeTypeDto = exports.ResourceDto = exports.CancellationReasonDto = exports.AppointmentStatusDto = exports.BusinessHoursDto = exports.BusinessAddressDto = exports.BusinessPhoneDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class BusinessPhoneDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "+234", description: "Country code" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessPhoneDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "08147626503", description: "Phone number" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessPhoneDto.prototype, "number", void 0);
exports.BusinessPhoneDto = BusinessPhoneDto;
class BusinessAddressDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "18, Alubarika street ijeshatedo" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "surulere" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Lagos" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "101282" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "postcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Nigeria" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "country", void 0);
exports.BusinessAddressDto = BusinessAddressDto;
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
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AppointmentStatusDto.prototype, "isActive", void 0);
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
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CancellationReasonDto.prototype, "isActive", void 0);
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
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ResourceDto.prototype, "isActive", void 0);
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
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BlockedTimeTypeDto.prototype, "isActive", void 0);
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
class ServiceChargeBasicInfoDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Service Charge" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ServiceChargeBasicInfoDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Standard service charge" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ServiceChargeBasicInfoDto.prototype, "description", void 0);
exports.ServiceChargeBasicInfoDto = ServiceChargeBasicInfoDto;
class ServiceChargeSettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "All services" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ServiceChargeSettingsDto.prototype, "applyServiceChargeOn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ServiceChargeSettingsDto.prototype, "automaticallyApplyDuringCheckout", void 0);
exports.ServiceChargeSettingsDto = ServiceChargeSettingsDto;
class AmountDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "NGN" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AmountDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AmountDto.prototype, "value", void 0);
exports.AmountDto = AmountDto;
class RateTypeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Percentage", enum: ["Flat rate", "Percentage", "Both"] }),
    (0, class_validator_1.IsEnum)(["Flat rate", "Percentage", "Both"]),
    __metadata("design:type", String)
], RateTypeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AmountDto),
    __metadata("design:type", AmountDto)
], RateTypeDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RateTypeDto.prototype, "percentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AmountDto),
    __metadata("design:type", AmountDto)
], RateTypeDto.prototype, "flatRate", void 0);
exports.RateTypeDto = RateTypeDto;
class TaxRateDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "VAT" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TaxRateDto.prototype, "tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7.5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TaxRateDto.prototype, "rate", void 0);
exports.TaxRateDto = TaxRateDto;
class ServiceChargeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ServiceChargeBasicInfoDto),
    __metadata("design:type", ServiceChargeBasicInfoDto)
], ServiceChargeDto.prototype, "basicInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ServiceChargeSettingsDto),
    __metadata("design:type", ServiceChargeSettingsDto)
], ServiceChargeDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RateTypeDto),
    __metadata("design:type", RateTypeDto)
], ServiceChargeDto.prototype, "rateType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TaxRateDto),
    __metadata("design:type", TaxRateDto)
], ServiceChargeDto.prototype, "taxRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ServiceChargeDto.prototype, "isActive", void 0);
exports.ServiceChargeDto = ServiceChargeDto;
class TaxDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "VAT" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TaxDto.prototype, "taxName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7.5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TaxDto.prototype, "taxRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TaxDto.prototype, "isActive", void 0);
exports.TaxDto = TaxDto;
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
    (0, swagger_1.ApiProperty)({ example: "Safemom" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessSettingsDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "info@safemom.com" }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessSettingsDto.prototype, "businessEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BusinessPhoneDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BusinessPhoneDto),
    __metadata("design:type", BusinessPhoneDto)
], CreateBusinessSettingsDto.prototype, "businessPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BusinessAddressDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BusinessAddressDto),
    __metadata("design:type", BusinessAddressDto)
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
    (0, swagger_1.ApiPropertyOptional)({ type: [ServiceChargeDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ServiceChargeDto),
    __metadata("design:type", Array)
], CreateBusinessSettingsDto.prototype, "serviceCharges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [TaxDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TaxDto),
    __metadata("design:type", Array)
], CreateBusinessSettingsDto.prototype, "taxes", void 0);
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
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
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