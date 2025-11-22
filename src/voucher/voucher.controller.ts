import { Controller, Get, Post, Req, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { VoucherService } from "./voucher.service"
import { CreateVoucherDto } from "./dto/create-voucher.dto"
import { UpdateVoucherDto } from "./dto/update-voucher.dto"
import { VoucherQueryDto } from "./dto/voucher-query.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../auth/schemas/user.schema"
import { AuditInterceptor } from "../audit/interceptors/audit.interceptor"
import { Audit } from "../audit/decorators/audit.decorator"
import { AuditAction, AuditEntity } from "../audit/schemas/audit-log.schema"
import { RequestWithUser } from "../auth/types/request-with-user.interface";

@ApiTags("Vouchers")
@Controller("vouchers")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

@Post()
@Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
@Audit({ action: AuditAction.CREATE, entity: AuditEntity.VOUCHER })
@ApiOperation({ summary: "Create a new voucher" })
@ApiResponse({ status: 201, description: "Voucher created successfully" })
create(@Body() createVoucherDto: CreateVoucherDto, @Req() req: RequestWithUser) {
  const userId = req.user.userId;  // <-- comes from your JwtStrategy
  return this.voucherService.create(createVoucherDto, userId);
}

  @Get()
@Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all vouchers' })
  @ApiResponse({ status: 200, description: 'Vouchers retrieved successfully' })
  findAll(@Query() query: VoucherQueryDto) {
    return this.voucherService.findAll(query)
  }

  @Get("stats")
@Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get voucher statistics" })
  @ApiResponse({ status: 200, description: "Voucher statistics retrieved successfully" })
  getStats() {
    return this.voucherService.getVoucherStats()
  }

  @Post('validate')
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @ApiOperation({ summary: 'Validate a voucher' })
  @ApiResponse({ status: 200, description: 'Voucher validation result' })
  validateVoucher(@Body() body: {
    voucherCode: string
    clientId: string
    serviceIds: string[]
    totalAmount: number
  }) {
    return this.voucherService.validateVoucher(
      body.voucherCode,
      body.clientId,
      body.serviceIds,
      body.totalAmount
    )
  }

  @Post(':code/use')
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.VOUCHER })
  @ApiOperation({ summary: 'Use a voucher' })
  @ApiResponse({ status: 200, description: 'Voucher used successfully' })
  useVoucher(@Param('code') voucherCode: string) {
    return this.voucherService.useVoucher(voucherCode)
  }

  @Get('code/:code')
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get voucher by code' })
  @ApiResponse({ status: 200, description: 'Voucher retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  findByCode(@Param('code') voucherCode: string) {
    return this.voucherService.findByCode(voucherCode)
  }

  @Get(':id')
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.VOUCHER })
  @ApiOperation({ summary: 'Get voucher by ID' })
  @ApiResponse({ status: 200, description: 'Voucher retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  findOne(@Param('id') id: string) {
    return this.voucherService.findOne(id)
  }

  @Patch(":id")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.VOUCHER })
  @ApiOperation({ summary: "Update voucher" })
  @ApiResponse({ status: 200, description: "Voucher updated successfully" })
  @ApiResponse({ status: 404, description: "Voucher not found" })
  update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.voucherService.update(id, updateVoucherDto)
  }

  @Delete(':id')
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @Audit({ action: AuditAction.DELETE, entity: AuditEntity.VOUCHER })
  @ApiOperation({ summary: 'Delete voucher' })
  @ApiResponse({ status: 200, description: 'Voucher deleted successfully' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  remove(@Param('id') id: string) {
    return this.voucherService.remove(id)
  }
}
