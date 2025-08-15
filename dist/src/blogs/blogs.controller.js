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
exports.BlogsController = void 0;
const common_1 = require("@nestjs/common");
const blogs_service_1 = require("./blogs.service");
const create_blog_dto_1 = require("./dto/create-blog.dto");
const update_blog_dto_1 = require("./dto/update-blog.dto");
const clap_blog_dto_1 = require("./dto/clap-blog.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const bookmark_blog_dto_1 = require("./dto/bookmark-blog.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const audit_decorator_1 = require("../common/decorators/audit.decorator");
const user_decorator_1 = require("../common/decorators/user.decorator");
const blog_analytics_service_1 = require("./services/blog-analytics.service");
const enums_1 = require("../common/enums");
const enums_2 = require("../common/enums");
const enums_3 = require("../common/enums");
let BlogsController = class BlogsController {
    constructor(blogsService, blogAnalyticsService) {
        this.blogsService = blogsService;
        this.blogAnalyticsService = blogAnalyticsService;
    }
    create(createBlogDto, user) {
        return this.blogsService.create(createBlogDto, user.id);
    }
    findAll(status, page, limit, sortBy, sortOrder, tags, category, authorId) {
        const tagsArray = tags ? tags.split(",") : undefined;
        return this.blogsService.findAll(status, page, limit, sortBy, sortOrder, tagsArray, category, authorId);
    }
    findPublished(page, limit, featured) {
        return this.blogsService.findPublished(page, limit, featured);
    }
    getPopularBlogs(limit) {
        return this.blogAnalyticsService.getPopularBlogs(limit);
    }
    getTrendingBlogs(days, limit) {
        return this.blogAnalyticsService.getTrendingBlogs(days, limit);
    }
    findOne(id, user) {
        return this.blogsService.findOne(id, user === null || user === void 0 ? void 0 : user.id);
    }
    getRelatedBlogs(id, limit) {
        return this.blogsService.getRelatedBlogs(id, limit);
    }
    update(id, updateBlogDto) {
        return this.blogsService.update(id, updateBlogDto);
    }
    publish(id) {
        return this.blogsService.publish(id);
    }
    unpublish(id) {
        return this.blogsService.unpublish(id);
    }
    clapBlog(id, user, clapDto) {
        return this.blogsService.clapBlog(id, user.id, clapDto);
    }
    addComment(id, user, commentDto) {
        return this.blogsService.addComment(id, user.id, commentDto);
    }
    getComments(id, page, limit) {
        return this.blogsService.getComments(id, page, limit);
    }
    bookmarkBlog(id, user, bookmarkDto) {
        return this.blogsService.bookmarkBlog(id, user.id, bookmarkDto);
    }
    removeBookmark(id, user) {
        return this.blogsService.removeBookmark(id, user.id);
    }
    getUserBookmarks(user, page, limit) {
        return this.blogsService.getUserBookmarks(user.id, page, limit);
    }
    incrementShareCount(id) {
        return this.blogAnalyticsService.incrementShareCount(id);
    }
    markAsRead(id) {
        return this.blogAnalyticsService.incrementReadCount(id);
    }
    softDelete(id, user) {
        return this.blogsService.softDelete(id, user.id);
    }
    hardDelete(id) {
        return this.blogsService.hardDelete(id);
    }
    restore(id) {
        return this.blogsService.restore(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.EDITOR),
    (0, audit_decorator_1.Audit)(enums_2.AuditAction.CREATE, "blog"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_dto_1.CreateBlogDto, Object]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('sortBy', new common_1.DefaultValuePipe('createdAt'))),
    __param(4, (0, common_1.Query)('sortOrder', new common_1.DefaultValuePipe('desc'))),
    __param(5, (0, common_1.Query)('tags')),
    __param(6, (0, common_1.Query)('category')),
    __param(7, (0, common_1.Query)('authorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("published"),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('featured')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Boolean]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "findPublished", null);
__decorate([
    (0, common_1.Get)("popular"),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "getPopularBlogs", null);
__decorate([
    (0, common_1.Get)("trending"),
    __param(0, (0, common_1.Query)('days', new common_1.DefaultValuePipe(7), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "getTrendingBlogs", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/related"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(5), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "getRelatedBlogs", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.EDITOR),
    (0, audit_decorator_1.Audit)(enums_2.AuditAction.UPDATE, "blog"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blog_dto_1.UpdateBlogDto]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_2.AuditAction.UPDATE, 'blog'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "publish", null);
__decorate([
    (0, common_1.Patch)(':id/unpublish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_2.AuditAction.UPDATE, 'blog'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "unpublish", null);
__decorate([
    (0, common_1.Post)(":id/clap"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, clap_blog_dto_1.ClapBlogDto]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "clapBlog", null);
__decorate([
    (0, common_1.Post)(":id/comments"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)(":id/comments"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)(":id/bookmark"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, bookmark_blog_dto_1.BookmarkBlogDto]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "bookmarkBlog", null);
__decorate([
    (0, common_1.Delete)(":id/bookmark"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "removeBookmark", null);
__decorate([
    (0, common_1.Get)("user/bookmarks"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "getUserBookmarks", null);
__decorate([
    (0, common_1.Post)(':id/share'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "incrementShareCount", null);
__decorate([
    (0, common_1.Post)(':id/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Delete)(":id/soft"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_2.AuditAction.SOFT_DELETE, "blog"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Delete)(':id/hard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN),
    (0, audit_decorator_1.Audit)(enums_2.AuditAction.DELETE, 'blog'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "hardDelete", null);
__decorate([
    (0, common_1.Patch)(':id/restore'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN),
    (0, audit_decorator_1.Audit)(enums_2.AuditAction.RESTORE, 'blog'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "restore", null);
BlogsController = __decorate([
    (0, common_1.Controller)("blogs"),
    __metadata("design:paramtypes", [blogs_service_1.BlogsService,
        blog_analytics_service_1.BlogAnalyticsService])
], BlogsController);
exports.BlogsController = BlogsController;
//# sourceMappingURL=blogs.controller.js.map