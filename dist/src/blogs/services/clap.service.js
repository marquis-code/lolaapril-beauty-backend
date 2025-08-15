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
exports.ClapService = void 0;
const common_1 = require("@nestjs/common");
let ClapService = class ClapService {
    constructor(blogClapModel) {
        this.blogClapModel = blogClapModel;
    }
    async clapBlog(blogId, userId, clapDto) {
        var _a;
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
            { $match: { blogId } },
            { $group: { _id: null, total: { $sum: "$count" } } },
        ]);
        return { totalClaps: ((_a = totalClaps[0]) === null || _a === void 0 ? void 0 : _a.total) || 0 };
    }
    async getTotalClaps(blogId) {
        var _a;
        const result = await this.blogClapModel.aggregate([
            { $match: { blogId } },
            { $group: { _id: null, total: { $sum: "$count" } } },
        ]);
        return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    }
    async getUserClaps(blogId, userId) {
        const clap = await this.blogClapModel.findOne({ blogId, userId });
        return (clap === null || clap === void 0 ? void 0 : clap.count) || 0;
    }
};
ClapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], ClapService);
exports.ClapService = ClapService;
//# sourceMappingURL=clap.service.js.map