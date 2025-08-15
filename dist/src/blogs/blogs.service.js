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
exports.BlogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const blog_schema_1 = require("./schemas/blog.schema");
const blog_clap_schema_1 = require("./schemas/blog-clap.schema");
const blog_comment_schema_1 = require("./schemas/blog-comment.schema");
const blog_bookmark_schema_1 = require("./schemas/blog-bookmark.schema");
const series_schema_1 = require("./schemas/series.schema");
const enums_1 = require("../common/enums");
const content_processor_service_1 = require("./services/content-processor.service");
const blog_analytics_service_1 = require("./services/blog-analytics.service");
const slugify_1 = require("slugify");
let BlogsService = class BlogsService {
    constructor(blogModel, blogClapModel, blogCommentModel, blogBookmarkModel, seriesModel, contentProcessorService, blogAnalyticsService) {
        this.blogModel = blogModel;
        this.blogClapModel = blogClapModel;
        this.blogCommentModel = blogCommentModel;
        this.blogBookmarkModel = blogBookmarkModel;
        this.seriesModel = seriesModel;
        this.contentProcessorService = contentProcessorService;
        this.blogAnalyticsService = blogAnalyticsService;
    }
    async create(createBlogDto, authorId) {
        const slug = await this.generateUniqueSlug(createBlogDto.title);
        const estimatedReadTime = this.contentProcessorService.calculateReadingTime(createBlogDto.content, createBlogDto.contentBlocks);
        const excerpt = createBlogDto.excerpt || this.contentProcessorService.generateExcerpt(createBlogDto.content);
        const tableOfContents = this.contentProcessorService.generateTableOfContents(createBlogDto.contentBlocks);
        const blog = new this.blogModel(Object.assign(Object.assign({}, createBlogDto), { slug,
            excerpt,
            authorId,
            tableOfContents, status: enums_1.BlogStatus.DRAFT, analytics: {
                estimatedReadTime,
                viewCount: 0,
                uniqueViewCount: 0,
                readCount: 0,
                clapCount: 0,
                shareCount: 0,
                bookmarkCount: 0,
                commentCount: 0,
            }, version: 1 }));
        return blog.save();
    }
    async findAll(status, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", tags, category, authorId) {
        const filter = { isDeleted: false };
        if (status)
            filter.status = status;
        if (tags && tags.length > 0)
            filter.tags = { $in: tags };
        if (category)
            filter.category = category;
        if (authorId)
            filter.authorId = authorId;
        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
        const [blogs, total] = await Promise.all([
            this.blogModel
                .find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate("authorId", "name email avatar")
                .populate("seriesId", "title slug")
                .exec(),
            this.blogModel.countDocuments(filter),
        ]);
        return {
            blogs,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findPublished(page = 1, limit = 10, featured) {
        const filter = {
            status: enums_1.BlogStatus.PUBLISHED,
            isDeleted: false,
        };
        if (featured !== undefined) {
            filter["settings.isFeatured"] = featured;
        }
        return this.findAll(enums_1.BlogStatus.PUBLISHED, page, limit, "publishedAt", "desc");
    }
    async findOne(id, userId) {
        const blog = await this.blogModel
            .findOne({
            $or: [{ _id: id }, { slug: id }],
            isDeleted: false,
        })
            .populate("authorId", "name email avatar bio")
            .populate("coAuthors", "name email avatar")
            .populate("seriesId", "title slug description")
            .exec();
        if (!blog) {
            throw new common_1.NotFoundException("Blog not found");
        }
        if (userId !== blog.authorId.toString()) {
            await this.blogAnalyticsService.incrementViewCount(blog._id.toString(), true);
        }
        return blog;
    }
    async update(id, updateBlogDto) {
        if (updateBlogDto.title) {
            updateBlogDto.slug = await this.generateUniqueSlug(updateBlogDto.title);
        }
        const blog = await this.blogModel
            .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, updateBlogDto, { new: true })
            .exec();
        if (!blog) {
            throw new common_1.NotFoundException("Blog not found");
        }
        return blog;
    }
    async publish(id) {
        const blog = await this.blogModel
            .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, {
            status: enums_1.BlogStatus.PUBLISHED,
            publishedAt: new Date(),
        }, { new: true })
            .exec();
        if (!blog) {
            throw new common_1.NotFoundException("Blog not found");
        }
        return blog;
    }
    async unpublish(id) {
        const blog = await this.blogModel
            .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, {
            status: enums_1.BlogStatus.DRAFT,
            $unset: { publishedAt: 1 },
        }, { new: true })
            .exec();
        if (!blog) {
            throw new common_1.NotFoundException("Blog not found");
        }
        return blog;
    }
    async softDelete(id, deletedBy) {
        const result = await this.blogModel.updateOne({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, { isDeleted: true, deletedAt: new Date(), deletedBy });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException("Blog not found");
        }
    }
    async hardDelete(id) {
        const result = await this.blogModel.deleteOne({
            $or: [{ _id: id }, { slug: id }],
        });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException("Blog not found");
        }
    }
    async restore(id) {
        const blog = await this.blogModel
            .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: true }, { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } }, { new: true })
            .exec();
        if (!blog) {
            throw new common_1.NotFoundException("Blog not found or not deleted");
        }
        return blog;
    }
    async clapBlog(blogId, userId, clapDto) {
        var _a;
        const blog = await this.findOne(blogId);
        if (!blog.settings.allowClaps) {
            throw new common_1.BadRequestException("Claps are not allowed for this blog");
        }
        const existingClap = await this.blogClapModel.findOne({ blogId, userId });
        if (existingClap) {
            const newCount = Math.min(existingClap.count + (clapDto.count || 1), 50);
            existingClap.count = newCount;
            await existingClap.save();
        }
        else {
            await new this.blogClapModel({
                blogId,
                userId,
                count: clapDto.count || 1,
            }).save();
        }
        const totalClaps = await this.blogClapModel.aggregate([
            { $match: { blogId: blog._id } },
            { $group: { _id: null, total: { $sum: "$count" } } },
        ]);
        const clapCount = ((_a = totalClaps[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        await this.blogAnalyticsService.updateClapCount(blogId, clapCount);
        return { totalClaps: clapCount };
    }
    async addComment(blogId, userId, commentDto) {
        const blog = await this.findOne(blogId);
        if (!blog.settings.allowComments) {
            throw new common_1.BadRequestException("Comments are not allowed for this blog");
        }
        const comment = new this.blogCommentModel(Object.assign({ blogId, authorId: userId }, commentDto));
        await comment.save();
        const commentCount = await this.blogCommentModel.countDocuments({ blogId, isDeleted: false });
        await this.blogAnalyticsService.updateCommentCount(blogId, commentCount);
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
    async bookmarkBlog(blogId, userId, bookmarkDto) {
        await this.findOne(blogId);
        const existingBookmark = await this.blogBookmarkModel.findOne({ blogId, userId });
        if (existingBookmark) {
            Object.assign(existingBookmark, bookmarkDto);
            await existingBookmark.save();
            return existingBookmark;
        }
        else {
            const bookmark = new this.blogBookmarkModel(Object.assign({ blogId,
                userId }, bookmarkDto));
            await bookmark.save();
            const bookmarkCount = await this.blogBookmarkModel.countDocuments({ blogId });
            await this.blogAnalyticsService.updateBookmarkCount(blogId, bookmarkCount);
            return bookmark;
        }
    }
    async removeBookmark(blogId, userId) {
        const result = await this.blogBookmarkModel.deleteOne({ blogId, userId });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException("Bookmark not found");
        }
        const bookmarkCount = await this.blogBookmarkModel.countDocuments({ blogId });
        await this.blogAnalyticsService.updateBookmarkCount(blogId, bookmarkCount);
    }
    async getUserBookmarks(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [bookmarks, total] = await Promise.all([
            this.blogBookmarkModel
                .find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({
                path: "blogId",
                select: "title slug excerpt featuredImage publishedAt authorId analytics.estimatedReadTime",
                populate: {
                    path: "authorId",
                    select: "name avatar",
                },
            })
                .exec(),
            this.blogBookmarkModel.countDocuments({ userId }),
        ]);
        return {
            bookmarks,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async generateUniqueSlug(title) {
        const baseSlug = (0, slugify_1.default)(title, { lower: true });
        let slug = baseSlug;
        let counter = 1;
        while (await this.blogModel.findOne({ slug, isDeleted: false })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        return slug;
    }
    async getRelatedBlogs(blogId, limit = 5) {
        const blog = await this.findOne(blogId);
        return this.blogModel
            .find({
            _id: { $ne: blogId },
            status: enums_1.BlogStatus.PUBLISHED,
            isDeleted: false,
            $or: [{ tags: { $in: blog.tags || [] } }, { category: blog.category }, { authorId: blog.authorId }],
        })
            .sort({ "analytics.viewCount": -1 })
            .limit(limit)
            .populate("authorId", "name avatar")
            .exec();
    }
};
BlogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(blog_schema_1.Blog.name)),
    __param(1, (0, mongoose_2.InjectModel)(blog_clap_schema_1.BlogClap.name)),
    __param(2, (0, mongoose_2.InjectModel)(blog_comment_schema_1.BlogComment.name)),
    __param(3, (0, mongoose_2.InjectModel)(blog_bookmark_schema_1.BlogBookmark.name)),
    __param(4, (0, mongoose_2.InjectModel)(series_schema_1.Series.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        content_processor_service_1.ContentProcessorService,
        blog_analytics_service_1.BlogAnalyticsService])
], BlogsService);
exports.BlogsService = BlogsService;
//# sourceMappingURL=blogs.service.js.map