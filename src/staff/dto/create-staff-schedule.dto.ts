// src/modules/staff/dto/create-staff.dto.ts
import { IsString, IsEmail, IsEnum, IsDateString, IsArray, IsOptional, ValidateNested, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'

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

  @IsEnum(['regular', 'temporary', 'override'])
  @IsOptional()
  scheduleType?: string

  @IsString()
  @IsOptional()
  reason?: string

  @IsString()
  createdBy: string
}