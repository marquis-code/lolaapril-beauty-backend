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
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const team_member_schema_1 = require("./schemas/team-member.schema");
const mongoose_2 = require("@nestjs/mongoose");
let TeamService = class TeamService {
    constructor(teamMemberModel) {
        this.teamMemberModel = teamMemberModel;
    }
    async create(createTeamMemberDto) {
        const existingMember = await this.teamMemberModel.findOne({
            email: createTeamMemberDto.email,
        });
        if (existingMember) {
            throw new common_1.ConflictException("Team member with this email already exists");
        }
        const teamMember = new this.teamMemberModel(createTeamMemberDto);
        return teamMember.save();
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, role, status, department, sortBy = "createdAt", sortOrder = "desc" } = query;
        const filter = {};
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }
        if (role)
            filter.role = role;
        if (status)
            filter.status = status;
        if (department)
            filter.department = department;
        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
        const [teamMembers, total] = await Promise.all([
            this.teamMemberModel.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
            this.teamMemberModel.countDocuments(filter),
        ]);
        return {
            teamMembers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const teamMember = await this.teamMemberModel.findById(id);
        if (!teamMember) {
            throw new common_1.NotFoundException("Team member not found");
        }
        return teamMember;
    }
    async update(id, updateTeamMemberDto) {
        if (updateTeamMemberDto.email) {
            const existingMember = await this.teamMemberModel.findOne({
                email: updateTeamMemberDto.email,
                _id: { $ne: id },
            });
            if (existingMember) {
                throw new common_1.ConflictException("Team member with this email already exists");
            }
        }
        const teamMember = await this.teamMemberModel.findByIdAndUpdate(id, updateTeamMemberDto, { new: true });
        if (!teamMember) {
            throw new common_1.NotFoundException("Team member not found");
        }
        return teamMember;
    }
    async remove(id) {
        const result = await this.teamMemberModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException("Team member not found");
        }
    }
    async findByRole(role) {
        return this.teamMemberModel.find({ role, status: "active" }).exec();
    }
    async findByDepartment(department) {
        return this.teamMemberModel.find({ department, status: "active" }).exec();
    }
    async updateStatus(id, status) {
        const teamMember = await this.teamMemberModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!teamMember) {
            throw new common_1.NotFoundException("Team member not found");
        }
        return teamMember;
    }
    async getTeamStats() {
        const stats = await this.teamMemberModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
                    inactive: { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
                },
            },
        ]);
        const roleStats = await this.teamMemberModel.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 },
                },
            },
        ]);
        const departmentStats = await this.teamMemberModel.aggregate([
            {
                $group: {
                    _id: "$department",
                    count: { $sum: 1 },
                },
            },
        ]);
        return {
            overview: stats[0] || { total: 0, active: 0, inactive: 0 },
            byRole: roleStats,
            byDepartment: departmentStats,
        };
    }
};
TeamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(team_member_schema_1.TeamMember.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], TeamService);
exports.TeamService = TeamService;
//# sourceMappingURL=team.service.js.map