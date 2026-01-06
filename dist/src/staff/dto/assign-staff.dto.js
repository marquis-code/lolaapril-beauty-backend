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
exports.AssignStaffDto = exports.AssignmentDetailsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AssignmentDetailsDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignmentDetailsDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignmentDetailsDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['primary', 'secondary', 'backup']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignmentDetailsDto.prototype, "assignmentType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AssignmentDetailsDto.prototype, "estimatedDuration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignmentDetailsDto.prototype, "specialInstructions", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignmentDetailsDto.prototype, "roomNumber", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], AssignmentDetailsDto.prototype, "requiredEquipment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignmentDetailsDto.prototype, "clientPreferences", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AssignmentDetailsDto.prototype, "setupTimeMinutes", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AssignmentDetailsDto.prototype, "cleanupTimeMinutes", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignmentDetailsDto.prototype, "serviceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignmentDetailsDto.prototype, "serviceName", void 0);
exports.AssignmentDetailsDto = AssignmentDetailsDto;
class AssignStaffDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignStaffDto.prototype, "staffId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignStaffDto.prototype, "businessId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignStaffDto.prototype, "appointmentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignStaffDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], AssignStaffDto.prototype, "assignmentDate", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AssignmentDetailsDto),
    __metadata("design:type", AssignmentDetailsDto)
], AssignStaffDto.prototype, "assignmentDetails", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignStaffDto.prototype, "assignedBy", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['auto', 'manual', 'client_request']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignStaffDto.prototype, "assignmentMethod", void 0);
exports.AssignStaffDto = AssignStaffDto;
//# sourceMappingURL=assign-staff.dto.js.map