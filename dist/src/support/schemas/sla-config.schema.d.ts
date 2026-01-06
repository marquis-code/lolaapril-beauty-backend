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
export type SLAConfigDocument = SLAConfig & Document;
export declare class SLAConfig {
    tenantId: Types.ObjectId;
    priority: string;
    firstResponseTime: number;
    resolutionTime: number;
    businessHours: {
        enabled: boolean;
        timezone: string;
        schedule: {
            monday: {
                start: string;
                end: string;
            };
            tuesday: {
                start: string;
                end: string;
            };
            wednesday: {
                start: string;
                end: string;
            };
            thursday: {
                start: string;
                end: string;
            };
            friday: {
                start: string;
                end: string;
            };
            saturday: {
                start: string;
                end: string;
            };
            sunday: {
                start: string;
                end: string;
            };
        };
    };
    escalationEmails: string[];
    isActive: boolean;
}
export declare const SLAConfigSchema: import("mongoose").Schema<SLAConfig, import("mongoose").Model<SLAConfig, any, any, any, Document<unknown, any, SLAConfig, any, {}> & SLAConfig & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SLAConfig, Document<unknown, {}, import("mongoose").FlatRecord<SLAConfig>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<SLAConfig> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
