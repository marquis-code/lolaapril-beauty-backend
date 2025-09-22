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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
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
        return this.settingsModel.find({ settingType }).exec();
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
        return this.settingsModel.find({ settingType: "business_hours" }).exec();
    }
    async getAppointmentSettings() {
        return this.settingsModel.find({ settingType: "appointment_settings" }).exec();
    }
    async getPaymentSettings() {
        return this.settingsModel.find({ settingType: "payment_settings" }).exec();
    }
    async getNotificationSettings() {
        return this.settingsModel.find({ settingType: "notification_settings" }).exec();
    }
    async updateBusinessHours(businessHours) {
        let settings = await this.settingsModel.findOne({ settingType: "business_hours" });
        if (!settings) {
            settings = new this.settingsModel({
                settingType: "business_hours",
                settingKey: "operating_hours",
                settingValue: businessHours,
                description: "Business operating hours",
            });
        }
        else {
            settings.settingValue = businessHours;
        }
        return settings.save();
    }
    async updateAppointmentSettings(appointmentSettings) {
        let settings = await this.settingsModel.findOne({ settingType: "appointment_settings" });
        if (!settings) {
            settings = new this.settingsModel({
                settingType: "appointment_settings",
                settingKey: "appointment_config",
                settingValue: appointmentSettings,
                description: "Appointment configuration settings",
            });
        }
        else {
            settings.settingValue = appointmentSettings;
        }
        return settings.save();
    }
};
SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], SettingsService);
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map