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
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type MobileSpaRequestDocument = MobileSpaRequest & Document;
export declare class MobileSpaService {
    serviceId: Types.ObjectId;
    serviceName: string;
    price: number;
    quantity: number;
}
export declare class MobileSpaLocation {
    address: string;
    lat: number;
    lng: number;
    placeId: string;
    additionalDirections: string;
}
export declare class MobileSpaRequest {
    clientId: Types.ObjectId;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    businessId: Types.ObjectId;
    businessName: string;
    businessEmail: string;
    services: MobileSpaService[];
    numberOfPeople: number;
    location: MobileSpaLocation;
    requestedDate: Date;
    requestedTime: string;
    status: string;
    suggestedDate: Date;
    suggestedTime: string;
    businessNotes: string;
    clientNotes: string;
    paymentLink: string;
    paymentStatus: string;
    totalAmount: number;
    requestNumber: string;
}
export declare const MobileSpaRequestSchema: MongooseSchema<MobileSpaRequest, import("mongoose").Model<MobileSpaRequest, any, any, any, Document<unknown, any, MobileSpaRequest, any, {}> & MobileSpaRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MobileSpaRequest, Document<unknown, {}, import("mongoose").FlatRecord<MobileSpaRequest>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<MobileSpaRequest> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
