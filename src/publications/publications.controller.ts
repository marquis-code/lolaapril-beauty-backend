import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Query, Body } from "@nestjs/common"
import { PublicationsService } from "./publications.service"
import { CreatePublicationDto } from "./dto/create-publication.dto"
import { UpdatePublicationDto } from "./dto/update-publication.dto"
import { ReviewPublicationDto } from "./dto/review-publication.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../common/decorators/roles.decorator"
import { UserRole, AuditAction, type PublicationStatus } from "../common/enums"
import { Audit } from "../common/decorators/audit.decorator"
import { User } from "../common/decorators/user.decorator"

@Controller("publications")
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Audit(AuditAction.CREATE, "publication")
  create(@Body() createPublicationDto: CreatePublicationDto) {
    return this.publicationsService.create(createPublicationDto)
  }

  @Get()
  findAll(@Query('status') status?: PublicationStatus) {
    return this.publicationsService.findAll(status);
  }

  @Get("published")
  findPublished() {
    return this.publicationsService.findPublished()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Audit(AuditAction.UPDATE, "publication")
  update(@Param('id') id: string, updatePublicationDto: UpdatePublicationDto) {
    return this.publicationsService.update(id, updatePublicationDto)
  }

  @Patch(':id/submit-review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Audit(AuditAction.UPDATE, 'publication')
  submitForReview(@Param('id') id: string) {
    return this.publicationsService.submitForReview(id);
  }

  @Patch(":id/approve")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.UPDATE, "publication")
  approve(@Param('id') id: string, @User() user: any) {
    return this.publicationsService.approve(id, user.id)
  }

  @Patch(":id/reject")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.UPDATE, "publication")
  reject(@Param('id') id: string, reviewDto: ReviewPublicationDto, @User() user: any) {
    return this.publicationsService.reject(id, user.id, reviewDto.rejectionReason)
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.UPDATE, 'publication')
  publish(@Param('id') id: string) {
    return this.publicationsService.publish(id);
  }

  @Delete(":id/soft")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.SOFT_DELETE, "publication")
  softDelete(@Param('id') id: string, @User() user: any) {
    return this.publicationsService.softDelete(id, user.id)
  }

  @Delete(":id/hard")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Audit(AuditAction.HARD_DELETE, "publication")
  hardDelete(@Param('id') id: string, @User() user: any) {
    return this.publicationsService.hardDelete(id)
    // return this.publicationsService.hardDelete(id, user.id)
  }
}
