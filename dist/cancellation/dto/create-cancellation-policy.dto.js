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
exports.UpdateCancellationPolicyDto = exports.CreateCancellationPolicyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class PolicyRuleDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 48,
        description: 'Hours before appointment this rule applies'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PolicyRuleDto.prototype, "hoursBeforeAppointment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100,
        description: 'Percentage of refund (0-100)'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PolicyRuleDto.prototype, "refundPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: 'Penalty percentage (0-100)'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PolicyRuleDto.prototype, "penaltyPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Full refund for early cancellations',
        description: 'Description of this rule'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyRuleDto.prototype, "description", void 0);
class CreateCancellationPolicyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Standard Cancellation Policy',
        description: 'Name of the policy'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCancellationPolicyDto.prototype, "policyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether deposits are required'
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCancellationPolicyDto.prototype, "requiresDeposit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 20,
        description: 'Deposit percentage (0-100)'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateCancellationPolicyDto.prototype, "depositPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1000,
        description: 'Minimum deposit amount in currency'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCancellationPolicyDto.prototype, "minimumDepositAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 24,
        description: 'Minimum hours before appointment for free cancellation'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCancellationPolicyDto.prototype, "cancellationWindowHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [PolicyRuleDto],
        description: 'Cancellation rules based on notice period'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PolicyRuleDto),
    __metadata("design:type", Array)
], CreateCancellationPolicyDto.prototype, "rules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Allow same-day cancellations'
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCancellationPolicyDto.prototype, "allowSameDayCancellation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: 'Refund percentage for same-day cancellations'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateCancellationPolicyDto.prototype, "sameDayRefundPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: [24, 4, 1],
        description: 'Hours before appointment to send reminders'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateCancellationPolicyDto.prototype, "reminderHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 3,
        description: 'Max no-shows before requiring deposits'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCancellationPolicyDto.prototype, "maxNoShowsBeforeDeposit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Policy applies to all services',
        description: 'Policy description'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCancellationPolicyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['507f1f77bcf86cd799439011'],
        description: 'Service IDs this policy applies to (empty = all services)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCancellationPolicyDto.prototype, "applicableServices", void 0);
exports.CreateCancellationPolicyDto = CreateCancellationPolicyDto;
class UpdateCancellationPolicyDto extends (0, swagger_1.PartialType)(CreateCancellationPolicyDto) {
}
exports.UpdateCancellationPolicyDto = UpdateCancellationPolicyDto;
//# sourceMappingURL=create-cancellation-policy.dto.js.map