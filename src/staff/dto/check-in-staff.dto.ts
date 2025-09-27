// src/modules/staff/dto/create-staff.dto.ts
import { IsString, IsEmail, IsEnum, IsDateString, IsArray, IsOptional, ValidateNested, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'

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
