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
exports.AppointmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const appointment_service_1 = require("./appointment.service");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
const update_appointment_dto_1 = require("./dto/update-appointment.dto");
const appointment_query_dto_1 = require("./dto/appointment-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../auth/schemas/user.schema");
const audit_interceptor_1 = require("../audit/interceptors/audit.interceptor");
const audit_decorator_1 = require("../audit/decorators/audit.decorator");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
let AppointmentController = class AppointmentController {
    constructor(appointmentService) {
        this.appointmentService = appointmentService;
    }
    create(createAppointmentDto) {
        return this.appointmentService.create(createAppointmentDto);
    }
    findAll(query) {
        return this.appointmentService.findAll(query);
    }
    getStats() {
        return this.appointmentService.getAppointmentStats();
    }
    getAvailableSlots(date, staffId) {
        return this.appointmentService.getAvailableTimeSlots(date, staffId);
    }
    getByDate(date) {
        return this.appointmentService.getAppointmentsByDate(date);
    }
    getByStaff(staffId, date) {
        return this.appointmentService.getAppointmentsByStaff(staffId, date);
    }
    findOne(id) {
        return this.appointmentService.findOne(id);
    }
    update(id, updateAppointmentDto) {
        return this.appointmentService.update(id, updateAppointmentDto);
    }
    updateStatus(id, body) {
        return this.appointmentService.updateStatus(id, body.status, body.cancellationReason);
    }
    assignStaff(id, body) {
        return this.appointmentService.assignStaff(id, body.staffId);
    }
    remove(id) {
        return this.appointmentService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.CREATE, entity: audit_log_schema_1.AuditEntity.APPOINTMENT }),
    (0, swagger_1.ApiOperation)({ summary: "Create a new appointment" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Appointment created successfully" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Time slot conflict" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_dto_1.CreateAppointmentDto]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get all appointments" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Appointments retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointment_query_dto_1.AppointmentQueryDto]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get appointment statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Statistics retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("available-slots/:date"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: "Get available time slots for a date" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Available slots retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Get)("by-date/:date"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get appointments by date" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Appointments retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "getByDate", null);
__decorate([
    (0, common_1.Get)("by-staff/:staffId"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get appointments by staff member" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Appointments retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "getByStaff", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.APPOINTMENT }),
    (0, swagger_1.ApiOperation)({ summary: "Get appointment by ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Appointment retrieved successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Appointment not found" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.APPOINTMENT }),
    (0, swagger_1.ApiOperation)({ summary: "Update appointment" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Appointment updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Appointment not found" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Time slot conflict" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appointment_dto_1.UpdateAppointmentDto]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.APPOINTMENT }),
    (0, swagger_1.ApiOperation)({ summary: "Update appointment status" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Status updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Appointment not found" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(":id/assign-staff"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.APPOINTMENT }),
    (0, swagger_1.ApiOperation)({ summary: "Assign staff to appointment" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Staff assigned successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Appointment not found" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "assignStaff", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.DELETE, entity: audit_log_schema_1.AuditEntity.APPOINTMENT }),
    (0, swagger_1.ApiOperation)({ summary: "Delete appointment" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Appointment deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Appointment not found" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentController.prototype, "remove", null);
AppointmentController = __decorate([
    (0, swagger_1.ApiTags)("Appointments"),
    (0, common_1.Controller)("appointments"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)(audit_interceptor_1.AuditInterceptor),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [appointment_service_1.AppointmentService])
], AppointmentController);
exports.AppointmentController = AppointmentController;
//# sourceMappingURL=appointment.controller.js.map