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
import { BlogStatus, ContentBlockType } from "../../common/enums";
import { BaseSchema } from "../../common/schemas/base.schema";
export type BlogDocument = Blog & Document;
export declare class ContentBlock {
    type: ContentBlockType;
    data: Record<string, any>;
    order: number;
}
export declare class BlogMetadata {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    keywords?: string[];
}
export declare class BlogAnalytics {
    viewCount: number;
    uniqueViewCount: number;
    readCount: number;
    clapCount: number;
    shareCount: number;
    bookmarkCount: number;
    commentCount: number;
    wordCount: number;
    averageReadTime?: number;
    estimatedReadTime?: number;
}
export declare class PublicationSettings {
    allowComments: boolean;
    allowClaps: boolean;
    isPremium: boolean;
    isFeatured: boolean;
    isEditorsPick: boolean;
    scheduledPublishAt?: Date;
    distributionChannels?: string[];
}
export declare class Blog extends BaseSchema {
    title: string;
    slug: string;
    subtitle?: string;
    content: string;
    contentBlocks?: ContentBlock[];
    excerpt?: string;
    featuredImage?: string;
    featuredImageAlt?: string;
    featuredImageCaption?: string;
    tags?: string[];
    category?: string;
    categoryId?: Types.ObjectId;
    seriesId?: Types.ObjectId;
    seriesOrder?: number;
    status: BlogStatus;
    authorId: Types.ObjectId;
    authorName?: string;
    coAuthors?: Types.ObjectId[];
    publicationId?: Types.ObjectId;
    publishedAt?: Date;
    lastModifiedAt?: Date;
    analytics: BlogAnalytics;
    metadata: BlogMetadata;
    settings: PublicationSettings;
    language?: string;
    relatedPosts?: string[];
    tableOfContents?: string[];
    version?: number;
    revisionHistory?: Array<{
        version: number;
        content: string;
        modifiedAt: Date;
        modifiedBy: Types.ObjectId;
    }>;
}
export declare const BlogSchema: import("mongoose").Schema<Blog, import("mongoose").Model<Blog, any, any, any, Document<unknown, any, Blog, any> & Blog & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Blog, Document<unknown, {}, import("mongoose").FlatRecord<Blog>, {}> & import("mongoose").FlatRecord<Blog> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
