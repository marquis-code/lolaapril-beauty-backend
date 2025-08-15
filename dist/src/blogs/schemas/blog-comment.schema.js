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
exports.BlogCommentSchema = exports.BlogComment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_schema_1 = require("../../common/schemas/base.schema");
let BlogComment = class BlogComment extends base_schema_1.BaseSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: "Blog" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BlogComment.prototype, "blogId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BlogComment.prototype, "authorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BlogComment.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "BlogComment" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BlogComment.prototype, "parentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], BlogComment.prototype, "isEdited", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], BlogComment.prototype, "editedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], BlogComment.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], BlogComment.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BlogComment.prototype, "likeCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BlogComment.prototype, "replyCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], BlogComment.prototype, "isPinned", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], BlogComment.prototype, "isHighlighted", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            start: { type: Number, required: true },
            end: { type: Number, required: true },
            text: { type: String }
        }
    }),
    __metadata("design:type", Object)
], BlogComment.prototype, "highlightedRange", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            userId: { type: mongoose_2.Types.ObjectId, ref: "User", required: true },
            type: { type: String, enum: ['like', 'dislike', 'love', 'laugh', 'angry'], required: true },
            createdAt: { type: Date, default: Date.now }
        }]),
    __metadata("design:type", Array)
], BlogComment.prototype, "reactions", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], BlogComment.prototype, "mentions", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogComment.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogComment.prototype, "userAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], BlogComment.prototype, "isSpam", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], BlogComment.prototype, "isApproved", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], BlogComment.prototype, "moderatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BlogComment.prototype, "moderatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BlogComment.prototype, "moderationReason", void 0);
BlogComment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BlogComment);
exports.BlogComment = BlogComment;
exports.BlogCommentSchema = mongoose_1.SchemaFactory.createForClass(BlogComment);
exports.BlogCommentSchema.index({ blogId: 1, createdAt: -1 });
exports.BlogCommentSchema.index({ authorId: 1 });
exports.BlogCommentSchema.index({ parentId: 1 });
exports.BlogCommentSchema.index({ isDeleted: 1, isApproved: 1 });
//# sourceMappingURL=blog-comment.schema.js.map