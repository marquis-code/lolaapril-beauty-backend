import { Model } from "mongoose";
import { Blog, BlogDocument } from "../schemas/blog.schema";
export declare class BlogAnalyticsService {
    private readonly blogModel;
    constructor(blogModel: Model<BlogDocument>);
    incrementViewCount(blogId: string, isUnique?: boolean): Promise<void>;
    incrementReadCount(blogId: string): Promise<void>;
    updateClapCount(blogId: string, totalClaps: number): Promise<void>;
    incrementShareCount(blogId: string): Promise<void>;
    updateBookmarkCount(blogId: string, count: number): Promise<void>;
    updateCommentCount(blogId: string, count: number): Promise<void>;
    getPopularBlogs(limit?: number): Promise<Blog[]>;
    getTrendingBlogs(days?: number, limit?: number): Promise<Blog[]>;
}
