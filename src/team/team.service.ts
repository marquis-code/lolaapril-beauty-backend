import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import type { Model } from "mongoose"
import type { TeamMember, TeamMemberDocument } from "./schemas/team-member.schema"
import type { CreateTeamMemberDto } from "./dto/create-team-member.dto"
import type { UpdateTeamMemberDto } from "./dto/update-team-member.dto"
import type { TeamMemberQueryDto } from "./dto/team-member-query.dto"

@Injectable()
export class TeamService {
  private teamMemberModel: Model<TeamMemberDocument>

  constructor(teamMemberModel: Model<TeamMemberDocument>) {
    this.teamMemberModel = teamMemberModel
  }

  async create(createTeamMemberDto: CreateTeamMemberDto): Promise<TeamMember> {
    // Check if email already exists
    const existingMember = await this.teamMemberModel.findOne({
      email: createTeamMemberDto.email,
    })
    if (existingMember) {
      throw new ConflictException("Team member with this email already exists")
    }

    const teamMember = new this.teamMemberModel(createTeamMemberDto)
    return teamMember.save()
  }

  async findAll(query: TeamMemberQueryDto) {
    const { page = 1, limit = 10, search, role, status, department, sortBy = "createdAt", sortOrder = "desc" } = query

    const filter: any = {}

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ]
    }

    if (role) filter.role = role
    if (status) filter.status = status
    if (department) filter.department = department

    const skip = (page - 1) * limit
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

    const [teamMembers, total] = await Promise.all([
      this.teamMemberModel.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
      this.teamMemberModel.countDocuments(filter),
    ])

    return {
      teamMembers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string): Promise<TeamMember> {
    const teamMember = await this.teamMemberModel.findById(id)
    if (!teamMember) {
      throw new NotFoundException("Team member not found")
    }
    return teamMember
  }

  async update(id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<TeamMember> {
    // Check if email is being updated and already exists
    if (updateTeamMemberDto.email) {
      const existingMember = await this.teamMemberModel.findOne({
        email: updateTeamMemberDto.email,
        _id: { $ne: id },
      })
      if (existingMember) {
        throw new ConflictException("Team member with this email already exists")
      }
    }

    const teamMember = await this.teamMemberModel.findByIdAndUpdate(id, updateTeamMemberDto, { new: true })
    if (!teamMember) {
      throw new NotFoundException("Team member not found")
    }
    return teamMember
  }

  async remove(id: string): Promise<void> {
    const result = await this.teamMemberModel.findByIdAndDelete(id)
    if (!result) {
      throw new NotFoundException("Team member not found")
    }
  }

  async findByRole(role: string): Promise<TeamMember[]> {
    return this.teamMemberModel.find({ role, status: "active" }).exec()
  }

  async findByDepartment(department: string): Promise<TeamMember[]> {
    return this.teamMemberModel.find({ department, status: "active" }).exec()
  }

  async updateStatus(id: string, status: string): Promise<TeamMember> {
    const teamMember = await this.teamMemberModel.findByIdAndUpdate(id, { status }, { new: true })
    if (!teamMember) {
      throw new NotFoundException("Team member not found")
    }
    return teamMember
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
    ])

    const roleStats = await this.teamMemberModel.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ])

    const departmentStats = await this.teamMemberModel.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
    ])

    return {
      overview: stats[0] || { total: 0, active: 0, inactive: 0 },
      byRole: roleStats,
      byDepartment: departmentStats,
    }
  }
}
