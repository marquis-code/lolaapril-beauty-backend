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
exports.CalculateRefundDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CalculateRefundDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-12-25T14:00:00Z',
        description: 'Appointment date and time (ISO format)'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculateRefundDto.prototype, "appointmentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5000,
        description: 'Total amount paid for the appointment'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CalculateRefundDto.prototype, "paidAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1000,
        description: 'Deposit amount paid (if any)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CalculateRefundDto.prototype, "depositAmount", void 0);
exports.CalculateRefundDto = CalculateRefundDto;
//# sourceMappingURL=calculate-refund.dto.js.map