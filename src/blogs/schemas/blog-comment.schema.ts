// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
// import { type Document, Types } from "mongoose"
// import { BaseSchema } from "../../common/schemas/base.schema"

// export class HighlightedRangeDto {
//   @IsNumber()
//   start: number

//   @IsNumber()
//   end: number

//   @IsOptional()
//   @IsString()
//   text?: string
// }


// export type BlogCommentDocument = BlogComment & Document

// @Schema({ timestamps: true })
// export class BlogComment extends BaseSchema {
//   @Prop({ type: Types.ObjectId, required: true, ref: "Blog" })
//   blogId: Types.ObjectId

//   @Prop({ type: Types.ObjectId, required: true, ref: "User" })
//   authorId: Types.ObjectId

//   @Prop({ required: true })
//   content: string

//   @Prop({ type: Types.ObjectId, ref: "BlogComment" })
//   parentId?: Types.ObjectId

//   @Prop({ default: 0 })
//   likesCount: number

//   @Prop({ default: false })
//   isHighlighted: boolean

//   @Prop()
//   highlightedText?: string

//   @Prop()
//   highlightedRange?: {
//     start: number
//     end: number
//   }
// }

// export const BlogCommentSchema = SchemaFactory.createForClass(BlogComment)

// BlogCommentSchema.index({ blogId: 1, createdAt: -1 })
// BlogCommentSchema.index({ parentId: 1 })
// BlogCommentSchema.index({ authorId: 1 })


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
import { BaseSchema } from "../../common/schemas/base.schema"

export type BlogCommentDocument = BlogComment & Document

// Define the highlighted range interface
export interface HighlightedRange {
  start: number
  end: number
  text?: string
}

// Define comment reaction interface
export interface CommentReaction {
  userId: Types.ObjectId
  type: 'like' | 'dislike' | 'love' | 'laugh' | 'angry'
  createdAt: Date
}

@Schema({ timestamps: true })
export class BlogComment extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true, ref: "Blog" })
  blogId: Types.ObjectId

  @Prop({ type: Types.ObjectId, required: true, ref: "User" })
  authorId: Types.ObjectId

  @Prop({ required: true })
  content: string

  @Prop({ type: Types.ObjectId, ref: "BlogComment" })
  parentId?: Types.ObjectId

  @Prop({ default: false })
  isEdited: boolean

  @Prop()
  editedAt?: Date

  @Prop({ default: false })
  isDeleted: boolean

  @Prop()
  deletedAt?: Date

  // @Prop({ type: Types.ObjectId, ref: "User" })
  // deletedBy?: Types.ObjectId

  @Prop({ default: 0 })
  likeCount: number

  @Prop({ default: 0 })
  replyCount: number

  @Prop({ default: false })
  isPinned: boolean

  @Prop({ default: false })
  isHighlighted: boolean

  // Fix: Explicitly specify the type for highlightedRange
  @Prop({ 
    type: {
      start: { type: Number, required: true },
      end: { type: Number, required: true },
      text: { type: String }
    }
  })
  highlightedRange?: HighlightedRange

  @Prop([{
    userId: { type: Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ['like', 'dislike', 'love', 'laugh', 'angry'], required: true },
    createdAt: { type: Date, default: Date.now }
  }])
  reactions?: CommentReaction[]

  @Prop([String])
  mentions?: string[]

  @Prop()
  ipAddress?: string

  @Prop()
  userAgent?: string

  @Prop({ default: false })
  isSpam: boolean

  @Prop({ default: false })
  isApproved: boolean

  @Prop()
  moderatedAt?: Date

  @Prop({ type: Types.ObjectId, ref: "User" })
  moderatedBy?: Types.ObjectId

  @Prop()
  moderationReason?: string
}

export const BlogCommentSchema = SchemaFactory.createForClass(BlogComment)

// Indexes for better performance
BlogCommentSchema.index({ blogId: 1, createdAt: -1 })
BlogCommentSchema.index({ authorId: 1 })
BlogCommentSchema.index({ parentId: 1 })
BlogCommentSchema.index({ isDeleted: 1, isApproved: 1 })