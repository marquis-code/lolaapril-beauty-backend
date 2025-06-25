import { Injectable, NotFoundException } from "@nestjs/common"
import { Model } from "mongoose"
import { Blog, BlogDocument } from "./schemas/blog.schema"
import { CreateBlogDto } from "./dto/create-blog.dto"
import { UpdateBlogDto } from "./dto/update-blog.dto"
import { BlogStatus } from "../common/enums"
import { InjectModel } from "@nestjs/mongoose"
import slugify from "slugify"

@Injectable()
export class BlogsService {

  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async create(createBlogDto: CreateBlogDto, authorId: string): Promise<Blog> {
    const slug = slugify(createBlogDto.title, { lower: true })
    const blog = new this.blogModel({
      ...createBlogDto,
      slug,
      authorId,
      status: BlogStatus.DRAFT,
    })
    return blog.save()
  }

  async findAll(status?: BlogStatus): Promise<Blog[]> {
    const filter: any = { isDeleted: false }
    if (status) {
      filter.status = status
    }
    return this.blogModel.find(filter).sort({ createdAt: -1 }).exec()
  }

  async findPublished(): Promise<Blog[]> {
    return this.blogModel
      .find({
        status: BlogStatus.PUBLISHED,
        isDeleted: false,
      })
      .sort({ publishedAt: -1, createdAt: -1 })
      .exec()
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogModel
      .findOne({
        $or: [{ _id: id }, { slug: id }],
        isDeleted: false,
      })
      .exec()

    if (!blog) {
      throw new NotFoundException("Blog not found")
    }
    return blog
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    if (updateBlogDto.title) {
      updateBlogDto.slug = slugify(updateBlogDto.title, { lower: true })
    }

    const blog = await this.blogModel
      .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, updateBlogDto, { new: true })
      .exec()

    if (!blog) {
      throw new NotFoundException("Blog not found")
    }
    return blog
  }

  async publish(id: string): Promise<Blog> {
    const blog = await this.blogModel
      .findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }], isDeleted: false },
        {
          status: BlogStatus.PUBLISHED,
          publishedAt: new Date(),
        },
        { new: true },
      )
      .exec()

    if (!blog) {
      throw new NotFoundException("Blog not found")
    }
    return blog
  }

  async unpublish(id: string): Promise<Blog> {
    const blog = await this.blogModel
      .findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }], isDeleted: false },
        {
          status: BlogStatus.DRAFT,
          $unset: { publishedAt: 1 },
        },
        { new: true },
      )
      .exec()

    if (!blog) {
      throw new NotFoundException("Blog not found")
    }
    return blog
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const result = await this.blogModel.updateOne(
      { $or: [{ _id: id }, { slug: id }], isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
    )

    if (result.matchedCount === 0) {
      throw new NotFoundException("Blog not found")
    }
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.blogModel.deleteOne({
      $or: [{ _id: id }, { slug: id }],
    })

    if (result.deletedCount === 0) {
      throw new NotFoundException("Blog not found")
    }
  }

  async restore(id: string): Promise<Blog> {
    const blog = await this.blogModel
      .findOneAndUpdate(
        { $or: [{ _id: id }, { slug: id }], isDeleted: true },
        { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } },
        { new: true },
      )
      .exec()

    if (!blog) {
      throw new NotFoundException("Blog not found or not deleted")
    }
    return blog
  }
}
