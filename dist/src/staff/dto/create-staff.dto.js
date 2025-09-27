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
exports.CreateStaffDto = exports.StaffCommissionDto = exports.StaffSkillDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class StaffSkillDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StaffSkillDto.prototype, "serviceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StaffSkillDto.prototype, "serviceName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['beginner', 'intermediate', 'expert', 'master']),
    __metadata("design:type", String)
], StaffSkillDto.prototype, "skillLevel", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StaffSkillDto.prototype, "experienceMonths", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffSkillDto.prototype, "isActive", void 0);
exports.StaffSkillDto = StaffSkillDto;
class StaffCommissionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffCommissionDto.prototype, "serviceId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['percentage', 'fixed']),
    __metadata("design:type", String)
], StaffCommissionDto.prototype, "commissionType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StaffCommissionDto.prototype, "commissionValue", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StaffCommissionDto.prototype, "minimumAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffCommissionDto.prototype, "isActive", void 0);
exports.StaffCommissionDto = StaffCommissionDto;
class CreateStaffDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "businessId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['stylist', 'barber', 'therapist', 'nail_tech', 'receptionist', 'manager', 'owner']),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['full_time', 'part_time', 'contractor', 'intern']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "employmentType", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateStaffDto.prototype, "hireDate", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StaffSkillDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "skills", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StaffCommissionDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "commissionStructure", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "profileImage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "bio", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "certifications", void 0);
exports.CreateStaffDto = CreateStaffDto;
//# sourceMappingURL=create-staff.dto.js.map