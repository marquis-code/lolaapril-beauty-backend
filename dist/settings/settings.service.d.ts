import { Model } from "mongoose";
import { BusinessSettings, BusinessSettingsDocument, BusinessHours } from "./schemas/business-settings.schema";
import { CreateBusinessSettingsDto } from "./dto/create-business-settings.dto";
import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto";
export declare class SettingsService {
    private settingsModel;
    constructor(settingsModel: Model<BusinessSettingsDocument>);
    create(createSettingsDto: CreateBusinessSettingsDto): Promise<BusinessSettings>;
    findAll(): Promise<BusinessSettings[]>;
    findOne(id: string): Promise<BusinessSettings>;
    findByType(settingType: string): Promise<BusinessSettings[]>;
    update(id: string, updateSettingsDto: UpdateBusinessSettingsDto): Promise<BusinessSettings>;
    remove(id: string): Promise<void>;
    getBusinessHours(): Promise<BusinessHours[]>;
    getAppointmentSettings(): Promise<any>;
    getPaymentSettings(): Promise<any>;
    getNotificationSettings(): Promise<any>;
    updateBusinessHours(businessHours: BusinessHours[]): Promise<BusinessSettings>;
    updateAppointmentSettings(appointmentSettings: any): Promise<BusinessSettings>;
    updatePaymentSettings(id: string, paymentSettings: any): Promise<BusinessSettings>;
    getBusinessSettings(): Promise<BusinessSettings | null>;
    getOrCreateBusinessSettings(): Promise<BusinessSettings>;
}
