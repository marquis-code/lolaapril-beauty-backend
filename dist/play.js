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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBusinessSettingsDto = exports.BusinessHoursDto = exports.BusinessAddressDto = exports.BusinessPhoneDto = exports.BusinessSettingsSchema = exports.BusinessSettings = exports.SettingsService = exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settings_service_1 = require("./settings.service");
Object.defineProperty(exports, "SettingsService", { enumerable: true, get: function () { return settings_service_1.SettingsService; } });
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
    updateById(id, updateSettingsDto) {
        return this.settingsService.updateById(id, updateSettingsDto);
    }
    removeById(id) {
        return this.settingsService.removeById(id);
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
    __metadata("design:paramtypes", [String, typeof (_b = typeof create_business_settings_dto_1.CreateBusinessSettingsDto !== "undefined" && create_business_settings_dto_1.CreateBusinessSettingsDto) === "function" ? _b : Object]),
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
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_business_settings_dto_1.UpdateBusinessSettingsDto !== "undefined" && update_business_settings_dto_1.UpdateBusinessSettingsDto) === "function" ? _c : Object]),
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
__decorate([
    (0, common_1.Patch)(":id"),
    (0, auth_1.ValidateBusiness)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.UPDATE, entity: audit_log_schema_1.AuditEntity.SETTINGS }),
    (0, swagger_1.ApiOperation)({ summary: "Update settings by ID (legacy)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Settings updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Settings not found" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof update_business_settings_dto_1.UpdateBusinessSettingsDto !== "undefined" && update_business_settings_dto_1.UpdateBusinessSettingsDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_1.ValidateBusiness)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.BUSINESS_ADMIN, user_schema_1.UserRole.BUSINESS_OWNER),
    (0, audit_decorator_1.Audit)({ action: audit_log_schema_1.AuditAction.DELETE, entity: audit_log_schema_1.AuditEntity.SETTINGS }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete settings by ID (legacy)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Settings not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "removeById", null);
SettingsController = __decorate([
    (0, swagger_1.ApiTags)("Settings Management"),
    (0, common_1.Controller)("settings"),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof settings_service_1.SettingsService !== "undefined" && settings_service_1.SettingsService) === "function" ? _a : Object])
], SettingsController);
exports.SettingsController = SettingsController;
const common_2 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const business_settings_schema_1 = require("./schemas/business-settings.schema");
Object.defineProperty(exports, "BusinessSettings", { enumerable: true, get: function () { return business_settings_schema_1.BusinessSettings; } });
const mongoose_2 = require("@nestjs/mongoose");
let SettingsService = class SettingsService {
    constructor(settingsModel) {
        this.settingsModel = settingsModel;
    }
    async create(businessId, createSettingsDto) {
        const existingSettings = await this.settingsModel.findOne({ businessId: new mongoose_1.Types.ObjectId(businessId) });
        if (existingSettings) {
            throw new common_2.ConflictException("Settings already exist for this business. Use update endpoint instead.");
        }
        const settings = new this.settingsModel({
            ...createSettingsDto,
            businessId: new mongoose_1.Types.ObjectId(businessId)
        });
        return settings.save();
    }
    async findByBusinessId(businessId) {
        const settings = await this.settingsModel.findOne({ businessId: new mongoose_1.Types.ObjectId(businessId) });
        if (!settings) {
            throw new common_2.NotFoundException("Settings not found for this business");
        }
        return settings;
    }
    async getBusinessHours(businessId) {
        const settings = await this.findByBusinessId(businessId);
        return settings.businessHours || [];
    }
    async getAppointmentSettings(businessId) {
        const settings = await this.findByBusinessId(businessId);
        return {
            appointmentStatuses: settings.appointmentStatuses,
            cancellationReasons: settings.cancellationReasons,
            defaultAppointmentDuration: settings.defaultAppointmentDuration,
            bookingWindowHours: settings.bookingWindowHours,
            allowOnlineBooking: settings.allowOnlineBooking,
            requireClientConfirmation: settings.requireClientConfirmation
        };
    }
    async getPaymentSettings(businessId) {
        const settings = await this.findByBusinessId(businessId);
        return {
            paymentMethods: settings.paymentMethods,
            serviceCharges: settings.serviceCharges,
            taxes: settings.taxes,
            defaultCurrency: settings.defaultCurrency
        };
    }
    async getNotificationSettings(businessId) {
        const settings = await this.findByBusinessId(businessId);
        throw new Error("Notification settings not implemented in current schema");
    }
    async update(businessId, updateSettingsDto) {
        const settings = await this.settingsModel.findOneAndUpdate({ businessId: new mongoose_1.Types.ObjectId(businessId) }, updateSettingsDto, { new: true, runValidators: true });
        if (!settings) {
            throw new common_2.NotFoundException("Settings not found for this business");
        }
        return settings;
    }
    async updateBusinessHours(businessId, businessHours) {
        const settings = await this.settingsModel.findOneAndUpdate({ businessId: new mongoose_1.Types.ObjectId(businessId) }, { businessHours }, { new: true, runValidators: true });
        if (!settings) {
            throw new common_2.NotFoundException("Settings not found for this business");
        }
        return settings;
    }
    async updateAppointmentSettings(businessId, appointmentSettings) {
        const settings = await this.settingsModel.findOne({ businessId: new mongoose_1.Types.ObjectId(businessId) });
        if (!settings) {
            throw new common_2.NotFoundException("Settings not found for this business");
        }
        if (appointmentSettings.appointmentStatuses) {
            settings.appointmentStatuses = appointmentSettings.appointmentStatuses;
        }
        if (appointmentSettings.cancellationReasons) {
            settings.cancellationReasons = appointmentSettings.cancellationReasons;
        }
        if (appointmentSettings.defaultAppointmentDuration) {
            settings.defaultAppointmentDuration = appointmentSettings.defaultAppointmentDuration;
        }
        if (appointmentSettings.bookingWindowHours) {
            settings.bookingWindowHours = appointmentSettings.bookingWindowHours;
        }
        if (typeof appointmentSettings.allowOnlineBooking === 'boolean') {
            settings.allowOnlineBooking = appointmentSettings.allowOnlineBooking;
        }
        if (typeof appointmentSettings.requireClientConfirmation === 'boolean') {
            settings.requireClientConfirmation = appointmentSettings.requireClientConfirmation;
        }
        return settings.save();
    }
    async remove(businessId) {
        const result = await this.settingsModel.findOneAndDelete({
            businessId: new mongoose_1.Types.ObjectId(businessId)
        });
        if (!result) {
            throw new common_2.NotFoundException("Settings not found for this business");
        }
    }
    async getOrCreateBusinessSettings(businessId) {
        let settings = await this.settingsModel.findOne({ businessId: new mongoose_1.Types.ObjectId(businessId) });
        if (!settings) {
            throw new common_2.NotFoundException("No business settings found. Please create business settings first.");
        }
        return settings;
    }
    async findAll() {
        return this.settingsModel.find().exec();
    }
    async findOne(id) {
        const settings = await this.settingsModel.findById(id);
        if (!settings) {
            throw new common_2.NotFoundException("Settings not found");
        }
        return settings;
    }
    async findByType(settingType) {
        return this.settingsModel.find().exec();
    }
    async updatePaymentSettings(id, paymentSettings) {
        const updateData = {};
        if (paymentSettings.paymentMethods) {
            updateData.paymentMethods = paymentSettings.paymentMethods;
        }
        if (paymentSettings.serviceCharges) {
            updateData.serviceCharges = paymentSettings.serviceCharges;
        }
        if (paymentSettings.taxes) {
            updateData.taxes = paymentSettings.taxes;
        }
        if (paymentSettings.defaultCurrency) {
            updateData.defaultCurrency = paymentSettings.defaultCurrency;
        }
        const settings = await this.settingsModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!settings) {
            throw new common_2.NotFoundException("Settings not found");
        }
        return settings;
    }
    async getBusinessSettings() {
        return this.settingsModel.findOne().exec();
    }
};
SettingsService = __decorate([
    (0, common_2.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(business_settings_schema_1.BusinessSettings.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], SettingsService);
exports.SettingsService = SettingsService;
const mongoose_3 = require("@nestjs/mongoose");
let BusinessSettings = class BusinessSettings {
};
__decorate([
    (0, mongoose_3.Prop)({ type: mongoose_1.Types.ObjectId, ref: 'Business', required: true, unique: true }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], business_settings_schema_1.BusinessSettings.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_3.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], business_settings_schema_1.BusinessSettings.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_3.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], business_settings_schema_1.BusinessSettings.prototype, "businessEmail", void 0);
__decorate([
    (0, mongoose_3.Prop)({
        type: {
            countryCode: { type: String, required: true },
            number: { type: String, required: true }
        },
        required: true
    }),
    __metadata("design:type", Object)
], business_settings_schema_1.BusinessSettings.prototype, "businessPhone", void 0);
__decorate([
    (0, mongoose_3.Prop)({
        type: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            region: { type: String, required: true },
            postcode: { type: String, required: true },
            country: { type: String, required: true }
        },
        required: true
    }),
    __metadata("design:type", Object)
], business_settings_schema_1.BusinessSettings.prototype, "businessAddress", void 0);
BusinessSettings = __decorate([
    (0, mongoose_3.Schema)({ timestamps: true })
], BusinessSettings);
exports.BusinessSettings = BusinessSettings;
exports.BusinessSettingsSchema = mongoose_3.SchemaFactory.createForClass(business_settings_schema_1.BusinessSettings);
exports.BusinessSettingsSchema.index({ businessId: 1 }, { unique: true });
exports.BusinessSettingsSchema.index({ businessName: 1 });
exports.BusinessSettingsSchema.index({ businessEmail: 1 });
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_2 = require("@nestjs/swagger");
class BusinessPhoneDto {
}
__decorate([
    (0, swagger_2.ApiProperty)({ example: "+234" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessPhoneDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: "08147626503" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessPhoneDto.prototype, "number", void 0);
exports.BusinessPhoneDto = BusinessPhoneDto;
class BusinessAddressDto {
}
__decorate([
    (0, swagger_2.ApiProperty)({ example: "18, Alubarika street ijeshatedo" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "street", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: "surulere" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: "Lagos" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "region", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: "101282" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "postcode", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: "Nigeria" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessAddressDto.prototype, "country", void 0);
exports.BusinessAddressDto = BusinessAddressDto;
class BusinessHoursDto {
}
__decorate([
    (0, swagger_2.ApiProperty)({ example: "Monday" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessHoursDto.prototype, "day", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: "09:00" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessHoursDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: "17:00" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BusinessHoursDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BusinessHoursDto.prototype, "isOpen", void 0);
exports.BusinessHoursDto = BusinessHoursDto;
class CreateBusinessSettingsDto {
}
__decorate([
    (0, swagger_2.ApiProperty)({ example: "Safemom" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], create_business_settings_dto_1.CreateBusinessSettingsDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: "info@safemom.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], create_business_settings_dto_1.CreateBusinessSettingsDto.prototype, "businessEmail", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ type: BusinessPhoneDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BusinessPhoneDto),
    __metadata("design:type", BusinessPhoneDto)
], create_business_settings_dto_1.CreateBusinessSettingsDto.prototype, "businessPhone", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ type: BusinessAddressDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BusinessAddressDto),
    __metadata("design:type", BusinessAddressDto)
], create_business_settings_dto_1.CreateBusinessSettingsDto.prototype, "businessAddress", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ type: [BusinessHoursDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BusinessHoursDto),
    __metadata("design:type", Array)
], create_business_settings_dto_1.CreateBusinessSettingsDto.prototype, "businessHours", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: "NGN" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], create_business_settings_dto_1.CreateBusinessSettingsDto.prototype, "defaultCurrency", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: "Africa/Lagos" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], create_business_settings_dto_1.CreateBusinessSettingsDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], create_business_settings_dto_1.CreateBusinessSettingsDto.prototype, "defaultAppointmentDuration", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], create_business_settings_dto_1.CreateBusinessSettingsDto.prototype, "bookingWindowHours", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], create_business_settings_dto_1.CreateBusinessSettingsDto.prototype, "allowOnlineBooking", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], create_business_settings_dto_1.CreateBusinessSettingsDto.prototype, "requireClientConfirmation", void 0);
exports.CreateBusinessSettingsDto = CreateBusinessSettingsDto;
const common_3 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_3.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=play.js.map