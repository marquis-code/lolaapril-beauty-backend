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
const business_schema_1 = require("../business/schemas/business.schema");
let SettingsService = class SettingsService {
    constructor(settingsModel, businessModel) {
        this.settingsModel = settingsModel;
        this.businessModel = businessModel;
    }
    getDefaultBusinessHours() {
        return [
            { day: 'Monday', startTime: '09:00', endTime: '17:00', isOpen: true },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isOpen: true },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isOpen: true },
            { day: 'Thursday', startTime: '09:00', endTime: '17:00', isOpen: true },
            { day: 'Friday', startTime: '09:00', endTime: '17:00', isOpen: true },
            { day: 'Saturday', startTime: '10:00', endTime: '16:00', isOpen: true },
            { day: 'Sunday', startTime: '00:00', endTime: '00:00', isOpen: false },
        ];
    }
    getDefaultAppointmentSettings() {
        return {
            appointmentStatuses: [
                { statusName: 'Scheduled', statusIcon: '📅', statusColor: '#3b82f6', isActive: true },
                { statusName: 'Confirmed', statusIcon: '✅', statusColor: '#22c55e', isActive: true },
                { statusName: 'In Progress', statusIcon: '🔄', statusColor: '#f59e0b', isActive: true },
                { statusName: 'Completed', statusIcon: '✔️', statusColor: '#10b981', isActive: true },
                { statusName: 'Cancelled', statusIcon: '❌', statusColor: '#ef4444', isActive: true },
                { statusName: 'No Show', statusIcon: '👻', statusColor: '#6b7280', isActive: true },
            ],
            cancellationReasons: [
                { name: 'Schedule conflict', reasonType: 'client_initiated', isActive: true },
                { name: 'Personal emergency', reasonType: 'client_initiated', isActive: true },
                { name: 'Changed mind', reasonType: 'client_initiated', isActive: true },
                { name: 'Staff unavailable', reasonType: 'business_initiated', isActive: true },
                { name: 'Weather conditions', reasonType: 'external_factors', isActive: true },
            ],
            defaultAppointmentDuration: 30,
            bookingWindowHours: 2,
            allowOnlineBooking: true,
            requireClientConfirmation: true
        };
    }
    getDefaultPaymentSettings() {
        return {
            paymentMethods: [
                { name: 'Cash', paymentType: 'cash', enabled: true },
                { name: 'Bank Transfer', paymentType: 'bank_transfer', enabled: true },
            ],
            serviceCharges: [],
            taxes: [],
            defaultCurrency: 'NGN'
        };
    }
    getDefaultNotificationSettings() {
        return {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            appointmentReminders: true,
            reminderHoursBefore: 24,
            marketingEmails: false
        };
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
    async findByBusinessIdOrNull(businessId) {
        return this.settingsModel.findOne({ businessId: new mongoose_1.Types.ObjectId(businessId) });
    }
    async findOrCreateDefault(businessId) {
        let settings = await this.settingsModel.findOne({ businessId: new mongoose_1.Types.ObjectId(businessId) });
        if (!settings) {
            const business = await this.businessModel.findById(businessId);
            if (!business) {
                throw new common_1.NotFoundException("Business not found");
            }
            const appointmentDefaults = this.getDefaultAppointmentSettings();
            const paymentDefaults = this.getDefaultPaymentSettings();
            const defaultSettings = {
                businessId: new mongoose_1.Types.ObjectId(businessId),
                businessName: business.businessName || 'My Business',
                businessEmail: business.contact?.email || 'business@example.com',
                businessPhone: {
                    countryCode: '+234',
                    number: business.contact?.primaryPhone || '0000000000'
                },
                businessAddress: {
                    street: business.address?.street || '',
                    city: business.address?.city || '',
                    region: business.address?.state || '',
                    postcode: business.address?.postalCode || '',
                    country: business.address?.country || 'Nigeria'
                },
                businessHours: this.getDefaultBusinessHours(),
                appointmentStatuses: appointmentDefaults.appointmentStatuses,
                cancellationReasons: appointmentDefaults.cancellationReasons,
                defaultAppointmentDuration: appointmentDefaults.defaultAppointmentDuration,
                bookingWindowHours: appointmentDefaults.bookingWindowHours,
                allowOnlineBooking: appointmentDefaults.allowOnlineBooking,
                requireClientConfirmation: appointmentDefaults.requireClientConfirmation,
                paymentMethods: paymentDefaults.paymentMethods,
                serviceCharges: paymentDefaults.serviceCharges,
                taxes: paymentDefaults.taxes,
                defaultCurrency: paymentDefaults.defaultCurrency,
                timezone: business.settings?.timezone || 'Africa/Lagos'
            };
            settings = new this.settingsModel(defaultSettings);
            await settings.save();
        }
        return settings;
    }
    async getBusinessHours(businessId) {
        const settings = await this.findByBusinessIdOrNull(businessId);
        return settings?.businessHours || this.getDefaultBusinessHours();
    }
    async getAppointmentSettings(businessId) {
        const settings = await this.findByBusinessIdOrNull(businessId);
        if (!settings) {
            return this.getDefaultAppointmentSettings();
        }
        return {
            appointmentStatuses: settings.appointmentStatuses || this.getDefaultAppointmentSettings().appointmentStatuses,
            cancellationReasons: settings.cancellationReasons || this.getDefaultAppointmentSettings().cancellationReasons,
            defaultAppointmentDuration: settings.defaultAppointmentDuration ?? 30,
            bookingWindowHours: settings.bookingWindowHours ?? 2,
            allowOnlineBooking: settings.allowOnlineBooking ?? true,
            requireClientConfirmation: settings.requireClientConfirmation ?? true
        };
    }
    async getPaymentSettings(businessId) {
        const settings = await this.findByBusinessIdOrNull(businessId);
        if (!settings) {
            return this.getDefaultPaymentSettings();
        }
        return {
            paymentMethods: settings.paymentMethods || this.getDefaultPaymentSettings().paymentMethods,
            serviceCharges: settings.serviceCharges || [],
            taxes: settings.taxes || [],
            defaultCurrency: settings.defaultCurrency || 'NGN'
        };
    }
    async getNotificationSettings(businessId) {
        return this.getDefaultNotificationSettings();
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
    __param(1, (0, mongoose_2.InjectModel)(business_schema_1.Business.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], SettingsService);
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map