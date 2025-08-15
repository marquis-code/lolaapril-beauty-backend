"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const blog_comment_schema_1 = require("../schemas/blog-comment.schema");
let CommentService = class CommentService {
    constructor(blogCommentModel) {
        this.blogCommentModel = blogCommentModel;
    }
    async addComment(blogId, userId, commentDto) {
        const comment = new this.blogCommentModel(Object.assign({ blogId, authorId: userId }, commentDto));
        await comment.save();
        return comment.populate("authorId", "name avatar");
    }
    async getComments(blogId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [comments, total] = await Promise.all([
            this.blogCommentModel
                .find({ blogId, isDeleted: false, parentId: null })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("authorId", "name avatar")
                .exec(),
            this.blogCommentModel.countDocuments({ blogId, isDeleted: false, parentId: null }),
        ]);
        for (const comment of comments) {
            const replies = await this.blogCommentModel
                .find({ parentId: comment._id, isDeleted: false })
                .sort({ createdAt: 1 })
                .populate("authorId", "name avatar")
                .exec();
            comment.replies = replies;
        }
        return {
            comments,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async updateComment(commentId, userId, content) {
        const comment = await this.blogCommentModel.findById(commentId);
        if (!comment) {
            throw new common_1.NotFoundException("Comment not found");
        }
        if (comment.authorId.toString() !== userId) {
            throw new common_1.BadRequestException("You can only edit your own comments");
        }
        comment.content = content;
        comment.isEdited = true;
        comment.editedAt = new Date();
        await comment.save();
        return comment.populate("authorId", "name avatar");
    }
    async deleteComment(commentId, userId) {
        const comment = await this.blogCommentModel.findById(commentId);
        if (!comment) {
            throw new common_1.NotFoundException("Comment not found");
        }
        if (comment.authorId.toString() !== userId) {
            throw new common_1.BadRequestException("You can only delete your own comments");
        }
        comment.isDeleted = true;
        comment.deletedAt = new Date();
        await comment.save();
    }
    async toggleCommentReaction(commentId, userId, reactionType) {
        const comment = await this.blogCommentModel.findById(commentId);
        if (!comment) {
            throw new common_1.NotFoundException("Comment not found");
        }
        if (!comment.reactions) {
            comment.reactions = [];
        }
        const existingReactionIndex = comment.reactions.findIndex(reaction => reaction.userId.toString() === userId);
        if (existingReactionIndex > -1) {
            const existingReaction = comment.reactions[existingReactionIndex];
            if (existingReaction.type === reactionType) {
                comment.reactions.splice(existingReactionIndex, 1);
            }
            else {
                comment.reactions[existingReactionIndex] = {
                    userId: new mongoose_2.Types.ObjectId(userId),
                    type: reactionType,
                    createdAt: new Date()
                };
            }
        }
        else {
            comment.reactions.push({
                userId: new mongoose_2.Types.ObjectId(userId),
                type: reactionType,
                createdAt: new Date()
            });
        }
        comment.likeCount = comment.reactions.filter(r => r.type === 'like').length;
        await comment.save();
        return comment.populate("authorId", "name avatar");
    }
    async getCommentReplies(parentCommentId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [replies, total] = await Promise.all([
            this.blogCommentModel
                .find({ parentId: parentCommentId, isDeleted: false })
                .sort({ createdAt: 1 })
                .skip(skip)
                .limit(limit)
                .populate("authorId", "name avatar")
                .exec(),
            this.blogCommentModel.countDocuments({ parentId: parentCommentId, isDeleted: false }),
        ]);
        return {
            replies,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getCommentCount(blogId) {
        return this.blogCommentModel.countDocuments({ blogId, isDeleted: false });
    }
    async pinComment(commentId) {
        const comment = await this.blogCommentModel.findByIdAndUpdate(commentId, { isPinned: true }, { new: true }).populate("authorId", "name avatar");
        if (!comment) {
            throw new common_1.NotFoundException("Comment not found");
        }
        return comment;
    }
    async unpinComment(commentId) {
        const comment = await this.blogCommentModel.findByIdAndUpdate(commentId, { isPinned: false }, { new: true }).populate("authorId", "name avatar");
        if (!comment) {
            throw new common_1.NotFoundException("Comment not found");
        }
        return comment;
    }
};
CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(blog_comment_schema_1.BlogComment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map