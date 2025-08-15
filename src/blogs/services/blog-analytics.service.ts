import { Injectable } from "@nestjs/common"
import { Model } from "mongoose"
import { Blog, BlogDocument } from "../schemas/blog.schema"
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class BlogAnalyticsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>, // Inject the Blog model here
  ) {}


  async incrementViewCount(blogId: string, isUnique = false): Promise<void> {
    const updateQuery: any = { $inc: { "analytics.viewCount": 1 } }

    if (isUnique) {
      updateQuery.$inc["analytics.uniqueViewCount"] = 1
    }

    await this.blogModel.updateOne({ _id: blogId }, updateQuery)
  }

  async incrementReadCount(blogId: string): Promise<void> {
    await this.blogModel.updateOne({ _id: blogId }, { $inc: { "analytics.readCount": 1 } })
  }

  async updateClapCount(blogId: string, totalClaps: number): Promise<void> {
    await this.blogModel.updateOne({ _id: blogId }, { $set: { "analytics.clapCount": totalClaps } })
  }

  async incrementShareCount(blogId: string): Promise<void> {
    await this.blogModel.updateOne({ _id: blogId }, { $inc: { "analytics.shareCount": 1 } })
  }

  async updateBookmarkCount(blogId: string, count: number): Promise<void> {
    await this.blogModel.updateOne({ _id: blogId }, { $set: { "analytics.bookmarkCount": count } })
  }

  async updateCommentCount(blogId: string, count: number): Promise<void> {
    await this.blogModel.updateOne({ _id: blogId }, { $set: { "analytics.commentCount": count } })
  }

  async getPopularBlogs(limit = 10): Promise<Blog[]> {
    return this.blogModel
      .find({ status: "published", isDeleted: false })
      .sort({ "analytics.viewCount": -1, "analytics.clapCount": -1 })
      .limit(limit)
      .exec()
  }

  async getTrendingBlogs(days = 7, limit = 10): Promise<Blog[]> {
    const dateThreshold = new Date()
    dateThreshold.setDate(dateThreshold.getDate() - days)

    return this.blogModel
      .find({
        status: "published",
        isDeleted: false,
        publishedAt: { $gte: dateThreshold },
      })
      .sort({ "analytics.viewCount": -1, "analytics.clapCount": -1 })
      .limit(limit)
      .exec()
  }
}
