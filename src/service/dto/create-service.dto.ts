import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsBoolean, IsArray, IsNumber, IsEnum, IsMongoId } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Types } from "mongoose"

// Add this DTO
export class TimeValueDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  value: number;

  @ApiProperty({ example: "h", enum: ["min", "h"] })
  @IsEnum(["min", "h"])
  unit: "min" | "h";
}


export class BasicDetailsDto {
  @ApiProperty({ example: "Men's Haircut" })
  @IsString()
  @IsNotEmpty()
  serviceName: string

  @ApiProperty({ example: "Hair Styling" })
  @IsString()
  @IsNotEmpty()
  serviceType: string

  @ApiProperty({ example: "64a1b2c3d4e5f6789012345a", description: "ServiceCategory ObjectId" })
  @IsMongoId()
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
  @ApiProperty({ example: "64a1b2c3d4e5f6789012345b", description: "User ObjectId" })
  @IsMongoId()
  @IsNotEmpty()
  id: string

  @ApiProperty({ example: "John Doe" })
  @IsString()
 @IsOptional()
  name?: string

  @ApiProperty({ example: "Hair Stylist" })
  @IsString()
  @IsOptional()
  role?: string

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

  @ApiProperty({ 
    type: [String], 
    example: ["64a1b2c3d4e5f6789012345c", "64a1b2c3d4e5f6789012345d"],
    description: "Array of Resource ObjectIds"
  })
  @IsArray()
  @IsMongoId({ each: true })
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

// export class ServiceDurationDto {
//   @ApiProperty({
//     type: "object",
//     properties: {
//       value: { type: "number", example: 1 },
//       unit: { type: "string", example: "h" },
//     },
//     additionalProperties: false,
//   })
//   @ValidateNested()
//   @Type(() => Object)
//   servicingTime: {
//     value: number
//     unit: "min" | "h"
//   }

//   @ApiProperty({
//     type: "object",
//     properties: {
//       value: { type: "number", example: 10 },
//       unit: { type: "string", example: "min" },
//     },
//     additionalProperties: false,
//   })
//   @ValidateNested()
//   @Type(() => Object)
//   processingTime: {
//     value: number
//     unit: "min" | "h"
//   }

//   @ApiProperty({ example: "1h 10min" })
//   @IsString()
//   @IsNotEmpty()
//   totalDuration: string
// }

export class ServiceDurationDto {
  @ApiProperty({ type: TimeValueDto })
  @ValidateNested()
  @Type(() => TimeValueDto)
  servicingTime: TimeValueDto;

  @ApiProperty({ type: TimeValueDto })
  @ValidateNested()
  @Type(() => TimeValueDto)
  processingTime: TimeValueDto;

  @ApiProperty({ example: "1h 10min" })
  @IsString()
  @IsNotEmpty()
  totalDuration: string;
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

  @ApiPropertyOptional({ 
    type: [String], 
    example: ["64a1b2c3d4e5f6789012345e", "64a1b2c3d4e5f6789012345f"],
    description: "Array of Form ObjectIds"
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  forms?: string[]

  @ApiPropertyOptional({ 
    type: [String], 
    example: ["64a1b2c3d4e5f6789012345g", "64a1b2c3d4e5f6789012345h"],
    description: "Array of Commission ObjectIds"
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
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

  @ApiPropertyOptional({ 
    type: [String], 
    example: ["64a1b2c3d4e5f6789012345i", "64a1b2c3d4e5f6789012345j"],
    description: "Array of ServiceAddOn ObjectIds"
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  serviceAddOns?: string[]

  @ApiPropertyOptional({ type: ServiceSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ServiceSettingsDto)
  settings?: ServiceSettingsDto
}