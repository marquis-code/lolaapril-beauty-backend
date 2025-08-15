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
export type BlogClapDocument = BlogClap & Document;
export declare class BlogClap extends BaseSchema {
    blogId: Types.ObjectId;
    userId: Types.ObjectId;
    count: number;
}
export declare const BlogClapSchema: import("mongoose").Schema<BlogClap, import("mongoose").Model<BlogClap, any, any, any, Document<unknown, any, BlogClap, any> & BlogClap & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BlogClap, Document<unknown, {}, import("mongoose").FlatRecord<BlogClap>, {}> & import("mongoose").FlatRecord<BlogClap> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
