// // import { Injectable, NotFoundException } from "@nestjs/common"
// // import { Model } from "mongoose"
// // import { Blog, BlogDocument } from "./schemas/blog.schema"
// // import { CreateBlogDto } from "./dto/create-blog.dto"
// // import { UpdateBlogDto } from "./dto/update-blog.dto"
// // import { BlogStatus } from "../common/enums"
// // import { InjectModel } from "@nestjs/mongoose"
// // import slugify from "slugify"

// // @Injectable()
// // export class BlogsService {

// //   constructor(@InjectModel(Blog.name)  private blogModel: Model<BlogDocument>) {}

// //   async create(createBlogDto: CreateBlogDto, authorId: string): Promise<Blog> {
// //     const slug = slugify(createBlogDto.title, { lower: true })
// //     const blog = new this.blogModel({
// //       ...createBlogDto,
// //       slug,
// //       authorId,
// //       status: BlogStatus.DRAFT,
// //     })
// //     return blog.save()
// //   }

// //   async findAll(status?: BlogStatus): Promise<Blog[]> {
// //     const filter: any = { isDeleted: false }
// //     if (status) {
// //       filter.status = status
// //     }
// //     return this.blogModel.find(filter).sort({ createdAt: -1 }).exec()
// //   }

// //   async findPublished(): Promise<Blog[]> {
// //     return this.blogModel
// //       .find({
// //         status: BlogStatus.PUBLISHED,
// //         isDeleted: false,
// //       })
// //       .sort({ publishedAt: -1, createdAt: -1 })
// //       .exec()
// //   }

// //   async findOne(id: string): Promise<Blog> {
// //     const blog = await this.blogModel
// //       .findOne({
// //         $or: [{ _id: id }, { slug: id }],
// //         isDeleted: false,
// //       })
// //       .exec()

// //     if (!blog) {
// //       throw new NotFoundException("Blog not found")
// //     }
// //     return blog
// //   }

// //   async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
// //     if (updateBlogDto.title) {
// //       updateBlogDto.slug = slugify(updateBlogDto.title, { lower: true })
// //     }

// //     const blog = await this.blogModel
// //       .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, updateBlogDto, { new: true })
// //       .exec()

// //     if (!blog) {
// //       throw new NotFoundException("Blog not found")
// //     }
// //     return blog
// //   }

// //   async publish(id: string): Promise<Blog> {
// //     const blog = await this.blogModel
// //       .findOneAndUpdate(
// //         { $or: [{ _id: id }, { slug: id }], isDeleted: false },
// //         {
// //           status: BlogStatus.PUBLISHED,
// //           publishedAt: new Date(),
// //         },
// //         { new: true },
// //       )
// //       .exec()

// //     if (!blog) {
// //       throw new NotFoundException("Blog not found")
// //     }
// //     return blog
// //   }

// //   async unpublish(id: string): Promise<Blog> {
// //     const blog = await this.blogModel
// //       .findOneAndUpdate(
// //         { $or: [{ _id: id }, { slug: id }], isDeleted: false },
// //         {
// //           status: BlogStatus.DRAFT,
// //           $unset: { publishedAt: 1 },
// //         },
// //         { new: true },
// //       )
// //       .exec()

// //     if (!blog) {
// //       throw new NotFoundException("Blog not found")
// //     }
// //     return blog
// //   }

// //   async softDelete(id: string, deletedBy: string): Promise<void> {
// //     const result = await this.blogModel.updateOne(
// //       { $or: [{ _id: id }, { slug: id }], isDeleted: false },
// //       { isDeleted: true, deletedAt: new Date(), deletedBy },
// //     )

// //     if (result.matchedCount === 0) {
// //       throw new NotFoundException("Blog not found")
// //     }
// //   }

// //   async hardDelete(id: string): Promise<void> {
// //     const result = await this.blogModel.deleteOne({
// //       $or: [{ _id: id }, { slug: id }],
// //     })

// //     if (result.deletedCount === 0) {
// //       throw new NotFoundException("Blog not found")
// //     }
// //   }

// //   async restore(id: string): Promise<Blog> {
// //     const blog = await this.blogModel
// //       .findOneAndUpdate(
// //         { $or: [{ _id: id }, { slug: id }], isDeleted: true },
// //         { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } },
// //         { new: true },
// //       )
// //       .exec()

// //     if (!blog) {
// //       throw new NotFoundException("Blog not found or not deleted")
// //     }
// //     return blog
// //   }
// // }


// import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
// import { Model } from "mongoose"
// import { InjectModel } from "@nestjs/mongoose"
// import { Blog, BlogDocument } from "./schemas/blog.schema"
// import { BlogClapDocument } from "./schemas/blog-clap.schema"
// import { BlogComment, BlogCommentDocument } from "./schemas/blog-comment.schema"
// import { BlogBookmark, BlogBookmarkDocument } from "./schemas/blog-bookmark.schema"
// import { SeriesDocument } from "./schemas/series.schema"
// import { CreateBlogDto } from "./dto/create-blog.dto"
// import { UpdateBlogDto } from "./dto/update-blog.dto"
// import { ClapBlogDto } from "./dto/clap-blog.dto"
// import { CreateCommentDto } from "./dto/create-comment.dto"
// import { BookmarkBlogDto } from "./dto/bookmark-blog.dto"
// import { BlogStatus } from "../common/enums"
// import { ContentProcessorService } from "./services/content-processor.service"
// import { BlogAnalyticsService } from "./services/blog-analytics.service"
// import slugify from "slugify"

// @Injectable()
// export class BlogsService {

  

//   constructor(
//     private readonly blogModel: Model<BlogDocument>,
//     private readonly blogClapModel: Model<BlogClapDocument>,
//     private readonly blogCommentModel: Model<BlogCommentDocument>,
//     private readonly blogBookmarkModel: Model<BlogBookmarkDocument>,
//     private readonly seriesModel: Model<SeriesDocument>,
//     private readonly contentProcessorService: ContentProcessorService,
//     private readonly blogAnalyticsService: BlogAnalyticsService,
//   ) {}
  
//   // private blogModel: Model<BlogDocument>
//   // private blogClapModel: Model<BlogClapDocument>
//   // private blogCommentModel: Model<BlogCommentDocument>
//   // private blogBookmarkModel: Model<BlogBookmarkDocument>
//   // private seriesModel: Model<SeriesDocument>
//   // private contentProcessorService: ContentProcessorService
//   // private blogAnalyticsService: BlogAnalyticsService

//   // constructor(
//   //   @InjectModel(Blog.name) blogModel: Model<BlogDocument>,
//   //    blogClapModel: Model<BlogClapDocument>,
//   //   @InjectModel(BlogComment.name) blogCommentModel: Model<BlogCommentDocument>,
//   //   @InjectModel(BlogBookmark.name) blogBookmarkModel: Model<BlogBookmarkDocument>,
//   //    seriesModel: Model<SeriesDocument>,
//   //    contentProcessorService: ContentProcessorService,
//   //    blogAnalyticsService: BlogAnalyticsService,
//   // ) {
//   //   this.blogModel = blogModel
//   //   this.blogClapModel = blogClapModel
//   //   this.blogCommentModel = blogCommentModel
//   //   this.blogBookmarkModel = blogBookmarkModel
//   //   this.seriesModel = seriesModel
//   //   this.contentProcessorService = contentProcessorService
//   //   this.blogAnalyticsService = blogAnalyticsService
//   // }

//   async create(createBlogDto: CreateBlogDto, authorId: string): Promise<Blog> {
//     const slug = await this.generateUniqueSlug(createBlogDto.title)

//     // Calculate reading time
//     const estimatedReadTime = this.contentProcessorService.calculateReadingTime(
//       createBlogDto.content,
//       createBlogDto.contentBlocks,
//     )

//     // Generate excerpt if not provided
//     const excerpt = createBlogDto.excerpt || this.contentProcessorService.generateExcerpt(createBlogDto.content)

//     // Generate table of contents
//     const tableOfContents = this.contentProcessorService.generateTableOfContents(createBlogDto.contentBlocks)

//     const blog = new this.blogModel({
//       ...createBlogDto,
//       slug,
//       excerpt,
//       authorId,
//       tableOfContents,
//       status: BlogStatus.DRAFT,
//       analytics: {
//         estimatedReadTime,
//         viewCount: 0,
//         uniqueViewCount: 0,
//         readCount: 0,
//         clapCount: 0,
//         shareCount: 0,
//         bookmarkCount: 0,
//         commentCount: 0,
//       },
//       version: 1,
//     })

//     return blog.save()
//   }

//   async findAll(
//     status?: BlogStatus,
//     page = 1,
//     limit = 10,
//     sortBy = "createdAt",
//     sortOrder: "asc" | "desc" = "desc",
//     tags?: string[],
//     category?: string,
//     authorId?: string,
//   ): Promise<{ blogs: Blog[]; total: number; page: number; totalPages: number }> {
//     const filter: any = { isDeleted: false }

//     if (status) filter.status = status
//     if (tags && tags.length > 0) filter.tags = { $in: tags }
//     if (category) filter.category = category
//     if (authorId) filter.authorId = authorId

//     const skip = (page - 1) * limit
//     const sortOptions: any = {}
//     sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

//     const [blogs, total] = await Promise.all([
//       this.blogModel
//         .find(filter)
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(limit)
//         .populate("authorId", "name email avatar")
//         .populate("seriesId", "title slug")
//         .exec(),
//       this.blogModel.countDocuments(filter),
//     ])

//     return {
//       blogs,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     }
//   }

//   async findPublished(
//     page = 1,
//     limit = 10,
//     featured?: boolean,
//   ): Promise<{ blogs: Blog[]; total: number; page: number; totalPages: number }> {
//     const filter: any = {
//       status: BlogStatus.PUBLISHED,
//       isDeleted: false,
//     }

//     if (featured !== undefined) {
//       filter["settings.isFeatured"] = featured
//     }

//     return this.findAll(BlogStatus.PUBLISHED, page, limit, "publishedAt", "desc")
//   }

//   async findOne(id: string, userId?: string): Promise<Blog> {
//     const blog = await this.blogModel
//       .findOne({
//         $or: [{ _id: id }, { slug: id }],
//         isDeleted: false,
//       })
//       .populate("authorId", "name email avatar bio")
//       .populate("coAuthors", "name email avatar")
//       .populate("seriesId", "title slug description")
//       .exec()

//     if (!blog) {
//       throw new NotFoundException("Blog not found")
//     }

//     // Increment view count (you might want to implement IP-based unique tracking)
//     if (userId !== blog.authorId.toString()) {
//       await this.blogAnalyticsService.incrementViewCount(blog._id.toString(), true)
//     }

//     return blog
//   }

//   async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
//     if (updateBlogDto.title) {
//       updateBlogDto.slug = await this.generateUniqueSlug(updateBlogDto.title)
//     }

//     const blog = await this.blogModel
//       .findOneAndUpdate({ $or: [{ _id: id }, { slug: id }], isDeleted: false }, updateBlogDto, { new: true })
//       .exec()

//     if (!blog) {
//       throw new NotFoundException("Blog not found")
//     }
//     return blog
//   }

//   async publish(id: string): Promise<Blog> {
//     const blog = await this.blogModel
//       .findOneAndUpdate(
//         { $or: [{ _id: id }, { slug: id }], isDeleted: false },
//         {
//           status: BlogStatus.PUBLISHED,
//           publishedAt: new Date(),
//         },
//         { new: true },
//       )
//       .exec()

//     if (!blog) {
//       throw new NotFoundException("Blog not found")
//     }
//     return blog
//   }

//   async unpublish(id: string): Promise<Blog> {
//     const blog = await this.blogModel
//       .findOneAndUpdate(
//         { $or: [{ _id: id }, { slug: id }], isDeleted: false },
//         {
//           status: BlogStatus.DRAFT,
//           $unset: { publishedAt: 1 },
//         },
//         { new: true },
//       )
//       .exec()

//     if (!blog) {
//       throw new NotFoundException("Blog not found")
//     }
//     return blog
//   }

//   async softDelete(id: string, deletedBy: string): Promise<void> {
//     const result = await this.blogModel.updateOne(
//       { $or: [{ _id: id }, { slug: id }], isDeleted: false },
//       { isDeleted: true, deletedAt: new Date(), deletedBy },
//     )

//     if (result.matchedCount === 0) {
//       throw new NotFoundException("Blog not found")
//     }
//   }

//   async hardDelete(id: string): Promise<void> {
//     const result = await this.blogModel.deleteOne({
//       $or: [{ _id: id }, { slug: id }],
//     })

//     if (result.deletedCount === 0) {
//       throw new NotFoundException("Blog not found")
//     }
//   }

//   async restore(id: string): Promise<Blog> {
//     const blog = await this.blogModel
//       .findOneAndUpdate(
//         { $or: [{ _id: id }, { slug: id }], isDeleted: true },
//         { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } },
//         { new: true },
//       )
//       .exec()

//     if (!blog) {
//       throw new NotFoundException("Blog not found or not deleted")
//     }
//     return blog
//   }

//   async clapBlog(blogId: string, userId: string, clapDto: ClapBlogDto): Promise<{ totalClaps: number }> {
//     const blog = await this.findOne(blogId)

//     if (!blog.settings.allowClaps) {
//       throw new BadRequestException("Claps are not allowed for this blog")
//     }

//     const existingClap = await this.blogClapModel.findOne({ blogId, userId })

//     if (existingClap) {
//       // Update existing clap count (max 50 claps per user per blog)
//       const newCount = Math.min(existingClap.count + (clapDto.count || 1), 50)
//       existingClap.count = newCount
//       await existingClap.save()
//     } else {
//       // Create new clap
//       await new this.blogClapModel({
//         blogId,
//         userId,
//         count: clapDto.count || 1,
//       }).save()
//     }

//     // Calculate total claps for this blog
//     const totalClaps = await this.blogClapModel.aggregate([
//       { $match: { blogId: blog._id } },
//       { $group: { _id: null, total: { $sum: "$count" } } },
//     ])

//     const clapCount = totalClaps[0]?.total || 0
//     await this.blogAnalyticsService.updateClapCount(blogId, clapCount)

//     return { totalClaps: clapCount }
//   }

//   async addComment(blogId: string, userId: string, commentDto: CreateCommentDto): Promise<BlogComment> {
//     const blog = await this.findOne(blogId)

//     if (!blog.settings.allowComments) {
//       throw new BadRequestException("Comments are not allowed for this blog")
//     }

//     const comment = new this.blogCommentModel({
//       blogId,
//       authorId: userId,
//       ...commentDto,
//     })

//     await comment.save()

//     // Update comment count
//     const commentCount = await this.blogCommentModel.countDocuments({ blogId, isDeleted: false })
//     await this.blogAnalyticsService.updateCommentCount(blogId, commentCount)

//     return comment.populate("authorId", "name avatar")
//   }

//   async getComments(
//     blogId: string,
//     page = 1,
//     limit = 20,
//   ): Promise<{
//     comments: BlogComment[]
//     total: number
//     page: number
//     totalPages: number
//   }> {
//     const skip = (page - 1) * limit

//     const [comments, total] = await Promise.all([
//       this.blogCommentModel
//         .find({ blogId, isDeleted: false, parentId: null })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .populate("authorId", "name avatar")
//         .exec(),
//       this.blogCommentModel.countDocuments({ blogId, isDeleted: false, parentId: null }),
//     ])

//     // Get replies for each comment
//     for (const comment of comments) {
//       const replies = await this.blogCommentModel
//         .find({ parentId: comment._id, isDeleted: false })
//         .sort({ createdAt: 1 })
//         .populate("authorId", "name avatar")
//         .exec()
//       ;(comment as any).replies = replies
//     }

//     return {
//       comments,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     }
//   }

//   async bookmarkBlog(blogId: string, userId: string, bookmarkDto: BookmarkBlogDto): Promise<BlogBookmark> {
//     await this.findOne(blogId) // Ensure blog exists

//     const existingBookmark = await this.blogBookmarkModel.findOne({ blogId, userId })

//     if (existingBookmark) {
//       // Update existing bookmark
//       Object.assign(existingBookmark, bookmarkDto)
//       await existingBookmark.save()
//       return existingBookmark
//     } else {
//       // Create new bookmark
//       const bookmark = new this.blogBookmarkModel({
//         blogId,
//         userId,
//         ...bookmarkDto,
//       })
//       await bookmark.save()

//       // Update bookmark count
//       const bookmarkCount = await this.blogBookmarkModel.countDocuments({ blogId })
//       await this.blogAnalyticsService.updateBookmarkCount(blogId, bookmarkCount)

//       return bookmark
//     }
//   }

//   async removeBookmark(blogId: string, userId: string): Promise<void> {
//     const result = await this.blogBookmarkModel.deleteOne({ blogId, userId })

//     if (result.deletedCount === 0) {
//       throw new NotFoundException("Bookmark not found")
//     }

//     // Update bookmark count
//     const bookmarkCount = await this.blogBookmarkModel.countDocuments({ blogId })
//     await this.blogAnalyticsService.updateBookmarkCount(blogId, bookmarkCount)
//   }

//   async getUserBookmarks(
//     userId: string,
//     page = 1,
//     limit = 10,
//   ): Promise<{
//     bookmarks: any[]
//     total: number
//     page: number
//     totalPages: number
//   }> {
//     const skip = (page - 1) * limit

//     const [bookmarks, total] = await Promise.all([
//       this.blogBookmarkModel
//         .find({ userId })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .populate({
//           path: "blogId",
//           select: "title slug excerpt featuredImage publishedAt authorId analytics.estimatedReadTime",
//           populate: {
//             path: "authorId",
//             select: "name avatar",
//           },
//         })
//         .exec(),
//       this.blogBookmarkModel.countDocuments({ userId }),
//     ])

//     return {
//       bookmarks,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     }
//   }

//   private async generateUniqueSlug(title: string): Promise<string> {
//     const baseSlug = slugify(title, { lower: true })
//     let slug = baseSlug
//     let counter = 1

//     while (await this.blogModel.findOne({ slug, isDeleted: false })) {
//       slug = `${baseSlug}-${counter}`
//       counter++
//     }

//     return slug
//   }

//   async getRelatedBlogs(blogId: string, limit = 5): Promise<Blog[]> {
//     const blog = await this.findOne(blogId)

//     return this.blogModel
//       .find({
//         _id: { $ne: blogId },
//         status: BlogStatus.PUBLISHED,
//         isDeleted: false,
//         $or: [{ tags: { $in: blog.tags || [] } }, { category: blog.category }, { authorId: blog.authorId }],
//       })
//       .sort({ "analytics.viewCount": -1 })
//       .limit(limit)
//       .populate("authorId", "name avatar")
//       .exec()
//   }
// }



import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import { Blog, BlogDocument } from "./schemas/blog.schema"
import { BlogClap, BlogClapDocument } from "./schemas/blog-clap.schema"
import { BlogComment, BlogCommentDocument } from "./schemas/blog-comment.schema"
import { BlogBookmark, BlogBookmarkDocument } from "./schemas/blog-bookmark.schema"
import { Series, SeriesDocument } from "./schemas/series.schema"
import { CreateBlogDto } from "./dto/create-blog.dto"
import { UpdateBlogDto } from "./dto/update-blog.dto"
import { ClapBlogDto } from "./dto/clap-blog.dto"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { BookmarkBlogDto } from "./dto/bookmark-blog.dto"
import { BlogStatus } from "../common/enums"
import { ContentProcessorService } from "./services/content-processor.service"
import { BlogAnalyticsService } from "./services/blog-analytics.service"
import slugify from "slugify"

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(BlogClap.name) private readonly blogClapModel: Model<BlogClapDocument>,
    @InjectModel(BlogComment.name) private readonly blogCommentModel: Model<BlogCommentDocument>,
    @InjectModel(BlogBookmark.name) private readonly blogBookmarkModel: Model<BlogBookmarkDocument>,
    @InjectModel(Series.name) private readonly seriesModel: Model<SeriesDocument>,
    private readonly contentProcessorService: ContentProcessorService,
    private readonly blogAnalyticsService: BlogAnalyticsService,
  ) {}

  async create(createBlogDto: CreateBlogDto, authorId: string): Promise<Blog> {
    const slug = await this.generateUniqueSlug(createBlogDto.title)

    // Calculate reading time
    const estimatedReadTime = this.contentProcessorService.calculateReadingTime(
      createBlogDto.content,
      createBlogDto.contentBlocks,
    )

    // Generate excerpt if not provided
    const excerpt = createBlogDto.excerpt || this.contentProcessorService.generateExcerpt(createBlogDto.content)

    // Generate table of contents
    const tableOfContents = this.contentProcessorService.generateTableOfContents(createBlogDto.contentBlocks)

    const blog = new this.blogModel({
      ...createBlogDto,
      slug,
      excerpt,
      authorId,
      tableOfContents,
      status: BlogStatus.DRAFT,
      analytics: {
        estimatedReadTime,
        viewCount: 0,
        uniqueViewCount: 0,
        readCount: 0,
        clapCount: 0,
        shareCount: 0,
        bookmarkCount: 0,
        commentCount: 0,
      },
      version: 1,
    })

    return blog.save()
  }

  async findAll(
    status?: BlogStatus,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
    tags?: string[],
    category?: string,
    authorId?: string,
  ): Promise<{ blogs: Blog[]; total: number; page: number; totalPages: number }> {
    const filter: any = { isDeleted: false }

    if (status) filter.status = status
    if (tags && tags.length > 0) filter.tags = { $in: tags }
    if (category) filter.category = category
    if (authorId) filter.authorId = authorId

    const skip = (page - 1) * limit
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

    const [blogs, total] = await Promise.all([
      this.blogModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate("authorId", "name email avatar")
        .populate("seriesId", "title slug")
        .exec(),
      this.blogModel.countDocuments(filter),
    ])

    return {
      blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findPublished(
    page = 1,
    limit = 10,
    featured?: boolean,
  ): Promise<{ blogs: Blog[]; total: number; page: number; totalPages: number }> {
    const filter: any = {
      status: BlogStatus.PUBLISHED,
      isDeleted: false,
    }

    if (featured !== undefined) {
      filter["settings.isFeatured"] = featured
    }

    return this.findAll(BlogStatus.PUBLISHED, page, limit, "publishedAt", "desc")
  }

  async findOne(id: string, userId?: string): Promise<Blog> {
    const blog = await this.blogModel
      .findOne({
        $or: [{ _id: id }, { slug: id }],
        isDeleted: false,
      })
      .populate("authorId", "name email avatar bio")
      .populate("coAuthors", "name email avatar")
      .populate("seriesId", "title slug description")
      .exec()

    if (!blog) {
      throw new NotFoundException("Blog not found")
    }

    // Increment view count (you might want to implement IP-based unique tracking)
    if (userId !== blog.authorId.toString()) {
      await this.blogAnalyticsService.incrementViewCount(blog._id.toString(), true)
    }

    return blog
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    if (updateBlogDto.title) {
      updateBlogDto.slug = await this.generateUniqueSlug(updateBlogDto.title)
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

  async clapBlog(blogId: string, userId: string, clapDto: ClapBlogDto): Promise<{ totalClaps: number }> {
    const blog = await this.findOne(blogId)

    if (!blog.settings.allowClaps) {
      throw new BadRequestException("Claps are not allowed for this blog")
    }

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
      { $match: { blogId: blog._id } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ])

    const clapCount = totalClaps[0]?.total || 0
    await this.blogAnalyticsService.updateClapCount(blogId, clapCount)

    return { totalClaps: clapCount }
  }

  async addComment(blogId: string, userId: string, commentDto: CreateCommentDto): Promise<BlogComment> {
    const blog = await this.findOne(blogId)

    if (!blog.settings.allowComments) {
      throw new BadRequestException("Comments are not allowed for this blog")
    }

    const comment = new this.blogCommentModel({
      blogId,
      authorId: userId,
      ...commentDto,
    })

    await comment.save()

    // Update comment count
    const commentCount = await this.blogCommentModel.countDocuments({ blogId, isDeleted: false })
    await this.blogAnalyticsService.updateCommentCount(blogId, commentCount)

    return comment.populate("authorId", "name avatar")
  }

  async getComments(
    blogId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    comments: BlogComment[]
    total: number
    page: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      this.blogCommentModel
        .find({ blogId, isDeleted: false, parentId: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("authorId", "name avatar")
        .exec(),
      this.blogCommentModel.countDocuments({ blogId, isDeleted: false, parentId: null }),
    ])

    // Get replies for each comment
    for (const comment of comments) {
      const replies = await this.blogCommentModel
        .find({ parentId: comment._id, isDeleted: false })
        .sort({ createdAt: 1 })
        .populate("authorId", "name avatar")
        .exec()
      ;(comment as any).replies = replies
    }

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async bookmarkBlog(blogId: string, userId: string, bookmarkDto: BookmarkBlogDto): Promise<BlogBookmark> {
    await this.findOne(blogId) // Ensure blog exists

    const existingBookmark = await this.blogBookmarkModel.findOne({ blogId, userId })

    if (existingBookmark) {
      // Update existing bookmark
      Object.assign(existingBookmark, bookmarkDto)
      await existingBookmark.save()
      return existingBookmark
    } else {
      // Create new bookmark
      const bookmark = new this.blogBookmarkModel({
        blogId,
        userId,
        ...bookmarkDto,
      })
      await bookmark.save()

      // Update bookmark count
      const bookmarkCount = await this.blogBookmarkModel.countDocuments({ blogId })
      await this.blogAnalyticsService.updateBookmarkCount(blogId, bookmarkCount)

      return bookmark
    }
  }

  async removeBookmark(blogId: string, userId: string): Promise<void> {
    const result = await this.blogBookmarkModel.deleteOne({ blogId, userId })

    if (result.deletedCount === 0) {
      throw new NotFoundException("Bookmark not found")
    }

    // Update bookmark count
    const bookmarkCount = await this.blogBookmarkModel.countDocuments({ blogId })
    await this.blogAnalyticsService.updateBookmarkCount(blogId, bookmarkCount)
  }

  async getUserBookmarks(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{
    bookmarks: any[]
    total: number
    page: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const [bookmarks, total] = await Promise.all([
      this.blogBookmarkModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "blogId",
          select: "title slug excerpt featuredImage publishedAt authorId analytics.estimatedReadTime",
          populate: {
            path: "authorId",
            select: "name avatar",
          },
        })
        .exec(),
      this.blogBookmarkModel.countDocuments({ userId }),
    ])

    return {
      bookmarks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = slugify(title, { lower: true })
    let slug = baseSlug
    let counter = 1

    while (await this.blogModel.findOne({ slug, isDeleted: false })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }

  async getRelatedBlogs(blogId: string, limit = 5): Promise<Blog[]> {
    const blog = await this.findOne(blogId)

    return this.blogModel
      .find({
        _id: { $ne: blogId },
        status: BlogStatus.PUBLISHED,
        isDeleted: false,
        $or: [{ tags: { $in: blog.tags || [] } }, { category: blog.category }, { authorId: blog.authorId }],
      })
      .sort({ "analytics.viewCount": -1 })
      .limit(limit)
      .populate("authorId", "name avatar")
      .exec()
  }
}