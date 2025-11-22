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
exports.AddressDto = exports.PhoneDto = exports.DurationDto = exports.CurrencyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CurrencyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "NGN" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CurrencyDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CurrencyDto.prototype, "amount", void 0);
exports.CurrencyDto = CurrencyDto;
class DurationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DurationDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "min", enum: ["min", "h", "day"] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DurationDto.prototype, "unit", void 0);
exports.DurationDto = DurationDto;
class PhoneDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "+234" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PhoneDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "+1234 567 8901" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PhoneDto.prototype, "number", void 0);
exports.PhoneDto = PhoneDto;
class AddressDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Home" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "addressName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Home" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "addressType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "123 Main Street" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Apt 4B" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "aptSuite", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Victoria Island" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Lagos" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Lagos State" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "101241" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "postcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Nigeria" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "country", void 0);
exports.AddressDto = AddressDto;
//# sourceMappingURL=common.dto.js.map