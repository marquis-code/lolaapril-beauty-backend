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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const team_member_schema_1 = require("./schemas/team-member.schema");
const mongoose_2 = require("@nestjs/mongoose");
const slugify_1 = require("slugify");
let TeamsService = class TeamsService {
    constructor(teamMemberModel) {
        this.teamMemberModel = teamMemberModel;
    }
    async create(createTeamMemberDto) {
        const slug = (0, slugify_1.default)(`${createTeamMemberDto.name}`, { lower: true });
        const teamMember = new this.teamMemberModel(Object.assign(Object.assign({}, createTeamMemberDto), { id: slug }));
        return teamMember.save();
    }
    async findAll() {
        return this.teamMemberModel.find({ isDeleted: false }).sort({ position: 1 }).exec();
    }
    async findOne(id) {
        const teamMember = await this.teamMemberModel
            .findOne({
            $or: [{ _id: id }, { id: id }],
            isDeleted: false,
        })
            .exec();
        if (!teamMember) {
            throw new common_1.NotFoundException("Team member not found");
        }
        return teamMember;
    }
    async update(id, updateTeamMemberDto) {
        const teamMember = await this.teamMemberModel
            .findOneAndUpdate({ $or: [{ _id: id }, { id: id }], isDeleted: false }, updateTeamMemberDto, { new: true })
            .exec();
        if (!teamMember) {
            throw new common_1.NotFoundException("Team member not found");
        }
        return teamMember;
    }
    async softDelete(id, deletedBy) {
        const result = await this.teamMemberModel.updateOne({ $or: [{ _id: id }, { id: id }], isDeleted: false }, { isDeleted: true, deletedAt: new Date(), deletedBy });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException("Team member not found");
        }
    }
    async hardDelete(id) {
        const result = await this.teamMemberModel.deleteOne({
            $or: [{ _id: id }, { id: id }],
        });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException("Team member not found");
        }
    }
    async restore(id) {
        const teamMember = await this.teamMemberModel
            .findOneAndUpdate({ $or: [{ _id: id }, { id: id }], isDeleted: true }, { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } }, { new: true })
            .exec();
        if (!teamMember) {
            throw new common_1.NotFoundException("Team member not found or not deleted");
        }
        return teamMember;
    }
};
TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(team_member_schema_1.TeamMember.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], TeamsService);
exports.TeamsService = TeamsService;
//# sourceMappingURL=teams.service.js.map