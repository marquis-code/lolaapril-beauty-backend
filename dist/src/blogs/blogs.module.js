"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const blogs_service_1 = require("./blogs.service");
const blogs_controller_1 = require("./blogs.controller");
const blog_schema_1 = require("./schemas/blog.schema");
const blog_clap_schema_1 = require("./schemas/blog-clap.schema");
const blog_comment_schema_1 = require("./schemas/blog-comment.schema");
const blog_bookmark_schema_1 = require("./schemas/blog-bookmark.schema");
const series_schema_1 = require("./schemas/series.schema");
const content_processor_service_1 = require("./services/content-processor.service");
const blog_analytics_service_1 = require("./services/blog-analytics.service");
let BlogsModule = class BlogsModule {
};
BlogsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: blog_schema_1.Blog.name, schema: blog_schema_1.BlogSchema },
                { name: blog_clap_schema_1.BlogClap.name, schema: blog_clap_schema_1.BlogClapSchema },
                { name: blog_comment_schema_1.BlogComment.name, schema: blog_comment_schema_1.BlogCommentSchema },
                { name: blog_bookmark_schema_1.BlogBookmark.name, schema: blog_bookmark_schema_1.BlogBookmarkSchema },
                { name: series_schema_1.Series.name, schema: series_schema_1.SeriesSchema },
            ]),
        ],
        providers: [blogs_service_1.BlogsService, content_processor_service_1.ContentProcessorService, blog_analytics_service_1.BlogAnalyticsService],
        controllers: [blogs_controller_1.BlogsController],
    })
], BlogsModule);
exports.BlogsModule = BlogsModule;
//# sourceMappingURL=blogs.module.js.map