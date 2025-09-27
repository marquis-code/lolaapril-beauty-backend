// src/modules/staff/controllers/staff.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  ValidationPipe,
  Request,
  HttpStatus,
  HttpCode
} from '@nestjs/common'
import { StaffService } from '../staff/staff.service'

// Import DTOs
import { CreateStaffDto } from '../staff/dto/create-staff.dto'
import { CreateStaffScheduleDto } from '../staff/dto/create-staff-schedule.dto'
import { AssignStaffDto } from '../staff/dto/assign-staff.dto'
import { AutoAssignStaffDto } from '../staff/dto/auto-assign-staff.dto'
import { CheckInStaffDto } from '../staff/dto/check-in-staff.dto'
import { CompleteAssignmentDto } from '../staff/dto/complete-assignment.dto'
import { GetStaffAssignmentsDto } from '../staff/dto/get-staff-assignments.dto'

// Import Guards
import { TenantGuard } from '../tenant/guards/tenant.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('staff')
@UseGuards(TenantGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // ================== STAFF MANAGEMENT ==================
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createStaff(
    @Body(ValidationPipe) createStaffDto: CreateStaffDto,
    @Request() req: any
  ) {
    try {
      // Get business ID from tenant middleware
      const businessId = req.tenant.businessId
      
      const staff = await this.staffService.createStaff({
        ...createStaffDto,
        businessId
      })

      return {
        success: true,
        data: staff,
        message: 'Staff member created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'STAFF_CREATION_FAILED'
      }
    }
  }

  @Get('business')
  @UseGuards(JwtAuthGuard)
  async getStaffByBusiness(
    @Query('status') status: string,
    @Request() req: any
  ) {
    try {
      const businessId = req.tenant.businessId
      
      const staff = await this.staffService.getStaffByBusiness(businessId, status)

      return {
        success: true,
        data: staff,
        message: 'Staff members retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'STAFF_RETRIEVAL_FAILED'
      }
    }
  }

  @Get('available')
  @UseGuards(JwtAuthGuard)
  async getAvailableStaff(
    @Query('date') date: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('serviceId') serviceId: string,
    @Request() req: any
  ) {
    try {
      const businessId = req.tenant.businessId
      
      const availableStaff = await this.staffService.getAvailableStaff(
        businessId,
        new Date(date),
        startTime,
        endTime,
        serviceId
      )

      return {
        success: true,
        data: availableStaff,
        message: 'Available staff retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'AVAILABLE_STAFF_RETRIEVAL_FAILED'
      }
    }
  }

  // ================== SCHEDULE MANAGEMENT ==================
  @Post('schedule')
  @UseGuards(JwtAuthGuard)
  async createSchedule(
    @Body(ValidationPipe) createScheduleDto: CreateStaffScheduleDto,
    @Request() req: any
  ) {
    try {
      const businessId = req.tenant.businessId
      const createdBy = req.user.id

      const schedule = await this.staffService.createStaffSchedule({
        ...createScheduleDto,
        businessId,
        createdBy
      })

      return {
        success: true,
        data: schedule,
        message: 'Staff schedule created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'SCHEDULE_CREATION_FAILED'
      }
    }
  }

  @Get('schedule/:staffId')
  @UseGuards(JwtAuthGuard)
  async getSchedule(
    @Param('staffId') staffId: string,
    @Query('date') date: string
  ) {
    try {
      const schedule = await this.staffService.getStaffSchedule(
        staffId, 
        new Date(date)
      )

      return {
        success: true,
        data: schedule,
        message: 'Staff schedule retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'SCHEDULE_RETRIEVAL_FAILED'
      }
    }
  }

  // ================== ASSIGNMENT MANAGEMENT ==================
  @Post('assign')
  @UseGuards(JwtAuthGuard)
  async assignStaff(
    @Body(ValidationPipe) assignStaffDto: AssignStaffDto,
    @Request() req: any
  ) {
    try {
      const businessId = req.tenant.businessId
      const assignedBy = req.user.id

      const assignment = await this.staffService.assignStaffToAppointment({
        ...assignStaffDto,
        businessId,
        assignedBy,
        assignmentMethod: 'manual'
      })

      return {
        success: true,
        data: assignment,
        message: 'Staff assigned successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'STAFF_ASSIGNMENT_FAILED'
      }
    }
  }

  @Post('auto-assign')
  @UseGuards(JwtAuthGuard)
  async autoAssignStaff(@Body(ValidationPipe) autoAssignDto: AutoAssignStaffDto) {
    try {
      const assignment = await this.staffService.autoAssignStaff(
        autoAssignDto.businessId,
        autoAssignDto.appointmentId,
        autoAssignDto.clientId,
        autoAssignDto.serviceId,
        autoAssignDto.assignmentDate,
        autoAssignDto.startTime,
        autoAssignDto.endTime
      )

      return {
        success: true,
        data: assignment,
        message: 'Staff auto-assigned successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'AUTO_ASSIGNMENT_FAILED'
      }
    }
  }

  @Get('assignments/:staffId')
  @UseGuards(JwtAuthGuard)
  async getAssignments(
    @Param('staffId') staffId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    try {
      const assignments = await this.staffService.getStaffAssignments(
        staffId,
        new Date(startDate),
        new Date(endDate)
      )

      return {
        success: true,
        data: assignments,
        message: 'Staff assignments retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'ASSIGNMENTS_RETRIEVAL_FAILED'
      }
    }
  }

  @Put('assignment/:assignmentId/complete')
  @UseGuards(JwtAuthGuard)
  async completeAssignment(
    @Param('assignmentId') assignmentId: string,
    @Body(ValidationPipe) completionData: CompleteAssignmentDto
  ) {
    try {
      const assignment = await this.staffService.completeStaffAssignment(
        assignmentId, 
        completionData
      )

      return {
        success: true,
        data: assignment,
        message: 'Assignment completed successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'ASSIGNMENT_COMPLETION_FAILED'
      }
    }
  }

  // ================== WORKING HOURS TRACKING ==================
  @Post('checkin')
  @UseGuards(JwtAuthGuard)
  async checkIn(
    @Body(ValidationPipe) checkInDto: CheckInStaffDto,
    @Request() req: any
  ) {
    try {
      const businessId = req.tenant.businessId
      const checkedInBy = req.user.id

      await this.staffService.checkInStaff({
        ...checkInDto,
        businessId,
        checkedInBy
      })

      return {
        success: true,
        message: 'Staff checked in successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'CHECK_IN_FAILED'
      }
    }
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkOut(
    @Body('staffId') staffId: string,
    @Request() req: any
  ) {
    try {
      const businessId = req.tenant.businessId
      const checkedOutBy = req.user.id

      await this.staffService.checkOutStaff(staffId, businessId, checkedOutBy)

      return {
        success: true,
        message: 'Staff checked out successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'CHECK_OUT_FAILED'
      }
    }
  }

  @Get('working-hours/:staffId')
  @UseGuards(JwtAuthGuard)
  async getWorkingHours(
    @Param('staffId') staffId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    try {
      const workingHours = await this.staffService.getStaffWorkingHours(
        staffId,
        new Date(startDate),
        new Date(endDate)
      )

      return {
        success: true,
        data: workingHours,
        message: 'Working hours retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'WORKING_HOURS_RETRIEVAL_FAILED'
      }
    }
  }

  // ================== STAFF PROFILE MANAGEMENT ==================
  @Get(':staffId')
  @UseGuards(JwtAuthGuard)
  async getStaffById(@Param('staffId') staffId: string) {
    try {
      const staff = await this.staffService.getStaffById(staffId)

      return {
        success: true,
        data: staff,
        message: 'Staff profile retrieved successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'STAFF_PROFILE_RETRIEVAL_FAILED'
      }
    }
  }

  @Put(':staffId/skills')
  @UseGuards(JwtAuthGuard)
  async updateStaffSkills(
    @Param('staffId') staffId: string,
    @Body('skills') skills: any[]
  ) {
    try {
      const staff = await this.staffService.updateStaffSkills(staffId, skills)

      return {
        success: true,
        data: staff,
        message: 'Staff skills updated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'SKILLS_UPDATE_FAILED'
      }
    }
  }

  @Put(':staffId/status')
  @UseGuards(JwtAuthGuard)
  async updateStaffStatus(
    @Param('staffId') staffId: string,
    @Body('status') status: string,
    @Body('reason') reason?: string
  ) {
    try {
      const staff = await this.staffService.updateStaffStatus(staffId, status, reason)

      return {
        success: true,
        data: staff,
        message: 'Staff status updated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'STATUS_UPDATE_FAILED'
      }
    }
  }
}