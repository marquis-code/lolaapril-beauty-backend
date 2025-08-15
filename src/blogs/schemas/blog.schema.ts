
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"
import { BlogStatus, ContentBlockType } from "../../common/enums"
import { BaseSchema } from "../../common/schemas/base.schema"

export type BlogDocument = Blog & Document

// Content block for rich text editing (Medium-style)
@Schema({ _id: false })
export class ContentBlock {
  @Prop({ enum: ContentBlockType, required: true })
  type: ContentBlockType

  @Prop({ type: Object })
  data: Record<string, any>

  @Prop()
  order: number
}

// SEO and social media metadata
@Schema({ _id: false })
export class BlogMetadata {
  @Prop()
  metaTitle?: string

  @Prop()
  metaDescription?: string

  @Prop()
  canonicalUrl?: string

  @Prop()
  ogTitle?: string

  @Prop()
  ogDescription?: string

  @Prop()
  ogImage?: string

  @Prop()
  twitterTitle?: string

  @Prop()
  twitterDescription?: string

  @Prop()
  twitterImage?: string

  @Prop([String])
  keywords?: string[]
}

// Analytics and engagement data
@Schema({ _id: false })
export class BlogAnalytics {
  @Prop({ default: 0 })
  viewCount: number

  @Prop({ default: 0 })
  uniqueViewCount: number

  @Prop({ default: 0 })
  readCount: number

  @Prop({ default: 0 })
  clapCount: number

  @Prop({ default: 0 })
  shareCount: number

  @Prop({ default: 0 })
  bookmarkCount: number

  @Prop({ default: 0 })
  commentCount: number

  @Prop({ default: 0 })
  wordCount: number // Added this property

  @Prop()
  averageReadTime?: number

  @Prop()
  estimatedReadTime?: number
}

// Publication settings
@Schema({ _id: false })
export class PublicationSettings {
  @Prop({ default: true })
  allowComments: boolean

  @Prop({ default: true })
  allowClaps: boolean

  @Prop({ default: false })
  isPremium: boolean

  @Prop({ default: false })
  isFeatured: boolean

  @Prop({ default: false })
  isEditorsPick: boolean

  @Prop()
  scheduledPublishAt?: Date

  @Prop([String])
  distributionChannels?: string[]
}

@Schema({ timestamps: true })
export class Blog extends BaseSchema {
  @Prop({ required: true })
  title: string

  @Prop({ required: true, unique: true })
  slug: string

  @Prop()
  subtitle?: string

  @Prop({ required: true })
  content: string

  @Prop([ContentBlock])
  contentBlocks?: ContentBlock[]

  @Prop()
  excerpt?: string

  @Prop()
  featuredImage?: string

  @Prop()
  featuredImageAlt?: string

  @Prop()
  featuredImageCaption?: string

  @Prop([String])
  tags?: string[]

  @Prop()
  category?: string

  @Prop({ type: Types.ObjectId, ref: "Category" })
  categoryId?: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Series" })
  seriesId?: Types.ObjectId

  @Prop()
  seriesOrder?: number

  @Prop({ enum: BlogStatus, default: BlogStatus.DRAFT })
  status: BlogStatus

  @Prop({ type: Types.ObjectId, required: true, ref: "User" })
  authorId: Types.ObjectId

  @Prop()
  authorName?: string

  @Prop([{ type: Types.ObjectId, ref: "User" }])
  coAuthors?: Types.ObjectId[]

  @Prop({ type: Types.ObjectId, ref: "Publication" })
  publicationId?: Types.ObjectId

  @Prop()
  publishedAt?: Date

  @Prop()
  lastModifiedAt?: Date

  @Prop({ type: BlogAnalytics, default: () => ({}) })
  analytics: BlogAnalytics

  @Prop({ type: BlogMetadata, default: () => ({}) })
  metadata: BlogMetadata

  @Prop({ type: PublicationSettings, default: () => ({}) })
  settings: PublicationSettings

  @Prop()
  language?: string

  @Prop([String])
  relatedPosts?: string[]

  @Prop()
  tableOfContents?: string[]

  @Prop()
  version?: number

  @Prop([
    {
      version: Number,
      content: String,
      modifiedAt: Date,
      modifiedBy: { type: Types.ObjectId, ref: "User" },
    },
  ])
  revisionHistory?: Array<{
    version: number
    content: string
    modifiedAt: Date
    modifiedBy: Types.ObjectId
  }>
}

export const BlogSchema = SchemaFactory.createForClass(Blog)

// Indexes for better performance
BlogSchema.index({ slug: 1 })
BlogSchema.index({ authorId: 1, status: 1 })
BlogSchema.index({ status: 1, publishedAt: -1 })
BlogSchema.index({ tags: 1 })
BlogSchema.index({ category: 1 })
BlogSchema.index({ "analytics.viewCount": -1 })
BlogSchema.index({ "analytics.clapCount": -1 })
BlogSchema.index({ createdAt: -1 })
BlogSchema.index({ publishedAt: -1 })
