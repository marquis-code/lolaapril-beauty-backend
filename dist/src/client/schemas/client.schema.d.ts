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
import type { Document } from "mongoose";
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
export declare class ClientSettings {
    appointmentNotifications: {
        emailNotifications: boolean;
    };
    marketingNotifications: {
        clientAcceptsEmailMarketing: boolean;
    };
}
export declare class Client {
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
export declare const ClientSchema: import("mongoose").Schema<Client, import("mongoose").Model<Client, any, any, any, Document<unknown, any, Client, any> & Client & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Client, Document<unknown, {}, import("mongoose").FlatRecord<Client>, {}> & import("mongoose").FlatRecord<Client> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
