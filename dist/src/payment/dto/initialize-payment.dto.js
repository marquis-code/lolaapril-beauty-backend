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
exports.InitializePaymentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class InitializePaymentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "client@example.com", description: "Client email address" }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000, description: "Payment amount in Naira" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], InitializePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "507f1f77bcf86cd799439011", description: "Client ID" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "507f1f77bcf86cd799439014", description: "Tenant/Business ID" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "507f1f77bcf86cd799439012", description: "Appointment ID" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "appointmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "507f1f77bcf86cd799439013", description: "Booking ID" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "paystack",
        description: "Payment gateway to use (paystack, flutterwave, etc.)",
        enum: ["paystack", "flutterwave", "stripe"]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "gateway", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Additional metadata for the payment",
        example: {
            services: [
                { serviceId: "507f1f77bcf86cd799439015", serviceName: "Hair Cut", price: 5000 }
            ],
            businessName: "Beauty Salon"
        }
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], InitializePaymentDto.prototype, "metadata", void 0);
exports.InitializePaymentDto = InitializePaymentDto;
//# sourceMappingURL=initialize-payment.dto.js.map