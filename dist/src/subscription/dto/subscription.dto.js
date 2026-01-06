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
exports.CheckLimitDto = exports.CancelSubscriptionDto = exports.UpgradePlanDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpgradePlanDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Plan type to upgrade to',
        enum: ['basic', 'standard', 'premium', 'enterprise']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['basic', 'standard', 'premium', 'enterprise']),
    __metadata("design:type", String)
], UpgradePlanDto.prototype, "planType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Billing cycle' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['monthly', 'yearly']),
    __metadata("design:type", String)
], UpgradePlanDto.prototype, "billingCycle", void 0);
exports.UpgradePlanDto = UpgradePlanDto;
class CancelSubscriptionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for cancellation' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelSubscriptionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Immediate cancellation or at period end' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CancelSubscriptionDto.prototype, "immediate", void 0);
exports.CancelSubscriptionDto = CancelSubscriptionDto;
class CheckLimitDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Context to check limits for',
        enum: ['booking', 'staff', 'service']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['booking', 'staff', 'service']),
    __metadata("design:type", String)
], CheckLimitDto.prototype, "context", void 0);
exports.CheckLimitDto = CheckLimitDto;
//# sourceMappingURL=subscription.dto.js.map