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
exports.CreateFeeStructureDto = exports.CustomRulesDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CustomRulesDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5000, description: 'No-show fee amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CustomRulesDto.prototype, "noShowFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2000, description: 'Cancellation fee amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CustomRulesDto.prototype, "cancellationFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1000, description: 'Minimum booking amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CustomRulesDto.prototype, "minBookingAmount", void 0);
exports.CustomRulesDto = CustomRulesDto;
class CreateFeeStructureDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '674e1d77a83f982823675034', description: 'Pricing tier ID (optional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeeStructureDto.prototype, "pricingTierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2.5, description: 'Platform fee percentage (e.g., 2.5 for 2.5%)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateFeeStructureDto.prototype, "platformFeePercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100, description: 'Fixed platform fee amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFeeStructureDto.prototype, "platformFeeFixed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-01-20T00:00:00.000Z', description: 'Effective from date (ISO format)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFeeStructureDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2027-01-20T00:00:00.000Z', description: 'Effective until date (ISO format)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFeeStructureDto.prototype, "effectiveTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, description: 'Whether this is a grandfathered pricing' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFeeStructureDto.prototype, "isGrandfathered", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: CustomRulesDto, description: 'Custom fee rules' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CustomRulesDto),
    __metadata("design:type", CustomRulesDto)
], CreateFeeStructureDto.prototype, "customRules", void 0);
exports.CreateFeeStructureDto = CreateFeeStructureDto;
//# sourceMappingURL=create-fee-structure.dto.js.map