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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_service_1 = require("./payment.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const update_payment_dto_1 = require("./dto/update-payment.dto");
const payment_query_dto_1 = require("./dto/payment-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../auth/schemas/user.schema");
const audit_interceptor_1 = require("../audit/interceptors/audit.interceptor");
const audit_decorator_1 = require("../audit/decorators/audit.decorator");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    create(createPaymentDto) {
        return this.paymentService.create(createPaymentDto);
    }
    findAll(query) {
        return this.paymentService.findAllWithQuery(query);
    }
    getStats() {
        return this.paymentService.getPaymentStats();
    }
    findOne(id) {
        return this.paymentService.findOne(id);
    }
    update(id, updatePaymentDto) {
        return this.paymentService.update(id, updatePaymentDto);
    }
    updateStatus(id, body) {
        return this.paymentService.updateStatus(id, body.status, body.transactionId);
    }
    processRefund(id, body) {
        return this.paymentService.processRefund(id, body.refundAmount, body.refundReason);
    }
    remove(id) {
        return this.paymentService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.CREATE, entity: audit_log_schema_1.AuditEntity.PAYMENT }),
    (0, swagger_1.ApiOperation)({ summary: "Create a new payment" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Payment created successfully" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get all payments" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Payments retrieved successfully" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_query_dto_1.PaymentQueryDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get payment statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Payment statistics retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF, user_schema_1.UserRole.CLIENT),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.PAYMENT }),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.PAYMENT }),
    (0, swagger_1.ApiOperation)({ summary: "Update payment" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Payment updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Payment not found" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.PAYMENT }),
    (0, swagger_1.ApiOperation)({ summary: "Update payment status" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Payment status updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Payment not found" }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(":id/refund"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.PAYMENT }),
    (0, swagger_1.ApiOperation)({ summary: "Process payment refund" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Refund processed successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Payment not found" }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "processRefund", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.DELETE, entity: audit_log_schema_1.AuditEntity.PAYMENT }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete payment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "remove", null);
PaymentController = __decorate([
    (0, swagger_1.ApiTags)("Payments"),
    (0, common_1.Controller)("payments"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)(audit_interceptor_1.AuditInterceptor),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map