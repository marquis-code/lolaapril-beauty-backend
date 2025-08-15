import { Model } from "mongoose";
import { Blog, BlogDocument } from "./schemas/blog.schema";
import { BlogClapDocument } from "./schemas/blog-clap.schema";
import { BlogComment, BlogCommentDocument } from "./schemas/blog-comment.schema";
import { BlogBookmark, BlogBookmarkDocument } from "./schemas/blog-bookmark.schema";
import { SeriesDocument } from "./schemas/series.schema";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { ClapBlogDto } from "./dto/clap-blog.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { BookmarkBlogDto } from "./dto/bookmark-blog.dto";
import { BlogStatus } from "../common/enums";
import { ContentProcessorService } from "./services/content-processor.service";
import { BlogAnalyticsService } from "./services/blog-analytics.service";
export declare class BlogsService {
    private readonly blogModel;
    private readonly blogClapModel;
    private readonly blogCommentModel;
    private readonly blogBookmarkModel;
    private readonly seriesModel;
    private readonly contentProcessorService;
    private readonly blogAnalyticsService;
    constructor(blogModel: Model<BlogDocument>, blogClapModel: Model<BlogClapDocument>, blogCommentModel: Model<BlogCommentDocument>, blogBookmarkModel: Model<BlogBookmarkDocument>, seriesModel: Model<SeriesDocument>, contentProcessorService: ContentProcessorService, blogAnalyticsService: BlogAnalyticsService);
    create(createBlogDto: CreateBlogDto, authorId: string): Promise<Blog>;
    findAll(status?: BlogStatus, page?: number, limit?: number, sortBy?: string, sortOrder?: "asc" | "desc", tags?: string[], category?: string, authorId?: string): Promise<{
        blogs: Blog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findPublished(page?: number, limit?: number, featured?: boolean): Promise<{
        blogs: Blog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string, userId?: string): Promise<Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog>;
    publish(id: string): Promise<Blog>;
    unpublish(id: string): Promise<Blog>;
    softDelete(id: string, deletedBy: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<Blog>;
    clapBlog(blogId: string, userId: string, clapDto: ClapBlogDto): Promise<{
        totalClaps: number;
    }>;
    addComment(blogId: string, userId: string, commentDto: CreateCommentDto): Promise<BlogComment>;
    getComments(blogId: string, page?: number, limit?: number): Promise<{
        comments: BlogComment[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    bookmarkBlog(blogId: string, userId: string, bookmarkDto: BookmarkBlogDto): Promise<BlogBookmark>;
    removeBookmark(blogId: string, userId: string): Promise<void>;
    getUserBookmarks(userId: string, page?: number, limit?: number): Promise<{
        bookmarks: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    private generateUniqueSlug;
    getRelatedBlogs(blogId: string, limit?: number): Promise<Blog[]>;
}
