import { Controller, Query, Body, Get, Post, Patch, Param, Delete, UseGuards, UseInterceptors } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { BookingService } from "./booking.service"
import { CreateBookingDto } from "./dto/create-booking.dto"
import { UpdateBookingDto } from "./dto/update-booking.dto"
import { BookingQueryDto } from "./dto/booking-query.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../auth/schemas/user.schema"
import { AuditInterceptor } from "../audit/interceptors/audit.interceptor"
import { Audit } from "../audit/decorators/audit.decorator"
import { AuditAction, AuditEntity } from "../audit/schemas/audit-log.schema"

@ApiTags("Bookings")
@Controller("bookings")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @Audit({ action: AuditAction.CREATE, entity: AuditEntity.BOOKING })
  @ApiOperation({ summary: "Create a new booking" })
  @ApiResponse({ status: 201, description: "Booking created successfully" })
  @ApiResponse({ status: 409, description: "Time slot conflict" })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF,UserRole.CLIENT)
  @ApiOperation({ summary: "Get all bookings" })
  @ApiResponse({ status: 200, description: "Bookings retrieved successfully" })
  findAll(@Query() query: BookingQueryDto) {
    return this.bookingService.findAll(query)
  }

  @Get("stats")
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @ApiOperation({ summary: "Get booking statistics" })
  @ApiResponse({ status: 200, description: "Statistics retrieved successfully" })
  getStats() {
    return this.bookingService.getBookingStats()
  }

  @Get('by-date/:date')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get bookings by date' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  getByDate(@Param('date') date: string) {
    const bookingDate = new Date(date)
    return this.bookingService.getBookingsByDate(bookingDate)
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CLIENT,UserRole.CLIENT)
  @Audit({ action: AuditAction.VIEW, entity: AuditEntity.BOOKING })
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id)
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.STAFF,UserRole.CLIENT)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.BOOKING })
  @ApiOperation({ summary: "Update booking" })
  @ApiResponse({ status: 200, description: "Booking updated successfully" })
  @ApiResponse({ status: 404, description: "Booking not found" })
  @ApiResponse({ status: 409, description: "Time slot conflict" })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto)
  }

  @Patch(":id/status")
  @Roles(UserRole.ADMIN, UserRole.STAFF,UserRole.CLIENT)
  @Audit({ action: AuditAction.UPDATE, entity: AuditEntity.BOOKING })
  @ApiOperation({ summary: "Update booking status" })
  @ApiResponse({ status: 200, description: "Status updated successfully" })
  @ApiResponse({ status: 404, description: "Booking not found" })
  updateStatus(@Param('id') id: string, body: { status: string; cancellationReason?: string }) {
    return this.bookingService.updateStatus(id, body.status, body.cancellationReason)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @Audit({ action: AuditAction.DELETE, entity: AuditEntity.BOOKING })
  @ApiOperation({ summary: 'Delete booking' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id)
  }
}
