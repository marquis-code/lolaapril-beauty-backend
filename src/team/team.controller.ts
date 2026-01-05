import { Controller, Query, Body,  Get, Post, Patch, Delete, UseGuards, UseInterceptors } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { TeamService } from "./team.service"
import { CreateTeamMemberDto } from "./dto/create-team-member.dto"
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto"
import { TeamMemberQueryDto } from "./dto/team-member-query.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../auth/schemas/user.schema"
import { AuditInterceptor } from "../audit/interceptors/audit.interceptor"
import { Audit } from "../audit/decorators/audit.decorator"
import { AuditAction, AuditEntity } from "../audit/schemas/audit-log.schema"

@ApiTags("Team Management")
@Controller("team")

@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @Audit({ action: AuditAction.CREATE, entity: AuditEntity.TEAM_MEMBER })
  @ApiOperation({ summary: "Create a new team member" })
  @ApiResponse({ status: 201, description: "Team member created successfully" })
  @ApiResponse({ status: 409, description: "Team member with email already exists" })
  create(@Body() createTeamMemberDto: CreateTeamMemberDto) {
    return this.teamService.create(createTeamMemberDto)
  }

  @Get()
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get all team members" })
  @ApiResponse({ status: 200, description: "Team members retrieved successfully" })
  findAll(@Query() query: TeamMemberQueryDto) {
    return this.teamService.findAll(query)
  }

  @Get("stats")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get team statistics" })
  @ApiResponse({ status: 200, description: "Team statistics retrieved successfully" })
  getStats() {
    return this.teamService.getTeamStats()
  }

  @Get("role/:role")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get team members by role" })
  @ApiResponse({ status: 200, description: "Team members retrieved successfully" })
  findByRole(role: string) {
    return this.teamService.findByRole(role)
  }

  @Get("department/:department")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get team members by department" })
  @ApiResponse({ status: 200, description: "Team members retrieved successfully" })
  findByDepartment(department: string) {
    return this.teamService.findByDepartment(department)
  }

  @Get(":id")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.TEAM_MEMBER })
  @ApiOperation({ summary: "Get team member by ID" })
  @ApiResponse({ status: 200, description: "Team member retrieved successfully" })
  @ApiResponse({ status: 404, description: "Team member not found" })
  findOne(id: string) {
    return this.teamService.findOne(id)
  }

  @Patch(":id")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.TEAM_MEMBER })
  @ApiOperation({ summary: "Update team member" })
  @ApiResponse({ status: 200, description: "Team member updated successfully" })
  @ApiResponse({ status: 404, description: "Team member not found" })
  update(id: string, @Body() updateTeamMemberDto: UpdateTeamMemberDto) {
    return this.teamService.update(id, updateTeamMemberDto)
  }

  @Patch(":id/status")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.TEAM_MEMBER })
  @ApiOperation({ summary: "Update team member status" })
  @ApiResponse({ status: 200, description: "Team member status updated successfully" })
  @ApiResponse({ status: 404, description: "Team member not found" })
  updateStatus(id: string, status: string) {
    return this.teamService.updateStatus(id, status)
  }

  @Delete(":id")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @Audit({ action: AuditAction.DELETE, entity: AuditEntity.TEAM_MEMBER })
  @ApiOperation({ summary: "Delete team member" })
  @ApiResponse({ status: 200, description: "Team member deleted successfully" })
  @ApiResponse({ status: 404, description: "Team member not found" })
  remove(id: string) {
    return this.teamService.remove(id)
  }
}
