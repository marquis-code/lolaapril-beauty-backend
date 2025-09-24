import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsBoolean, IsArray, IsNumber, IsEnum } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class BasicDetailsDto {
  @ApiProperty({ example: "Men's Haircut" })
  @IsString()
  @IsNotEmpty()
  serviceName: string

  @ApiProperty({ example: "Hair Styling" })
  @IsString()
  @IsNotEmpty()
  serviceType: string

  @ApiProperty({ example: "Hair Services" })
  @IsString()
  @IsNotEmpty()
  category: string

  @ApiProperty({
    example: "Professional men's haircut service including consultation, precision cutting, and basic styling.",
  })
  @IsString()
  @IsNotEmpty()
  description: string
}

export class TeamMemberDto {
  @ApiProperty({ example: "tm_001" })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({ example: "Morning Shift" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: "Admin" })
  @IsString()
  @IsNotEmpty()
  role: string

  @ApiProperty({ example: true })
  @IsBoolean()
  selected: boolean
}

export class TeamMembersDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  allTeamMembers: boolean

  @ApiProperty({ type: [TeamMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  selectedMembers: TeamMemberDto[]
}

export class ResourcesDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isRequired: boolean

  @ApiProperty({ type: [String], example: [] })
  @IsArray()
  @IsString({ each: true })
  resourceList: string[]
}

export class PriceDto {
  @ApiProperty({ example: "NGN" })
  @IsString()
  @IsNotEmpty()
  currency: string

  @ApiProperty({ example: 5000 })
  @IsNumber()
  amount: number

  @ApiPropertyOptional({ example: 3000 })
  @IsOptional()
  @IsNumber()
  minimumAmount?: number
}

export class ServiceDurationDto {
  @ApiProperty({
    type: "object",
    properties: {
      value: { type: "number", example: 1 },
      unit: { type: "string", example: "h" },
    },
    additionalProperties: false,
  })
  @ValidateNested()
  @Type(() => Object)
  servicingTime: {
    value: number
    unit: "min" | "h"
  }

  @ApiProperty({
    type: "object",
    properties: {
      value: { type: "number", example: 10 },
      unit: { type: "string", example: "min" },
    },
    additionalProperties: false,
  })
  @ValidateNested()
  @Type(() => Object)
  processingTime: {
    value: number
    unit: "min" | "h"
  }

  @ApiProperty({ example: "1h 10min" })
  @IsString()
  @IsNotEmpty()
  totalDuration: string
}

export class ExtraTimeOptionsDto {
  @ApiPropertyOptional({ example: "Team member becomes available during processing time" })
  @IsOptional()
  @IsString()
  processingTime?: string

  @ApiPropertyOptional({ example: "Team member remains occupied during blocked time" })
  @IsOptional()
  @IsString()
  blockedTime?: string

  @ApiPropertyOptional({ example: "Team member remains occupied during servicing time" })
  @IsOptional()
  @IsString()
  extraServicingTime?: string
}

export class PricingAndDurationDto {
  @ApiProperty({ example: "Fixed", enum: ["Fixed", "Free", "From"] })
  @IsEnum(["Fixed", "Free", "From"])
  priceType: string

  @ApiProperty({ type: PriceDto })
  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto

  @ApiProperty({ type: ServiceDurationDto })
  @ValidateNested()
  @Type(() => ServiceDurationDto)
  duration: ServiceDurationDto

  @ApiPropertyOptional({ type: ExtraTimeOptionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExtraTimeOptionsDto)
  extraTimeOptions?: ExtraTimeOptionsDto
}

export class OnlineBookingDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean

  @ApiProperty({ example: "All clients" })
  @IsString()
  availableFor: string
}

export class ServiceSettingsDto {
  @ApiProperty({ type: OnlineBookingDto })
  @ValidateNested()
  @Type(() => OnlineBookingDto)
  onlineBooking: OnlineBookingDto

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  forms?: string[]

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  commissions?: string[]

  @ApiPropertyOptional({
    type: "object",
    additionalProperties: true,
    example: {}
  })
  @IsOptional()
  generalSettings?: Record<string, any>
}

export class CreateServiceDto {
  @ApiProperty({ type: BasicDetailsDto })
  @ValidateNested()
  @Type(() => BasicDetailsDto)
  basicDetails: BasicDetailsDto

  @ApiProperty({ type: TeamMembersDto })
  @ValidateNested()
  @Type(() => TeamMembersDto)
  teamMembers: TeamMembersDto

  @ApiPropertyOptional({ type: ResourcesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ResourcesDto)
  resources?: ResourcesDto

  @ApiProperty({ type: PricingAndDurationDto })
  @ValidateNested()
  @Type(() => PricingAndDurationDto)
  pricingAndDuration: PricingAndDurationDto

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceAddOns?: string[]

  @ApiPropertyOptional({ type: ServiceSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ServiceSettingsDto)
  settings?: ServiceSettingsDto
}