import { Injectable, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import { Publication, PublicationDocument } from "./schemas/publication.schema"
import { CreatePublicationDto } from "./dto/create-publication.dto"
import { UpdatePublicationDto } from "./dto/update-publication.dto"
import { InjectModel } from "@nestjs/mongoose"
import { PublicationStatus } from "../common/enums"

@Injectable()
export class PublicationsService {

  constructor(@InjectModel(Publication.name) private publicationModel: Model<PublicationDocument>) {}

  async create(createPublicationDto: CreatePublicationDto): Promise<Publication> {
    const publication = new this.publicationModel({
      ...createPublicationDto,
      status: PublicationStatus.DRAFT,
    })
    return publication.save()
  }

  async findAll(status?: PublicationStatus): Promise<Publication[]> {
    const filter: any = { isDeleted: false }
    if (status) {
      filter.status = status
    }
    return this.publicationModel.find(filter).sort({ createdAt: -1 }).exec()
  }

  async findPublished(): Promise<Publication[]> {
    return this.publicationModel
      .find({
        status: PublicationStatus.PUBLISHED,
        isDeleted: false,
      })
      .sort({ year: -1, createdAt: -1 })
      .exec()
  }

  async findOne(id: string): Promise<Publication> {
    const publication = await this.publicationModel.findOne({ _id: id, isDeleted: false }).exec()
    if (!publication) {
      throw new NotFoundException("Publication not found")
    }
    return publication
  }

  async update(id: string, updatePublicationDto: UpdatePublicationDto): Promise<Publication> {
    const publication = await this.publicationModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updatePublicationDto, { new: true })
      .exec()

    if (!publication) {
      throw new NotFoundException("Publication not found")
    }
    return publication
  }

  async submitForReview(id: string): Promise<Publication> {
    const publication = await this.publicationModel
      .findOneAndUpdate(
        { _id: id, status: PublicationStatus.DRAFT, isDeleted: false },
        { status: PublicationStatus.PENDING_REVIEW },
        { new: true },
      )
      .exec()

    if (!publication) {
      throw new NotFoundException("Publication not found or not in draft status")
    }
    return publication
  }

  async approve(id: string, reviewedBy: string): Promise<Publication> {
    const publication = await this.publicationModel
      .findOneAndUpdate(
        { _id: id, status: PublicationStatus.PENDING_REVIEW, isDeleted: false },
        {
          status: PublicationStatus.APPROVED,
          reviewedBy,
          reviewedAt: new Date(),
        },
        { new: true },
      )
      .exec()

    if (!publication) {
      throw new NotFoundException("Publication not found or not pending review")
    }
    return publication
  }

  async reject(id: string, reviewedBy: string, rejectionReason: string): Promise<Publication> {
    const publication = await this.publicationModel
      .findOneAndUpdate(
        { _id: id, status: PublicationStatus.PENDING_REVIEW, isDeleted: false },
        {
          status: PublicationStatus.REJECTED,
          reviewedBy,
          reviewedAt: new Date(),
          rejectionReason,
        },
        { new: true },
      )
      .exec()

    if (!publication) {
      throw new NotFoundException("Publication not found or not pending review")
    }
    return publication
  }

  async publish(id: string): Promise<Publication> {
    const publication = await this.publicationModel
      .findOneAndUpdate(
        { _id: id, status: PublicationStatus.APPROVED, isDeleted: false },
        {
          status: PublicationStatus.PUBLISHED,
          publishedAt: new Date(),
        },
        { new: true },
      )
      .exec()

    if (!publication) {
      throw new NotFoundException("Publication not found or not approved")
    }
    return publication
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const result = await this.publicationModel.updateOne(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
    )

    if (result.matchedCount === 0) {
      throw new NotFoundException("Publication not found")
    }
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.publicationModel.deleteOne({ _id: id })
    if (result.deletedCount === 0) {
      throw new NotFoundException("Publication not found")
    }
  }

  async restore(id: string): Promise<Publication> {
    const publication = await this.publicationModel
      .findOneAndUpdate(
        { _id: id, isDeleted: true },
        { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } },
        { new: true },
      )
      .exec()

    if (!publication) {
      throw new NotFoundException("Publication not found or not deleted")
    }
    return publication
  }
}
