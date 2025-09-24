import { Controller, Get, Post, Patch, Param, Delete, UseGuards, UseInterceptors } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { PaymentService } from "./payment.service"
import { CreatePaymentDto } from "./dto/create-payment.dto"
import { UpdatePaymentDto } from "./dto/update-payment.dto"
import { PaymentQueryDto } from "./dto/payment-query.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../auth/schemas/user.schema"
import { AuditInterceptor } from "../audit/interceptors/audit.interceptor"
import { Audit } from "../audit/decorators/audit.decorator"
import { AuditAction, AuditEntity } from "../audit/schemas/audit-log.schema"

@ApiTags("Payments")
@Controller("payments")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.CREATE, entity: AuditEntity.PAYMENT })
  @ApiOperation({ summary: "Create a new payment" })
  @ApiResponse({ status: 201, description: "Payment created successfully" })
  create(createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get all payments" })
  @ApiResponse({ status: 200, description: "Payments retrieved successfully" })
  findAll(query: PaymentQueryDto) {
    return this.paymentService.findAllWithQuery(query)
  }

  @Get("stats")
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get payment statistics" })
  @ApiResponse({ status: 200, description: "Payment statistics retrieved successfully" })
  getStats() {
    return this.paymentService.getPaymentStats()
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.PAYMENT })
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id)
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.PAYMENT })
  @ApiOperation({ summary: "Update payment" })
  @ApiResponse({ status: 200, description: "Payment updated successfully" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  update(@Param('id') id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto)
  }

  @Patch(":id/status")
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.PAYMENT })
  @ApiOperation({ summary: "Update payment status" })
  @ApiResponse({ status: 200, description: "Payment status updated successfully" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  updateStatus(@Param('id') id: string, body: { status: string; transactionId?: string }) {
    return this.paymentService.updateStatus(id, body.status, body.transactionId)
  }

  @Post(":id/refund")
  @Roles(UserRole.ADMIN)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.PAYMENT })
  @ApiOperation({ summary: "Process payment refund" })
  @ApiResponse({ status: 200, description: "Refund processed successfully" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  processRefund(@Param('id') id: string, body: { refundAmount: number; refundReason: string }) {
    return this.paymentService.processRefund(id, body.refundAmount, body.refundReason)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @Audit({ action: AuditAction.DELETE, entity: AuditEntity.PAYMENT })
  @ApiOperation({ summary: 'Delete payment' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id)
  }
}
