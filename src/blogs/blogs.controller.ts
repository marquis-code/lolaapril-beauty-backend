// import { Controller, Get, Body, Post, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
// import { BlogsService } from "./blogs.service"
// import { CreateBlogDto } from "./dto/create-blog.dto"
// import { UpdateBlogDto } from "./dto/update-blog.dto"
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
// import { RolesGuard } from "../auth/guards/roles.guard"
// import { Roles } from "../common/decorators/roles.decorator"
// import { UserRole, AuditAction, type BlogStatus } from "../common/enums"
// import { Audit } from "../common/decorators/audit.decorator"
// import { User } from "../common/decorators/user.decorator"

// @Controller("blogs")
// export class BlogsController {
//   constructor(private readonly blogsService: BlogsService) {}

//   @Post()
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
//   @Audit(AuditAction.CREATE, "blog")
//   create(@Body() createBlogDto: CreateBlogDto, @User() user: any) {
//     return this.blogsService.create(createBlogDto, user.id)
//   }

//   @Get()
//   findAll(@Query('status') status?: BlogStatus) {
//     return this.blogsService.findAll(status)
//   }

//   @Get("published")
//   findPublished() {
//     return this.blogsService.findPublished()
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.blogsService.findOne(id)
//   }

//   @Patch(":id")
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
//   @Audit(AuditAction.UPDATE, "blog")
//   update(@Param('id') id: string, updateBlogDto: UpdateBlogDto) {
//     return this.blogsService.update(id, updateBlogDto)
//   }

//   @Patch(':id/publish')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
//   @Audit(AuditAction.UPDATE, 'blog')
//   publish(@Param('id') id: string) {
//     return this.blogsService.publish(id)
//   }

//   @Patch(':id/unpublish')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
//   @Audit(AuditAction.UPDATE, 'blog')
//   unpublish(@Param('id') id: string) {
//     return this.blogsService.unpublish(id)
//   }

//   @Delete(":id/soft")
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
//   @Audit(AuditAction.SOFT_DELETE, "blog")
//   softDelete(@Param('id') id: string, @User() user: any) {
//     return this.blogsService.softDelete(id, user.id)
//   }

//   @Delete(':id/hard')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.SUPER_ADMIN)
//   @Audit(AuditAction.DELETE, 'blog')
//   hardDelete(@Param('id') id: string) {
//     return this.blogsService.hardDelete(id)
//   }

//   @Patch(':id/restore')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
//   @Audit(AuditAction.RESTORE, 'blog')
//   restore(@Param('id') id: string) {
//     return this.blogsService.restore(id)
//   }
// }


import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common"
import { BlogsService } from "./blogs.service"
import { CreateBlogDto } from "./dto/create-blog.dto"
import { UpdateBlogDto } from "./dto/update-blog.dto"
import { ClapBlogDto } from "./dto/clap-blog.dto"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { BookmarkBlogDto } from "./dto/bookmark-blog.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../common/decorators/roles.decorator"
import { Audit } from "../common/decorators/audit.decorator"
import { User } from "../common/decorators/user.decorator"
import { BlogAnalyticsService } from "./services/blog-analytics.service"
import { UserRole } from "../common/enums"
import { AuditAction } from "../common/enums"
import { BlogStatus } from "../common/enums"

@Controller("blogs")
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogAnalyticsService: BlogAnalyticsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Audit(AuditAction.CREATE, "blog")
  create(@Body() createBlogDto: CreateBlogDto, @User() user: any) {
    return this.blogsService.create(createBlogDto, user.id)
  }

  @Get()
  findAll(
    @Query('status') status?: BlogStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy?: string,
    @Query('sortOrder', new DefaultValuePipe('desc')) sortOrder?: 'asc' | 'desc',
    @Query('tags') tags?: string,
    @Query('category') category?: string,
    @Query('authorId') authorId?: string,
  ) {
    const tagsArray = tags ? tags.split(",") : undefined
    return this.blogsService.findAll(status, page, limit, sortBy, sortOrder, tagsArray, category, authorId)
  }

  @Get("published")
  findPublished(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('featured') featured?: boolean,
  ) {
    return this.blogsService.findPublished(page, limit, featured)
  }

  @Get("popular")
  getPopularBlogs(@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number) {
    return this.blogAnalyticsService.getPopularBlogs(limit)
  }

  @Get("trending")
  getTrendingBlogs(
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.blogAnalyticsService.getTrendingBlogs(days, limit)
  }

  @Get(":id")
  findOne(@Param('id') id: string, @User() user?: any) {
    return this.blogsService.findOne(id, user?.id)
  }

  @Get(":id/related")
  getRelatedBlogs(@Param('id') id: string, @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit?: number) {
    return this.blogsService.getRelatedBlogs(id, limit)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Audit(AuditAction.UPDATE, "blog")
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto)
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.UPDATE, 'blog')
  publish(@Param('id') id: string) {
    return this.blogsService.publish(id)
  }

  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.UPDATE, 'blog')
  unpublish(@Param('id') id: string) {
    return this.blogsService.unpublish(id)
  }

  @Post(":id/clap")
  @UseGuards(JwtAuthGuard)
  clapBlog(@Param('id') id: string, @User() user: any, @Body() clapDto: ClapBlogDto) {
    return this.blogsService.clapBlog(id, user.id, clapDto)
  }

  @Post(":id/comments")
  @UseGuards(JwtAuthGuard)
  addComment(@Param('id') id: string, @User() user: any, @Body() commentDto: CreateCommentDto) {
    return this.blogsService.addComment(id, user.id, commentDto)
  }

  @Get(":id/comments")
  getComments(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.blogsService.getComments(id, page, limit)
  }

  @Post(":id/bookmark")
  @UseGuards(JwtAuthGuard)
  bookmarkBlog(@Param('id') id: string, @User() user: any, @Body() bookmarkDto: BookmarkBlogDto) {
    return this.blogsService.bookmarkBlog(id, user.id, bookmarkDto)
  }

  @Delete(":id/bookmark")
  @UseGuards(JwtAuthGuard)
  removeBookmark(@Param('id') id: string, @User() user: any) {
    return this.blogsService.removeBookmark(id, user.id)
  }

  @Get("user/bookmarks")
  @UseGuards(JwtAuthGuard)
  getUserBookmarks(
    @User() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.blogsService.getUserBookmarks(user.id, page, limit)
  }

  @Post(':id/share')
  incrementShareCount(@Param('id') id: string) {
    return this.blogAnalyticsService.incrementShareCount(id)
  }

  @Post(':id/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(@Param('id') id: string) {
    return this.blogAnalyticsService.incrementReadCount(id)
  }

  @Delete(":id/soft")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.SOFT_DELETE, "blog")
  softDelete(@Param('id') id: string, @User() user: any) {
    return this.blogsService.softDelete(id, user.id)
  }

  @Delete(':id/hard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Audit(AuditAction.DELETE, 'blog')
  hardDelete(@Param('id') id: string) {
    return this.blogsService.hardDelete(id)
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.RESTORE, 'blog')
  restore(@Param('id') id: string) {
    return this.blogsService.restore(id)
  }
}
