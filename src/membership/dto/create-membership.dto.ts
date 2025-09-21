import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
} from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class MembershipBenefitDto {
  @ApiProperty({
    example: "discount",
    enum: ["discount", "free_service", "priority_booking", "exclusive_access"],
  })
  @IsEnum(["discount", "free_service", "priority_booking", "exclusive_access"])
  benefitType: string

  @ApiProperty({ example: "10% discount on all services" })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercentage?: number

  @ApiPropertyOptional({ example: "service_001" })
  @IsOptional()
  @IsString()
  freeServiceId?: string

  @ApiPropertyOptional({ example: "Free Hair Wash" })
  @IsOptional()
  @IsString()
  freeServiceName?: string
}

export class MembershipTierDto {
  @ApiProperty({ example: "Silver" })
  @IsString()
  @IsNotEmpty()
  tierName: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  tierLevel: number

  @ApiProperty({ example: 10000 })
  @IsNumber()
  @Min(0)
  minimumSpend: number

  @ApiProperty({ example: 1.5 })
  @IsNumber()
  @Min(1)
  pointsMultiplier: number

  @ApiProperty({ type: [MembershipBenefitDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MembershipBenefitDto)
  benefits: MembershipBenefitDto[]

  @ApiProperty({ example: "#C0C0C0" })
  @IsString()
  @IsNotEmpty()
  tierColor: string
}

export class CreateMembershipDto {
  @ApiProperty({ example: "VIP Membership" })
  @IsString()
  @IsNotEmpty()
  membershipName: string

  @ApiProperty({ example: "Exclusive membership program with amazing benefits" })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({
    example: "tier_based",
    enum: ["points_based", "tier_based", "subscription", "prepaid"],
  })
  @IsEnum(["points_based", "tier_based", "subscription", "prepaid"])
  membershipType: string

  @ApiPropertyOptional({ type: [MembershipTierDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MembershipTierDto)
  tiers?: MembershipTierDto[]

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointsPerDollar?: number

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pointsRedemptionValue?: number

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  subscriptionPrice?: number

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  subscriptionDuration?: number

  @ApiPropertyOptional({ type: [MembershipBenefitDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MembershipBenefitDto)
  generalBenefits?: MembershipBenefitDto[]

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({ example: "507f1f77bcf86cd799439011" })
  @IsString()
  @IsNotEmpty()
  createdBy: string
}
