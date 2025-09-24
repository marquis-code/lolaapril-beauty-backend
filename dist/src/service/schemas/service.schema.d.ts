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
import { Types, Document } from "mongoose";
export type ServiceDocument = Service & Document;
export declare class BasicDetails {
    serviceName: string;
    serviceType: string;
    category: Types.ObjectId;
    description: string;
}
export declare const BasicDetailsSchema: import("mongoose").Schema<BasicDetails, import("mongoose").Model<BasicDetails, any, any, any, Document<unknown, any, BasicDetails, any> & BasicDetails & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BasicDetails, Document<unknown, {}, import("mongoose").FlatRecord<BasicDetails>, {}> & import("mongoose").FlatRecord<BasicDetails> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class TeamMember {
    id: Types.ObjectId;
    name: string;
    role: string;
    selected: boolean;
}
export declare const TeamMemberSchema: import("mongoose").Schema<TeamMember, import("mongoose").Model<TeamMember, any, any, any, Document<unknown, any, TeamMember, any> & TeamMember & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TeamMember, Document<unknown, {}, import("mongoose").FlatRecord<TeamMember>, {}> & import("mongoose").FlatRecord<TeamMember> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class TeamMembers {
    allTeamMembers: boolean;
    selectedMembers: TeamMember[];
}
export declare const TeamMembersSchema: import("mongoose").Schema<TeamMembers, import("mongoose").Model<TeamMembers, any, any, any, Document<unknown, any, TeamMembers, any> & TeamMembers & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TeamMembers, Document<unknown, {}, import("mongoose").FlatRecord<TeamMembers>, {}> & import("mongoose").FlatRecord<TeamMembers> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Resources {
    isRequired: boolean;
    resourceList: Types.ObjectId[];
}
export declare const ResourcesSchema: import("mongoose").Schema<Resources, import("mongoose").Model<Resources, any, any, any, Document<unknown, any, Resources, any> & Resources & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Resources, Document<unknown, {}, import("mongoose").FlatRecord<Resources>, {}> & import("mongoose").FlatRecord<Resources> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Price {
    currency: string;
    amount: number;
    minimumAmount?: number;
}
export declare const PriceSchema: import("mongoose").Schema<Price, import("mongoose").Model<Price, any, any, any, Document<unknown, any, Price, any> & Price & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Price, Document<unknown, {}, import("mongoose").FlatRecord<Price>, {}> & import("mongoose").FlatRecord<Price> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
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
export declare const ServiceDurationSchema: import("mongoose").Schema<ServiceDuration, import("mongoose").Model<ServiceDuration, any, any, any, Document<unknown, any, ServiceDuration, any> & ServiceDuration & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ServiceDuration, Document<unknown, {}, import("mongoose").FlatRecord<ServiceDuration>, {}> & import("mongoose").FlatRecord<ServiceDuration> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class ExtraTimeOptions {
    processingTime: string;
    blockedTime: string;
    extraServicingTime: string;
}
export declare const ExtraTimeOptionsSchema: import("mongoose").Schema<ExtraTimeOptions, import("mongoose").Model<ExtraTimeOptions, any, any, any, Document<unknown, any, ExtraTimeOptions, any> & ExtraTimeOptions & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ExtraTimeOptions, Document<unknown, {}, import("mongoose").FlatRecord<ExtraTimeOptions>, {}> & import("mongoose").FlatRecord<ExtraTimeOptions> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class PricingAndDuration {
    priceType: string;
    price: Price;
    duration: ServiceDuration;
    extraTimeOptions: ExtraTimeOptions;
}
export declare const PricingAndDurationSchema: import("mongoose").Schema<PricingAndDuration, import("mongoose").Model<PricingAndDuration, any, any, any, Document<unknown, any, PricingAndDuration, any> & PricingAndDuration & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PricingAndDuration, Document<unknown, {}, import("mongoose").FlatRecord<PricingAndDuration>, {}> & import("mongoose").FlatRecord<PricingAndDuration> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class OnlineBooking {
    enabled: boolean;
    availableFor: string;
}
export declare const OnlineBookingSchema: import("mongoose").Schema<OnlineBooking, import("mongoose").Model<OnlineBooking, any, any, any, Document<unknown, any, OnlineBooking, any> & OnlineBooking & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OnlineBooking, Document<unknown, {}, import("mongoose").FlatRecord<OnlineBooking>, {}> & import("mongoose").FlatRecord<OnlineBooking> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class ServiceSettings {
    onlineBooking: OnlineBooking;
    forms: Types.ObjectId[];
    commissions: Types.ObjectId[];
    generalSettings: Record<string, any>;
}
export declare const ServiceSettingsSchema: import("mongoose").Schema<ServiceSettings, import("mongoose").Model<ServiceSettings, any, any, any, Document<unknown, any, ServiceSettings, any> & ServiceSettings & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ServiceSettings, Document<unknown, {}, import("mongoose").FlatRecord<ServiceSettings>, {}> & import("mongoose").FlatRecord<ServiceSettings> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
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
export declare const ServiceVariantSchema: import("mongoose").Schema<ServiceVariant, import("mongoose").Model<ServiceVariant, any, any, any, Document<unknown, any, ServiceVariant, any> & ServiceVariant & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ServiceVariant, Document<unknown, {}, import("mongoose").FlatRecord<ServiceVariant>, {}> & import("mongoose").FlatRecord<ServiceVariant> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Service {
    basicDetails: BasicDetails;
    teamMembers: TeamMembers;
    resources: Resources;
    pricingAndDuration: PricingAndDuration;
    serviceAddOns: Types.ObjectId[];
    settings: ServiceSettings;
    variants: ServiceVariant[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ServiceSchema: import("mongoose").Schema<Service, import("mongoose").Model<Service, any, any, any, Document<unknown, any, Service, any> & Service & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Service, Document<unknown, {}, import("mongoose").FlatRecord<Service>, {}> & import("mongoose").FlatRecord<Service> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
