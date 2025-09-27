// src/modules/staff/dto/create-staff.dto.ts
import { IsString, IsEmail, IsEnum, IsDateString, IsArray, IsOptional, ValidateNested, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'


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
   requiredEquipment?: string[];

  @IsString()
  @IsOptional()
  clientPreferences?: string


  @IsString()
  @IsOptional()
  setupTimeMinutes?: number

    @IsString()
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
  clientId: string

  @IsDateString()
  assignmentDate: Date

  @ValidateNested()
  @Type(() => AssignmentDetailsDto)
  assignmentDetails: AssignmentDetailsDto

  @IsString()
  assignedBy: string

  @IsEnum(['auto', 'manual', 'client_request'])
  @IsOptional()
  assignmentMethod?: string
}