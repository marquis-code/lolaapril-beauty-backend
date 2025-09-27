// src/modules/staff/dto/create-staff.dto.ts
import { IsString, IsEmail, IsEnum, IsDateString, IsArray, IsOptional, ValidateNested, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'

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
