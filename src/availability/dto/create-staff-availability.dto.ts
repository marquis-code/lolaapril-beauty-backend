// src/modules/availability/dto/create-staff-availability.dto.ts
import { IsString, IsDateString, IsArray, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class TimeSlotDto {
  @IsString()
  startTime: string

  @IsString()
  endTime: string

  @IsOptional()
  isBreak?: boolean
}

export class CreateStaffAvailabilityDto {
  @IsString()
  staffId: string

  @IsString()
  @IsOptional()
  businessId?: string

  @IsDateString()
  date: string // Keep as string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  availableSlots: TimeSlotDto[]

  @IsString()
  @IsOptional()
  reason?: string

  @IsString()
  createdBy: string
}