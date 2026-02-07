import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { Model, Types } from "mongoose"
import { TeamMember, TeamMemberDocument } from "./schemas/team-member.schema"
import { Service, ServiceDocument } from "../service/schemas/service.schema"
import { CreateTeamMemberDto } from "./dto/create-team-member.dto"
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto"
import { TeamMemberQueryDto } from "./dto/team-member-query.dto"
import { ApiResponse } from "../common/interfaces/common.interface"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(TeamMember.name) private teamMemberModel: Model<TeamMemberDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  // Utility method to validate ObjectId
  private validateObjectId(id: string, entityName: string = "Entity"): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`${entityName} not found`)
    }
  }

  // Validate service references in skills and commissions
  private async validateServiceReferences(createTeamMemberDto: CreateTeamMemberDto): Promise<void> {
    const serviceIds: Set<string> = new Set()

    // Collect service IDs from skills
    if (createTeamMemberDto.skills?.services) {
      createTeamMemberDto.skills.services.forEach(serviceId => {
        const id = serviceId.toString()
        this.validateObjectId(id, "Service")
        serviceIds.add(id)
      })
    }

    // Collect service IDs from commissions
    if (createTeamMemberDto.commissions) {
      createTeamMemberDto.commissions.forEach(commission => {
        const id = commission.serviceId.toString()
        this.validateObjectId(id, "Service")
        serviceIds.add(id)
      })
    }

    // Validate all service IDs exist
    if (serviceIds.size > 0) {
      const serviceObjectIds = Array.from(serviceIds).map(id => new Types.ObjectId(id))
      
      const query = this.serviceModel.find({
        _id: { $in: serviceObjectIds },
        isActive: true
      })
      query.select('_id basicDetails.serviceName')
      query.lean()
      
      const existingServices = await query.exec() as any[]

      const existingServiceIds = new Set<string>()
      existingServices.forEach((service: any) => {
        existingServiceIds.add(service._id.toString())
      })
      
      const missingServices = Array.from(serviceIds).filter(id => !existingServiceIds.has(id))

      if (missingServices.length > 0) {
        throw new NotFoundException(`Services not found: ${missingServices.join(', ')}`)
      }

      // Update commission service names based on actual service data
      if (createTeamMemberDto.commissions) {
        createTeamMemberDto.commissions.forEach(commission => {
          const service = existingServices.find((s: any) => s._id.toString() === commission.serviceId.toString())
          if (service) {
            commission.serviceName = service.basicDetails.serviceName
          }
        })
      }
    }
  }

  async create(businessId: string, createTeamMemberDto: CreateTeamMemberDto): Promise<ApiResponse<TeamMember>> {
    try {
      // Check if email already exists
      const existingMember = await this.teamMemberModel.findOne({
        email: createTeamMemberDto.email,
        businessId: new Types.ObjectId(businessId),
      })
      if (existingMember) {
        throw new ConflictException("Team member with this email already exists")
      }

      // Validate service references
      await this.validateServiceReferences(createTeamMemberDto)

      const teamMember = new this.teamMemberModel({ ...createTeamMemberDto, businessId: new Types.ObjectId(businessId) })
      const savedTeamMember = await teamMember.save()

      return {
        success: true,
        data: savedTeamMember,
        message: "Team member created successfully",
      }
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to create team member: ${error.message}`)
    }
  }

  async findAll(businessId: string, query: TeamMemberQueryDto): Promise<ApiResponse<TeamMember[]>> {
    try {
      const { page = 1, limit = 10, search, role, status, department, sortBy = "createdAt", sortOrder = "desc" } = query

      const filter: any = { businessId: new Types.ObjectId(businessId) }

      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { "phone.number": { $regex: search, $options: "i" } },
        ]
      }

      if (role) filter.role = role
      if (status) filter.isActive = status === 'active'
      if (department) filter.department = department

      const skip = (page - 1) * limit
      const sortOptions: any = {}
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

      // Separate query construction
      const teamMembersQuery = this.teamMemberModel.find(filter)
      teamMembersQuery.populate('skills.services', 'basicDetails.serviceName')
      teamMembersQuery.populate('commissions.serviceId', 'basicDetails.serviceName')
      teamMembersQuery.sort(sortOptions)
      teamMembersQuery.skip(skip)
      teamMembersQuery.limit(limit)

      const teamMembers = await teamMembersQuery.exec()
      const total = await this.teamMemberModel.countDocuments(filter)

      return {
        success: true,
        data: teamMembers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      throw new Error(`Failed to fetch team members: ${error.message}`)
    }
  }

  async findOne(businessId: string, id: string): Promise<ApiResponse<TeamMember>> {
    try {
      this.validateObjectId(id, "Team member")


      const teamMember = await this.teamMemberModel
        .findOne({ _id: new Types.ObjectId(id), businessId: new Types.ObjectId(businessId) })
        .populate('skills.services', 'basicDetails.serviceName pricingAndDuration')
        .populate('commissions.serviceId', 'basicDetails.serviceName pricingAndDuration')

      if (!teamMember) {
        throw new NotFoundException("Team member not found")
      }

      return {
        success: true,
        data: teamMember,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to fetch team member: ${error.message}`)
    }
  }

  async update(businessId: string, id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<ApiResponse<TeamMember>> {
    try {
      this.validateObjectId(id, "Team member")

      // Check if email is being updated and already exists
      if (updateTeamMemberDto.email) {
        const existingMember = await this.teamMemberModel.findOne({
          email: updateTeamMemberDto.email,
          _id: { $ne: new Types.ObjectId(id) },
          businessId: new Types.ObjectId(businessId),
        })
        if (existingMember) {
          throw new ConflictException("Team member with this email already exists")
        }
      }

      // Validate service references if they're being updated
      if (updateTeamMemberDto.skills?.services || updateTeamMemberDto.commissions) {
        await this.validateServiceReferences(updateTeamMemberDto as CreateTeamMemberDto)
      }


      const teamMember = await this.teamMemberModel
        .findOneAndUpdate(
          { _id: new Types.ObjectId(id), businessId: new Types.ObjectId(businessId) },
          { ...updateTeamMemberDto, updatedAt: new Date() },
          { new: true, runValidators: true }
        )
        .populate('skills.services', 'basicDetails.serviceName')
        .populate('commissions.serviceId', 'basicDetails.serviceName')

      if (!teamMember) {
        throw new NotFoundException("Team member not found")
      }

      return {
        success: true,
        data: teamMember,
        message: "Team member updated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error
      }
      throw new Error(`Failed to update team member: ${error.message}`)
    }
  }

  async remove(businessId: string, id: string): Promise<ApiResponse<null>> {
    try {
      this.validateObjectId(id, "Team member")

      const result = await this.teamMemberModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id), businessId: new Types.ObjectId(businessId) },
        { isActive: false, updatedAt: new Date() },
        { new: true }
      )

      if (!result) {
        throw new NotFoundException("Team member not found")
      }

      return {
        success: true,
        message: "Team member deactivated successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to deactivate team member: ${error.message}`)
    }
  }

  async findByRole(businessId: string, role: string): Promise<ApiResponse<TeamMember[]>> {
    try {
      const teamMembers = await this.teamMemberModel
        .find({ businessId: new Types.ObjectId(businessId), role, isActive: true })
        .populate('skills.services', 'basicDetails.serviceName')
        .exec()

      return {
        success: true,
        data: teamMembers,
      }
    } catch (error) {
      throw new Error(`Failed to fetch team members by role: ${error.message}`)
    }
  }

  async findByDepartment(businessId: string, department: string): Promise<ApiResponse<TeamMember[]>> {
    try {
      const teamMembers = await this.teamMemberModel
        .find({ businessId: new Types.ObjectId(businessId), department, isActive: true })
        .populate('skills.services', 'basicDetails.serviceName')
        .exec()

      return {
        success: true,
        data: teamMembers,
      }
    } catch (error) {
      throw new Error(`Failed to fetch team members by department: ${error.message}`)
    }
  }

  async updateStatus(businessId: string, id: string, status: string): Promise<ApiResponse<TeamMember>> {
    try {
      this.validateObjectId(id, "Team member")

      const teamMember = await this.teamMemberModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id), businessId: new Types.ObjectId(businessId) },
        { isActive: status, updatedAt: new Date() },
        { new: true }
      )

      if (!teamMember) {
        throw new NotFoundException("Team member not found")
      }

      return {
        success: true,
        data: teamMember,
        message: `Team member ${status ? 'activated' : 'deactivated'} successfully`,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(`Failed to update team member status: ${error.message}`)
    }
  }

  async addCommission(businessId: string, teamMemberId: string, serviceId: string, commissionData: { commissionType: string; commissionValue: number }): Promise<ApiResponse<TeamMember>> {
    try {

      this.validateObjectId(teamMemberId, "Team member")
      this.validateObjectId(serviceId, "Service")

      // Verify service exists
      const service = await this.serviceModel.findById(new Types.ObjectId(serviceId))
      if (!service) {
        throw new NotFoundException("Service not found")
      }

      // Check if commission already exists for this service
      const teamMember = await this.teamMemberModel.findOne({ _id: new Types.ObjectId(teamMemberId), businessId: new Types.ObjectId(businessId) })
      if (!teamMember) {
        throw new NotFoundException("Team member not found")
      }

      const existingCommission = teamMember.commissions.find(
        comm => comm.serviceId.toString() === serviceId
      )

      if (existingCommission) {
        throw new ConflictException("Commission for this service already exists")
      }

      // Add new commission
      const newCommission = {
        serviceId: new Types.ObjectId(serviceId),
        serviceName: service.basicDetails.serviceName,
        commissionType: commissionData.commissionType,
        commissionValue: commissionData.commissionValue,
      }

      teamMember.commissions.push(newCommission as any)
      teamMember.updatedAt = new Date()
      const updatedTeamMember = await teamMember.save()

      return {
        success: true,
        data: updatedTeamMember,
        message: "Commission added successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error
      }
      throw new Error(`Failed to add commission: ${error.message}`)
    }
  }

  async getTeamStats(businessId: string): Promise<ApiResponse<any>> {
    try {

      const stats = await this.teamMemberModel.aggregate([
        { $match: { businessId: new Types.ObjectId(businessId) } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
            inactive: { $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] } },
          },
        },
      ])


      const roleStats = await this.teamMemberModel.aggregate([
        { $match: { businessId: new Types.ObjectId(businessId), isActive: true } },
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])


      const employmentStats = await this.teamMemberModel.aggregate([
        { $match: { businessId: new Types.ObjectId(businessId), isActive: true } },
        {
          $group: {
            _id: "$employmentType",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])

      // Get service skills statistics

      const skillsStats = await this.teamMemberModel.aggregate([
        { $match: { businessId: new Types.ObjectId(businessId), isActive: true, "skills.services": { $exists: true, $ne: [] } } },
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
      ])

      return {
        success: true,
        data: {
          overview: stats[0] || { total: 0, active: 0, inactive: 0 },
          byRole: roleStats,
          byEmploymentType: employmentStats,
          topSkills: skillsStats,
        },
      }
    } catch (error) {
      throw new Error(`Failed to get team stats: ${error.message}`)
    }
  }
}