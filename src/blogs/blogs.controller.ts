import { Controller, Get, Body, Post, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { BlogsService } from "./blogs.service"
import { CreateBlogDto } from "./dto/create-blog.dto"
import { UpdateBlogDto } from "./dto/update-blog.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../common/decorators/roles.decorator"
import { UserRole, AuditAction, type BlogStatus } from "../common/enums"
import { Audit } from "../common/decorators/audit.decorator"
import { User } from "../common/decorators/user.decorator"

@Controller("blogs")
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Audit(AuditAction.CREATE, "blog")
  create(@Body() createBlogDto: CreateBlogDto, @User() user: any) {
    return this.blogsService.create(createBlogDto, user.id)
  }

  @Get()
  findAll(@Query('status') status?: BlogStatus) {
    return this.blogsService.findAll(status)
  }

  @Get("published")
  findPublished() {
    return this.blogsService.findPublished()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Audit(AuditAction.UPDATE, "blog")
  update(@Param('id') id: string, updateBlogDto: UpdateBlogDto) {
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
