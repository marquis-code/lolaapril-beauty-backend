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
export declare enum ServiceCategory {
    HAIRCUT = "haircut",
    COLORING = "coloring",
    STYLING = "styling",
    TREATMENT = "treatment",
    NAILS = "nails",
    FACIAL = "facial",
    MASSAGE = "massage",
    WAXING = "waxing"
}
export declare class Service {
    name: string;
    description: string;
    price: number;
    duration: number;
    category: ServiceCategory;
    image?: string;
    isActive: boolean;
    tags: string[];
    preparationTime?: number;
    cleanupTime?: number;
    popularity: number;
    requirements?: string;
    aftercareInstructions?: string;
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
