import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Body } from "@nestjs/common"
import { UsersService } from "./users.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../common/decorators/roles.decorator"
import { UserRole, AuditAction } from "../common/enums"
import { Audit } from "../common/decorators/audit.decorator"
import { User } from "../common/decorators/user.decorator"

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    // Public signup endpoint
    @Post("signup")
    // @UseGuards(JwtAuthGuard, RolesGuard)
    @Audit(AuditAction.CREATE, "user")
    signup(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }
  

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Audit(AuditAction.CREATE, "user")
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto, 'create user DTO')
    return this.usersService.create(createUserDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Audit(AuditAction.UPDATE, "user")
  update(@Param('id') id: string, updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(":id/soft")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Audit(AuditAction.SOFT_DELETE, "user")
  softDelete(@Param('id') id: string, @User() user: any) {
    return this.usersService.softDelete(id, user.id)
  }

  @Delete(':id/hard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Audit(AuditAction.DELETE, 'user')
  hardDelete(@Param('id') id: string) {
    return this.usersService.hardDelete(id);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Audit(AuditAction.RESTORE, 'user')
  restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }
}
