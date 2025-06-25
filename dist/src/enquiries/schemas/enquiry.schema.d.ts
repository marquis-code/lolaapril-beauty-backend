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
import { Document } from "mongoose";
import { BaseSchema } from "../../common/schemas/base.schema";
export type EnquiryDocument = Enquiry & Document;
export declare class Enquiry extends BaseSchema {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
    isRead: boolean;
    isReplied: boolean;
}
export declare const EnquirySchema: import("mongoose").Schema<Enquiry, import("mongoose").Model<Enquiry, any, any, any, Document<unknown, any, Enquiry, any> & Enquiry & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Enquiry, Document<unknown, {}, import("mongoose").FlatRecord<Enquiry>, {}> & import("mongoose").FlatRecord<Enquiry> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
