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
const blog_schema_1 = require("./schemas/blog.schema");
const enums_1 = require("../common/enums");
const mongoose_2 = require("@nestjs/mongoose");
const slugify_1 = require("slugify");
let BlogsService = class BlogsService {
    constructor(blogModel) {
        this.blogModel = blogModel;
    }
    async create(createBlogDto, authorId) {
        const slug = (0, slugify_1.default)(createBlogDto.title, { lower: true });
        const blog = new this.blogModel(Object.assign(Object.assign({}, createBlogDto), { slug,
            authorId, status: enums_1.BlogStatus.DRAFT }));
        return blog.save();
    }
    async findAll(status) {
        const filter = { isDeleted: false };
        if (status) {
            filter.status = status;
        }
        return this.blogModel.find(filter).sort({ createdAt: -1 }).exec();
    }
    async findPublished() {
        return this.blogModel
            .find({
            status: enums_1.BlogStatus.PUBLISHED,
            isDeleted: false,
        })
            .sort({ publishedAt: -1, createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const blog = await this.blogModel
            .findOne({
            $or: [{ _id: id }, { slug: id }],
            isDeleted: false,
        })
            .exec();
        if (!blog) {
            throw new common_1.NotFoundException("Blog not found");
        }
        return blog;
    }
    async update(id, updateBlogDto) {
        if (updateBlogDto.title) {
            updateBlogDto.slug = (0, slugify_1.default)(updateBlogDto.title, { lower: true });
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
};
BlogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(blog_schema_1.Blog.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], BlogsService);
exports.BlogsService = BlogsService;
//# sourceMappingURL=blogs.service.js.map