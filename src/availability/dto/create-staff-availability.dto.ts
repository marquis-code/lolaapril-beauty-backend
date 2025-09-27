// src/modules/availability/dto/create-staff-availability.dto.ts
import { IsNotEmpty, IsDateString, IsArray, IsOptional, IsString } from 'class-validator'
import { TimeSlot } from '../schemas/business-hours.schema'

export class CreateStaffAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  staffId: string

  @IsNotEmpty()
  @IsString()
  businessId: string

  @IsNotEmpty()
  @IsDateString()
  date: Date

  @IsNotEmpty()
  @IsArray()
  availableSlots: TimeSlot[]

  @IsOptional()
  @IsString()
  reason?: string

  @IsNotEmpty()
  @IsString()
  createdBy: string
}
