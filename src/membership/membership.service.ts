import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Model } from "mongoose"
import type {
  Membership,
  MembershipDocument,
  ClientMembership,
  ClientMembershipDocument,
} from "./schemas/membership.schema"
import type { CreateMembershipDto, PurchaseMembershipDto } from "./dto/create-membership.dto"

@Injectable()
export class MembershipService {
  private membershipModel: Model<MembershipDocument>
  private clientMembershipModel: Model<ClientMembershipDocument>

  constructor(model1: Model<MembershipDocument>, model2: Model<ClientMembershipDocument>) {
    this.membershipModel = model1
    this.clientMembershipModel = model2
  }

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const membership = new this.membershipModel(createMembershipDto)
    return membership.save()
  }

  async findAll(): Promise<Membership[]> {
    return this.membershipModel.find({ status: "active" }).populate("includedServices").exec()
  }

  async findOne(id: string): Promise<Membership> {
    const membership = await this.membershipModel.findById(id).populate("includedServices").exec()
    if (!membership) {
      throw new NotFoundException("Membership not found")
    }
    return membership
  }

  async update(id: string, updateData: Partial<CreateMembershipDto>): Promise<Membership> {
    const membership = await this.membershipModel.findByIdAndUpdate(id, updateData, { new: true })
    if (!membership) {
      throw new NotFoundException("Membership not found")
    }
    return membership
  }

  async purchaseMembership(purchaseDto: PurchaseMembershipDto): Promise<ClientMembership> {
    const membership = await this.findOne(purchaseDto.membershipId.toString())

    // Check if client already has an active membership
    const existingMembership = await this.clientMembershipModel.findOne({
      clientId: purchaseDto.clientId,
      status: "active",
    })

    if (existingMembership) {
      throw new BadRequestException("Client already has an active membership")
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + membership.duration)

    const clientMembership = new this.clientMembershipModel({
      clientId: purchaseDto.clientId,
      membershipId: purchaseDto.membershipId,
      startDate,
      endDate,
      status: "active",
      autoRenewal: purchaseDto.autoRenewal || false,
    })

    return clientMembership.save()
  }

  async getClientMemberships(clientId: string): Promise<ClientMembership[]> {
    return this.clientMembershipModel.find({ clientId }).populate("membershipId").sort({ createdAt: -1 }).exec()
  }

  async getActiveMembership(clientId: string): Promise<ClientMembership | null> {
    return this.clientMembershipModel.findOne({ clientId, status: "active" }).populate("membershipId").exec()
  }

  async useMembershipService(clientId: string, serviceId: string, bookingId: string): Promise<boolean> {
    const membership = await this.getActiveMembership(clientId)
    if (!membership) {
      return false
    }

    // Check if membership includes this service
    const membershipData = membership.membershipId as any
    const isServiceIncluded = membershipData.includedServices.some((id: any) => id.toString() === serviceId)

    if (!isServiceIncluded) {
      return false
    }

    // Check usage limits
    if (membershipData.maxBookings && membership.usedBookings >= membershipData.maxBookings) {
      return false
    }

    // Update usage
    await this.clientMembershipModel.findByIdAndUpdate(membership._id, {
      $inc: { usedBookings: 1 },
      $push: {
        usageHistory: {
          date: new Date(),
          serviceId,
          bookingId,
        },
      },
    })

    return true
  }

  async remove(id: string): Promise<void> {
    const result = await this.membershipModel.findByIdAndDelete(id)
    if (!result) {
      throw new NotFoundException("Membership not found")
    }
  }
}
