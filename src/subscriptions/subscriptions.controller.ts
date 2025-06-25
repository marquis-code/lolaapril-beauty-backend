import { Controller, Get, Post, Param, Delete, Patch, UseGuards, Body } from "@nestjs/common"
import { SubscriptionsService } from "./subscriptions.service"
import { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../common/decorators/roles.decorator"
import { UserRole, AuditAction } from "../common/enums"
import { Audit } from "../common/decorators/audit.decorator"
import { User } from "../common/decorators/user.decorator"

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Audit(AuditAction.CREATE, "subscription")
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  findAll() {
    return this.subscriptionsService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch('unsubscribe/:email')
  unsubscribe(@Param('email') email: string) {
    return this.subscriptionsService.unsubscribe(email);
  }

  @Delete(":id/soft")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Audit(AuditAction.SOFT_DELETE, "subscription")
  softDelete(@Param('id') id: string, @User() user: any) {
    return this.subscriptionsService.softDelete(id, user.id)
  }

  @Delete(':id/hard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Audit(AuditAction.DELETE, 'subscription')
  hardDelete(@Param('id') id: string) {
    return this.subscriptionsService.hardDelete(id);
  }
}
