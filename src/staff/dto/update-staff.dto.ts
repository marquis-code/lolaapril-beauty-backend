
// src/modules/staff/dto/create-staff.dto.ts
import { IsString, IsEmail, IsEnum, IsDateString, IsArray, IsOptional, ValidateNested, IsNumber } from 'class-validator'
import { StaffSkillDto, StaffCommissionDto } from "./create-staff.dto"
import { Type } from 'class-transformer'
import { Types } from 'mongoose'


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