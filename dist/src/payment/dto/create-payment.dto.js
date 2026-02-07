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
exports.CreatePaymentDto = exports.PaymentItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class PaymentItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "service", enum: ["service", "product", "bundle"] }),
    (0, class_validator_1.IsEnum)(["service", "product", "bundle"]),
    __metadata("design:type", String)
], PaymentItemDto.prototype, "itemType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "service_001" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PaymentItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Hair Cut" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PaymentItemDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PaymentItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PaymentItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PaymentItemDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PaymentItemDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 375 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PaymentItemDto.prototype, "tax", void 0);
exports.PaymentItemDto = PaymentItemDto;
class CreatePaymentDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "507f1f77bcf86cd799439011" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "businessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "507f1f77bcf86cd799439011" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "507f1f77bcf86cd799439012" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "appointmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "507f1f77bcf86cd799439013" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "PAY_2025_001" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentReference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PaymentItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentItemDto),
    __metadata("design:type", Array)
], CreatePaymentDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "totalDiscount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 375 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "totalTax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "serviceCharge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5075 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "cash",
        enum: ["cash", "card", "bank_transfer", "mobile_money", "online"],
    }),
    (0, class_validator_1.IsEnum)(["cash", "card", "bank_transfer", "mobile_money", "online"]),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "pending",
        enum: ["pending", "processing", "completed", "failed", "refunded", "partially_refunded"],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(["pending", "processing", "completed", "failed", "refunded", "partially_refunded"]),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "TXN_123456789" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "507f1f77bcf86cd799439014" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "processedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Payment processed successfully" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "notes", void 0);
exports.CreatePaymentDto = CreatePaymentDto;
//# sourceMappingURL=create-payment.dto.js.map