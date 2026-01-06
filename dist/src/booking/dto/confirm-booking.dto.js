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
exports.ConfirmBookingDto = exports.StaffServiceAssignmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class StaffServiceAssignmentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff member ID',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], StaffServiceAssignmentDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Service ID this staff will handle',
        example: '507f1f77bcf86cd799439012'
    }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], StaffServiceAssignmentDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Staff member name (optional)',
        example: 'John Doe'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StaffServiceAssignmentDto.prototype, "staffName", void 0);
exports.StaffServiceAssignmentDto = StaffServiceAssignmentDto;
class ConfirmBookingDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Single staff ID (deprecated - use staffAssignments instead)',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], ConfirmBookingDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Multiple staff assignments per service',
        type: [StaffServiceAssignmentDto]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StaffServiceAssignmentDto),
    __metadata("design:type", Array)
], ConfirmBookingDto.prototype, "staffAssignments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes for the confirmation',
        example: 'Client prefers window seat'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfirmBookingDto.prototype, "notes", void 0);
exports.ConfirmBookingDto = ConfirmBookingDto;
//# sourceMappingURL=confirm-booking.dto.js.map