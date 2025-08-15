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
import { BaseSchema } from "../../common/schemas/base.schema";
export type BlogCommentDocument = BlogComment & Document;
export interface HighlightedRange {
    start: number;
    end: number;
    text?: string;
}
export interface CommentReaction {
    userId: Types.ObjectId;
    type: 'like' | 'dislike' | 'love' | 'laugh' | 'angry';
    createdAt: Date;
}
export declare class BlogComment extends BaseSchema {
    blogId: Types.ObjectId;
    authorId: Types.ObjectId;
    content: string;
    parentId?: Types.ObjectId;
    isEdited: boolean;
    editedAt?: Date;
    isDeleted: boolean;
    deletedAt?: Date;
    likeCount: number;
    replyCount: number;
    isPinned: boolean;
    isHighlighted: boolean;
    highlightedRange?: HighlightedRange;
    reactions?: CommentReaction[];
    mentions?: string[];
    ipAddress?: string;
    userAgent?: string;
    isSpam: boolean;
    isApproved: boolean;
    moderatedAt?: Date;
    moderatedBy?: Types.ObjectId;
    moderationReason?: string;
}
export declare const BlogCommentSchema: import("mongoose").Schema<BlogComment, import("mongoose").Model<BlogComment, any, any, any, Document<unknown, any, BlogComment, any> & BlogComment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BlogComment, Document<unknown, {}, import("mongoose").FlatRecord<BlogComment>, {}> & import("mongoose").FlatRecord<BlogComment> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
