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
exports.CreateTeamMemberDto = exports.EmergencyContactDto = exports.CommissionDto = exports.SkillsDto = exports.WorkingHoursDto = exports.PhoneDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class PhoneDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PhoneDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234567890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PhoneDto.prototype, "number", void 0);
exports.PhoneDto = PhoneDto;
class WorkingHoursDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Monday" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WorkingHoursDto.prototype, "day", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "09:00" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WorkingHoursDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "17:00" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WorkingHoursDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], WorkingHoursDto.prototype, "isWorking", void 0);
exports.WorkingHoursDto = WorkingHoursDto;
class SkillsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
        description: "Array of service ObjectIds"
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], SkillsDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ["Bridal Hair", "Color Correction"] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SkillsDto.prototype, "specializations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Senior" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SkillsDto.prototype, "experienceLevel", void 0);
exports.SkillsDto = SkillsDto;
class CommissionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "507f1f77bcf86cd799439011",
        description: "Service ObjectId"
    }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], CommissionDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Hair Cut" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CommissionDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "percentage", enum: ["percentage", "fixed"] }),
    (0, class_validator_1.IsEnum)(["percentage", "fixed"]),
    __metadata("design:type", String)
], CommissionDto.prototype, "commissionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CommissionDto.prototype, "commissionValue", void 0);
exports.CommissionDto = CommissionDto;
class EmergencyContactDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Jane Doe" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Spouse" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "relationship", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "+234 123 456 7890" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "phone", void 0);
exports.EmergencyContactDto = EmergencyContactDto;
class CreateTeamMemberDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "John" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTeamMemberDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Doe" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTeamMemberDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "john.doe@salon.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateTeamMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PhoneDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PhoneDto),
    __metadata("design:type", PhoneDto)
], CreateTeamMemberDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "stylist",
        enum: ["admin", "manager", "stylist", "therapist", "receptionist", "cleaner"],
    }),
    (0, class_validator_1.IsEnum)(["admin", "manager", "stylist", "therapist", "receptionist", "cleaner"]),
    __metadata("design:type", String)
], CreateTeamMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "full_time",
        enum: ["full_time", "part_time", "contract", "freelance"],
    }),
    (0, class_validator_1.IsEnum)(["full_time", "part_time", "contract", "freelance"]),
    __metadata("design:type", String)
], CreateTeamMemberDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2025-01-01T00:00:00.000Z" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateTeamMemberDto.prototype, "hireDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTeamMemberDto.prototype, "salary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [WorkingHoursDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkingHoursDto),
    __metadata("design:type", Array)
], CreateTeamMemberDto.prototype, "workingHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SkillsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SkillsDto),
    __metadata("design:type", SkillsDto)
], CreateTeamMemberDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CommissionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CommissionDto),
    __metadata("design:type", Array)
], CreateTeamMemberDto.prototype, "commissions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "https://example.com/profile.jpg" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTeamMemberDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Experienced hair stylist with 5+ years in the industry" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTeamMemberDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTeamMemberDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTeamMemberDto.prototype, "canBookOnline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: EmergencyContactDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EmergencyContactDto),
    __metadata("design:type", EmergencyContactDto)
], CreateTeamMemberDto.prototype, "emergencyContact", void 0);
exports.CreateTeamMemberDto = CreateTeamMemberDto;
//# sourceMappingURL=create-team-member.dto.js.map