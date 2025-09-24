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
exports.VoucherController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const voucher_service_1 = require("./voucher.service");
const create_voucher_dto_1 = require("./dto/create-voucher.dto");
const update_voucher_dto_1 = require("./dto/update-voucher.dto");
const voucher_query_dto_1 = require("./dto/voucher-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../auth/schemas/user.schema");
const audit_interceptor_1 = require("../audit/interceptors/audit.interceptor");
const audit_decorator_1 = require("../audit/decorators/audit.decorator");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
let VoucherController = class VoucherController {
    constructor(voucherService) {
        this.voucherService = voucherService;
    }
    create(createVoucherDto) {
        return this.voucherService.create(createVoucherDto);
    }
    findAll(query) {
        return this.voucherService.findAll(query);
    }
    getStats() {
        return this.voucherService.getVoucherStats();
    }
    validateVoucher(body) {
        return this.voucherService.validateVoucher(body.voucherCode, body.clientId, body.serviceIds, body.totalAmount);
    }
    useVoucher(voucherCode) {
        return this.voucherService.useVoucher(voucherCode);
    }
    findByCode(voucherCode) {
        return this.voucherService.findByCode(voucherCode);
    }
    findOne(id) {
        return this.voucherService.findOne(id);
    }
    update(id, updateVoucherDto) {
        return this.voucherService.update(id, updateVoucherDto);
    }
    remove(id) {
        return this.voucherService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.CREATE, entity: audit_log_schema_1.AuditEntity.VOUCHER }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new voucher' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Voucher created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_voucher_dto_1.CreateVoucherDto]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get all vouchers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vouchers retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [voucher_query_dto_1.VoucherQueryDto]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get voucher statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Voucher statistics retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Validate a voucher' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher validation result' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "validateVoucher", null);
__decorate([
    (0, common_1.Post)(':code/use'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.VOUCHER }),
    (0, swagger_1.ApiOperation)({ summary: 'Use a voucher' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher used successfully' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "useVoucher", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get voucher by code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Voucher not found' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.VOUCHER }),
    (0, swagger_1.ApiOperation)({ summary: 'Get voucher by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Voucher not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.VOUCHER }),
    (0, swagger_1.ApiOperation)({ summary: "Update voucher" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Voucher updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Voucher not found" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_voucher_dto_1.UpdateVoucherDto]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.DELETE, entity: audit_log_schema_1.AuditEntity.VOUCHER }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete voucher' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Voucher not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "remove", null);
VoucherController = __decorate([
    (0, swagger_1.ApiTags)("Vouchers"),
    (0, common_1.Controller)("vouchers"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)(audit_interceptor_1.AuditInterceptor),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [voucher_service_1.VoucherService])
], VoucherController);
exports.VoucherController = VoucherController;
//# sourceMappingURL=voucher.controller.js.map