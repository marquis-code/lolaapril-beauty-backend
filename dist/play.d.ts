/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { SettingsService } from "./settings.service";
import { CreateBusinessSettingsDto } from "./dto/create-business-settings.dto";
import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto";
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    create(businessId: string, createSettingsDto: CreateBusinessSettingsDto): any;
    findAll(businessId: string): any;
    getBusinessHours(businessId: string): any;
    getAppointmentSettings(businessId: string): any;
    getPaymentSettings(businessId: string): any;
    getNotificationSettings(businessId: string): any;
    update(businessId: string, updateSettingsDto: UpdateBusinessSettingsDto): any;
    updateBusinessHours(businessId: string, businessHours: any): any;
    updateAppointmentSettings(businessId: string, appointmentSettings: any): any;
    remove(businessId: string): any;
    findByType(type: string): any;
    findOne(id: string): any;
    updateById(id: string, updateSettingsDto: UpdateBusinessSettingsDto): any;
    removeById(id: string): any;
}
import { Model, Types } from "mongoose";
import { BusinessSettings, BusinessSettingsDocument, BusinessHours } from "./schemas/business-settings.schema";
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
import { Document } from "mongoose";
export type BusinessSettingsDocument = BusinessSettings & Document;
export declare class BusinessSettings {
    businessId: Types.ObjectId;
    businessName: string;
    businessEmail: string;
    businessPhone: {
        countryCode: string;
        number: string;
    };
    businessAddress: {
        street: string;
        city: string;
        region: string;
        postcode: string;
        country: string;
    };
}
export declare const BusinessSettingsSchema: import("mongoose").Schema<BusinessSettings, Model<BusinessSettings, any, any, any, Document<unknown, any, BusinessSettings, any, {}> & BusinessSettings & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BusinessSettings, Document<unknown, {}, import("mongoose").FlatRecord<BusinessSettings>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<BusinessSettings> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class BusinessPhoneDto {
    countryCode: string;
    number: string;
}
export declare class BusinessAddressDto {
    street: string;
    city: string;
    region: string;
    postcode: string;
    country: string;
}
export declare class BusinessHoursDto {
    day: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
}
export declare class CreateBusinessSettingsDto {
    businessName: string;
    businessEmail: string;
    businessPhone: BusinessPhoneDto;
    businessAddress: BusinessAddressDto;
    businessHours: BusinessHoursDto[];
    defaultCurrency?: string;
    timezone?: string;
    defaultAppointmentDuration?: number;
    bookingWindowHours?: number;
    allowOnlineBooking?: boolean;
    requireClientConfirmation?: boolean;
}
