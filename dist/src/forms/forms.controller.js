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
exports.FormsController = void 0;
const common_1 = require("@nestjs/common");
const forms_service_1 = require("./forms.service");
const create_form_dto_1 = require("./dto/create-form.dto");
const update_form_dto_1 = require("./dto/update-form.dto");
const submit_form_dto_1 = require("./dto/submit-form.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const enums_1 = require("../common/enums");
const audit_decorator_1 = require("../common/decorators/audit.decorator");
const user_decorator_1 = require("../common/decorators/user.decorator");
let FormsController = class FormsController {
    constructor(formsService) {
        this.formsService = formsService;
    }
    create(createFormDto) {
        return this.formsService.create(createFormDto);
    }
    findAll() {
        return this.formsService.findAll();
    }
    findOne(id) {
        return this.formsService.findOne(id);
    }
    getSubmissions(id) {
        return this.formsService.getSubmissions(id);
    }
    submitForm(id, submitFormDto) {
        return this.formsService.submitForm(id, submitFormDto);
    }
    update(id, updateFormDto) {
        return this.formsService.update(id, updateFormDto);
    }
    softDelete(id, user) {
        return this.formsService.softDelete(id, user.id);
    }
    hardDelete(id) {
        return this.formsService.hardDelete(id);
    }
    restore(id) {
        return this.formsService.restore(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.CREATE, "form"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_form_dto_1.CreateFormDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.EDITOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/submissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.EDITOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "getSubmissions", null);
__decorate([
    (0, common_1.Post)(":id/submit"),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.CREATE, "form_submission"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_form_dto_1.SubmitFormDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "submitForm", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.UPDATE, "form"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_form_dto_1.UpdateFormDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id/soft"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.SOFT_DELETE, "form"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Delete)(':id/hard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.DELETE, 'form'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "hardDelete", null);
__decorate([
    (0, common_1.Patch)(':id/restore'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.RESTORE, 'form'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "restore", null);
FormsController = __decorate([
    (0, common_1.Controller)("forms"),
    __metadata("design:paramtypes", [forms_service_1.FormsService])
], FormsController);
exports.FormsController = FormsController;
//# sourceMappingURL=forms.controller.js.map