import { 
  Controller, Query, Body, Get, Post, Patch, Param, Delete, 
  UseGuards, UseInterceptors, Headers, RawBodyRequest, Req 
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger"
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
import { InitializePaymentDto } from "./dto/initialize-payment.dto"
import { Request } from 'express'

@ApiTags("Payments")
@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initialize')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @UseInterceptors(AuditInterceptor)
  @Audit({ action: AuditAction.CREATE, entity: AuditEntity.PAYMENT })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initialize payment with Paystack' })
  @ApiResponse({ status: 201, description: 'Payment initialized successfully' })
  @ApiBody({ type: InitializePaymentDto })
  initializePayment(@Body() initializePaymentDto: InitializePaymentDto) {
    return this.paymentService.initializePayment(initializePaymentDto)
  }

  @Get('verify/:reference')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @UseInterceptors(AuditInterceptor)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.PAYMENT })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify payment with Paystack' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  verifyPayment(@Param('reference') reference: string) {
    return this.paymentService.verifyPayment(reference)
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Paystack webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Req() req: RawBodyRequest<Request>
  ) {
    const payload = req.body
    await this.paymentService.handleWebhook(payload, signature)
    return { message: 'Webhook received' }
  }

  @Post(':reference/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(AuditInterceptor)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.PAYMENT })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate refund via Paystack' })
  @ApiResponse({ status: 200, description: 'Refund initiated successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  initiateRefund(
    @Param('reference') reference: string,
    @Body() body: { amount?: number }
  ) {
    return this.paymentService.initiateRefund(reference, body.amount)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @UseInterceptors(AuditInterceptor)
  @Audit({ action: AuditAction.CREATE, entity: AuditEntity.PAYMENT })
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new payment" })
  @ApiResponse({ status: 201, description: "Payment created successfully" })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all payments" })
  @ApiResponse({ status: 200, description: "Payments retrieved successfully" })
  findAll(@Query() query: PaymentQueryDto) {
    return this.paymentService.findAllWithQuery(query)
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get payment statistics" })
  @ApiResponse({ status: 200, description: "Payment statistics retrieved successfully" })
  getStats() {
    return this.paymentService.getPaymentStats()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @UseInterceptors(AuditInterceptor)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.PAYMENT })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @UseInterceptors(AuditInterceptor)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.PAYMENT })
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update payment" })
  @ApiResponse({ status: 200, description: "Payment updated successfully" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto)
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @UseInterceptors(AuditInterceptor)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.PAYMENT })
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update payment status" })
  @ApiResponse({ status: 200, description: "Payment status updated successfully" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  updateStatus(
    @Param('id') id: string, 
    @Body() body: { status: string; transactionId?: string }
  ) {
    return this.paymentService.updateStatus(id, body.status, body.transactionId)
  }

  @Post(":id/refund")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(AuditInterceptor)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.PAYMENT })
  @ApiBearerAuth()
  @ApiOperation({ summary: "Process payment refund" })
  @ApiResponse({ status: 200, description: "Refund processed successfully" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  processRefund(
    @Param('id') id: string, 
    @Body() body: { refundAmount: number; refundReason: string }
  ) {
    return this.paymentService.processRefund(id, body.refundAmount, body.refundReason)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(AuditInterceptor)
  @Audit({ action: AuditAction.DELETE, entity: AuditEntity.PAYMENT })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete payment' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id)
  }
}