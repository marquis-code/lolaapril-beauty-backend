import { Injectable, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import { Program, ProgramDocument } from "./schemas/program.schema"
import { ProgramApplication, ProgramApplicationDocument } from "./schemas/program-application.schema"
import { CreateProgramDto } from "./dto/create-program.dto"
import { UpdateProgramDto } from "./dto/update-program.dto"
import { SubmitApplicationDto } from "./dto/submit-application.dto"
import { ProgramStatus } from "../common/enums"
import { InjectModel } from "@nestjs/mongoose"
import slugify from "slugify"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class ProgramsService {


  constructor(
    @InjectModel(Program.name) private programModel: Model<ProgramDocument>,
    @InjectModel(ProgramApplication.name) private applicationModel: Model<ProgramApplicationDocument>
  ) {}

  async create(createProgramDto: CreateProgramDto): Promise<Program> {
    const slug = slugify(createProgramDto.title, { lower: true })
    const registrationToken = uuidv4()

    const program = new this.programModel({
      ...createProgramDto,
      slug,
      registrationToken,
      status: ProgramStatus.DRAFT,
    })
    return program.save()
  }

  async findAll(status?: ProgramStatus): Promise<Program[]> {
    const filter: any = { isDeleted: false }
    if (status) {
      filter.status = status
    }
    return this.programModel.find(filter).sort({ createdAt: -1 }).exec()
  }

  async findActive(): Promise<Program[]> {
    return this.programModel
      .find({
        status: ProgramStatus.ACTIVE,
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec()
  }

  async findOne(id: string): Promise<Program> {
    const program = await this.programModel
      .findOne({
        $or: [{ _id: id }, { slug: id }],
        isDeleted: false,
      })
      .exec()

    if (!program) {
      throw new NotFoundException("Program not found")
    }
    return program
  }

  async findByRegistrationToken(token: string): Promise<Program> {
    const program = await this.programModel
      .findOne({
        registrationToken: token,
        status: ProgramStatus.ACTIVE,
        isDeleted: false,
      })
      .exec()

    if (!program) {
      throw new NotFoundException("Program not found or not active")
    }
    return program
  }

  async update(id: string, updateProgramDto: UpdateProgramDto): Promise<Program> {
    const program = await this.programModel
      .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, updateProgramDto, { new: true })
      .exec()

    if (!program) {
      throw new NotFoundException("Program not found")
    }
    return program
  }

  async activate(id: string): Promise<Program> {
    const program = await this.programModel
      .findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }], isDeleted: false },
        { status: ProgramStatus.ACTIVE },
        { new: true },
      )
      .exec()

    if (!program) {
      throw new NotFoundException("Program not found")
    }
    return program
  }

  async deactivate(id: string): Promise<Program> {
    const program = await this.programModel
      .findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }], isDeleted: false },
        { status: ProgramStatus.INACTIVE },
        { new: true },
      )
      .exec()

    if (!program) {
      throw new NotFoundException("Program not found")
    }
    return program
  }

  async getRegistrationLink(id: string): Promise<{ registrationLink: string }> {
    const program = await this.findOne(id)
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000"
    return {
      registrationLink: `${baseUrl}/programs/apply/${program.registrationToken}`,
    }
  }

  async submitApplication(token: string, applicationDto: SubmitApplicationDto): Promise<ProgramApplication> {
    const program = await this.findByRegistrationToken(token)

    const application = new this.applicationModel({
      programId: program._id,
      programTitle: program.title,
      responses: applicationDto.responses,
      applicantEmail: applicationDto.applicantEmail,
    })

    return application.save()
  }

  async getApplications(programId: string): Promise<ProgramApplication[]> {
    return this.applicationModel.find({ programId, isDeleted: false }).sort({ createdAt: -1 }).exec()
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const result = await this.programModel.updateOne(
      { $or: [{ _id: id }, { slug: id }], isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
    )

    if (result.matchedCount === 0) {
      throw new NotFoundException("Program not found")
    }
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.programModel.deleteOne({
      $or: [{ _id: id }, { slug: id }],
    })

    if (result.deletedCount === 0) {
      throw new NotFoundException("Program not found")
    }
  }

  async restore(id: string): Promise<Program> {
    const program = await this.programModel
      .findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }], isDeleted: true },
        { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } },
        { new: true },
      )
      .exec()

    if (!program) {
      throw new NotFoundException("Program not found or not deleted")
    }
    return program
  }
}
