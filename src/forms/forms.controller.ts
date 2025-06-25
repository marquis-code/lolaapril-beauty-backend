import { Controller, Get, Post, Patch, Param, Delete, Body, UseGuards } from "@nestjs/common"
import { FormsService } from "./forms.service"
import { CreateFormDto } from "./dto/create-form.dto"
import { UpdateFormDto } from "./dto/update-form.dto"
import { SubmitFormDto } from "./dto/submit-form.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../common/decorators/roles.decorator"
import { UserRole, AuditAction } from "../common/enums"
import { Audit } from "../common/decorators/audit.decorator"
import { User } from "../common/decorators/user.decorator"

@Controller("forms")
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.CREATE, "form")
  create(@Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  findAll() {
    return this.formsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formsService.findOne(id)
  }

  @Get(':id/submissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  getSubmissions(@Param('id') id: string) {
    return this.formsService.getSubmissions(id)
  }

  @Post(":id/submit")
  @Audit(AuditAction.CREATE, "form_submission")
  submitForm(@Param('id') id: string, submitFormDto: SubmitFormDto) {
    return this.formsService.submitForm(id, submitFormDto)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.UPDATE, "form")
  update(@Param('id') id: string, updateFormDto: UpdateFormDto) {
    return this.formsService.update(id, updateFormDto)
  }

  @Delete(":id/soft")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.SOFT_DELETE, "form")
  softDelete(@Param('id') id: string, @User() user: any) {
    return this.formsService.softDelete(id, user.id)
  }

  @Delete(':id/hard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Audit(AuditAction.DELETE, 'form')
  hardDelete(@Param('id') id: string) {
    return this.formsService.hardDelete(id)
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.RESTORE, 'form')
  restore(@Param('id') id: string) {
    return this.formsService.restore(id)
  }
}
