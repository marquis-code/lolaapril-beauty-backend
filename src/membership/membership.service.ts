import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { Membership, type MembershipDocument } from "./schemas/membership.schema"
import { ClientMembership, type ClientMembershipDocument } from "./schemas/client-membership.schema"
import type { CreateMembershipDto } from "./dto/create-membership.dto"
import type { UpdateMembershipDto } from "./dto/update-membership.dto"
import type { CreateClientMembershipDto } from "./dto/create-client-membership.dto"
import type { MembershipQueryDto } from "./dto/membership-query.dto"

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    @InjectModel(ClientMembership.name) private clientMembershipModel: Model<ClientMembershipDocument>,
  ) {}

  // Membership Program Management
  async createMembership(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const membership = new this.membershipModel(createMembershipDto)
    return membership.save()
  }

  async findAllMemberships(query: MembershipQueryDto) {
    const { page = 1, limit = 10, membershipType, isActive, search, sortBy = "createdAt", sortOrder = "desc" } = query

    const filter: any = {}

    if (membershipType) filter.membershipType = membershipType
    if (isActive !== undefined) filter.isActive = isActive

    // Search functionality
    if (search) {
      filter.$or = [
        { membershipName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

    const [memberships, total] = await Promise.all([
      this.membershipModel
        .find(filter)
        .populate("createdBy", "firstName lastName email")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.membershipModel.countDocuments(filter),
    ])

    return {
      memberships,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async findMembershipById(id: string): Promise<Membership> {
    const membership = await this.membershipModel.findById(id).populate("createdBy", "firstName lastName email").exec()

    if (!membership) {
      throw new NotFoundException("Membership not found")
    }
    return membership
  }

  async updateMembership(id: string, updateMembershipDto: UpdateMembershipDto): Promise<Membership> {
    const membership = await this.membershipModel
      .findByIdAndUpdate(id, { ...updateMembershipDto, updatedAt: new Date() }, { new: true })
      .populate("createdBy", "firstName lastName email")
      .exec()

    if (!membership) {
      throw new NotFoundException("Membership not found")
    }
    return membership
  }

  async removeMembership(id: string): Promise<void> {
    const result = await this.membershipModel.findByIdAndDelete(id)
    if (!result) {
      throw new NotFoundException("Membership not found")
    }
  }

  // Client Membership Management
  async enrollClient(createClientMembershipDto: CreateClientMembershipDto): Promise<ClientMembership> {
    // Check if client already has this membership
    const existingMembership = await this.clientMembershipModel.findOne({
      clientId: createClientMembershipDto.clientId,
      membershipId: createClientMembershipDto.membershipId,
      status: "active",
    })

    if (existingMembership) {
      throw new BadRequestException("Client already has an active membership of this type")
    }

    const clientMembership = new this.clientMembershipModel(createClientMembershipDto)
    return clientMembership.save()
  }

  async findClientMemberships(clientId: string) {
    return this.clientMembershipModel
      .find({ clientId })
      .populate("membershipId")
      .populate("clientId", "firstName lastName email")
      .sort({ joinDate: -1 })
      .exec()
  }

  async findClientMembershipById(id: string): Promise<ClientMembership> {
    const clientMembership = await this.clientMembershipModel
      .findById(id)
      .populate("membershipId")
      .populate("clientId", "firstName lastName email")
      .exec()

    if (!clientMembership) {
      throw new NotFoundException("Client membership not found")
    }
    return clientMembership
  }

  async addPoints(
    clientMembershipId: string,
    points: number,
    description: string,
    saleId?: string,
  ): Promise<ClientMembership> {
    const clientMembership = await this.clientMembershipModel.findById(clientMembershipId)

    if (!clientMembership) {
      throw new NotFoundException("Client membership not found")
    }

    const pointsTransaction = {
      transactionType: "earned",
      points,
      description,
      saleId,
      transactionDate: new Date(),
    }

    clientMembership.totalPoints += points
    clientMembership.pointsHistory.push(pointsTransaction)
    clientMembership.lastActivity = new Date()
    clientMembership.updatedAt = new Date()

    // Check for tier upgrade
    await this.checkTierUpgrade(clientMembership)

    return clientMembership.save()
  }

  async redeemPoints(clientMembershipId: string, points: number, description: string): Promise<ClientMembership> {
    const clientMembership = await this.clientMembershipModel.findById(clientMembershipId)

    if (!clientMembership) {
      throw new NotFoundException("Client membership not found")
    }

    if (clientMembership.totalPoints < points) {
      throw new BadRequestException("Insufficient points")
    }

    const pointsTransaction = {
      transactionType: "redeemed",
      points: -points,
      description,
      transactionDate: new Date(),
    }

    clientMembership.totalPoints -= points
    clientMembership.pointsHistory.push(pointsTransaction)
    clientMembership.lastActivity = new Date()
    clientMembership.updatedAt = new Date()

    return clientMembership.save()
  }

  async updateSpending(clientMembershipId: string, amount: number): Promise<ClientMembership> {
    const clientMembership = await this.clientMembershipModel.findById(clientMembershipId)

    if (!clientMembership) {
      throw new NotFoundException("Client membership not found")
    }

    clientMembership.totalSpent += amount
    clientMembership.lastActivity = new Date()
    clientMembership.updatedAt = new Date()

    // Check for tier upgrade
    await this.checkTierUpgrade(clientMembership)

    return clientMembership.save()
  }

  private async checkTierUpgrade(clientMembership: ClientMembership): Promise<void> {
    const membership = await this.membershipModel.findById(clientMembership.membershipId)

    if (!membership || membership.membershipType !== "tier_based") {
      return
    }

    // Find the highest tier the client qualifies for
    const qualifyingTiers = membership.tiers
      .filter((tier) => clientMembership.totalSpent >= tier.minimumSpend)
      .sort((a, b) => b.tierLevel - a.tierLevel)

    if (qualifyingTiers.length > 0) {
      const newTier = qualifyingTiers[0]
      if (newTier.tierName !== clientMembership.currentTier) {
        clientMembership.currentTier = newTier.tierName

        // Calculate progress to next tier
        const nextTier = membership.tiers.find((tier) => tier.tierLevel > newTier.tierLevel)
        if (nextTier) {
          const progressAmount = clientMembership.totalSpent - newTier.minimumSpend
          const tierRange = nextTier.minimumSpend - newTier.minimumSpend
          clientMembership.tierProgress = Math.min(100, (progressAmount / tierRange) * 100)
        } else {
          clientMembership.tierProgress = 100 // Max tier reached
        }
      }
    }
  }

  async getMembershipStats() {
    const [membershipStats, clientMembershipStats] = await Promise.all([
      this.membershipModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
            byType: {
              $push: {
                type: "$membershipType",
                count: 1,
              },
            },
          },
        },
      ]),
      this.clientMembershipModel.aggregate([
        {
          $group: {
            _id: null,
            totalMembers: { $sum: 1 },
            activeMembers: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
            totalPointsIssued: { $sum: "$totalPoints" },
            totalSpending: { $sum: "$totalSpent" },
          },
        },
      ]),
    ])

    const tierDistribution = await this.clientMembershipModel.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$currentTier",
          count: { $sum: 1 },
        },
      },
    ])

    return {
      programs: membershipStats[0] || { total: 0, active: 0, byType: [] },
      members: clientMembershipStats[0] || {
        totalMembers: 0,
        activeMembers: 0,
        totalPointsIssued: 0,
        totalSpending: 0,
      },
      tierDistribution,
    }
  }

  async getClientMembershipBenefits(clientId: string): Promise<any[]> {
    const clientMemberships = await this.clientMembershipModel
      .find({ clientId, status: "active" })
      .populate("membershipId")
      .exec()

    const benefits = []

    for (const clientMembership of clientMemberships) {
      const membership = clientMembership.membershipId as any

      // Add general benefits
      benefits.push(...membership.generalBenefits)

      // Add tier-specific benefits
      if (clientMembership.currentTier) {
        const currentTier = membership.tiers.find((tier) => tier.tierName === clientMembership.currentTier)
        if (currentTier) {
          benefits.push(...currentTier.benefits)
        }
      }
    }

    return benefits
  }
}
