import { Controller, Get, Query, Param, UseGuards } from "@nestjs/common"
import { AuditService } from "./audit.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../common/decorators/roles.decorator"
import { UserRole } from "../common/enums"

@Controller("audit")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(@Query('limit') limit?: number, @Query('skip') skip?: number) {
    return this.auditService.findAll(limit, skip)
  }

  @Get("user/:userId")
  findByUser(@Param('userId') userId: string, @Query('limit') limit?: number) {
    return this.auditService.findByUser(userId, limit)
  }

  @Get("resource/:resource")
  findByResource(@Param('resource') resource: string, @Query('resourceId') resourceId?: string) {
    return this.auditService.findByResource(resource, resourceId)
  }
}
