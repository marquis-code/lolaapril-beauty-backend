import { Model } from "mongoose";
import { BlogComment, BlogCommentDocument } from "../schemas/blog-comment.schema";
import { CreateCommentDto } from "../dto/create-comment.dto";
export declare class CommentService {
    private readonly blogCommentModel;
    constructor(blogCommentModel: Model<BlogCommentDocument>);
    addComment(blogId: string, userId: string, commentDto: CreateCommentDto): Promise<BlogComment>;
    getComments(blogId: string, page?: number, limit?: number): Promise<{
        comments: BlogComment[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    updateComment(commentId: string, userId: string, content: string): Promise<BlogComment>;
    deleteComment(commentId: string, userId: string): Promise<void>;
    toggleCommentReaction(commentId: string, userId: string, reactionType: 'like' | 'dislike' | 'love' | 'laugh' | 'angry'): Promise<BlogComment>;
    getCommentReplies(parentCommentId: string, page?: number, limit?: number): Promise<{
        replies: BlogComment[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getCommentCount(blogId: string): Promise<number>;
    pinComment(commentId: string): Promise<BlogComment>;
    unpinComment(commentId: string): Promise<BlogComment>;
}
