
// src/modules/staff/dto/create-staff.dto.ts
import { IsString, IsEmail, IsEnum, IsDateString, IsArray, IsOptional, ValidateNested, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'

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