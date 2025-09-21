import { Controller, Get, Post, Patch, Param, Delete } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { MembershipService } from "./membership.service"
import type { CreateMembershipDto, PurchaseMembershipDto } from "./dto/create-membership.dto"

@ApiTags("memberships")
@Controller("memberships")
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post()
  @ApiOperation({ summary: "Create a new membership plan" })
  @ApiResponse({ status: 201, description: "Membership created successfully" })
  create(createMembershipDto: CreateMembershipDto) {
    return this.membershipService.create(createMembershipDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all membership plans" })
  findAll() {
    return this.membershipService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get membership plan by ID' })
  findOne(@Param('id') id: string) {
    return this.membershipService.findOne(id);
  }

  @Post("purchase")
  @ApiOperation({ summary: "Purchase membership for client" })
  purchaseMembership(purchaseDto: PurchaseMembershipDto) {
    return this.membershipService.purchaseMembership(purchaseDto)
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get client memberships' })
  getClientMemberships(@Param('clientId') clientId: string) {
    return this.membershipService.getClientMemberships(clientId);
  }

  @Get('client/:clientId/active')
  @ApiOperation({ summary: 'Get active membership for client' })
  getActiveMembership(@Param('clientId') clientId: string) {
    return this.membershipService.getActiveMembership(clientId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update membership plan" })
  update(@Param('id') id: string, updateData: Partial<CreateMembershipDto>) {
    return this.membershipService.update(id, updateData)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete membership plan' })
  remove(@Param('id') id: string) {
    return this.membershipService.remove(id);
  }
}
