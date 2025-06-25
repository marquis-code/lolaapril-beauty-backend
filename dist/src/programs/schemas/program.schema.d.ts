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
import { ProgramStatus, FormFieldType } from "../../common/enums";
import { BaseSchema } from "../../common/schemas/base.schema";
export type ProgramDocument = Program & Document;
declare class FormField {
    id: string;
    label: string;
    type: FormFieldType;
    required: boolean;
    options?: string[];
    placeholder?: string;
    description?: string;
}
export declare class Program extends BaseSchema {
    title: string;
    slug: string;
    category: string;
    description: string;
    duration?: string;
    focusAreas?: string[];
    outcomes?: string[];
    keyResponsibilities?: string[];
    image?: string;
    highlights?: Array<{
        title: string;
        description: string;
    }>;
    status: ProgramStatus;
    registrationToken: string;
    formFields: FormField[];
    formTitle?: string;
    formInstructions?: string;
    applicationsCount: number;
}
export declare const ProgramSchema: import("mongoose").Schema<Program, import("mongoose").Model<Program, any, any, any, Document<unknown, any, Program, any> & Program & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Program, Document<unknown, {}, import("mongoose").FlatRecord<Program>, {}> & import("mongoose").FlatRecord<Program> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
