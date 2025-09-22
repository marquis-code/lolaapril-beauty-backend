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
exports.CreateAppointmentDto = exports.PaymentInstructionsDto = exports.PaymentDetailsDto = exports.TaxDto = exports.PaymentStatusDto = exports.ServiceDetailsDto = exports.AppointmentDetailsDto = exports.SelectedServiceDto = exports.AdditionalServiceDto = exports.SelectedOptionDto = exports.PriceDto = exports.DurationDto = exports.BusinessInfoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class BusinessInfoDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "lola_april_wellness_spa" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessInfoDto.prototype, "businessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Lola April Wellness Spa" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessInfoDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4.9 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BusinessInfoDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 45 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BusinessInfoDto.prototype, "reviewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "11 Rasheed Alaba Williams Street, Lekki Phase 1, Lagos" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessInfoDto.prototype, "address", void 0);
exports.BusinessInfoDto = BusinessInfoDto;
class DurationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DurationDto.prototype, "hours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DurationDto.prototype, "minutes", void 0);
exports.DurationDto = DurationDto;
class PriceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "NGN" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PriceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 130000 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PriceDto.prototype, "amount", void 0);
exports.PriceDto = PriceDto;
class SelectedOptionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "dear_mum_special" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SelectedOptionDto.prototype, "optionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Dear Mum: You're Special" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SelectedOptionDto.prototype, "optionName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DurationDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DurationDto),
    __metadata("design:type", DurationDto)
], SelectedOptionDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "We welcome her with a refreshing drink & a complimentary card from you." }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SelectedOptionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PriceDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], SelectedOptionDto.prototype, "price", void 0);
exports.SelectedOptionDto = SelectedOptionDto;
class AdditionalServiceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "infrared_therapy" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdditionalServiceDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Infrared Therapy" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdditionalServiceDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DurationDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DurationDto),
    __metadata("design:type", DurationDto)
], AdditionalServiceDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Penetrates deeper into the muscles & joints to reduce inflammation and pain." }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdditionalServiceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PriceDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], AdditionalServiceDto.prototype, "price", void 0);
exports.AdditionalServiceDto = AdditionalServiceDto;
class SelectedServiceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "dear_mum_series" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SelectedServiceDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Dear Mum Series" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SelectedServiceDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "bundle" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SelectedServiceDto.prototype, "serviceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SelectedOptionDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SelectedOptionDto),
    __metadata("design:type", SelectedOptionDto)
], SelectedServiceDto.prototype, "selectedOption", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [AdditionalServiceDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AdditionalServiceDto),
    __metadata("design:type", Array)
], SelectedServiceDto.prototype, "additionalServices", void 0);
exports.SelectedServiceDto = SelectedServiceDto;
class AppointmentDetailsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-09-21" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AppointmentDetailsDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Sunday" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AppointmentDetailsDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "18:00" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AppointmentDetailsDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "20:45" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AppointmentDetailsDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2 hrs, 45 mins duration" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AppointmentDetailsDto.prototype, "duration", void 0);
exports.AppointmentDetailsDto = AppointmentDetailsDto;
class ServiceDetailsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Dear Mum Series" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ServiceDetailsDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Dear Mum: You're Special with any professional" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ServiceDetailsDto.prototype, "serviceDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PriceDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], ServiceDetailsDto.prototype, "price", void 0);
exports.ServiceDetailsDto = ServiceDetailsDto;
class PaymentStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: PriceDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], PaymentStatusDto.prototype, "payNow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PriceDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], PaymentStatusDto.prototype, "payAtVenue", void 0);
exports.PaymentStatusDto = PaymentStatusDto;
class TaxDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "NGN" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TaxDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 9750 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TaxDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7.5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TaxDto.prototype, "rate", void 0);
exports.TaxDto = TaxDto;
class PaymentDetailsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Pay at venue" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PaymentDetailsDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PriceDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], PaymentDetailsDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TaxDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TaxDto),
    __metadata("design:type", TaxDto)
], PaymentDetailsDto.prototype, "tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PriceDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], PaymentDetailsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaymentStatusDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PaymentStatusDto),
    __metadata("design:type", PaymentStatusDto)
], PaymentDetailsDto.prototype, "paymentStatus", void 0);
exports.PaymentDetailsDto = PaymentDetailsDto;
class PaymentInstructionsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "https://paystack.com/pay/qthu-d1gcx" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentInstructionsDto.prototype, "paymentUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Appointments are confirmed upon payment. Unconfirmed appointments will be released after 2 hours from the time of booking.",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PaymentInstructionsDto.prototype, "confirmationPolicy", void 0);
exports.PaymentInstructionsDto = PaymentInstructionsDto;
class CreateAppointmentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "507f1f77bcf86cd799439011" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BusinessInfoDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BusinessInfoDto),
    __metadata("design:type", BusinessInfoDto)
], CreateAppointmentDto.prototype, "businessInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SelectedServiceDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SelectedServiceDto),
    __metadata("design:type", Array)
], CreateAppointmentDto.prototype, "selectedServices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DurationDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DurationDto),
    __metadata("design:type", DurationDto)
], CreateAppointmentDto.prototype, "totalDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-09-21" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "selectedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "18:00" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "selectedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AppointmentDetailsDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AppointmentDetailsDto),
    __metadata("design:type", AppointmentDetailsDto)
], CreateAppointmentDto.prototype, "appointmentDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ServiceDetailsDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ServiceDetailsDto),
    __metadata("design:type", ServiceDetailsDto)
], CreateAppointmentDto.prototype, "serviceDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaymentDetailsDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PaymentDetailsDto),
    __metadata("design:type", PaymentDetailsDto)
], CreateAppointmentDto.prototype, "paymentDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: PaymentInstructionsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PaymentInstructionsDto),
    __metadata("design:type", PaymentInstructionsDto)
], CreateAppointmentDto.prototype, "paymentInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Please ensure the room is well ventilated", maxLength: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "customerNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "pending_confirmation",
        enum: ["pending_confirmation", "confirmed", "in_progress", "completed", "cancelled", "no_show"],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(["pending_confirmation", "confirmed", "in_progress", "completed", "cancelled", "no_show"]),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "507f1f77bcf86cd799439012" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "assignedStaff", void 0);
exports.CreateAppointmentDto = CreateAppointmentDto;
//# sourceMappingURL=create-appointment.dto.js.map