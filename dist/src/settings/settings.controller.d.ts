import { SettingsService } from "./settings.service";
import { CreateBusinessSettingsDto } from "./dto/create-business-settings.dto";
import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto";
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getBusinessHours(businessId: string): Promise<import("./schemas/business-settings.schema").BusinessHours[]>;
    getAppointmentSettings(businessId: string): Promise<any>;
    getPaymentSettings(businessId: string): Promise<any>;
    getNotificationSettings(businessId: string): Promise<any>;
    create(businessId: string, createSettingsDto: CreateBusinessSettingsDto): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    findAll(businessId: string): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    update(businessId: string, updateSettingsDto: UpdateBusinessSettingsDto): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    updateBusinessHours(businessId: string, businessHours: any): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    updateAppointmentSettings(businessId: string, appointmentSettings: any): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    remove(businessId: string): Promise<void>;
    findByType(type: string): Promise<import("./schemas/business-settings.schema").BusinessSettings[]>;
    findOne(id: string): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
}
