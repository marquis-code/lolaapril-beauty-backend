import { Model } from "mongoose";
import { BusinessSettings, BusinessSettingsDocument, BusinessHours } from "./schemas/business-settings.schema";
import { CreateBusinessSettingsDto } from "./dto/create-business-settings.dto";
import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto";
export declare class SettingsService {
    private settingsModel;
    constructor(settingsModel: Model<BusinessSettingsDocument>);
    create(businessId: string, createSettingsDto: CreateBusinessSettingsDto): Promise<BusinessSettings>;
    findByBusinessId(businessId: string): Promise<BusinessSettings>;
    getBusinessHours(businessId: string): Promise<BusinessHours[]>;
    getAppointmentSettings(businessId: string): Promise<any>;
    getPaymentSettings(businessId: string): Promise<any>;
    getNotificationSettings(businessId: string): Promise<any>;
    update(businessId: string, updateSettingsDto: UpdateBusinessSettingsDto): Promise<BusinessSettings>;
    updateBusinessHours(businessId: string, businessHours: BusinessHours[]): Promise<BusinessSettings>;
    updateAppointmentSettings(businessId: string, appointmentSettings: any): Promise<BusinessSettings>;
    remove(businessId: string): Promise<void>;
    getOrCreateBusinessSettings(businessId: string): Promise<BusinessSettings>;
    findAll(): Promise<BusinessSettings[]>;
    findOne(id: string): Promise<BusinessSettings>;
    findByType(settingType: string): Promise<BusinessSettings[]>;
    updatePaymentSettings(id: string, paymentSettings: any): Promise<BusinessSettings>;
    getBusinessSettings(): Promise<BusinessSettings | null>;
}
