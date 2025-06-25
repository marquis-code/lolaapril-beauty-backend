import { Controller, Get, Post, Patch, Body, Delete, UseGuards, Param } from "@nestjs/common"
import { ProgramsService } from "./programs.service"
import { CreateProgramDto } from "./dto/create-program.dto"
import { UpdateProgramDto } from "./dto/update-program.dto"
import { SubmitApplicationDto } from "./dto/submit-application.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../common/decorators/roles.decorator"
import { Audit } from "../common/decorators/audit.decorator"
import { UserRole, AuditAction, type ProgramStatus } from "../common/enums"

@Controller("programs")
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.CREATE, "program")
  create(@Body() createProgramDto: CreateProgramDto) {
    return this.programsService.create(createProgramDto)
  }

  @Get()
  findAll(status?: ProgramStatus) {
    return this.programsService.findAll(status)
  }

  @Get("active")
  findActive() {
    return this.programsService.findActive()
  }

  @Get(":id")
  findOne(@Param('id') id: string,) {
    return this.programsService.findOne(id)
  }

  @Get(":id/registration-link")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  getRegistrationLink(@Param('id') id: string,) {
    return this.programsService.getRegistrationLink(id)
  }

  @Get(":id/applications")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  getApplications(@Param('id') id: string,) {
    return this.programsService.getApplications(id)
  }

  @Post("apply/:token")
  @Audit(AuditAction.CREATE, "program_application")
  submitApplication(@Param('token') token: string, applicationDto: SubmitApplicationDto) {
    return this.programsService.submitApplication(token, applicationDto)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.UPDATE, "program")
  update(@Param('id') id: string, updateProgramDto: UpdateProgramDto) {
    return this.programsService.update(id, updateProgramDto)
  }

  @Patch(":id/activate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.UPDATE, "program")
  activate(@Param('id') id: string) {
    return this.programsService.activate(id)
  }

  @Patch(":id/deactivate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.UPDATE, "program")
  deactivate(@Param('id') id: string) {
    return this.programsService.deactivate(id)
  }

  @Delete(":id/soft")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.SOFT_DELETE, "program")
  softDelete(@Param('id') id: string, user: any) {
    return this.programsService.softDelete(id, user.id)
  }

  @Delete(":id/hard")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Audit(AuditAction.DELETE, "program")
  hardDelete(@Param('id') id: string) {
    return this.programsService.hardDelete(id)
  }

  @Patch(":id/restore")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.RESTORE, "program")
  restore(@Param('id') id: string) {
    return this.programsService.restore(id)
  }
}
