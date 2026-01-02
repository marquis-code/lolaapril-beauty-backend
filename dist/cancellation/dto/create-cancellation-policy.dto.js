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
exports.CreateCancellationPolicyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class PolicyRuleDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 48 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PolicyRuleDto.prototype, "hoursBeforeAppointment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PolicyRuleDto.prototype, "refundPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PolicyRuleDto.prototype, "penaltyPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Full refund for early cancellations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyRuleDto.prototype, "description", void 0);
class CreateCancellationPolicyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Standard Cancellation Policy' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCancellationPolicyDto.prototype, "policyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCancellationPolicyDto.prototype, "requiresDeposit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateCancellationPolicyDto.prototype, "depositPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCancellationPolicyDto.prototype, "minimumDepositAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 24 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCancellationPolicyDto.prototype, "cancellationWindowHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PolicyRuleDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PolicyRuleDto),
    __metadata("design:type", Array)
], CreateCancellationPolicyDto.prototype, "rules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCancellationPolicyDto.prototype, "allowSameDayCancellation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateCancellationPolicyDto.prototype, "sameDayRefundPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: [24, 4, 1] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateCancellationPolicyDto.prototype, "reminderHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Policy applies to all services' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCancellationPolicyDto.prototype, "description", void 0);
exports.CreateCancellationPolicyDto = CreateCancellationPolicyDto;
//# sourceMappingURL=create-cancellation-policy.dto.js.map