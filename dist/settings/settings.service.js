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
    async create(createSettingsDto) {
        const settings = new this.settingsModel(createSettingsDto);
        return settings.save();
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
    async update(id, updateSettingsDto) {
        const settings = await this.settingsModel.findByIdAndUpdate(id, updateSettingsDto, { new: true });
        if (!settings) {
            throw new common_1.NotFoundException("Settings not found");
        }
        return settings;
    }
    async remove(id) {
        const result = await this.settingsModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException("Settings not found");
        }
    }
    async getBusinessHours() {
        const settings = await this.settingsModel.findOne().exec();
        return (settings === null || settings === void 0 ? void 0 : settings.businessHours) || [];
    }
    async getAppointmentSettings() {
        const settings = await this.settingsModel.findOne().exec();
        if (!settings)
            return null;
        return {
            appointmentStatuses: settings.appointmentStatuses,
            cancellationReasons: settings.cancellationReasons,
            defaultAppointmentDuration: settings.defaultAppointmentDuration,
            bookingWindowHours: settings.bookingWindowHours,
            allowOnlineBooking: settings.allowOnlineBooking,
            requireClientConfirmation: settings.requireClientConfirmation
        };
    }
    async getPaymentSettings() {
        const settings = await this.settingsModel.findOne().exec();
        if (!settings)
            return null;
        return {
            paymentMethods: settings.paymentMethods,
            serviceCharges: settings.serviceCharges,
            taxes: settings.taxes,
            defaultCurrency: settings.defaultCurrency
        };
    }
    async getNotificationSettings() {
        throw new Error("Notification settings not implemented in current schema");
    }
    async updateBusinessHours(businessHours) {
        let settings = await this.settingsModel.findOne();
        if (!settings) {
            throw new common_1.NotFoundException("Business settings not found. Please create business settings first.");
        }
        settings.businessHours = businessHours;
        return settings.save();
    }
    async updateAppointmentSettings(appointmentSettings) {
        let settings = await this.settingsModel.findOne();
        if (!settings) {
            throw new common_1.NotFoundException("Business settings not found. Please create business settings first.");
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
    async getOrCreateBusinessSettings() {
        let settings = await this.settingsModel.findOne().exec();
        if (!settings) {
            throw new Error("No business settings found. Please create business settings first.");
        }
        return settings;
    }
};
SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(business_settings_schema_1.BusinessSettings.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], SettingsService);
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map