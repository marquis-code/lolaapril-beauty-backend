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
exports.BlogAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const blog_schema_1 = require("../schemas/blog.schema");
const mongoose_2 = require("@nestjs/mongoose");
let BlogAnalyticsService = class BlogAnalyticsService {
    constructor(blogModel) {
        this.blogModel = blogModel;
    }
    async incrementViewCount(blogId, isUnique = false) {
        const updateQuery = { $inc: { "analytics.viewCount": 1 } };
        if (isUnique) {
            updateQuery.$inc["analytics.uniqueViewCount"] = 1;
        }
        await this.blogModel.updateOne({ _id: blogId }, updateQuery);
    }
    async incrementReadCount(blogId) {
        await this.blogModel.updateOne({ _id: blogId }, { $inc: { "analytics.readCount": 1 } });
    }
    async updateClapCount(blogId, totalClaps) {
        await this.blogModel.updateOne({ _id: blogId }, { $set: { "analytics.clapCount": totalClaps } });
    }
    async incrementShareCount(blogId) {
        await this.blogModel.updateOne({ _id: blogId }, { $inc: { "analytics.shareCount": 1 } });
    }
    async updateBookmarkCount(blogId, count) {
        await this.blogModel.updateOne({ _id: blogId }, { $set: { "analytics.bookmarkCount": count } });
    }
    async updateCommentCount(blogId, count) {
        await this.blogModel.updateOne({ _id: blogId }, { $set: { "analytics.commentCount": count } });
    }
    async getPopularBlogs(limit = 10) {
        return this.blogModel
            .find({ status: "published", isDeleted: false })
            .sort({ "analytics.viewCount": -1, "analytics.clapCount": -1 })
            .limit(limit)
            .exec();
    }
    async getTrendingBlogs(days = 7, limit = 10) {
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);
        return this.blogModel
            .find({
            status: "published",
            isDeleted: false,
            publishedAt: { $gte: dateThreshold },
        })
            .sort({ "analytics.viewCount": -1, "analytics.clapCount": -1 })
            .limit(limit)
            .exec();
    }
};
BlogAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(blog_schema_1.Blog.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], BlogAnalyticsService);
exports.BlogAnalyticsService = BlogAnalyticsService;
//# sourceMappingURL=blog-analytics.service.js.map