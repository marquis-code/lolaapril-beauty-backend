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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const business_settings_schema_1 = require("./schemas/business-settings.schema");
const mongoose_2 = require("@nestjs/mongoose");
let SettingsService = class SettingsService {
    constructor(settingsModel) {
        this.settingsModel = settingsModel;
    }
    async create(businessId, createSettingsDto) {
        const existingSettings = await this.settingsModel.findOne({ businessId: new mongoose_1.Types.ObjectId(businessId) });
        if (existingSettings) {
            throw new common_1.ConflictException("Settings already exist for this business. Use update endpoint instead.");
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
            throw new common_1.NotFoundException("Settings not found for this business");
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
            throw new common_1.NotFoundException("Settings not found for this business");
        }
        return settings;
    }
    async updateBusinessHours(businessId, businessHours) {
        const settings = await this.settingsModel.findOneAndUpdate({ businessId: new mongoose_1.Types.ObjectId(businessId) }, { businessHours }, { new: true, runValidators: true });
        if (!settings) {
            throw new common_1.NotFoundException("Settings not found for this business");
        }
        return settings;
    }
    async updateAppointmentSettings(businessId, appointmentSettings) {
        const settings = await this.settingsModel.findOne({ businessId: new mongoose_1.Types.ObjectId(businessId) });
        if (!settings) {
            throw new common_1.NotFoundException("Settings not found for this business");
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
            throw new common_1.NotFoundException("Settings not found for this business");
        }
    }
    async getOrCreateBusinessSettings(businessId) {
        let settings = await this.settingsModel.findOne({ businessId: new mongoose_1.Types.ObjectId(businessId) });
        if (!settings) {
            throw new common_1.NotFoundException("No business settings found. Please create business settings first.");
        }
        return settings;
    }
    async findAll() {
        return this.settingsModel.find().exec();
    }
    async findOne(id) {
        const settings = await this.settingsModel.findById(id);
        if (!settings) {
            throw new common_1.NotFoundException("Settings not found");
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
            throw new common_1.NotFoundException("Settings not found");
        }
        return settings;
    }
    async getBusinessSettings() {
        return this.settingsModel.findOne().exec();
    }
};
SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(business_settings_schema_1.BusinessSettings.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], SettingsService);
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map