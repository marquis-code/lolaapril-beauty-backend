// ============================================================================
// UPDATED: CreateStaffDto - userId removed
// ============================================================================
// src/modules/staff/dto/create-staff.dto.ts

import { 
  IsString, 
  IsEmail, 
  IsEnum, 
  IsDateString, 
  IsArray, 
  IsOptional, 
  ValidateNested, 
  IsNumber,
  MinLength,
  Matches
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class StaffSkillDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  serviceId: string

  @ApiProperty({ example: 'Haircut' })
  @IsString()
  serviceName: string

  @ApiProperty({ 
    enum: ['beginner', 'intermediate', 'expert', 'master'],
    example: 'expert'
  })
  @IsEnum(['beginner', 'intermediate', 'expert', 'master'])
  skillLevel: string

  @ApiPropertyOptional({ example: 36 })
  @IsNumber()
  @IsOptional()
  experienceMonths?: number

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isActive?: boolean
}

export class StaffCommissionDto {
  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsOptional()
  serviceId?: string

  @ApiProperty({ 
    enum: ['percentage', 'fixed'],
    example: 'percentage'
  })
  @IsEnum(['percentage', 'fixed'])
  commissionType: string

  @ApiProperty({ example: 30 })
  @IsNumber()
  commissionValue: number

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  minimumAmount?: number

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isActive?: boolean
}

export class CreateStaffDto {
  // ❌ REMOVED: userId - will be created automatically
  
  @ApiProperty({ 
    description: 'Business ID',
    example: '507f1f77bcf86cd799439011'
  })
  @IsString()
  businessId: string

  @ApiProperty({ 
    description: 'Staff first name',
    example: 'John'
  })
  @IsString()
  @MinLength(2)
  firstName: string

  @ApiProperty({ 
    description: 'Staff last name',
    example: 'Doe'
  })
  @IsString()
  @MinLength(2)
  lastName: string

  @ApiProperty({ 
    description: 'Staff email address',
    example: 'john.doe@example.com'
  })
  @IsEmail()
  email: string

  @ApiProperty({ 
    description: 'Staff phone number',
    example: '+2348012345678'
  })
  @IsString()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Phone number must be valid'
  })
  phone: string

  @ApiProperty({ 
    description: 'Staff role',
    enum: ['stylist', 'barber', 'therapist', 'nail_tech', 'receptionist', 'manager', 'owner'],
    example: 'stylist'
  })
  @IsEnum(['stylist', 'barber', 'therapist', 'nail_tech', 'receptionist', 'manager', 'owner'])
  role: string

  @ApiPropertyOptional({ 
    description: 'Employment type',
    enum: ['full_time', 'part_time', 'contractor', 'intern'],
    example: 'full_time'
  })
  @IsEnum(['full_time', 'part_time', 'contractor', 'intern'])
  @IsOptional()
  employmentType?: string

  @ApiProperty({ 
    description: 'Hire date',
    example: '2024-01-01'
  })
  @IsDateString()
  hireDate: Date

  @ApiPropertyOptional({ 
    description: 'Staff skills',
    type: [StaffSkillDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StaffSkillDto)
  @IsOptional()
  skills?: StaffSkillDto[]

  @ApiPropertyOptional({ 
    description: 'Commission structure',
    type: [StaffCommissionDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StaffCommissionDto)
  @IsOptional()
  commissionStructure?: StaffCommissionDto[]

  @ApiPropertyOptional({ 
    description: 'Profile image URL',
    example: 'https://example.com/profile.jpg'
  })
  @IsString()
  @IsOptional()
  profileImage?: string

  @ApiPropertyOptional({ 
    description: 'Staff bio',
    example: 'Experienced hair stylist with 5 years of experience'
  })
  @IsString()
  @IsOptional()
  bio?: string

  @ApiPropertyOptional({ 
    description: 'Certifications',
    example: ['Advanced Styling Certificate', 'Color Specialist']
  })
  @IsArray()
  @IsOptional()
  certifications?: string[]

  @ApiPropertyOptional({ 
    description: 'Password for staff account (optional - will be auto-generated if not provided)',
    example: 'SecurePassword123!',
    minLength: 8
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string
}

// ============================================================================
// Other DTOs remain the same
// ============================================================================

export class TimeSlotDto {
  @IsString()
  startTime: string

  @IsString()
  endTime: string

  @IsOptional()
  isBreak?: boolean

  @IsString()
  @IsOptional()
  breakType?: string
}

export class DailyScheduleDto {
  @IsNumber()
  dayOfWeek: number

  @IsOptional()
  isWorkingDay?: boolean

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  workingHours: TimeSlotDto[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  @IsOptional()
  breaks?: TimeSlotDto[]

  @IsNumber()
  @IsOptional()
  maxHoursPerDay?: number
}

export class CreateStaffScheduleDto {
  @IsString()
  staffId: string

  @IsString()
  businessId: string

  @IsDateString()
  effectiveDate: Date

  @IsDateString()
  @IsOptional()
  endDate?: Date

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyScheduleDto)
  weeklySchedule: DailyScheduleDto[]

  @IsEnum(['regular', 'temporary', 'override', '24_7'])
  @IsOptional()
  scheduleType?: string

  @IsString()
  @IsOptional()
  reason?: string

  @IsString()
  createdBy: string

  @IsOptional()
  isDefault24_7?: boolean
}

export class AssignmentDetailsDto {
  @IsString()
  startTime: string

  @IsString()
  endTime: string

  @IsEnum(['primary', 'secondary', 'backup'])
  @IsOptional()
  assignmentType?: string

  @IsNumber()
  @IsOptional()
  estimatedDuration?: number

  @IsString()
  @IsOptional()
  specialInstructions?: string

  @IsString()
  @IsOptional()
  roomNumber?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredEquipment?: string[]

  @IsString()
  @IsOptional()
  clientPreferences?: string

  @IsNumber()
  @IsOptional()
  setupTimeMinutes?: number

  @IsNumber()
  @IsOptional()
  cleanupTimeMinutes?: number

  @IsString()
  serviceId: string

  @IsString()
  serviceName: string
}

export class AssignStaffDto {
  @IsString()
  staffId: string

  @IsString()
  businessId: string

  @IsString()
  appointmentId: string

  @IsString()
  @IsOptional()
  clientId?: string

  @IsDateString()
  assignmentDate: Date

  @ValidateNested()
  @Type(() => AssignmentDetailsDto)
  assignmentDetails: AssignmentDetailsDto

  @IsString()
  @IsOptional()
  assignedBy?: string

  @IsEnum(['auto', 'manual', 'client_request'])
  @IsOptional()
  assignmentMethod?: string
}

export class AutoAssignStaffDto {
  @IsString()
  businessId: string

  @IsString()
  appointmentId: string

  @IsString()
  clientId: string

  @IsString()
  serviceId: string

  @IsDateString()
  assignmentDate: Date

  @IsString()
  startTime: string

  @IsString()
  endTime: string
}

export class CheckInStaffDto {
  @IsString()
  staffId: string

  @IsString()
  businessId: string

  @IsString()
  checkedInBy: string

  @IsString()
  @IsOptional()
  notes?: string
}

export class CompleteAssignmentDto {
  @IsOptional()
  @IsString()
  actualStartTime?: string

  @IsOptional()
  @IsString()
  actualEndTime?: string

  @IsOptional()
  @IsString()
  completionNotes?: string

  @IsOptional()
  @IsNumber()
  rating?: number

  @IsOptional()
  @IsString()
  clientFeedback?: string

  @IsOptional()
  @IsString()
  staffFeedback?: string

  @IsOptional()
  @IsString()
  qualityCheckNotes?: string

  @IsOptional()
  qualityCheckCompleted?: boolean

  @IsOptional()
  @IsString()
  qualityCheckedBy?: string
}

export class GetStaffAssignmentsDto {
  @IsString()
  staffId: string

  @IsDateString()
  startDate: Date

  @IsDateString()
  endDate: Date

  @IsEnum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'])
  @IsOptional()
  status?: string

  @IsString()
  @IsOptional()
  serviceId?: string
}

export class CheckAvailabilityDto {
  @IsString()
  businessId: string

  @IsDateString()
  date: Date

  @IsString()
  startTime: string

  @IsString()
  endTime: string

  @IsString()
  @IsOptional()
  serviceId?: string

  @IsArray()
  @IsOptional()
  excludeStaffIds?: string[]
}

export class UpdateStaffDto {
  @IsString()
  @IsOptional()
  firstName?: string

  @IsString()
  @IsOptional()
  lastName?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsEnum(['stylist', 'barber', 'therapist', 'nail_tech', 'receptionist', 'manager', 'owner'])
  @IsOptional()
  role?: string

  @IsEnum(['full_time', 'part_time', 'contractor', 'intern'])
  @IsOptional()
  employmentType?: string

  @IsEnum(['active', 'inactive', 'on_leave', 'terminated'])
  @IsOptional()
  status?: string

  @IsString()
  @IsOptional()
  profileImage?: string

  @IsString()
  @IsOptional()
  bio?: string

  @IsArray()
  @IsOptional()
  certifications?: string[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StaffSkillDto)
  @IsOptional()
  skills?: StaffSkillDto[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StaffCommissionDto)
  @IsOptional()
  commissionStructure?: StaffCommissionDto[]
}