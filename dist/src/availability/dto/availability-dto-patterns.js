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
exports.GetAvailabilitySlotsQueryDto = exports.CreateStaffAvailabilityAdminDto = exports.CreateMyAvailabilityDtoExplicit = exports.CreateMyAvailabilityDto = exports.GetAvailableSlotsPublicDto = exports.CreateStaffAvailabilityDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateStaffAvailabilityDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Business ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffAvailabilityDto.prototype, "businessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff member ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffAvailabilityDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date for availability', example: '2026-01-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateStaffAvailabilityDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Available time slots',
        type: [Object],
        example: [{ startTime: '09:00', endTime: '17:00', isBreak: false }]
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateStaffAvailabilityDto.prototype, "availableSlots", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who created this availability' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffAvailabilityDto.prototype, "createdBy", void 0);
exports.CreateStaffAvailabilityDto = CreateStaffAvailabilityDto;
class GetAvailableSlotsPublicDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Business ID (required for public access)',
        example: '675cfabbb2d65f'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAvailableSlotsPublicDto.prototype, "businessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date to check availability', example: '2026-01-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetAvailableSlotsPublicDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Service IDs to book',
        type: [String],
        example: ['service_123', 'service_456']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GetAvailableSlotsPublicDto.prototype, "serviceIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preferred staff ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAvailableSlotsPublicDto.prototype, "staffId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Buffer time in minutes', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetAvailableSlotsPublicDto.prototype, "bufferTime", void 0);
exports.GetAvailableSlotsPublicDto = GetAvailableSlotsPublicDto;
class CreateMyAvailabilityDto extends (0, swagger_1.OmitType)(CreateStaffAvailabilityDto, ['businessId', 'staffId', 'createdBy']) {
}
exports.CreateMyAvailabilityDto = CreateMyAvailabilityDto;
class CreateMyAvailabilityDtoExplicit {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date for availability', example: '2026-01-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMyAvailabilityDtoExplicit.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Available time slots',
        type: [Object]
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateMyAvailabilityDtoExplicit.prototype, "availableSlots", void 0);
exports.CreateMyAvailabilityDtoExplicit = CreateMyAvailabilityDtoExplicit;
class CreateStaffAvailabilityAdminDto extends (0, swagger_1.OmitType)(CreateStaffAvailabilityDto, ['businessId', 'createdBy']) {
}
exports.CreateStaffAvailabilityAdminDto = CreateStaffAvailabilityAdminDto;
class GetAvailabilitySlotsQueryDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business ID (required for public access, optional if authenticated)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAvailabilitySlotsQueryDto.prototype, "businessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-01-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetAvailabilitySlotsQueryDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GetAvailabilitySlotsQueryDto.prototype, "serviceIds", void 0);
exports.GetAvailabilitySlotsQueryDto = GetAvailabilitySlotsQueryDto;
exports.default = {
    CreateStaffAvailabilityDto,
    GetAvailableSlotsPublicDto,
    CreateMyAvailabilityDto,
    CreateStaffAvailabilityAdminDto,
    GetAvailabilitySlotsQueryDto,
};
//# sourceMappingURL=availability-dto-patterns.js.map