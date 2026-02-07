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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sales_service_1 = require("./sales.service");
const auth_1 = require("../auth");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const update_sale_dto_1 = require("./dto/update-sale.dto");
const sales_query_dto_1 = require("./dto/sales-query.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../auth/schemas/user.schema");
const audit_interceptor_1 = require("../audit/interceptors/audit.interceptor");
const audit_decorator_1 = require("../audit/decorators/audit.decorator");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
let SalesController = class SalesController {
    constructor(salesService) {
        this.salesService = salesService;
    }
    create(businessId, createSaleDto) {
        return this.salesService.create(businessId, createSaleDto);
    }
    findAll(businessId, query) {
        return this.salesService.findAllWithQuery(businessId, query);
    }
    getStats(businessId) {
        return this.salesService.getSalesStats(businessId);
    }
    getTopServices(businessId) {
        return this.salesService.getTopServices(businessId);
    }
    getRevenueByPeriod(businessId, period = "daily") {
        return this.salesService.getRevenueByPeriod(businessId, period);
    }
    findOne(businessId, id) {
        return this.salesService.findOne(businessId, id);
    }
    update(businessId, id, updateSaleDto) {
        return this.salesService.update(businessId, id, updateSaleDto);
    }
    completeSale(businessId, id, body) {
        return this.salesService.completeSale(businessId, id, body.completedBy);
    }
    updateStatus(businessId, id, body) {
        return this.salesService.updateStatus(businessId, id, body.status);
    }
    updatePaymentStatus(businessId, id, body) {
        return this.salesService.updatePaymentStatus(businessId, id, body.paymentStatus, body.amountPaid);
    }
    remove(businessId, id) {
        return this.salesService.remove(businessId, id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.CREATE, entity: audit_log_schema_1.AuditEntity.SALE }),
    (0, swagger_1.ApiOperation)({ summary: "Create a new sale" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Sale created successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_sale_dto_1.CreateSaleDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get all sales" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Sales retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sales_query_dto_1.SalesQueryDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get sales statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Sales statistics retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("top-services"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get top performing services" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Top services retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getTopServices", null);
__decorate([
    (0, common_1.Get)("revenue-by-period"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get revenue by time period" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Revenue data retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getRevenueByPeriod", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.SALE }),
    (0, swagger_1.ApiOperation)({ summary: "Get sale by ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Sale retrieved successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Sale not found" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.SALE }),
    (0, swagger_1.ApiOperation)({ summary: "Update sale" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Sale updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Sale not found" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_sale_dto_1.UpdateSaleDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/complete"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.SALE }),
    (0, swagger_1.ApiOperation)({ summary: "Complete sale" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Sale completed successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Sale not found" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "completeSale", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.SALE }),
    (0, swagger_1.ApiOperation)({ summary: "Update sale status" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Sale status updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Sale not found" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(":id/payment-status"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.SALE }),
    (0, swagger_1.ApiOperation)({ summary: "Update sale payment status" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Payment status updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Sale not found" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "updatePaymentStatus", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.DELETE, entity: audit_log_schema_1.AuditEntity.SALE }),
    (0, swagger_1.ApiOperation)({ summary: "Delete sale" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Sale deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Sale not found" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "remove", null);
SalesController = __decorate([
    (0, swagger_1.ApiTags)("Sales"),
    (0, common_1.Controller)("sales"),
    (0, common_1.UseInterceptors)(audit_interceptor_1.AuditInterceptor),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
exports.SalesController = SalesController;
//# sourceMappingURL=sales.controller.js.map