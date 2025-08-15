import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"
import { BaseSchema } from "../../common/schemas/base.schema"

export type SeriesDocument = Series & Document

@Schema({ timestamps: true })
export class Series extends BaseSchema {
  @Prop({ required: true })
  title: string

  @Prop({ required: true, unique: true })
  slug: string

  @Prop()
  description?: string

  @Prop()
  coverImage?: string

  @Prop({ type: Types.ObjectId, required: true, ref: "User" })
  authorId: Types.ObjectId

  @Prop([{ type: Types.ObjectId, ref: "Blog" }])
  blogIds: Types.ObjectId[]

  @Prop({ default: 0 })
  totalPosts: number

  @Prop({ default: false })
  isCompleted: boolean
}

export const SeriesSchema = SchemaFactory.createForClass(Series)

SeriesSchema.index({ slug: 1 })
SeriesSchema.index({ authorId: 1 })
