import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"
import { BlogStatus } from "../../common/enums"
import { BaseSchema } from "../../common/schemas/base.schema"

export type BlogDocument = Blog & Document

@Schema({ timestamps: true })
export class Blog extends BaseSchema {
  @Prop({ required: true })
  title: string

  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ required: true })
  content: string

  @Prop()
  excerpt?: string

  @Prop()
  featuredImage?: string

  @Prop([String])
  tags?: string[]

  @Prop()
  category?: string

  @Prop({ enum: BlogStatus, default: BlogStatus.DRAFT })
  status: BlogStatus

  @Prop({ type: Types.ObjectId, required: true, ref: "User" })
  authorId: Types.ObjectId

  @Prop()
  authorName?: string

  @Prop()
  publishedAt?: Date

  @Prop({ default: 0 })
  viewCount: number

  @Prop()
  metaTitle?: string

  @Prop()
  metaDescription?: string
}

export const BlogSchema = SchemaFactory.createForClass(Blog)
