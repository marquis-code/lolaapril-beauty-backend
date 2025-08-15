import { ContentBlockType } from "../../common/enums";
export declare class ContentBlockDto {
    type: ContentBlockType;
    data: Record<string, any>;
    order: number;
}
export declare class BlogMetadataDto {
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
export declare class PublicationSettingsDto {
    allowComments?: boolean;
    allowClaps?: boolean;
    isPremium?: boolean;
    isFeatured?: boolean;
    isEditorsPick?: boolean;
    scheduledPublishAt?: Date;
    distributionChannels?: string[];
}
export declare class CreateBlogDto {
    title: string;
    subtitle?: string;
    content: string;
    contentBlocks?: ContentBlockDto[];
    excerpt?: string;
    featuredImage?: string;
    featuredImageAlt?: string;
    featuredImageCaption?: string;
    tags?: string[];
    category?: string;
    categoryId?: string;
    seriesId?: string;
    seriesOrder?: number;
    coAuthors?: string[];
    publicationId?: string;
    authorName?: string;
    metadata?: BlogMetadataDto;
    settings?: PublicationSettingsDto;
    language?: string;
    relatedPosts?: string[];
}
