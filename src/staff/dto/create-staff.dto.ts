// src/modules/staff/dto/create-staff.dto.ts
import { IsString, IsEmail, IsEnum, IsDateString, IsArray, IsOptional, ValidateNested, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'

export class StaffSkillDto {
  @IsString()
  serviceId: string

  @IsString()
  serviceName: string

  @IsEnum(['beginner', 'intermediate', 'expert', 'master'])
  skillLevel: string

  @IsNumber()
  @IsOptional()
  experienceMonths?: number

  @IsOptional()
  isActive?: boolean
}

export class StaffCommissionDto {
  @IsString()
  @IsOptional()
  serviceId?: string

  @IsEnum(['percentage', 'fixed'])
  commissionType: string

  @IsNumber()
  commissionValue: number

  @IsNumber()
  @IsOptional()
  minimumAmount?: number

  @IsOptional()
  isActive?: boolean
}

export class CreateStaffDto {
  @IsString()
  userId: string

  @IsString()
  businessId: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  phone: string

  @IsEnum(['stylist', 'barber', 'therapist', 'nail_tech', 'receptionist', 'manager', 'owner'])
  role: string

  @IsEnum(['full_time', 'part_time', 'contractor', 'intern'])
  @IsOptional()
  employmentType?: string

  @IsDateString()
  hireDate: Date

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

  @IsString()
  @IsOptional()
  profileImage?: string

  @IsString()
  @IsOptional()
  bio?: string

  @IsArray()
  @IsOptional()
  certifications?: string[]
}
