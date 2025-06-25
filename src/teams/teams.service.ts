import { Injectable, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import { TeamMember, TeamMemberDocument } from "./schemas/team-member.schema"
import { CreateTeamMemberDto } from "./dto/create-team-member.dto"
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto"
import { InjectModel } from "@nestjs/mongoose"
import slugify from "slugify"

@Injectable()
export class TeamsService {
  constructor(@InjectModel(TeamMember.name) private teamMemberModel: Model<TeamMemberDocument>) {}

  async create(createTeamMemberDto: CreateTeamMemberDto): Promise<TeamMember> {
    const slug = slugify(`${createTeamMemberDto.name}`, { lower: true })
    const teamMember = new this.teamMemberModel({
      ...createTeamMemberDto,
      id: slug,
    })
    return teamMember.save()
  }

  async findAll(): Promise<TeamMember[]> {
    return this.teamMemberModel.find({ isDeleted: false }).sort({ position: 1 }).exec()
  }

  async findOne(id: string): Promise<TeamMember> {
    const teamMember = await this.teamMemberModel
      .findOne({
        $or: [{ _id: id }, { id: id }],
        isDeleted: false,
      })
      .exec()

    if (!teamMember) {
      throw new NotFoundException("Team member not found")
    }
    return teamMember
  }

  async update(id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<TeamMember> {
    const teamMember = await this.teamMemberModel
      .findOneAndUpdate({ $or: [{ _id: id }, { id: id }], isDeleted: false }, updateTeamMemberDto, { new: true })
      .exec()

    if (!teamMember) {
      throw new NotFoundException("Team member not found")
    }
    return teamMember
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const result = await this.teamMemberModel.updateOne(
      { $or: [{ _id: id }, { id: id }], isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
    )

    if (result.matchedCount === 0) {
      throw new NotFoundException("Team member not found")
    }
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.teamMemberModel.deleteOne({
      $or: [{ _id: id }, { id: id }],
    })

    if (result.deletedCount === 0) {
      throw new NotFoundException("Team member not found")
    }
  }

  async restore(id: string): Promise<TeamMember> {
    const teamMember = await this.teamMemberModel
      .findOneAndUpdate(
        { $or: [{ _id: id }, { id: id }], isDeleted: true },
        { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } },
        { new: true },
      )
      .exec()

    if (!teamMember) {
      throw new NotFoundException("Team member not found or not deleted")
    }
    return teamMember
  }
}
