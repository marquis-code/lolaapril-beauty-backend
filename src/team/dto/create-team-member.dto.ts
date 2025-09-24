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
  IsMongoId,
} from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Types } from "mongoose"

export class PhoneDto {
  @ApiProperty({ example: '+234' })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  number: string;
}

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
  @ApiPropertyOptional({ 
    type: [String], 
    example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    description: "Array of service ObjectIds"
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  services?: string[] | Types.ObjectId[]

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
  @ApiProperty({ 
    example: "507f1f77bcf86cd799439011",
    description: "Service ObjectId"
  })
  @IsMongoId()
  serviceId: string | Types.ObjectId

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

  @ApiProperty({ type: PhoneDto })
  @ValidateNested()
  @Type(() => PhoneDto)
  phone: PhoneDto;

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