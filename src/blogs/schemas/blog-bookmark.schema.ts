import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"
import { BaseSchema } from "../../common/schemas/base.schema"

export type BlogBookmarkDocument = BlogBookmark & Document

@Schema({ timestamps: true })
export class BlogBookmark extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true, ref: "Blog" })
  blogId: Types.ObjectId

  @Prop({ type: Types.ObjectId, required: true, ref: "User" })
  userId: Types.ObjectId

  @Prop([String])
  collections?: string[]

  @Prop()
  note?: string
}

export const BlogBookmarkSchema = SchemaFactory.createForClass(BlogBookmark)

BlogBookmarkSchema.index({ blogId: 1, userId: 1 }, { unique: true })
BlogBookmarkSchema.index({ userId: 1, createdAt: -1 })
