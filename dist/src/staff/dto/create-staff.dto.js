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
exports.UpdateStaffDto = exports.CheckAvailabilityDto = exports.GetStaffAssignmentsDto = exports.CompleteAssignmentDto = exports.CheckInStaffDto = exports.AutoAssignStaffDto = exports.AssignStaffDto = exports.AssignmentDetailsDto = exports.CreateStaffScheduleDto = exports.DailyScheduleDto = exports.TimeSlotDto = exports.CreateStaffDto = exports.StaffCommissionDto = exports.StaffSkillDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class StaffSkillDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439012' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StaffSkillDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Haircut' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StaffSkillDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['beginner', 'intermediate', 'expert', 'master'],
        example: 'expert'
    }),
    (0, class_validator_1.IsEnum)(['beginner', 'intermediate', 'expert', 'master']),
    __metadata("design:type", String)
], StaffSkillDto.prototype, "skillLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 36 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StaffSkillDto.prototype, "experienceMonths", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffSkillDto.prototype, "isActive", void 0);
exports.StaffSkillDto = StaffSkillDto;
class StaffCommissionDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '507f1f77bcf86cd799439012' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StaffCommissionDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['percentage', 'fixed'],
        example: 'percentage'
    }),
    (0, class_validator_1.IsEnum)(['percentage', 'fixed']),
    __metadata("design:type", String)
], StaffCommissionDto.prototype, "commissionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StaffCommissionDto.prototype, "commissionValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StaffCommissionDto.prototype, "minimumAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffCommissionDto.prototype, "isActive", void 0);
exports.StaffCommissionDto = StaffCommissionDto;
class CreateStaffDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Business ID',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "businessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff first name',
        example: 'John'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff last name',
        example: 'Doe'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff email address',
        example: 'john.doe@example.com'
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff phone number',
        example: '+2348012345678'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
        message: 'Phone number must be valid'
    }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff role',
        enum: ['stylist', 'barber', 'therapist', 'nail_tech', 'receptionist', 'manager', 'owner'],
        example: 'stylist'
    }),
    (0, class_validator_1.IsEnum)(['stylist', 'barber', 'therapist', 'nail_tech', 'receptionist', 'manager', 'owner']),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Employment type',
        enum: ['full_time', 'part_time', 'contractor', 'intern'],
        example: 'full_time'
    }),
    (0, class_validator_1.IsEnum)(['full_time', 'part_time', 'contractor', 'intern']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hire date',
        example: '2024-01-01'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateStaffDto.prototype, "hireDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Staff skills',
        type: [StaffSkillDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StaffSkillDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Commission structure',
        type: [StaffCommissionDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StaffCommissionDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "commissionStructure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Profile image URL',
        example: 'https://example.com/profile.jpg'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Staff bio',
        example: 'Experienced hair stylist with 5 years of experience'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Certifications',
        example: ['Advanced Styling Certificate', 'Color Specialist']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStaffDto.prototype, "certifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Password for staff account (optional - will be auto-generated if not provided)',
        example: 'SecurePassword123!',
        minLength: 8
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "password", void 0);
exports.CreateStaffDto = CreateStaffDto;
class TimeSlotDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TimeSlotDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TimeSlotDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], TimeSlotDto.prototype, "isBreak", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TimeSlotDto.prototype, "breakType", void 0);
exports.TimeSlotDto = TimeSlotDto;
class DailyScheduleDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DailyScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DailyScheduleDto.prototype, "isWorkingDay", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TimeSlotDto),
    __metadata("design:type", Array)
], DailyScheduleDto.prototype, "workingHours", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TimeSlotDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DailyScheduleDto.prototype, "breaks", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DailyScheduleDto.prototype, "maxHoursPerDay", void 0);
exports.DailyScheduleDto = DailyScheduleDto;
class CreateStaffScheduleDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "staffId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "businessId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateStaffScheduleDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateStaffScheduleDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DailyScheduleDto),
    __metadata("design:type", Array)
], CreateStaffScheduleDto.prototype, "weeklySchedule", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['regular', 'temporary', 'override', '24_7']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "scheduleType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffScheduleDto.prototype, "createdBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateStaffScheduleDto.prototype, "isDefault24_7", void 0);
exports.CreateStaffScheduleDto = CreateStaffScheduleDto;
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
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AssignmentDetailsDto.prototype, "setupTimeMinutes", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
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
    (0, class_validator_1.IsOptional)(),
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
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignStaffDto.prototype, "assignedBy", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['auto', 'manual', 'client_request']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignStaffDto.prototype, "assignmentMethod", void 0);
exports.AssignStaffDto = AssignStaffDto;
class AutoAssignStaffDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AutoAssignStaffDto.prototype, "businessId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AutoAssignStaffDto.prototype, "appointmentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AutoAssignStaffDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AutoAssignStaffDto.prototype, "serviceId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], AutoAssignStaffDto.prototype, "assignmentDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AutoAssignStaffDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AutoAssignStaffDto.prototype, "endTime", void 0);
exports.AutoAssignStaffDto = AutoAssignStaffDto;
class CheckInStaffDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckInStaffDto.prototype, "staffId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckInStaffDto.prototype, "businessId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckInStaffDto.prototype, "checkedInBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckInStaffDto.prototype, "notes", void 0);
exports.CheckInStaffDto = CheckInStaffDto;
class CompleteAssignmentDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteAssignmentDto.prototype, "actualStartTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteAssignmentDto.prototype, "actualEndTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteAssignmentDto.prototype, "completionNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CompleteAssignmentDto.prototype, "rating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteAssignmentDto.prototype, "clientFeedback", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteAssignmentDto.prototype, "staffFeedback", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteAssignmentDto.prototype, "qualityCheckNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CompleteAssignmentDto.prototype, "qualityCheckCompleted", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteAssignmentDto.prototype, "qualityCheckedBy", void 0);
exports.CompleteAssignmentDto = CompleteAssignmentDto;
class GetStaffAssignmentsDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetStaffAssignmentsDto.prototype, "staffId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], GetStaffAssignmentsDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], GetStaffAssignmentsDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetStaffAssignmentsDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetStaffAssignmentsDto.prototype, "serviceId", void 0);
exports.GetStaffAssignmentsDto = GetStaffAssignmentsDto;
class CheckAvailabilityDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckAvailabilityDto.prototype, "businessId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CheckAvailabilityDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckAvailabilityDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckAvailabilityDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckAvailabilityDto.prototype, "serviceId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CheckAvailabilityDto.prototype, "excludeStaffIds", void 0);
exports.CheckAvailabilityDto = CheckAvailabilityDto;
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
    (0, class_transformer_1.Type)(() => StaffSkillDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStaffDto.prototype, "skills", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StaffCommissionDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStaffDto.prototype, "commissionStructure", void 0);
exports.UpdateStaffDto = UpdateStaffDto;
//# sourceMappingURL=create-staff.dto.js.map