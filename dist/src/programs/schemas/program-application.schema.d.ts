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
import { type Document, Types } from "mongoose";
import { BaseSchema } from "../../common/schemas/base.schema";
export type ProgramApplicationDocument = ProgramApplication & Document;
declare class FormResponse {
    fieldId: string;
    fieldLabel: string;
    value: string;
}
export declare class ProgramApplication extends BaseSchema {
    programId: Types.ObjectId;
    programTitle: string;
    applicantEmail: string;
    responses: FormResponse[];
    status: string;
    reviewedBy?: string;
    reviewedAt?: Date;
    notes?: string;
}
export declare const ProgramApplicationSchema: import("mongoose").Schema<ProgramApplication, import("mongoose").Model<ProgramApplication, any, any, any, Document<unknown, any, ProgramApplication, any> & ProgramApplication & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProgramApplication, Document<unknown, {}, import("mongoose").FlatRecord<ProgramApplication>, {}> & import("mongoose").FlatRecord<ProgramApplication> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
