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
exports.CreateServiceBundleDto = exports.BundleOnlineBookingDto = exports.BundlePricingDto = exports.BundleServiceDto = exports.BasicInfoDto = exports.RetailPriceDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class RetailPriceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "NGN" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RetailPriceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], RetailPriceDto.prototype, "amount", void 0);
exports.RetailPriceDto = RetailPriceDto;
class BasicInfoDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Cut and Blow-dry" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BasicInfoDto.prototype, "bundleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Hair Services" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BasicInfoDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Complete hair transformation package including professional cut and styling blow-dry." }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BasicInfoDto.prototype, "description", void 0);
exports.BasicInfoDto = BasicInfoDto;
class BundleServiceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "service_001" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BundleServiceDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Hair Cut" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BundleServiceDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BundleServiceDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BundleServiceDto.prototype, "sequence", void 0);
exports.BundleServiceDto = BundleServiceDto;
class BundlePricingDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Fixed" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BundlePricingDto.prototype, "priceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: RetailPriceDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RetailPriceDto),
    __metadata("design:type", RetailPriceDto)
], BundlePricingDto.prototype, "retailPrice", void 0);
exports.BundlePricingDto = BundlePricingDto;
class BundleOnlineBookingDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BundleOnlineBookingDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Females only" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BundleOnlineBookingDto.prototype, "availableFor", void 0);
exports.BundleOnlineBookingDto = BundleOnlineBookingDto;
class CreateServiceBundleDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: BasicInfoDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BasicInfoDto),
    __metadata("design:type", BasicInfoDto)
], CreateServiceBundleDto.prototype, "basicInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BundleServiceDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BundleServiceDto),
    __metadata("design:type", Array)
], CreateServiceBundleDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Booked in sequence" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceBundleDto.prototype, "scheduleType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BundlePricingDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BundlePricingDto),
    __metadata("design:type", BundlePricingDto)
], CreateServiceBundleDto.prototype, "pricing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: BundleOnlineBookingDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BundleOnlineBookingDto),
    __metadata("design:type", BundleOnlineBookingDto)
], CreateServiceBundleDto.prototype, "onlineBooking", void 0);
exports.CreateServiceBundleDto = CreateServiceBundleDto;
//# sourceMappingURL=create-service-bundle.dto.js.map