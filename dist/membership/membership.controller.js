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
exports.MembershipController = void 0;
const common_1 = require("@nestjs/common");
const business_context_decorator_1 = require("../auth/decorators/business-context.decorator");
const swagger_1 = require("@nestjs/swagger");
const membership_service_1 = require("./membership.service");
const create_membership_dto_1 = require("./dto/create-membership.dto");
const update_membership_dto_1 = require("./dto/update-membership.dto");
const create_client_membership_dto_1 = require("./dto/create-client-membership.dto");
const membership_query_dto_1 = require("./dto/membership-query.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../auth/schemas/user.schema");
const audit_interceptor_1 = require("../audit/interceptors/audit.interceptor");
const audit_decorator_1 = require("../audit/decorators/audit.decorator");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
let MembershipController = class MembershipController {
    constructor(membershipService) {
        this.membershipService = membershipService;
    }
    createMembership(businessId, createMembershipDto) {
        return this.membershipService.createMembership(businessId, createMembershipDto);
    }
    findAllMemberships(businessId, query) {
        return this.membershipService.findAllMemberships(businessId, query);
    }
    getStats(businessId) {
        return this.membershipService.getMembershipStats(businessId);
    }
    findMembershipById(businessId, id) {
        return this.membershipService.findMembershipById(businessId, id);
    }
    updateMembership(businessId, id, updateMembershipDto) {
        return this.membershipService.updateMembership(businessId, id, updateMembershipDto);
    }
    removeMembership(businessId, id) {
        return this.membershipService.removeMembership(businessId, id);
    }
    enrollClient(businessId, createClientMembershipDto) {
        return this.membershipService.enrollClient(businessId, createClientMembershipDto);
    }
    findClientMemberships(businessId, clientId) {
        return this.membershipService.findClientMemberships(businessId, clientId);
    }
    getClientBenefits(businessId, clientId) {
        return this.membershipService.getClientMembershipBenefits(businessId, clientId);
    }
    addPoints(businessId, id, body) {
        return this.membershipService.addPoints(businessId, id, body.points, body.description, body.saleId);
    }
    redeemPoints(businessId, id, body) {
        return this.membershipService.redeemPoints(businessId, id, body.points, body.description);
    }
    updateSpending(businessId, id, body) {
        return this.membershipService.updateSpending(businessId, id, body.amount);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.CREATE, entity: audit_log_schema_1.AuditEntity.MEMBERSHIP }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new membership program' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Membership program created successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_membership_dto_1.CreateMembershipDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "createMembership", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get all membership programs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership programs retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, membership_query_dto_1.MembershipQueryDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "findAllMemberships", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get membership statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Membership statistics retrieved successfully" }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.MEMBERSHIP }),
    (0, swagger_1.ApiOperation)({ summary: 'Get membership program by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership program retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Membership program not found' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "findMembershipById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.MEMBERSHIP }),
    (0, swagger_1.ApiOperation)({ summary: "Update membership program" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Membership program updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Membership program not found" }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_membership_dto_1.UpdateMembershipDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "updateMembership", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.DELETE, entity: audit_log_schema_1.AuditEntity.MEMBERSHIP }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete membership program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership program deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Membership program not found' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "removeMembership", null);
__decorate([
    (0, common_1.Post)('enroll'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.CREATE, entity: audit_log_schema_1.AuditEntity.CLIENT_MEMBERSHIP }),
    (0, swagger_1.ApiOperation)({ summary: 'Enroll client in membership program' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Client enrolled successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_client_membership_dto_1.CreateClientMembershipDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "enrollClient", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get client memberships' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client memberships retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "findClientMemberships", null);
__decorate([
    (0, common_1.Get)('client/:clientId/benefits'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get client membership benefits' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client benefits retrieved successfully' }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "getClientBenefits", null);
__decorate([
    (0, common_1.Post)("client-membership/:id/points/add"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.CLIENT_MEMBERSHIP }),
    (0, swagger_1.ApiOperation)({ summary: "Add points to client membership" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Points added successfully" }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "addPoints", null);
__decorate([
    (0, common_1.Post)("client-membership/:id/points/redeem"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.CLIENT_MEMBERSHIP }),
    (0, swagger_1.ApiOperation)({ summary: "Redeem points from client membership" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Points redeemed successfully" }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "redeemPoints", null);
__decorate([
    (0, common_1.Post)("client-membership/:id/spending"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.CLIENT_MEMBERSHIP }),
    (0, swagger_1.ApiOperation)({ summary: "Update client spending" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Spending updated successfully" }),
    __param(0, (0, business_context_decorator_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "updateSpending", null);
MembershipController = __decorate([
    (0, swagger_1.ApiTags)("Memberships"),
    (0, common_1.Controller)("memberships"),
    (0, common_1.UseInterceptors)(audit_interceptor_1.AuditInterceptor),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [membership_service_1.MembershipService])
], MembershipController);
exports.MembershipController = MembershipController;
//# sourceMappingURL=membership.controller.js.map