import { Controller, Body, Get, Post, Patch, Param, Delete } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { SettingsService } from "./settings.service"
import { CreateBusinessSettingsDto } from "./dto/create-business-settings.dto"
import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../auth/schemas/user.schema"
import { AuditInterceptor } from "../audit/interceptors/audit.interceptor"
import { Audit } from "../audit/decorators/audit.decorator"
import { AuditAction, AuditEntity } from "../audit/schemas/audit-log.schema"
import { ValidateBusiness, BusinessId } from "../auth"

@ApiTags("Settings Management")
@Controller("settings")
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // ==================== GET SPECIFIC SETTINGS (MUST BE BEFORE PARAMETERIZED ROUTES) ====================
  
  @Get("business-hours")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: "Get business hours for current business" })
  @ApiResponse({ status: 200, description: "Business hours retrieved successfully" })
  getBusinessHours(@BusinessId() businessId: string) {
    return this.settingsService.getBusinessHours(businessId)
  }

  @Get("appointment-settings")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: "Get appointment settings for current business" })
  @ApiResponse({ status: 200, description: "Appointment settings retrieved successfully" })
  getAppointmentSettings(@BusinessId() businessId: string) {
    return this.settingsService.getAppointmentSettings(businessId)
  }

  @Get("payment-settings")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER)
  @ApiOperation({ summary: "Get payment settings for current business" })
  @ApiResponse({ status: 200, description: "Payment settings retrieved successfully" })
  getPaymentSettings(@BusinessId() businessId: string) {
    return this.settingsService.getPaymentSettings(businessId)
  }

  @Get("notification-settings")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: "Get notification settings for current business" })
  @ApiResponse({ status: 200, description: "Notification settings retrieved successfully" })
  getNotificationSettings(@BusinessId() businessId: string) {
    return this.settingsService.getNotificationSettings(businessId)
  }

  // ==================== CREATE SETTINGS ====================
  
  @Post()
  @ValidateBusiness() // ✅ Validate business access
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER)
  @Audit({ action: AuditAction.CREATE, entity: AuditEntity.SETTINGS })
  @ApiOperation({ summary: "Create settings for current business" })
  @ApiResponse({ status: 201, description: "Settings created successfully" })
  @ApiResponse({ status: 409, description: "Settings already exist for this business" })
  create(
    @BusinessId() businessId: string,
    @Body() createSettingsDto: CreateBusinessSettingsDto
  ) {
    return this.settingsService.create(businessId, createSettingsDto)
  }

  // ==================== GET SETTINGS ====================
  
  @Get()
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: "Get settings for current business" })
  @ApiResponse({ status: 200, description: "Settings retrieved successfully" })
  findAll(@BusinessId() businessId: string) {
    return this.settingsService.findOrCreateDefault(businessId)
  }

  // ==================== UPDATE SETTINGS ====================
  
  @Patch()
  @ValidateBusiness() // ✅ Validate business access
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.SETTINGS })
  @ApiOperation({ summary: "Update settings for current business" })
  @ApiResponse({ status: 200, description: "Settings updated successfully" })
  @ApiResponse({ status: 404, description: "Settings not found" })
  update(
    @BusinessId() businessId: string,
    @Body() updateSettingsDto: UpdateBusinessSettingsDto
  ) {
    return this.settingsService.update(businessId, updateSettingsDto)
  }

  @Patch("business-hours")
  @ValidateBusiness()
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.SETTINGS })
  @ApiOperation({ summary: "Update business hours for current business" })
  @ApiResponse({ status: 200, description: "Business hours updated successfully" })
  updateBusinessHours(
    @BusinessId() businessId: string,
    @Body() businessHours: any
  ) {
    return this.settingsService.updateBusinessHours(businessId, businessHours)
  }

  @Patch("appointment-settings")
  @ValidateBusiness()
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.SETTINGS })
  @ApiOperation({ summary: "Update appointment settings for current business" })
  @ApiResponse({ status: 200, description: "Appointment settings updated successfully" })
  updateAppointmentSettings(
    @BusinessId() businessId: string,
    @Body() appointmentSettings: any
  ) {
    return this.settingsService.updateAppointmentSettings(businessId, appointmentSettings)
  }

  // ==================== DELETE SETTINGS ====================
  
  @Delete()
  @ValidateBusiness()
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER)
  @Audit({ action: AuditAction.DELETE, entity: AuditEntity.SETTINGS })
  @ApiOperation({ summary: "Delete settings for current business" })
  @ApiResponse({ status: 200, description: "Settings deleted successfully" })
  @ApiResponse({ status: 404, description: "Settings not found" })
  remove(@BusinessId() businessId: string) {
    return this.settingsService.remove(businessId)
  }

  // ==================== LEGACY/PARAMETERIZED ENDPOINTS (MUST BE LAST) ====================
  
  @Get('type/:type')
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER, UserRole.STAFF)
  @ApiOperation({ summary: 'Get settings by type (legacy)' })
  @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
  findByType(@Param('type') type: string) {
    return this.settingsService.findByType(type)
  }

  @Get(':id')
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER, UserRole.STAFF)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.SETTINGS })
  @ApiOperation({ summary: 'Get settings by ID (legacy)' })
  @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Settings not found' })
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(id)
  }
}