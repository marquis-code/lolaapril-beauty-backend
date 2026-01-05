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
import { Document, Types } from "mongoose";
export type ClientDocument = Client & Document;
export declare class EmergencyContact {
    fullName: string;
    relationship: string;
    email: string;
    phone: {
        countryCode: string;
        number: string;
    };
}
export declare const EmergencyContactSchema: import("mongoose").Schema<EmergencyContact, import("mongoose").Model<EmergencyContact, any, any, any, Document<unknown, any, EmergencyContact, any, {}> & EmergencyContact & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EmergencyContact, Document<unknown, {}, import("mongoose").FlatRecord<EmergencyContact>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<EmergencyContact> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class ClientProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: {
        countryCode: string;
        number: string;
    };
    birthday: {
        dayAndMonth: string;
        year: string;
    };
    gender: string;
    pronouns: string;
    additionalEmail: string;
    additionalPhone: {
        countryCode: string;
        number: string;
    };
}
export declare const ClientProfileSchema: import("mongoose").Schema<ClientProfile, import("mongoose").Model<ClientProfile, any, any, any, Document<unknown, any, ClientProfile, any, {}> & ClientProfile & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ClientProfile, Document<unknown, {}, import("mongoose").FlatRecord<ClientProfile>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ClientProfile> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class AdditionalInfo {
    clientSource: string;
    referredBy: {
        clientId: string;
        clientName: string;
    };
    preferredLanguage: string;
    occupation: string;
    country: string;
}
export declare const AdditionalInfoSchema: import("mongoose").Schema<AdditionalInfo, import("mongoose").Model<AdditionalInfo, any, any, any, Document<unknown, any, AdditionalInfo, any, {}> & AdditionalInfo & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AdditionalInfo, Document<unknown, {}, import("mongoose").FlatRecord<AdditionalInfo>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<AdditionalInfo> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class ClientAddress {
    addressName: string;
    addressType: string;
    street: string;
    aptSuite: string;
    district: string;
    city: string;
    region: string;
    postcode: string;
    country: string;
}
export declare const ClientAddressSchema: import("mongoose").Schema<ClientAddress, import("mongoose").Model<ClientAddress, any, any, any, Document<unknown, any, ClientAddress, any, {}> & ClientAddress & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ClientAddress, Document<unknown, {}, import("mongoose").FlatRecord<ClientAddress>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ClientAddress> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class ClientSettings {
    appointmentNotifications: {
        emailNotifications: boolean;
    };
    marketingNotifications: {
        clientAcceptsEmailMarketing: boolean;
    };
}
export declare const ClientSettingsSchema: import("mongoose").Schema<ClientSettings, import("mongoose").Model<ClientSettings, any, any, any, Document<unknown, any, ClientSettings, any, {}> & ClientSettings & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ClientSettings, Document<unknown, {}, import("mongoose").FlatRecord<ClientSettings>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ClientSettings> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Client {
    businessId: Types.ObjectId;
    profile: ClientProfile;
    additionalInfo: AdditionalInfo;
    emergencyContacts: {
        primary: EmergencyContact;
        secondary: EmergencyContact;
    };
    address: ClientAddress;
    settings: ClientSettings;
    isActive: boolean;
    totalVisits: number;
    totalSpent: number;
    lastVisit: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ClientSchema: import("mongoose").Schema<Client, import("mongoose").Model<Client, any, any, any, Document<unknown, any, Client, any, {}> & Client & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Client, Document<unknown, {}, import("mongoose").FlatRecord<Client>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Client> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
