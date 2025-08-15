import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"
import { BaseSchema } from "../../common/schemas/base.schema"

export type BlogClapDocument = BlogClap & Document

@Schema({ timestamps: true })
export class BlogClap extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true, ref: "Blog" })
  blogId: Types.ObjectId

  @Prop({ type: Types.ObjectId, required: true, ref: "User" })
  userId: Types.ObjectId

  @Prop({ default: 1, min: 1, max: 50 })
  count: number
}

export const BlogClapSchema = SchemaFactory.createForClass(BlogClap)

// Compound index to ensure one clap record per user per blog
BlogClapSchema.index({ blogId: 1, userId: 1 }, { unique: true })
