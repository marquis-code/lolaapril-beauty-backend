// src/modules/staff/dto/create-staff.dto.ts
import { IsString, IsEmail, IsEnum, IsDateString, IsArray, IsOptional, ValidateNested, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'

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