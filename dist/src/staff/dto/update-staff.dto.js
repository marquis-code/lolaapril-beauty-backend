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
exports.UpdateStaffDto = void 0;
const class_validator_1 = require("class-validator");
const create_staff_dto_1 = require("./create-staff.dto");
const class_transformer_1 = require("class-transformer");
class UpdateStaffDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['stylist', 'barber', 'therapist', 'nail_tech', 'receptionist', 'manager', 'owner']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['full_time', 'part_time', 'contractor', 'intern']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "employmentType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['active', 'inactive', 'on_leave', 'terminated']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "profileImage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "bio", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStaffDto.prototype, "certifications", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_staff_dto_1.StaffSkillDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStaffDto.prototype, "skills", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_staff_dto_1.StaffCommissionDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStaffDto.prototype, "commissionStructure", void 0);
exports.UpdateStaffDto = UpdateStaffDto;
//# sourceMappingURL=update-staff.dto.js.map