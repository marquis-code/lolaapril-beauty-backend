import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsEmail,
  IsDateString,
} from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class WorkingHoursDto {
  @ApiProperty({ example: "Monday" })
  @IsString()
  @IsNotEmpty()
  day: string

  @ApiProperty({ example: "09:00" })
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ example: "17:00" })
  @IsString()
  @IsNotEmpty()
  endTime: string

  @ApiProperty({ example: true })
  @IsBoolean()
  isWorking: boolean
}

export class SkillsDto {
  @ApiPropertyOptional({ type: [String], example: ["Hair Cut", "Hair Color"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[]

  @ApiPropertyOptional({ type: [String], example: ["Bridal Hair", "Color Correction"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[]

  @ApiPropertyOptional({ example: "Senior" })
  @IsOptional()
  @IsString()
  experienceLevel?: string
}

export class CommissionDto {
  @ApiProperty({ example: "service_001" })
  @IsString()
  @IsNotEmpty()
  serviceId: string

  @ApiProperty({ example: "Hair Cut" })
  @IsString()
  @IsNotEmpty()
  serviceName: string

  @ApiProperty({ example: "percentage", enum: ["percentage", "fixed"] })
  @IsEnum(["percentage", "fixed"])
  commissionType: string

  @ApiProperty({ example: 15 })
  @IsNumber()
  commissionValue: number
}

export class EmergencyContactDto {
  @ApiProperty({ example: "Jane Doe" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: "Spouse" })
  @IsString()
  @IsNotEmpty()
  relationship: string

  @ApiProperty({ example: "+234 123 456 7890" })
  @IsString()
  @IsNotEmpty()
  phone: string
}

export class CreateTeamMemberDto {
  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty({ example: "john.doe@salon.com" })
  @IsEmail()
  email: string

  @ApiProperty({
    type: "object",
    properties: {
      countryCode: { type: "string", example: "+234" },
      number: { type: "string", example: "+234 123 456 7890" },
    },
  })
  @ValidateNested()
  @Type(() => Object)
  phone: {
    countryCode: string
    number: string
  }

  @ApiProperty({
    example: "stylist",
    enum: ["admin", "manager", "stylist", "therapist", "receptionist", "cleaner"],
  })
  @IsEnum(["admin", "manager", "stylist", "therapist", "receptionist", "cleaner"])
  role: string

  @ApiProperty({
    example: "full_time",
    enum: ["full_time", "part_time", "contract", "freelance"],
  })
  @IsEnum(["full_time", "part_time", "contract", "freelance"])
  employmentType: string

  @ApiPropertyOptional({ example: "2025-01-01T00:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  hireDate?: Date

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @IsNumber()
  salary?: number

  @ApiPropertyOptional({ type: [WorkingHoursDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursDto)
  workingHours?: WorkingHoursDto[]

  @ApiPropertyOptional({ type: SkillsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SkillsDto)
  skills?: SkillsDto

  @ApiPropertyOptional({ type: [CommissionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommissionDto)
  commissions?: CommissionDto[]

  @ApiPropertyOptional({ example: "https://example.com/profile.jpg" })
  @IsOptional()
  @IsString()
  profileImage?: string

  @ApiPropertyOptional({ example: "Experienced hair stylist with 5+ years in the industry" })
  @IsOptional()
  @IsString()
  bio?: string

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  canBookOnline?: boolean

  @ApiPropertyOptional({ type: EmergencyContactDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto
}
