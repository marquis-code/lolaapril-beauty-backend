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
exports.CreateMembershipDto = exports.MembershipTierDto = exports.MembershipBenefitDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class MembershipBenefitDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "discount",
        enum: ["discount", "free_service", "priority_booking", "exclusive_access"],
    }),
    (0, class_validator_1.IsEnum)(["discount", "free_service", "priority_booking", "exclusive_access"]),
    __metadata("design:type", String)
], MembershipBenefitDto.prototype, "benefitType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "10% discount on all services" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MembershipBenefitDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MembershipBenefitDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "service_001" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MembershipBenefitDto.prototype, "freeServiceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Free Hair Wash" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MembershipBenefitDto.prototype, "freeServiceName", void 0);
exports.MembershipBenefitDto = MembershipBenefitDto;
class MembershipTierDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Silver" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MembershipTierDto.prototype, "tierName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], MembershipTierDto.prototype, "tierLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MembershipTierDto.prototype, "minimumSpend", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1.5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], MembershipTierDto.prototype, "pointsMultiplier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MembershipBenefitDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MembershipBenefitDto),
    __metadata("design:type", Array)
], MembershipTierDto.prototype, "benefits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "#C0C0C0" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MembershipTierDto.prototype, "tierColor", void 0);
exports.MembershipTierDto = MembershipTierDto;
class CreateMembershipDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "VIP Membership" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "membershipName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Exclusive membership program with amazing benefits" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "tier_based",
        enum: ["points_based", "tier_based", "subscription", "prepaid"],
    }),
    (0, class_validator_1.IsEnum)(["points_based", "tier_based", "subscription", "prepaid"]),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "membershipType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [MembershipTierDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MembershipTierDto),
    __metadata("design:type", Array)
], CreateMembershipDto.prototype, "tiers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMembershipDto.prototype, "pointsPerDollar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateMembershipDto.prototype, "pointsRedemptionValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMembershipDto.prototype, "subscriptionPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateMembershipDto.prototype, "subscriptionDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [MembershipBenefitDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MembershipBenefitDto),
    __metadata("design:type", Array)
], CreateMembershipDto.prototype, "generalBenefits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMembershipDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "507f1f77bcf86cd799439011" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "createdBy", void 0);
exports.CreateMembershipDto = CreateMembershipDto;
//# sourceMappingURL=create-membership.dto.js.map