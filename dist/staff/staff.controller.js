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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const staff_service_1 = require("../staff/staff.service");
const create_staff_dto_1 = require("../staff/dto/create-staff.dto");
const create_staff_schedule_dto_1 = require("../staff/dto/create-staff-schedule.dto");
const assign_staff_dto_1 = require("../staff/dto/assign-staff.dto");
const auto_assign_staff_dto_1 = require("../staff/dto/auto-assign-staff.dto");
const check_in_staff_dto_1 = require("../staff/dto/check-in-staff.dto");
const complete_assignment_dto_1 = require("../staff/dto/complete-assignment.dto");
let StaffController = class StaffController {
    constructor(staffService) {
        this.staffService = staffService;
    }
    async createStaff(createStaffDto, req) {
        try {
            const businessId = req.tenant.businessId;
            const staff = await this.staffService.createStaff({
                ...createStaffDto,
                businessId
            });
            return {
                success: true,
                data: staff,
                message: 'Staff member created successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'STAFF_CREATION_FAILED'
            };
        }
    }
    async getStaffByBusiness(status, req) {
        try {
            const businessId = req.tenant.businessId;
            const staff = await this.staffService.getStaffByBusiness(businessId, status);
            return {
                success: true,
                data: staff,
                message: 'Staff members retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'STAFF_RETRIEVAL_FAILED'
            };
        }
    }
    async getAvailableStaff(date, startTime, endTime, serviceId, req) {
        try {
            const businessId = req.tenant.businessId;
            const availableStaff = await this.staffService.getAvailableStaff(businessId, new Date(date), startTime, endTime, serviceId);
            return {
                success: true,
                data: availableStaff,
                message: 'Available staff retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'AVAILABLE_STAFF_RETRIEVAL_FAILED'
            };
        }
    }
    async createSchedule(createScheduleDto, req) {
        try {
            const businessId = req.tenant.businessId;
            const createdBy = req.user.id;
            const schedule = await this.staffService.createStaffSchedule({
                ...createScheduleDto,
                businessId,
                createdBy
            });
            return {
                success: true,
                data: schedule,
                message: 'Staff schedule created successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'SCHEDULE_CREATION_FAILED'
            };
        }
    }
    async getSchedule(staffId, date) {
        try {
            const schedule = await this.staffService.getStaffSchedule(staffId, new Date(date));
            return {
                success: true,
                data: schedule,
                message: 'Staff schedule retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'SCHEDULE_RETRIEVAL_FAILED'
            };
        }
    }
    async assignStaff(assignStaffDto, req) {
        try {
            const businessId = req.tenant.businessId;
            const assignedBy = req.user.id;
            const assignment = await this.staffService.assignStaffToAppointment({
                ...assignStaffDto,
                businessId,
                assignedBy,
                assignmentMethod: 'manual'
            });
            return {
                success: true,
                data: assignment,
                message: 'Staff assigned successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'STAFF_ASSIGNMENT_FAILED'
            };
        }
    }
    async autoAssignStaff(autoAssignDto) {
        try {
            const assignment = await this.staffService.autoAssignStaff(autoAssignDto.businessId, autoAssignDto.appointmentId, autoAssignDto.clientId, autoAssignDto.serviceId, autoAssignDto.assignmentDate, autoAssignDto.startTime, autoAssignDto.endTime);
            return {
                success: true,
                data: assignment,
                message: 'Staff auto-assigned successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'AUTO_ASSIGNMENT_FAILED'
            };
        }
    }
    async getAssignments(staffId, startDate, endDate) {
        try {
            const assignments = await this.staffService.getStaffAssignments(staffId, new Date(startDate), new Date(endDate));
            return {
                success: true,
                data: assignments,
                message: 'Staff assignments retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'ASSIGNMENTS_RETRIEVAL_FAILED'
            };
        }
    }
    async completeAssignment(assignmentId, completionData) {
        try {
            const assignment = await this.staffService.completeStaffAssignment(assignmentId, completionData);
            return {
                success: true,
                data: assignment,
                message: 'Assignment completed successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'ASSIGNMENT_COMPLETION_FAILED'
            };
        }
    }
    async checkIn(checkInDto, req) {
        try {
            const businessId = req.tenant.businessId;
            const checkedInBy = req.user.id;
            await this.staffService.checkInStaff({
                ...checkInDto,
                businessId,
                checkedInBy
            });
            return {
                success: true,
                message: 'Staff checked in successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'CHECK_IN_FAILED'
            };
        }
    }
    async checkOut(staffId, req) {
        try {
            const businessId = req.tenant.businessId;
            const checkedOutBy = req.user.id;
            await this.staffService.checkOutStaff(staffId, businessId, checkedOutBy);
            return {
                success: true,
                message: 'Staff checked out successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'CHECK_OUT_FAILED'
            };
        }
    }
    async getWorkingHours(staffId, startDate, endDate) {
        try {
            const workingHours = await this.staffService.getStaffWorkingHours(staffId, new Date(startDate), new Date(endDate));
            return {
                success: true,
                data: workingHours,
                message: 'Working hours retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'WORKING_HOURS_RETRIEVAL_FAILED'
            };
        }
    }
    async getStaffById(staffId) {
        try {
            const staff = await this.staffService.getStaffById(staffId);
            return {
                success: true,
                data: staff,
                message: 'Staff profile retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'STAFF_PROFILE_RETRIEVAL_FAILED'
            };
        }
    }
    async updateStaffSkills(staffId, skills) {
        try {
            const staff = await this.staffService.updateStaffSkills(staffId, skills);
            return {
                success: true,
                data: staff,
                message: 'Staff skills updated successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'SKILLS_UPDATE_FAILED'
            };
        }
    }
    async updateStaffStatus(staffId, status, reason) {
        try {
            const staff = await this.staffService.updateStaffStatus(staffId, status, reason);
            return {
                success: true,
                data: staff,
                message: 'Staff status updated successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: 'STATUS_UPDATE_FAILED'
            };
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_dto_1.CreateStaffDto, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "createStaff", null);
__decorate([
    (0, common_1.Get)('business'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffByBusiness", null);
__decorate([
    (0, common_1.Get)('available'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('startTime')),
    __param(2, (0, common_1.Query)('endTime')),
    __param(3, (0, common_1.Query)('serviceId')),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getAvailableStaff", null);
__decorate([
    (0, common_1.Post)('schedule'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_schedule_dto_1.CreateStaffScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Get)('schedule/:staffId'),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getSchedule", null);
__decorate([
    (0, common_1.Post)('assign'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_staff_dto_1.AssignStaffDto, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "assignStaff", null);
__decorate([
    (0, common_1.Post)('auto-assign'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auto_assign_staff_dto_1.AutoAssignStaffDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "autoAssignStaff", null);
__decorate([
    (0, common_1.Get)('assignments/:staffId'),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getAssignments", null);
__decorate([
    (0, common_1.Put)('assignment/:assignmentId/complete'),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, complete_assignment_dto_1.CompleteAssignmentDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "completeAssignment", null);
__decorate([
    (0, common_1.Post)('checkin'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_in_staff_dto_1.CheckInStaffDto, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('checkout'),
    __param(0, (0, common_1.Body)('staffId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Get)('working-hours/:staffId'),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getWorkingHours", null);
__decorate([
    (0, common_1.Get)(':staffId'),
    __param(0, (0, common_1.Param)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffById", null);
__decorate([
    (0, common_1.Put)(':staffId/skills'),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Body)('skills')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "updateStaffSkills", null);
__decorate([
    (0, common_1.Put)(':staffId/status'),
    __param(0, (0, common_1.Param)('staffId')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "updateStaffStatus", null);
StaffController = __decorate([
    (0, common_1.Controller)('staff'),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
exports.StaffController = StaffController;
//# sourceMappingURL=staff.controller.js.map