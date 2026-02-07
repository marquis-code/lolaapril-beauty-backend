import { Controller, Query, Body, Get, Post, Patch, Delete, UseGuards, UseInterceptors, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { AppointmentService } from "./appointment.service"
import { BusinessId } from "../auth/decorators/business-context.decorator"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"
import { UpdateAppointmentDto } from "./dto/update-appointment.dto"
import { AppointmentQueryDto } from "./dto/appointment-query.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../auth/schemas/user.schema"
import { AuditInterceptor } from "../audit/interceptors/audit.interceptor"
import { Audit } from "../audit/decorators/audit.decorator"
import { AuditAction, AuditEntity } from "../audit/schemas/audit-log.schema"

@ApiTags("Appointments")
@Controller("appointments")
// 
// @UseInterceptors(AuditInterceptor)
// @ApiBearerAuth()
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @Audit({ action: AuditAction.CREATE, entity: AuditEntity.APPOINTMENT })
  @ApiOperation({ summary: "Create a new appointment" })
  @ApiResponse({ status: 201, description: "Appointment created successfully" })
  @ApiResponse({ status: 409, description: "Time slot conflict" })
  create(@BusinessId() businessId: string, @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create({ ...createAppointmentDto, businessId })
  }

  @Get()
  // @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get all appointments" })
  @ApiResponse({ status: 200, description: "Appointments retrieved successfully" })
  findAll(@BusinessId() businessId: string, @Query() query: AppointmentQueryDto) {
    return this.appointmentService.findAll({ ...query, businessId })
  }

  @Get("stats")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get appointment statistics" })
  @ApiResponse({ status: 200, description: "Statistics retrieved successfully" })
  getStats() {
    return this.appointmentService.getAppointmentStats()
  }

  @Get("available-slots/:date")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @ApiOperation({ summary: "Get available time slots for a date" })
  @ApiResponse({ status: 200, description: "Available slots retrieved successfully" })
  getAvailableSlots(date: string, staffId?: string) {
    return this.appointmentService.getAvailableTimeSlots(date, staffId)
  }

  @Get("by-date/:date")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get appointments by date" })
  @ApiResponse({ status: 200, description: "Appointments retrieved successfully" })
  getByDate(@BusinessId() businessId: string, date: string) {
    return this.appointmentService.getAppointmentsByDate(businessId, date)
  }

  @Get("by-staff/:staffId")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: "Get appointments by staff member" })
  @ApiResponse({ status: 200, description: "Appointments retrieved successfully" })
  getByStaff(@BusinessId() businessId: string, staffId: string, date?: string) {
    return this.appointmentService.getAppointmentsByStaff(businessId, staffId, date)
  }

  @Get(":id")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.APPOINTMENT })
  @ApiOperation({ summary: "Get appointment by ID" })
  @ApiResponse({ status: 200, description: "Appointment retrieved successfully" })
  @ApiResponse({ status: 404, description: "Appointment not found" })
  findOne(id: string) {
    return this.appointmentService.findOne(id)
  }

  @Patch(":id")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.APPOINTMENT })
  @ApiOperation({ summary: "Update appointment" })
  @ApiResponse({ status: 200, description: "Appointment updated successfully" })
  @ApiResponse({ status: 404, description: "Appointment not found" })
  @ApiResponse({ status: 409, description: "Time slot conflict" })
  update(id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, updateAppointmentDto)
  }

  @Patch(":id/status")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.APPOINTMENT })
  @ApiOperation({ summary: "Update appointment status" })
  @ApiResponse({ status: 200, description: "Status updated successfully" })
  @ApiResponse({ status: 404, description: "Appointment not found" })
  updateStatus(id: string, body: { status: string; cancellationReason?: string }) {
    return this.appointmentService.updateStatus(id, body.status, body.cancellationReason)
  }

  @Patch(":id/assign-staff")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.APPOINTMENT })
  @ApiOperation({ summary: "Assign staff to appointment" })
  @ApiResponse({ status: 200, description: "Staff assigned successfully" })
  @ApiResponse({ status: 404, description: "Appointment not found" })
  assignStaff(id: string, body: { staffId: string }) {
    return this.appointmentService.assignStaff(id, body.staffId)
  }

  @Delete(":id")
  @Roles(UserRole.BUSINESS_ADMIN, UserRole.SUPER_ADMIN)
  @Audit({ action: AuditAction.DELETE, entity: AuditEntity.APPOINTMENT })
  @ApiOperation({ summary: "Delete appointment" })
  @ApiResponse({ status: 200, description: "Appointment deleted successfully" })
  @ApiResponse({ status: 404, description: "Appointment not found" })
  remove(id: string) {
    return this.appointmentService.remove(id)
  }
}
