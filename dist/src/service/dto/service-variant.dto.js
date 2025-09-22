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
exports.CreateServiceVariantDto = exports.VariantSettingsDto = exports.VariantPricingDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class VariantPricingDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Fixed" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VariantPricingDto.prototype, "priceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: "object",
        properties: {
            currency: { type: "string", example: "NGN" },
            amount: { type: "number", example: 4000 },
        },
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], VariantPricingDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: "object",
        properties: {
            value: { type: "number", example: 45 },
            unit: { type: "string", example: "min" },
        },
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Object)
], VariantPricingDto.prototype, "duration", void 0);
exports.VariantPricingDto = VariantPricingDto;
class VariantSettingsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "HC-SH-001" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VariantSettingsDto.prototype, "sku", void 0);
exports.VariantSettingsDto = VariantSettingsDto;
class CreateServiceVariantDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Short Hair" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceVariantDto.prototype, "variantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Specialized haircut service for clients with short to medium length hair." }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceVariantDto.prototype, "variantDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: VariantPricingDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => VariantPricingDto),
    __metadata("design:type", VariantPricingDto)
], CreateServiceVariantDto.prototype, "pricing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: VariantSettingsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => VariantSettingsDto),
    __metadata("design:type", VariantSettingsDto)
], CreateServiceVariantDto.prototype, "settings", void 0);
exports.CreateServiceVariantDto = CreateServiceVariantDto;
//# sourceMappingURL=service-variant.dto.js.map