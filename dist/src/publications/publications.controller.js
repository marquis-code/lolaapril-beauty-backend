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
exports.PublicationsController = void 0;
const common_1 = require("@nestjs/common");
const publications_service_1 = require("./publications.service");
const create_publication_dto_1 = require("./dto/create-publication.dto");
const update_publication_dto_1 = require("./dto/update-publication.dto");
const review_publication_dto_1 = require("./dto/review-publication.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const enums_1 = require("../common/enums");
const audit_decorator_1 = require("../common/decorators/audit.decorator");
const user_decorator_1 = require("../common/decorators/user.decorator");
let PublicationsController = class PublicationsController {
    constructor(publicationsService) {
        this.publicationsService = publicationsService;
    }
    create(createPublicationDto) {
        return this.publicationsService.create(createPublicationDto);
    }
    findAll(status) {
        return this.publicationsService.findAll(status);
    }
    findPublished() {
        return this.publicationsService.findPublished();
    }
    findOne(id) {
        return this.publicationsService.findOne(id);
    }
    update(id, updatePublicationDto) {
        return this.publicationsService.update(id, updatePublicationDto);
    }
    submitForReview(id) {
        return this.publicationsService.submitForReview(id);
    }
    approve(id, user) {
        return this.publicationsService.approve(id, user.id);
    }
    reject(id, reviewDto, user) {
        return this.publicationsService.reject(id, user.id, reviewDto.rejectionReason);
    }
    publish(id) {
        return this.publicationsService.publish(id);
    }
    softDelete(id, user) {
        return this.publicationsService.softDelete(id, user.id);
    }
    hardDelete(id, user) {
        return this.publicationsService.hardDelete(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.EDITOR),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.CREATE, "publication"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_publication_dto_1.CreatePublicationDto]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("published"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "findPublished", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.EDITOR),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.UPDATE, "publication"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_publication_dto_1.UpdatePublicationDto]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/submit-review'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.EDITOR),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.UPDATE, 'publication'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "submitForReview", null);
__decorate([
    (0, common_1.Patch)(":id/approve"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.UPDATE, "publication"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(":id/reject"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.UPDATE, "publication"),
    __param(0, (0, common_1.Param)('id')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_publication_dto_1.ReviewPublicationDto, Object]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.UPDATE, 'publication'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "publish", null);
__decorate([
    (0, common_1.Delete)(":id/soft"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.SOFT_DELETE, "publication"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Delete)(":id/hard"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)(enums_1.AuditAction.HARD_DELETE, "publication"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublicationsController.prototype, "hardDelete", null);
PublicationsController = __decorate([
    (0, common_1.Controller)("publications"),
    __metadata("design:paramtypes", [publications_service_1.PublicationsService])
], PublicationsController);
exports.PublicationsController = PublicationsController;
//# sourceMappingURL=publications.controller.js.map