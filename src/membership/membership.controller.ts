import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { MembershipService } from "./membership.service"
import type { CreateMembershipDto } from "./dto/create-membership.dto"
import type { UpdateMembershipDto } from "./dto/update-membership.dto"
import type { CreateClientMembershipDto } from "./dto/create-client-membership.dto"
import type { MembershipQueryDto } from "./dto/membership-query.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../auth/schemas/user.schema"
import { AuditInterceptor } from "../audit/interceptors/audit.interceptor"
import { Audit } from "../audit/decorators/audit.decorator"
import { AuditAction, AuditEntity } from "../audit/schemas/audit-log.schema"

@ApiTags("Memberships")
@Controller("memberships")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  // Membership Program Management
  @Post()
  @Roles(UserRole.ADMIN)
  @Audit({ action: AuditAction.CREATE, entity: AuditEntity.MEMBERSHIP })
  @ApiOperation({ summary: 'Create a new membership program' })
  @ApiResponse({ status: 201, description: 'Membership program created successfully' })
  createMembership(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipService.createMembership(createMembershipDto)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all membership programs' })
  @ApiResponse({ status: 200, description: 'Membership programs retrieved successfully' })
  findAllMemberships(@Query() query: MembershipQueryDto) {
    return this.membershipService.findAllMemberships(query)
  }

  @Get("stats")
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get membership statistics" })
  @ApiResponse({ status: 200, description: "Membership statistics retrieved successfully" })
  getStats() {
    return this.membershipService.getMembershipStats()
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.MEMBERSHIP })
  @ApiOperation({ summary: 'Get membership program by ID' })
  @ApiResponse({ status: 200, description: 'Membership program retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Membership program not found' })
  findMembershipById(@Param('id') id: string) {
    return this.membershipService.findMembershipById(id)
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.MEMBERSHIP })
  @ApiOperation({ summary: "Update membership program" })
  @ApiResponse({ status: 200, description: "Membership program updated successfully" })
  @ApiResponse({ status: 404, description: "Membership program not found" })
  updateMembership(@Param('id') id: string, @Body() updateMembershipDto: UpdateMembershipDto) {
    return this.membershipService.updateMembership(id, updateMembershipDto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @Audit({ action: AuditAction.DELETE, entity: AuditEntity.MEMBERSHIP })
  @ApiOperation({ summary: 'Delete membership program' })
  @ApiResponse({ status: 200, description: 'Membership program deleted successfully' })
  @ApiResponse({ status: 404, description: 'Membership program not found' })
  removeMembership(@Param('id') id: string) {
    return this.membershipService.removeMembership(id)
  }

  // Client Membership Management
  @Post('enroll')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.CREATE, entity: AuditEntity.CLIENT_MEMBERSHIP })
  @ApiOperation({ summary: 'Enroll client in membership program' })
  @ApiResponse({ status: 201, description: 'Client enrolled successfully' })
  enrollClient(@Body() createClientMembershipDto: CreateClientMembershipDto) {
    return this.membershipService.enrollClient(createClientMembershipDto)
  }

  @Get('client/:clientId')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get client memberships' })
  @ApiResponse({ status: 200, description: 'Client memberships retrieved successfully' })
  findClientMemberships(@Param('clientId') clientId: string) {
    return this.membershipService.findClientMemberships(clientId)
  }

  @Get('client/:clientId/benefits')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get client membership benefits' })
  @ApiResponse({ status: 200, description: 'Client benefits retrieved successfully' })
  getClientBenefits(@Param('clientId') clientId: string) {
    return this.membershipService.getClientMembershipBenefits(clientId)
  }

  @Post("client-membership/:id/points/add")
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.CLIENT_MEMBERSHIP })
  @ApiOperation({ summary: "Add points to client membership" })
  @ApiResponse({ status: 200, description: "Points added successfully" })
  addPoints(@Param('id') id: string, @Body() body: { points: number; description: string; saleId?: string }) {
    return this.membershipService.addPoints(id, body.points, body.description, body.saleId)
  }

  @Post("client-membership/:id/points/redeem")
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.CLIENT_MEMBERSHIP })
  @ApiOperation({ summary: "Redeem points from client membership" })
  @ApiResponse({ status: 200, description: "Points redeemed successfully" })
  redeemPoints(@Param('id') id: string, @Body() body: { points: number; description: string }) {
    return this.membershipService.redeemPoints(id, body.points, body.description)
  }

  @Post("client-membership/:id/spending")
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.CLIENT_MEMBERSHIP })
  @ApiOperation({ summary: "Update client spending" })
  @ApiResponse({ status: 200, description: "Spending updated successfully" })
  updateSpending(@Param('id') id: string, @Body() body: { amount: number }) {
    return this.membershipService.updateSpending(id, body.amount)
  }
}
