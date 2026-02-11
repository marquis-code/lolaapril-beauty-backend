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
export type ServiceBundleDocument = ServiceBundle & Document;
export declare class BasicInfo {
    bundleName: string;
    category: Types.ObjectId;
    description: string;
}
export declare class BundleService {
    serviceId: Types.ObjectId;
    serviceName: string;
    duration: number;
    sequence: number;
}
export declare class BundlePricing {
    priceType: string;
    retailPrice: {
        currency: string;
        amount: number;
    };
}
export declare class BundleOnlineBooking {
    enabled: boolean;
    availableFor: string;
}
export declare class ServiceBundle {
    basicInfo: BasicInfo;
    services: BundleService[];
    scheduleType: string;
    pricing: BundlePricing;
    onlineBooking: BundleOnlineBooking;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ServiceBundleSchema: import("mongoose").Schema<ServiceBundle, import("mongoose").Model<ServiceBundle, any, any, any, Document<unknown, any, ServiceBundle, any, {}> & ServiceBundle & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ServiceBundle, Document<unknown, {}, import("mongoose").FlatRecord<ServiceBundle>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ServiceBundle> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
