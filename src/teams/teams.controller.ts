import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Body } from "@nestjs/common"
import { TeamsService } from "./teams.service"
import { CreateTeamMemberDto } from "./dto/create-team-member.dto"
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../common/decorators/roles.decorator"
import { UserRole, AuditAction } from "../common/enums"
import { Audit } from "../common/decorators/audit.decorator"
import { User } from "../common/decorators/user.decorator"

@Controller("teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.CREATE, "team_member")
  create(@Body() createTeamMemberDto: CreateTeamMemberDto) {
    return this.teamsService.create(createTeamMemberDto)
  }

  @Get()
  findAll() {
    return this.teamsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.UPDATE, "team_member")
  update(@Param('id') id: string, updateTeamMemberDto: UpdateTeamMemberDto) {
    return this.teamsService.update(id, updateTeamMemberDto)
  }

  @Delete(":id/soft")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.SOFT_DELETE, "team_member")
  softDelete(@Param('id') id: string, @User() user: any) {
    return this.teamsService.softDelete(id, user.id)
  }

  @Delete(':id/hard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Audit(AuditAction.DELETE, 'team_member')
  hardDelete(@Param('id') id: string) {
    return this.teamsService.hardDelete(id);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.RESTORE, 'team_member')
  restore(@Param('id') id: string) {
    return this.teamsService.restore(id);
  }
}
