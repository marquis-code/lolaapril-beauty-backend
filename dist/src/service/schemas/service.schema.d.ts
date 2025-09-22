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
export type ServiceDocument = Service & Document;
export declare class BasicDetails {
    serviceName: string;
    serviceType: string;
    category: string;
    description: string;
}
export declare class TeamMember {
    id: string;
    name: string;
    role: string;
    selected: boolean;
}
export declare class TeamMembers {
    allTeamMembers: boolean;
    selectedMembers: TeamMember[];
}
export declare class Resources {
    required: boolean;
    resourceList: string[];
}
export declare class Price {
    currency: string;
    amount: number;
    minimumAmount?: number;
}
export declare class ServiceDuration {
    servicingTime: {
        value: number;
        unit: "min" | "h";
    };
    processingTime: {
        value: number;
        unit: "min" | "h";
    };
    totalDuration: string;
}
export declare class ExtraTimeOptions {
    processingTime: string;
    blockedTime: string;
    extraServicingTime: string;
}
export declare class PricingAndDuration {
    priceType: string;
    price: Price;
    duration: ServiceDuration;
    extraTimeOptions: ExtraTimeOptions;
}
export declare class OnlineBooking {
    enabled: boolean;
    availableFor: string;
}
export declare class ServiceSettings {
    onlineBooking: OnlineBooking;
    forms: string[];
    commissions: string[];
    generalSettings: Record<string, any>;
}
export declare class ServiceVariant {
    variantName: string;
    variantDescription: string;
    pricing: {
        priceType: string;
        price: Price;
        duration: {
            value: number;
            unit: string;
        };
    };
    settings: {
        sku?: string;
    };
}
export declare class Service {
    basicDetails: BasicDetails;
    teamMembers: TeamMembers;
    resources: Resources;
    pricingAndDuration: PricingAndDuration;
    serviceAddOns: string[];
    settings: ServiceSettings;
    variants: ServiceVariant[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ServiceSchema: import("mongoose").Schema<Service, import("mongoose").Model<Service, any, any, any, Document<unknown, any, Service, any> & Service & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Service, Document<unknown, {}, import("mongoose").FlatRecord<Service>, {}> & import("mongoose").FlatRecord<Service> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
