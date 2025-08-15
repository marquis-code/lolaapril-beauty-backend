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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogSchema = exports.Blog = exports.PublicationSettings = exports.BlogAnalytics = exports.BlogMetadata = exports.ContentBlock = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enums_1 = require("../../common/enums");
const base_schema_1 = require("../../common/schemas/base.schema");
let ContentBlock = class ContentBlock {
};
__decorate([
    (0, mongoose_1.Prop)({ enum: enums_1.ContentBlockType, required: true }),
    __metadata("design:type", String)
], ContentBlock.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ContentBlock.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ContentBlock.prototype, "order", void 0);
ContentBlock = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ContentBlock);
exports.ContentBlock = ContentBlock;
let BlogMetadata = class BlogMetadata {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogMetadata.prototype, "metaTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogMetadata.prototype, "metaDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogMetadata.prototype, "canonicalUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogMetadata.prototype, "ogTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogMetadata.prototype, "ogDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogMetadata.prototype, "ogImage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogMetadata.prototype, "twitterTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogMetadata.prototype, "twitterDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogMetadata.prototype, "twitterImage", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], BlogMetadata.prototype, "keywords", void 0);
BlogMetadata = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BlogMetadata);
exports.BlogMetadata = BlogMetadata;
let BlogAnalytics = class BlogAnalytics {
};
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BlogAnalytics.prototype, "viewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BlogAnalytics.prototype, "uniqueViewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BlogAnalytics.prototype, "readCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BlogAnalytics.prototype, "clapCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BlogAnalytics.prototype, "shareCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BlogAnalytics.prototype, "bookmarkCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BlogAnalytics.prototype, "commentCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BlogAnalytics.prototype, "wordCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BlogAnalytics.prototype, "averageReadTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BlogAnalytics.prototype, "estimatedReadTime", void 0);
BlogAnalytics = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BlogAnalytics);
exports.BlogAnalytics = BlogAnalytics;
let PublicationSettings = class PublicationSettings {
};
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], PublicationSettings.prototype, "allowComments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], PublicationSettings.prototype, "allowClaps", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], PublicationSettings.prototype, "isPremium", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], PublicationSettings.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], PublicationSettings.prototype, "isEditorsPick", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], PublicationSettings.prototype, "scheduledPublishAt", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], PublicationSettings.prototype, "distributionChannels", void 0);
PublicationSettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PublicationSettings);
exports.PublicationSettings = PublicationSettings;
let Blog = class Blog extends base_schema_1.BaseSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Blog.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Blog.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "subtitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Blog.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)([ContentBlock]),
    __metadata("design:type", Array)
], Blog.prototype, "contentBlocks", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "excerpt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "featuredImage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "featuredImageAlt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "featuredImageCaption", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Blog.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Category" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Blog.prototype, "categoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Series" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Blog.prototype, "seriesId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Blog.prototype, "seriesOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: enums_1.BlogStatus, default: enums_1.BlogStatus.DRAFT }),
    __metadata("design:type", String)
], Blog.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Blog.prototype, "authorId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "authorName", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Types.ObjectId, ref: "User" }]),
    __metadata("design:type", Array)
], Blog.prototype, "coAuthors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Publication" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Blog.prototype, "publicationId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Blog.prototype, "publishedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Blog.prototype, "lastModifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BlogAnalytics, default: () => ({}) }),
    __metadata("design:type", BlogAnalytics)
], Blog.prototype, "analytics", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BlogMetadata, default: () => ({}) }),
    __metadata("design:type", BlogMetadata)
], Blog.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PublicationSettings, default: () => ({}) }),
    __metadata("design:type", PublicationSettings)
], Blog.prototype, "settings", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Blog.prototype, "relatedPosts", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Blog.prototype, "tableOfContents", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Blog.prototype, "version", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            version: Number,
            content: String,
            modifiedAt: Date,
            modifiedBy: { type: mongoose_2.Types.ObjectId, ref: "User" },
        },
    ]),
    __metadata("design:type", Array)
], Blog.prototype, "revisionHistory", void 0);
Blog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Blog);
exports.Blog = Blog;
exports.BlogSchema = mongoose_1.SchemaFactory.createForClass(Blog);
exports.BlogSchema.index({ slug: 1 });
exports.BlogSchema.index({ authorId: 1, status: 1 });
exports.BlogSchema.index({ status: 1, publishedAt: -1 });
exports.BlogSchema.index({ tags: 1 });
exports.BlogSchema.index({ category: 1 });
exports.BlogSchema.index({ "analytics.viewCount": -1 });
exports.BlogSchema.index({ "analytics.clapCount": -1 });
exports.BlogSchema.index({ createdAt: -1 });
exports.BlogSchema.index({ publishedAt: -1 });
//# sourceMappingURL=blog.schema.js.map