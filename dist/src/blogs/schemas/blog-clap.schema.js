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
exports.BlogClapSchema = exports.BlogClap = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_schema_1 = require("../../common/schemas/base.schema");
let BlogClap = class BlogClap extends base_schema_1.BaseSchema {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: "Blog" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BlogClap.prototype, "blogId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BlogClap.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1, min: 1, max: 50 }),
    __metadata("design:type", Number)
], BlogClap.prototype, "count", void 0);
BlogClap = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BlogClap);
exports.BlogClap = BlogClap;
exports.BlogClapSchema = mongoose_1.SchemaFactory.createForClass(BlogClap);
exports.BlogClapSchema.index({ blogId: 1, userId: 1 }, { unique: true });
//# sourceMappingURL=blog-clap.schema.js.map