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
export type SeriesDocument = Series & Document;
export declare class Series extends BaseSchema {
    title: string;
    slug: string;
    description?: string;
    coverImage?: string;
    authorId: Types.ObjectId;
    blogIds: Types.ObjectId[];
    totalPosts: number;
    isCompleted: boolean;
}
export declare const SeriesSchema: import("mongoose").Schema<Series, import("mongoose").Model<Series, any, any, any, Document<unknown, any, Series, any> & Series & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Series, Document<unknown, {}, import("mongoose").FlatRecord<Series>, {}> & import("mongoose").FlatRecord<Series> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
