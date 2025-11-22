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
exports.TeamController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const team_service_1 = require("./team.service");
const create_team_member_dto_1 = require("./dto/create-team-member.dto");
const update_team_member_dto_1 = require("./dto/update-team-member.dto");
const team_member_query_dto_1 = require("./dto/team-member-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../auth/schemas/user.schema");
const audit_interceptor_1 = require("../audit/interceptors/audit.interceptor");
const audit_decorator_1 = require("../audit/decorators/audit.decorator");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
let TeamController = class TeamController {
    constructor(teamService) {
        this.teamService = teamService;
    }
    create(createTeamMemberDto) {
        return this.teamService.create(createTeamMemberDto);
    }
    findAll(query) {
        return this.teamService.findAll(query);
    }
    getStats() {
        return this.teamService.getTeamStats();
    }
    findByRole(role) {
        return this.teamService.findByRole(role);
    }
    findByDepartment(department) {
        return this.teamService.findByDepartment(department);
    }
    findOne(id) {
        return this.teamService.findOne(id);
    }
    update(id, updateTeamMemberDto) {
        return this.teamService.update(id, updateTeamMemberDto);
    }
    updateStatus(id, status) {
        return this.teamService.updateStatus(id, status);
    }
    remove(id) {
        return this.teamService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.CREATE, entity: audit_log_schema_1.AuditEntity.TEAM_MEMBER }),
    (0, swagger_1.ApiOperation)({ summary: "Create a new team member" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Team member created successfully" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Team member with email already exists" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_team_member_dto_1.CreateTeamMemberDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get all team members" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Team members retrieved successfully" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [team_member_query_dto_1.TeamMemberQueryDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Get team statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Team statistics retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("role/:role"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get team members by role" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Team members retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "findByRole", null);
__decorate([
    (0, common_1.Get)("department/:department"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get team members by department" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Team members retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "findByDepartment", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.TEAM_MEMBER }),
    (0, swagger_1.ApiOperation)({ summary: "Get team member by ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Team member retrieved successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Team member not found" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.TEAM_MEMBER }),
    (0, swagger_1.ApiOperation)({ summary: "Update team member" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Team member updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Team member not found" }),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_team_member_dto_1.UpdateTeamMemberDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.TEAM_MEMBER }),
    (0, swagger_1.ApiOperation)({ summary: "Update team member status" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Team member status updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Team member not found" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.DELETE, entity: audit_log_schema_1.AuditEntity.TEAM_MEMBER }),
    (0, swagger_1.ApiOperation)({ summary: "Delete team member" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Team member deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Team member not found" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "remove", null);
TeamController = __decorate([
    (0, swagger_1.ApiTags)("Team Management"),
    (0, common_1.Controller)("team"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)(audit_interceptor_1.AuditInterceptor),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], TeamController);
exports.TeamController = TeamController;
//# sourceMappingURL=team.controller.js.map