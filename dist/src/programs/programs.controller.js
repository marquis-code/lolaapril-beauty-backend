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
exports.ProgramsController = void 0;
const common_1 = require("@nestjs/common");
const programs_service_1 = require("./programs.service");
const create_program_dto_1 = require("./dto/create-program.dto");
const update_program_dto_1 = require("./dto/update-program.dto");
const submit_application_dto_1 = require("./dto/submit-application.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const audit_decorator_1 = require("../common/decorators/audit.decorator");
const enums_1 = require("../common/enums");
let ProgramsController = class ProgramsController {
    constructor(programsService) {
        this.programsService = programsService;
    }
    create(createProgramDto) {
        return this.programsService.create(createProgramDto);
    }
    findAll(status) {
        return this.programsService.findAll(status);
    }
    findActive() {
        return this.programsService.findActive();
    }
    findOne(id) {
        return this.programsService.findOne(id);
    }
    getRegistrationLink(id) {
        return this.programsService.getRegistrationLink(id);
    }
    getApplications(id) {
        return this.programsService.getApplications(id);
    }
    submitApplication(token, applicationDto) {
        return this.programsService.submitApplication(token, applicationDto);
    }
    update(id, updateProgramDto) {
        return this.programsService.update(id, updateProgramDto);
    }
    activate(id) {
        return this.programsService.activate(id);
    }
    deactivate(id) {
        return this.programsService.deactivate(id);
    }
    softDelete(id, user) {
        return this.programsService.softDelete(id, user.id);
    }
    hardDelete(id) {
        return this.programsService.hardDelete(id);
    }
    restore(id) {
        return this.programsService.restore(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.CREATE, "program"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_program_dto_1.CreateProgramDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("active"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/registration-link"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "getRegistrationLink", null);
__decorate([
    (0, common_1.Get)(":id/applications"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.EDITOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "getApplications", null);
__decorate([
    (0, common_1.Post)("apply/:token"),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.CREATE, "program_application"),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_application_dto_1.SubmitApplicationDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "submitApplication", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.UPDATE, "program"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_program_dto_1.UpdateProgramDto]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/activate"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.UPDATE, "program"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "activate", null);
__decorate([
    (0, common_1.Patch)(":id/deactivate"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.UPDATE, "program"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(":id/soft"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.SOFT_DELETE, "program"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Delete)(":id/hard"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.DELETE, "program"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "hardDelete", null);
__decorate([
    (0, common_1.Patch)(":id/restore"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.RESTORE, "program"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramsController.prototype, "restore", null);
ProgramsController = __decorate([
    (0, common_1.Controller)("programs"),
    __metadata("design:paramtypes", [programs_service_1.ProgramsService])
], ProgramsController);
exports.ProgramsController = ProgramsController;
//# sourceMappingURL=programs.controller.js.map