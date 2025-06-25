import { Injectable, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import { Form, FormDocument } from "./schemas/form.schema"
import { FormSubmission, FormSubmissionDocument } from "./schemas/form-submission.schema"
import { CreateFormDto } from "./dto/create-form.dto"
import { UpdateFormDto } from "./dto/update-form.dto"
import { SubmitFormDto } from "./dto/submit-form.dto"
import { InjectModel } from "@nestjs/mongoose"
import slugify from "slugify"

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<FormDocument>,
    @InjectModel(FormSubmission.name) private submissionModel: Model<FormSubmissionDocument>,
  ) {}

  async create(createFormDto: CreateFormDto): Promise<Form> {
    const slug = slugify(createFormDto.title, { lower: true })
    const form = new this.formModel({
      ...createFormDto,
      slug,
    })
    return form.save()
  }

  async findAll(): Promise<Form[]> {
    return this.formModel.find({ isDeleted: false }).sort({ createdAt: -1 }).exec()
  }

  async findOne(id: string): Promise<Form> {
    const form = await this.formModel
      .findOne({
        $or: [{ _id: id }, { slug: id }],
        isDeleted: false,
      })
      .exec()

    if (!form) {
      throw new NotFoundException("Form not found")
    }
    return form
  }

  async update(id: string, updateFormDto: UpdateFormDto): Promise<Form> {
    if (updateFormDto.title) {
      updateFormDto.slug = slugify(updateFormDto.title, { lower: true })
    }

    const form = await this.formModel
      .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, updateFormDto, { new: true })
      .exec()

    if (!form) {
      throw new NotFoundException("Form not found")
    }
    return form
  }

  async submitForm(id: string, submitFormDto: SubmitFormDto): Promise<FormSubmission> {
    const form = await this.findOne(id)

    const submission = new this.submissionModel({
      formId: form._id,
      formTitle: form.title,
      responses: submitFormDto.responses,
      submitterEmail: submitFormDto.submitterEmail,
    })

    // Update form submission count
    await this.formModel.updateOne({ _id: form._id }, { $inc: { submissionsCount: 1 } })

    return submission.save()
  }

  async getSubmissions(formId: string): Promise<FormSubmission[]> {
    const form = await this.findOne(formId)
    return this.submissionModel.find({ formId: form._id, isDeleted: false }).sort({ createdAt: -1 }).exec()
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const result = await this.formModel.updateOne(
      { $or: [{ _id: id }, { slug: id }], isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
    )

    if (result.matchedCount === 0) {
      throw new NotFoundException("Form not found")
    }
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.formModel.deleteOne({
      $or: [{ _id: id }, { slug: id }],
    })

    if (result.deletedCount === 0) {
      throw new NotFoundException("Form not found")
    }
  }

  async restore(id: string): Promise<Form> {
    const form = await this.formModel
      .findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }], isDeleted: true },
        { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } },
        { new: true },
      )
      .exec()

    if (!form) {
      throw new NotFoundException("Form not found or not deleted")
    }
    return form
  }
}
