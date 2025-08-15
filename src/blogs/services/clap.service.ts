import { Injectable } from "@nestjs/common"
import type { Model } from "mongoose"
import type { BlogClapDocument } from "../schemas/blog-clap.schema"
import type { ClapBlogDto } from "../dto/clap-blog.dto"

@Injectable()
export class ClapService {
  private readonly blogClapModel: Model<BlogClapDocument>

  constructor(blogClapModel: Model<BlogClapDocument>) {
    this.blogClapModel = blogClapModel
  }

  async clapBlog(blogId: string, userId: string, clapDto: ClapBlogDto): Promise<{ totalClaps: number }> {
    const existingClap = await this.blogClapModel.findOne({ blogId, userId })

    if (existingClap) {
      // Update existing clap count (max 50 claps per user per blog)
      const newCount = Math.min(existingClap.count + (clapDto.count || 1), 50)
      existingClap.count = newCount
      await existingClap.save()
    } else {
      // Create new clap
      await new this.blogClapModel({
        blogId,
        userId,
        count: clapDto.count || 1,
      }).save()
    }

    // Calculate total claps for this blog
    const totalClaps = await this.blogClapModel.aggregate([
      { $match: { blogId } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ])

    return { totalClaps: totalClaps[0]?.total || 0 }
  }

  async getTotalClaps(blogId: string): Promise<number> {
    const result = await this.blogClapModel.aggregate([
      { $match: { blogId } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ])

    return result[0]?.total || 0
  }

  async getUserClaps(blogId: string, userId: string): Promise<number> {
    const clap = await this.blogClapModel.findOne({ blogId, userId })
    return clap?.count || 0
  }
}
