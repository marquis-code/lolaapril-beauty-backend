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
import { FormFieldType } from "../../common/enums";
import { BaseSchema } from "../../common/schemas/base.schema";
export type FormDocument = Form & Document;
declare class FormField {
    id: string;
    label: string;
    type: FormFieldType;
    required: boolean;
    options?: string[];
    placeholder?: string;
    description?: string;
    validation?: string;
}
export declare class Form extends BaseSchema {
    title: string;
    slug: string;
    description?: string;
    instructions?: string;
    fields: FormField[];
    isActive: boolean;
    submissionsCount: number;
    successMessage?: string;
    redirectUrl?: string;
}
export declare const FormSchema: import("mongoose").Schema<Form, import("mongoose").Model<Form, any, any, any, Document<unknown, any, Form, any> & Form & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Form, Document<unknown, {}, import("mongoose").FlatRecord<Form>, {}> & import("mongoose").FlatRecord<Form> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
