import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsObject,
} from "class-validator"
import { Type } from "class-transformer"
import { ContentBlockType } from "../../common/enums"

export class ContentBlockDto {
  @IsEnum(ContentBlockType)
  type: ContentBlockType

  @IsObject()
  data: Record<string, any>

  @IsNumber()
  order: number
}

export class BlogMetadataDto {
  @IsOptional()
  @IsString()
  metaTitle?: string

  @IsOptional()
  @IsString()
  metaDescription?: string

  @IsOptional()
  @IsString()
  canonicalUrl?: string

  @IsOptional()
  @IsString()
  ogTitle?: string

  @IsOptional()
  @IsString()
  ogDescription?: string

  @IsOptional()
  @IsString()
  ogImage?: string

  @IsOptional()
  @IsString()
  twitterTitle?: string

  @IsOptional()
  @IsString()
  twitterDescription?: string

  @IsOptional()
  @IsString()
  twitterImage?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[]
}

export class PublicationSettingsDto {
  @IsOptional()
  @IsBoolean()
  allowComments?: boolean

  @IsOptional()
  @IsBoolean()
  allowClaps?: boolean

  @IsOptional()
  @IsBoolean()
  isPremium?: boolean

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean

  @IsOptional()
  @IsBoolean()
  isEditorsPick?: boolean

  @IsOptional()
  scheduledPublishAt?: Date

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  distributionChannels?: string[]
}

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  subtitle?: string

  @IsNotEmpty()
  @IsString()
  content: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  contentBlocks?: ContentBlockDto[]

  @IsOptional()
  @IsString()
  excerpt?: string

  @IsOptional()
  @IsString()
  featuredImage?: string

  @IsOptional()
  @IsString()
  featuredImageAlt?: string

  @IsOptional()
  @IsString()
  featuredImageCaption?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  seriesId?: string

  @IsOptional()
  @IsNumber()
  seriesOrder?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coAuthors?: string[]

  @IsOptional()
  @IsString()
  publicationId?: string

  @IsOptional()
  @IsString()
  authorName?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => BlogMetadataDto)
  metadata?: BlogMetadataDto

  @IsOptional()
  @ValidateNested()
  @Type(() => PublicationSettingsDto)
  settings?: PublicationSettingsDto

  @IsOptional()
  @IsString()
  language?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedPosts?: string[]
}
