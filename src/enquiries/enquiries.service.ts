import { Injectable, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import { Enquiry, EnquiryDocument } from "./schemas/enquiry.schema"
import { CreateEnquiryDto } from "./dto/create-enquiry.dto"

@Injectable()
export class EnquiriesService {

  constructor(@InjectModel(Enquiry.name) private enquiryModel: Model<EnquiryDocument>) {}

  async create(createEnquiryDto: CreateEnquiryDto): Promise<Enquiry> {
    const enquiry = new this.enquiryModel(createEnquiryDto)
    return enquiry.save()
  }

  async findAll(): Promise<Enquiry[]> {
    return this.enquiryModel.find({ isDeleted: false }).sort({ createdAt: -1 }).exec()
  }

  async findOne(id: string): Promise<Enquiry> {
    const enquiry = await this.enquiryModel.findOne({ _id: id, isDeleted: false }).exec()
    if (!enquiry) {
      throw new NotFoundException("Enquiry not found")
    }
    return enquiry
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const result = await this.enquiryModel.updateOne(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
    )

    if (result.matchedCount === 0) {
      throw new NotFoundException("Enquiry not found")
    }
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.enquiryModel.deleteOne({ _id: id })
    if (result.deletedCount === 0) {
      throw new NotFoundException("Enquiry not found")
    }
  }
}
