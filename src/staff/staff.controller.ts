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
import { ValidateBusiness, BusinessId } from "../auth"

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // ================== STAFF MANAGEMENT (SPECIFIC ROUTES FIRST) ==================
  
  @Get('business')
  @ValidateBusiness()
  async getStaffByBusiness(
    @BusinessId() businessId: string,
    @Query('status') status: string,
  ) {
    try {
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
  @ValidateBusiness()
  async getAvailableStaff(
    @BusinessId() businessId: string,
    @Query('date') date: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('serviceId') serviceId: string,
  ) {
    try {
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
  @ValidateBusiness()
  async createSchedule(
    @Body(ValidationPipe) createScheduleDto: CreateStaffScheduleDto,
    @Request() req: any,
    @BusinessId() businessId: string,
  ) {
    try {
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

  // ================== ASSIGNMENT MANAGEMENT ==================
  
  @Post('assign')
  @ValidateBusiness()
  async assignStaff(
    @Body(ValidationPipe) assignStaffDto: AssignStaffDto,
    @Request() req: any,
    @BusinessId() businessId: string,
  ) {
    try {
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
  @ValidateBusiness()
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

  // ================== WORKING HOURS TRACKING ==================
  
  @Post('checkin')
  @ValidateBusiness()
  async checkIn(
    @Body(ValidationPipe) checkInDto: CheckInStaffDto,
    @Request() req: any,
    @BusinessId() businessId: string,
  ) {
    try {
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
  @ValidateBusiness()
  async checkOut(
    @Body('staffId') staffId: string,
    @Request() req: any,
    @BusinessId() businessId: string,
  ) {
    try {
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

  // ================== ROUTES WITH PARAMETERS (MUST COME AFTER SPECIFIC ROUTES) ==================
  
  @Get('schedule/:staffId')
  @ValidateBusiness()
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

  @Get('assignments/:staffId')
  @ValidateBusiness()
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

  @Get('working-hours/:staffId')
  @ValidateBusiness()
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

  @Put('assignment/:assignmentId/complete')
  @ValidateBusiness()
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

  @Put(':staffId/skills')
  @ValidateBusiness()
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
  @ValidateBusiness()
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

  // Generic :staffId route MUST be last
  @Get(':staffId')
  @ValidateBusiness()
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

  @Post()
  @ValidateBusiness()
  @HttpCode(HttpStatus.CREATED)
  async createStaff(
    @Body(ValidationPipe) createStaffDto: CreateStaffDto,
    @BusinessId() businessId: string,
  ) {
    try {
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
}