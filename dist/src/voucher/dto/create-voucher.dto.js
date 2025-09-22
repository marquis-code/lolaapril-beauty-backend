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
exports.CreateVoucherDto = exports.VoucherRestrictionsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class VoucherRestrictionsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ["service_001", "service_002"] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], VoucherRestrictionsDto.prototype, "applicableServices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ["Hair Services", "Spa Services"] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], VoucherRestrictionsDto.prototype, "applicableCategories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], VoucherRestrictionsDto.prototype, "minimumSpend", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], VoucherRestrictionsDto.prototype, "maximumDiscount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ["service_003"] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], VoucherRestrictionsDto.prototype, "excludedServices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VoucherRestrictionsDto.prototype, "firstTimeClientsOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ["Monday", "Tuesday"] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], VoucherRestrictionsDto.prototype, "applicableDays", void 0);
exports.VoucherRestrictionsDto = VoucherRestrictionsDto;
class CreateVoucherDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "WELCOME20" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "voucherCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Welcome Discount" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "voucherName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "20% discount for new clients" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "percentage",
        enum: ["percentage", "fixed_amount", "service_discount", "buy_one_get_one"],
    }),
    (0, class_validator_1.IsEnum)(["percentage", "fixed_amount", "service_discount", "buy_one_get_one"]),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "discountType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVoucherDto.prototype, "discountValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-01-01T00:00:00.000Z" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateVoucherDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-12-31T23:59:59.999Z" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateVoucherDto.prototype, "validUntil", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateVoucherDto.prototype, "usageLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateVoucherDto.prototype, "usagePerClient", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: VoucherRestrictionsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => VoucherRestrictionsDto),
    __metadata("design:type", VoucherRestrictionsDto)
], CreateVoucherDto.prototype, "restrictions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "active",
        enum: ["active", "inactive", "expired", "used_up"],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(["active", "inactive", "expired", "used_up"]),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "507f1f77bcf86cd799439011" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "createdBy", void 0);
exports.CreateVoucherDto = CreateVoucherDto;
//# sourceMappingURL=create-voucher.dto.js.map