import type { Model } from "mongoose";
import type { BusinessSettings, BusinessSettingsDocument } from "./schemas/business-settings.schema";
import type { CreateBusinessSettingsDto } from "./dto/create-business-settings.dto";
import type { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto";
export declare class SettingsService {
    private settingsModel;
    constructor(settingsModel: Model<BusinessSettingsDocument>);
    create(createSettingsDto: CreateBusinessSettingsDto): Promise<BusinessSettings>;
    findAll(): Promise<BusinessSettings[]>;
    findOne(id: string): Promise<BusinessSettings>;
    findByType(settingType: string): Promise<BusinessSettings[]>;
    update(id: string, updateSettingsDto: UpdateBusinessSettingsDto): Promise<BusinessSettings>;
    remove(id: string): Promise<void>;
    getBusinessHours(): Promise<BusinessSettings[]>;
    getAppointmentSettings(): Promise<BusinessSettings[]>;
    getPaymentSettings(): Promise<BusinessSettings[]>;
    getNotificationSettings(): Promise<BusinessSettings[]>;
    updateBusinessHours(businessHours: any): Promise<BusinessSettings>;
    updateAppointmentSettings(appointmentSettings: any): Promise<BusinessSettings>;
}
