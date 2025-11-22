import { Controller, Query, Body, Get, Post, Patch, Delete, UseGuards, UseInterceptors } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { SalesService } from "./sales.service"
import { CreateSaleDto } from "./dto/create-sale.dto"
import { UpdateSaleDto } from "./dto/update-sale.dto"
import { SalesQueryDto } from "./dto/sales-query.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../auth/schemas/user.schema"
import { AuditInterceptor } from "../audit/interceptors/audit.interceptor"
import { Audit } from "../audit/decorators/audit.decorator"
import { AuditAction, AuditEntity } from "../audit/schemas/audit-log.schema"

@ApiTags("Sales")
@Controller("sales")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.CREATE, entity: AuditEntity.SALE })
  @ApiOperation({ summary: "Create a new sale" })
  @ApiResponse({ status: 201, description: "Sale created successfully" })
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto)
  }

  @Get()
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get all sales" })
  @ApiResponse({ status: 200, description: "Sales retrieved successfully" })
  findAll(@Query() query: SalesQueryDto) {
    return this.salesService.findAllWithQuery(query)
  }

  @Get("stats")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get sales statistics" })
  @ApiResponse({ status: 200, description: "Sales statistics retrieved successfully" })
  getStats() {
    return this.salesService.getSalesStats()
  }

  @Get("top-services")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get top performing services" })
  @ApiResponse({ status: 200, description: "Top services retrieved successfully" })
  getTopServices() {
    return this.salesService.getTopServices()
  }

  @Get("revenue-by-period")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get revenue by time period" })
  @ApiResponse({ status: 200, description: "Revenue data retrieved successfully" })
  getRevenueByPeriod(period: "daily" | "weekly" | "monthly" = "daily") {
    return this.salesService.getRevenueByPeriod(period)
  }

  @Get(":id")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.SALE })
  @ApiOperation({ summary: "Get sale by ID" })
  @ApiResponse({ status: 200, description: "Sale retrieved successfully" })
  @ApiResponse({ status: 404, description: "Sale not found" })
  findOne(id: string) {
    return this.salesService.findOne(id)
  }

  @Patch(":id")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.SALE })
  @ApiOperation({ summary: "Update sale" })
  @ApiResponse({ status: 200, description: "Sale updated successfully" })
  @ApiResponse({ status: 404, description: "Sale not found" })
  update(id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto)
  }

  @Patch(":id/complete")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.SALE })
  @ApiOperation({ summary: "Complete sale" })
  @ApiResponse({ status: 200, description: "Sale completed successfully" })
  @ApiResponse({ status: 404, description: "Sale not found" })
  completeSale(id: string, body: { completedBy: string }) {
    return this.salesService.completeSale(id, body.completedBy)
  }

  @Patch(":id/status")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.SALE })
  @ApiOperation({ summary: "Update sale status" })
  @ApiResponse({ status: 200, description: "Sale status updated successfully" })
  @ApiResponse({ status: 404, description: "Sale not found" })
  updateStatus(id: string, body: { status: string }) {
    return this.salesService.updateStatus(id, body.status)
  }

  @Patch(":id/payment-status")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.SALE })
  @ApiOperation({ summary: "Update sale payment status" })
  @ApiResponse({ status: 200, description: "Payment status updated successfully" })
  @ApiResponse({ status: 404, description: "Sale not found" })
  updatePaymentStatus(id: string, body: { paymentStatus: string; amountPaid?: number }) {
    return this.salesService.updatePaymentStatus(id, body.paymentStatus, body.amountPaid)
  }

  @Delete(":id")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @Audit({ action: AuditAction.DELETE, entity: AuditEntity.SALE })
  @ApiOperation({ summary: "Delete sale" })
  @ApiResponse({ status: 200, description: "Sale deleted successfully" })
  @ApiResponse({ status: 404, description: "Sale not found" })
  remove(id: string) {
    return this.salesService.remove(id)
  }
}
