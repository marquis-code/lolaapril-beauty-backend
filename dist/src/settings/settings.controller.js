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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settings_service_1 = require("./settings.service");
const create_business_settings_dto_1 = require("./dto/create-business-settings.dto");
const update_business_settings_dto_1 = require("./dto/update-business-settings.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../auth/schemas/user.schema");
const audit_decorator_1 = require("../audit/decorators/audit.decorator");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
const auth_1 = require("../auth");
let SettingsController = class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    create(businessId, createSettingsDto) {
        return this.settingsService.create(businessId, createSettingsDto);
    }
    findAll(businessId) {
        return this.settingsService.findByBusinessId(businessId);
    }
    getBusinessHours(businessId) {
        return this.settingsService.getBusinessHours(businessId);
    }
    getAppointmentSettings(businessId) {
        return this.settingsService.getAppointmentSettings(businessId);
    }
    getPaymentSettings(businessId) {
        return this.settingsService.getPaymentSettings(businessId);
    }
    getNotificationSettings(businessId) {
        return this.settingsService.getNotificationSettings(businessId);
    }
    update(businessId, updateSettingsDto) {
        return this.settingsService.update(businessId, updateSettingsDto);
    }
    updateBusinessHours(businessId, businessHours) {
        return this.settingsService.updateBusinessHours(businessId, businessHours);
    }
    updateAppointmentSettings(businessId, appointmentSettings) {
        return this.settingsService.updateAppointmentSettings(businessId, appointmentSettings);
    }
    remove(businessId) {
        return this.settingsService.remove(businessId);
    }
    findByType(type) {
        return this.settingsService.findByType(type);
    }
    findOne(id) {
        return this.settingsService.findOne(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, auth_1.ValidateBusiness)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.CREATE, entity: audit_log_schema_1.AuditEntity.SETTINGS }),
    (0, swagger_1.ApiOperation)({ summary: "Create settings for current business" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Settings created successfully" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Settings already exist for this business" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_business_settings_dto_1.CreateBusinessSettingsDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get settings for current business" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Settings retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("business-hours"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get business hours for current business" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Business hours retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getBusinessHours", null);
__decorate([
    (0, common_1.Get)("appointment-settings"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get appointment settings for current business" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Appointment settings retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getAppointmentSettings", null);
__decorate([
    (0, common_1.Get)("payment-settings"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER),
    (0, swagger_1.ApiOperation)({ summary: "Get payment settings for current business" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Payment settings retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getPaymentSettings", null);
__decorate([
    (0, common_1.Get)("notification-settings"),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: "Get notification settings for current business" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Notification settings retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getNotificationSettings", null);
__decorate([
    (0, common_1.Patch)(),
    (0, auth_1.ValidateBusiness)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.SETTINGS }),
    (0, swagger_1.ApiOperation)({ summary: "Update settings for current business" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Settings updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Settings not found" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_business_settings_dto_1.UpdateBusinessSettingsDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)("business-hours"),
    (0, auth_1.ValidateBusiness)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.SETTINGS }),
    (0, swagger_1.ApiOperation)({ summary: "Update business hours for current business" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Business hours updated successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateBusinessHours", null);
__decorate([
    (0, common_1.Patch)("appointment-settings"),
    (0, auth_1.ValidateBusiness)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.SETTINGS }),
    (0, swagger_1.ApiOperation)({ summary: "Update appointment settings for current business" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Appointment settings updated successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateAppointmentSettings", null);
__decorate([
    (0, common_1.Delete)(),
    (0, auth_1.ValidateBusiness)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.DELETE, entity: audit_log_schema_1.AuditEntity.SETTINGS }),
    (0, swagger_1.ApiOperation)({ summary: "Delete settings for current business" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Settings deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Settings not found" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get settings by type (legacy)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings retrieved successfully' }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER, user_schema_1.UserRole.STAFF),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.VIEW, entity: audit_log_schema_1.AuditEntity.SETTINGS }),
    (0, swagger_1.ApiOperation)({ summary: 'Get settings by ID (legacy)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Settings not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "findOne", null);
SettingsController = __decorate([
    (0, swagger_1.ApiTags)("Settings Management"),
    (0, common_1.Controller)("settings"),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
exports.SettingsController = SettingsController;
//# sourceMappingURL=settings.controller.js.map