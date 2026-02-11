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
import { Document, Types } from 'mongoose';
export type BusinessVerificationDocument = BusinessVerification & Document;
export declare class BusinessVerification {
    tenantId: Types.ObjectId;
    status: string;
    verificationLevel: string;
    businessDocuments: {
        businessRegistration: {
            url: string;
            verified: boolean;
            verifiedAt: Date;
        };
        taxId: {
            number: string;
            verified: boolean;
            verifiedAt: Date;
        };
        businessLicense: {
            url: string;
            verified: boolean;
            verifiedAt: Date;
        };
        professionalCertificates: {
            url: string;
            type: string;
            verified: boolean;
            verifiedAt: Date;
        }[];
    };
    ownerVerification: {
        idType: string;
        idNumber: string;
        idDocument: string;
        verified: boolean;
        verifiedAt: Date;
    };
    addressVerification: {
        address: string;
        proofDocument: string;
        verified: boolean;
        verifiedAt: Date;
    };
    verificationNotes: string[];
    verifiedBy: Types.ObjectId;
    verifiedAt: Date;
    rejectionReason: string;
    qualityMetrics: {
        responseRate: number;
        avgResponseTime: number;
        completionRate: number;
        cancellationRate: number;
        onTimeRate: number;
    };
}
export declare const BusinessVerificationSchema: import("mongoose").Schema<BusinessVerification, import("mongoose").Model<BusinessVerification, any, any, any, Document<unknown, any, BusinessVerification, any, {}> & BusinessVerification & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BusinessVerification, Document<unknown, {}, import("mongoose").FlatRecord<BusinessVerification>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<BusinessVerification> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
