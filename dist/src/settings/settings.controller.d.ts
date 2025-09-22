import type { SettingsService } from "./settings.service";
import type { CreateBusinessSettingsDto } from "./dto/create-business-settings.dto";
import type { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto";
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    create(createSettingsDto: CreateBusinessSettingsDto): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    findAll(): Promise<import("./schemas/business-settings.schema").BusinessSettings[]>;
    getBusinessHours(): Promise<import("./schemas/business-settings.schema").BusinessSettings[]>;
    getAppointmentSettings(): Promise<import("./schemas/business-settings.schema").BusinessSettings[]>;
    getPaymentSettings(): Promise<import("./schemas/business-settings.schema").BusinessSettings[]>;
    getNotificationSettings(): Promise<import("./schemas/business-settings.schema").BusinessSettings[]>;
    findByType(type: string): Promise<import("./schemas/business-settings.schema").BusinessSettings[]>;
    findOne(id: string): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    update(id: string, updateSettingsDto: UpdateBusinessSettingsDto): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    updateBusinessHours(businessHours: any): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    updateAppointmentSettings(appointmentSettings: any): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    remove(id: string): Promise<void>;
}
