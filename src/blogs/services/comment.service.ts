// import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
// import type { Model } from "mongoose"
// import type { BlogComment, BlogCommentDocument } from "../schemas/blog-comment.schema"
// import type { CreateCommentDto } from "../dto/create-comment.dto"

// @Injectable()
// export class CommentService {
//   private readonly blogCommentModel: Model<BlogCommentDocument>

//   constructor(blogCommentModel: Model<BlogCommentDocument>) {
//     this.blogCommentModel = blogCommentModel
//   }

//   async addComment(blogId: string, userId: string, commentDto: CreateCommentDto): Promise<BlogComment> {
//     const comment = new this.blogCommentModel({
//       blogId,
//       authorId: userId,
//       ...commentDto,
//     })

//     await comment.save()
//     return comment.populate("authorId", "name avatar")
//   }

//   async getComments(
//     blogId: string,
//     page = 1,
//     limit = 20,
//   ): Promise<{
//     comments: BlogComment[]
//     total: number
//     page: number
//     totalPages: number
//   }> {
//     const skip = (page - 1) * limit

//     const [comments, total] = await Promise.all([
//       this.blogCommentModel
//         .find({ blogId, isDeleted: false, parentId: null })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .populate("authorId", "name avatar")
//         .exec(),
//       this.blogCommentModel.countDocuments({ blogId, isDeleted: false, parentId: null }),
//     ])

//     // Get replies for each comment
//     for (const comment of comments) {
//       const replies = await this.blogCommentModel
//         .find({ parentId: comment._id, isDeleted: false })
//         .sort({ createdAt: 1 })
//         .populate("authorId", "name avatar")
//         .exec()
//       ;(comment as any).replies = replies
//     }

//     return {
//       comments,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     }
//   }

//   async deleteComment(commentId: string, userId: string): Promise<void> {
//     const comment = await this.blogCommentModel.findById(commentId)

//     if (!comment) {
//       throw new NotFoundException("Comment not found")
//     }

//     if (comment.authorId.toString() !== userId) {
//       throw new BadRequestException("You can only delete your own comments")
//     }

//     comment.isDeleted = true
//     comment.deletedAt = new Date()
//     await comment.save()
//   }

//   async getCommentCount(blogId: string): Promise<number> {
//     return this.blogCommentModel.countDocuments({ blogId, isDeleted: false })
//   }
// }


import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { BlogComment, BlogCommentDocument } from "../schemas/blog-comment.schema"
import { CreateCommentDto } from "../dto/create-comment.dto"

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(BlogComment.name) private readonly blogCommentModel: Model<BlogCommentDocument>
  ) {}

  async addComment(blogId: string, userId: string, commentDto: CreateCommentDto): Promise<BlogComment> {
    const comment = new this.blogCommentModel({
      blogId,
      authorId: userId,
      ...commentDto,
    })

    await comment.save()
    return comment.populate("authorId", "name avatar")
  }

  async getComments(
    blogId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    comments: BlogComment[]
    total: number
    page: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      this.blogCommentModel
        .find({ blogId, isDeleted: false, parentId: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("authorId", "name avatar")
        .exec(),
      this.blogCommentModel.countDocuments({ blogId, isDeleted: false, parentId: null }),
    ])

    // Get replies for each comment
    for (const comment of comments) {
      const replies = await this.blogCommentModel
        .find({ parentId: comment._id, isDeleted: false })
        .sort({ createdAt: 1 })
        .populate("authorId", "name avatar")
        .exec()
      ;(comment as any).replies = replies
    }

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async updateComment(commentId: string, userId: string, content: string): Promise<BlogComment> {
    const comment = await this.blogCommentModel.findById(commentId)

    if (!comment) {
      throw new NotFoundException("Comment not found")
    }

    if (comment.authorId.toString() !== userId) {
      throw new BadRequestException("You can only edit your own comments")
    }

    comment.content = content
    comment.isEdited = true
    comment.editedAt = new Date()

    await comment.save()
    return comment.populate("authorId", "name avatar")
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.blogCommentModel.findById(commentId)

    if (!comment) {
      throw new NotFoundException("Comment not found")
    }

    if (comment.authorId.toString() !== userId) {
      throw new BadRequestException("You can only delete your own comments")
    }

    comment.isDeleted = true
    comment.deletedAt = new Date()
    await comment.save()
  }

  async toggleCommentReaction(
    commentId: string, 
    userId: string, 
    reactionType: 'like' | 'dislike' | 'love' | 'laugh' | 'angry'
  ): Promise<BlogComment> {
    const comment = await this.blogCommentModel.findById(commentId)

    if (!comment) {
      throw new NotFoundException("Comment not found")
    }

    if (!comment.reactions) {
      comment.reactions = []
    }

    const existingReactionIndex = comment.reactions.findIndex(
      reaction => reaction.userId.toString() === userId
    )

    if (existingReactionIndex > -1) {
      const existingReaction = comment.reactions[existingReactionIndex]
      if (existingReaction.type === reactionType) {
        // Remove reaction if it's the same type
        comment.reactions.splice(existingReactionIndex, 1)
      } else {
        // Update reaction type
        comment.reactions[existingReactionIndex] = {
          userId: new Types.ObjectId(userId),
          type: reactionType,
          createdAt: new Date()
        }
      }
    } else {
      // Add new reaction
      comment.reactions.push({
        userId: new Types.ObjectId(userId),
        type: reactionType,
        createdAt: new Date()
      })
    }

    // Update like count (you might want to calculate other reaction counts too)
    comment.likeCount = comment.reactions.filter(r => r.type === 'like').length

    await comment.save()
    return comment.populate("authorId", "name avatar")
  }

  async getCommentReplies(parentCommentId: string, page = 1, limit = 10): Promise<{
    replies: BlogComment[]
    total: number
    page: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const [replies, total] = await Promise.all([
      this.blogCommentModel
        .find({ parentId: parentCommentId, isDeleted: false })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate("authorId", "name avatar")
        .exec(),
      this.blogCommentModel.countDocuments({ parentId: parentCommentId, isDeleted: false }),
    ])

    return {
      replies,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getCommentCount(blogId: string): Promise<number> {
    return this.blogCommentModel.countDocuments({ blogId, isDeleted: false })
  }

  async pinComment(commentId: string): Promise<BlogComment> {
    const comment = await this.blogCommentModel.findByIdAndUpdate(
      commentId,
      { isPinned: true },
      { new: true }
    ).populate("authorId", "name avatar")

    if (!comment) {
      throw new NotFoundException("Comment not found")
    }

    return comment
  }

  async unpinComment(commentId: string): Promise<BlogComment> {
    const comment = await this.blogCommentModel.findByIdAndUpdate(
      commentId,
      { isPinned: false },
      { new: true }
    ).populate("authorId", "name avatar")

    if (!comment) {
      throw new NotFoundException("Comment not found")
    }

    return comment
  }
}