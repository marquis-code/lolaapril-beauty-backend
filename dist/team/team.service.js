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
const service_schema_1 = require("../service/schemas/service.schema");
const mongoose_2 = require("@nestjs/mongoose");
let TeamService = class TeamService {
    constructor(teamMemberModel, serviceModel) {
        this.teamMemberModel = teamMemberModel;
        this.serviceModel = serviceModel;
    }
    validateObjectId(id, entityName = "Entity") {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`${entityName} not found`);
        }
    }
    async validateServiceReferences(createTeamMemberDto) {
        var _a;
        const serviceIds = new Set();
        if ((_a = createTeamMemberDto.skills) === null || _a === void 0 ? void 0 : _a.services) {
            createTeamMemberDto.skills.services.forEach(serviceId => {
                const id = serviceId.toString();
                this.validateObjectId(id, "Service");
                serviceIds.add(id);
            });
        }
        if (createTeamMemberDto.commissions) {
            createTeamMemberDto.commissions.forEach(commission => {
                const id = commission.serviceId.toString();
                this.validateObjectId(id, "Service");
                serviceIds.add(id);
            });
        }
        if (serviceIds.size > 0) {
            const serviceObjectIds = Array.from(serviceIds).map(id => new mongoose_1.Types.ObjectId(id));
            const query = this.serviceModel.find({
                _id: { $in: serviceObjectIds },
                isActive: true
            });
            query.select('_id basicDetails.serviceName');
            query.lean();
            const existingServices = await query.exec();
            const existingServiceIds = new Set();
            existingServices.forEach((service) => {
                existingServiceIds.add(service._id.toString());
            });
            const missingServices = Array.from(serviceIds).filter(id => !existingServiceIds.has(id));
            if (missingServices.length > 0) {
                throw new common_1.NotFoundException(`Services not found: ${missingServices.join(', ')}`);
            }
            if (createTeamMemberDto.commissions) {
                createTeamMemberDto.commissions.forEach(commission => {
                    const service = existingServices.find((s) => s._id.toString() === commission.serviceId.toString());
                    if (service) {
                        commission.serviceName = service.basicDetails.serviceName;
                    }
                });
            }
        }
    }
    async create(createTeamMemberDto) {
        try {
            const existingMember = await this.teamMemberModel.findOne({
                email: createTeamMemberDto.email,
            });
            if (existingMember) {
                throw new common_1.ConflictException("Team member with this email already exists");
            }
            await this.validateServiceReferences(createTeamMemberDto);
            const teamMember = new this.teamMemberModel(createTeamMemberDto);
            const savedTeamMember = await teamMember.save();
            return {
                success: true,
                data: savedTeamMember,
                message: "Team member created successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to create team member: ${error.message}`);
        }
    }
    async findAll(query) {
        try {
            const { page = 1, limit = 10, search, role, status, department, sortBy = "createdAt", sortOrder = "desc" } = query;
            const filter = {};
            if (search) {
                filter.$or = [
                    { firstName: { $regex: search, $options: "i" } },
                    { lastName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { "phone.number": { $regex: search, $options: "i" } },
                ];
            }
            if (role)
                filter.role = role;
            if (status)
                filter.isActive = status === 'active';
            if (department)
                filter.department = department;
            const skip = (page - 1) * limit;
            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
            const teamMembersQuery = this.teamMemberModel.find(filter);
            teamMembersQuery.populate('skills.services', 'basicDetails.serviceName');
            teamMembersQuery.populate('commissions.serviceId', 'basicDetails.serviceName');
            teamMembersQuery.sort(sortOptions);
            teamMembersQuery.skip(skip);
            teamMembersQuery.limit(limit);
            const teamMembers = await teamMembersQuery.exec();
            const total = await this.teamMemberModel.countDocuments(filter);
            return {
                success: true,
                data: teamMembers,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch team members: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            this.validateObjectId(id, "Team member");
            const teamMember = await this.teamMemberModel
                .findById(new mongoose_1.Types.ObjectId(id))
                .populate('skills.services', 'basicDetails.serviceName pricingAndDuration')
                .populate('commissions.serviceId', 'basicDetails.serviceName pricingAndDuration');
            if (!teamMember) {
                throw new common_1.NotFoundException("Team member not found");
            }
            return {
                success: true,
                data: teamMember,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch team member: ${error.message}`);
        }
    }
    async update(id, updateTeamMemberDto) {
        var _a;
        try {
            this.validateObjectId(id, "Team member");
            if (updateTeamMemberDto.email) {
                const existingMember = await this.teamMemberModel.findOne({
                    email: updateTeamMemberDto.email,
                    _id: { $ne: new mongoose_1.Types.ObjectId(id) },
                });
                if (existingMember) {
                    throw new common_1.ConflictException("Team member with this email already exists");
                }
            }
            if (((_a = updateTeamMemberDto.skills) === null || _a === void 0 ? void 0 : _a.services) || updateTeamMemberDto.commissions) {
                await this.validateServiceReferences(updateTeamMemberDto);
            }
            const teamMember = await this.teamMemberModel
                .findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), Object.assign(Object.assign({}, updateTeamMemberDto), { updatedAt: new Date() }), { new: true, runValidators: true })
                .populate('skills.services', 'basicDetails.serviceName')
                .populate('commissions.serviceId', 'basicDetails.serviceName');
            if (!teamMember) {
                throw new common_1.NotFoundException("Team member not found");
            }
            return {
                success: true,
                data: teamMember,
                message: "Team member updated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to update team member: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            this.validateObjectId(id, "Team member");
            const result = await this.teamMemberModel.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { isActive: false, updatedAt: new Date() }, { new: true });
            if (!result) {
                throw new common_1.NotFoundException("Team member not found");
            }
            return {
                success: true,
                message: "Team member deactivated successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to deactivate team member: ${error.message}`);
        }
    }
    async findByRole(role) {
        try {
            const teamMembers = await this.teamMemberModel
                .find({ role, isActive: true })
                .populate('skills.services', 'basicDetails.serviceName')
                .exec();
            return {
                success: true,
                data: teamMembers,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch team members by role: ${error.message}`);
        }
    }
    async findByDepartment(department) {
        try {
            const teamMembers = await this.teamMemberModel
                .find({ department, isActive: true })
                .populate('skills.services', 'basicDetails.serviceName')
                .exec();
            return {
                success: true,
                data: teamMembers,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch team members by department: ${error.message}`);
        }
    }
    async updateStatus(id, status) {
        try {
            this.validateObjectId(id, "Team member");
            const teamMember = await this.teamMemberModel.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { isActive: status, updatedAt: new Date() }, { new: true });
            if (!teamMember) {
                throw new common_1.NotFoundException("Team member not found");
            }
            return {
                success: true,
                data: teamMember,
                message: `Team member ${status ? 'activated' : 'deactivated'} successfully`,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update team member status: ${error.message}`);
        }
    }
    async addCommission(teamMemberId, serviceId, commissionData) {
        try {
            this.validateObjectId(teamMemberId, "Team member");
            this.validateObjectId(serviceId, "Service");
            const service = await this.serviceModel.findById(new mongoose_1.Types.ObjectId(serviceId));
            if (!service) {
                throw new common_1.NotFoundException("Service not found");
            }
            const teamMember = await this.teamMemberModel.findById(new mongoose_1.Types.ObjectId(teamMemberId));
            if (!teamMember) {
                throw new common_1.NotFoundException("Team member not found");
            }
            const existingCommission = teamMember.commissions.find(comm => comm.serviceId.toString() === serviceId);
            if (existingCommission) {
                throw new common_1.ConflictException("Commission for this service already exists");
            }
            const newCommission = {
                serviceId: new mongoose_1.Types.ObjectId(serviceId),
                serviceName: service.basicDetails.serviceName,
                commissionType: commissionData.commissionType,
                commissionValue: commissionData.commissionValue,
            };
            teamMember.commissions.push(newCommission);
            teamMember.updatedAt = new Date();
            const updatedTeamMember = await teamMember.save();
            return {
                success: true,
                data: updatedTeamMember,
                message: "Commission added successfully",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to add commission: ${error.message}`);
        }
    }
    async getTeamStats() {
        try {
            const stats = await this.teamMemberModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
                        inactive: { $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] } },
                    },
                },
            ]);
            const roleStats = await this.teamMemberModel.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: "$role",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
            ]);
            const employmentStats = await this.teamMemberModel.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: "$employmentType",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
            ]);
            const skillsStats = await this.teamMemberModel.aggregate([
                { $match: { isActive: true, "skills.services": { $exists: true, $ne: [] } } },
                { $unwind: "$skills.services" },
                {
                    $lookup: {
                        from: "services",
                        localField: "skills.services",
                        foreignField: "_id",
                        as: "serviceInfo"
                    }
                },
                { $unwind: "$serviceInfo" },
                {
                    $group: {
                        _id: "$serviceInfo.basicDetails.serviceName",
                        serviceId: { $first: "$serviceInfo._id" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);
            return {
                success: true,
                data: {
                    overview: stats[0] || { total: 0, active: 0, inactive: 0 },
                    byRole: roleStats,
                    byEmploymentType: employmentStats,
                    topSkills: skillsStats,
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to get team stats: ${error.message}`);
        }
    }
};
TeamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(team_member_schema_1.TeamMember.name)),
    __param(1, (0, mongoose_2.InjectModel)(service_schema_1.Service.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], TeamService);
exports.TeamService = TeamService;
//# sourceMappingURL=team.service.js.map