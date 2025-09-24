import { SettingsService } from "./settings.service";
import { CreateBusinessSettingsDto } from "./dto/create-business-settings.dto";
import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto";
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    create(createSettingsDto: CreateBusinessSettingsDto): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    findAll(): Promise<import("./schemas/business-settings.schema").BusinessSettings[]>;
    getBusinessHours(): Promise<import("./schemas/business-settings.schema").BusinessHours[]>;
    getAppointmentSettings(): Promise<any>;
    getPaymentSettings(): Promise<any>;
    getNotificationSettings(): Promise<any>;
    findByType(type: string): Promise<import("./schemas/business-settings.schema").BusinessSettings[]>;
    findOne(id: string): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    update(id: string, updateSettingsDto: UpdateBusinessSettingsDto): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    updateBusinessHours(businessHours: any): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    updateAppointmentSettings(appointmentSettings: any): Promise<import("./schemas/business-settings.schema").BusinessSettings>;
    remove(id: string): Promise<void>;
}
