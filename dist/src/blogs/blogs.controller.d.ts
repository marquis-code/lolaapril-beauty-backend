import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { ClapBlogDto } from "./dto/clap-blog.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { BookmarkBlogDto } from "./dto/bookmark-blog.dto";
import { BlogAnalyticsService } from "./services/blog-analytics.service";
import { BlogStatus } from "../common/enums";
export declare class BlogsController {
    private readonly blogsService;
    private readonly blogAnalyticsService;
    constructor(blogsService: BlogsService, blogAnalyticsService: BlogAnalyticsService);
    create(createBlogDto: CreateBlogDto, user: any): Promise<import("./schemas/blog.schema").Blog>;
    findAll(status?: BlogStatus, page?: number, limit?: number, sortBy?: string, sortOrder?: 'asc' | 'desc', tags?: string, category?: string, authorId?: string): Promise<{
        blogs: import("./schemas/blog.schema").Blog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findPublished(page?: number, limit?: number, featured?: boolean): Promise<{
        blogs: import("./schemas/blog.schema").Blog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getPopularBlogs(limit?: number): Promise<import("./schemas/blog.schema").Blog[]>;
    getTrendingBlogs(days?: number, limit?: number): Promise<import("./schemas/blog.schema").Blog[]>;
    findOne(id: string, user?: any): Promise<import("./schemas/blog.schema").Blog>;
    getRelatedBlogs(id: string, limit?: number): Promise<import("./schemas/blog.schema").Blog[]>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<import("./schemas/blog.schema").Blog>;
    publish(id: string): Promise<import("./schemas/blog.schema").Blog>;
    unpublish(id: string): Promise<import("./schemas/blog.schema").Blog>;
    clapBlog(id: string, user: any, clapDto: ClapBlogDto): Promise<{
        totalClaps: number;
    }>;
    addComment(id: string, user: any, commentDto: CreateCommentDto): Promise<import("./schemas/blog-comment.schema").BlogComment>;
    getComments(id: string, page?: number, limit?: number): Promise<{
        comments: import("./schemas/blog-comment.schema").BlogComment[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    bookmarkBlog(id: string, user: any, bookmarkDto: BookmarkBlogDto): Promise<import("./schemas/blog-bookmark.schema").BlogBookmark>;
    removeBookmark(id: string, user: any): Promise<void>;
    getUserBookmarks(user: any, page?: number, limit?: number): Promise<{
        bookmarks: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    incrementShareCount(id: string): Promise<void>;
    markAsRead(id: string): Promise<void>;
    softDelete(id: string, user: any): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<import("./schemas/blog.schema").Blog>;
}
