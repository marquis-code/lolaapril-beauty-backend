import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsBoolean, IsArray, IsNumber } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class BasicInfoDto {
  @ApiProperty({ example: "Cut and Blow-dry" })
  @IsString()
  @IsNotEmpty()
  bundleName: string

  @ApiProperty({ example: "Hair Services" })
  @IsString()
  @IsNotEmpty()
  category: string

  @ApiProperty({ example: "Complete hair transformation package including professional cut and styling blow-dry." })
  @IsString()
  @IsNotEmpty()
  description: string
}

export class BundleServiceDto {
  @ApiProperty({ example: "service_001" })
  @IsString()
  @IsNotEmpty()
  serviceId: string

  @ApiProperty({ example: "Hair Cut" })
  @IsString()
  @IsNotEmpty()
  serviceName: string

  @ApiProperty({ example: 45 })
  @IsNumber()
  duration: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  sequence: number
}

export class BundlePricingDto {
  @ApiProperty({ example: "Service pricing" })
  @IsString()
  @IsNotEmpty()
  priceType: string

  @ApiProperty({
    type: "object",
    properties: {
      currency: { type: "string", example: "NGN" },
      amount: { type: "number", example: 15000 },
    },
  })
  @ValidateNested()
  @Type(() => Object)
  retailPrice: {
    currency: string
    amount: number
  }
}

export class BundleOnlineBookingDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean

  @ApiProperty({ example: "Females only" })
  @IsString()
  availableFor: string
}

export class CreateServiceBundleDto {
  @ApiProperty({ type: BasicInfoDto })
  @ValidateNested()
  @Type(() => BasicInfoDto)
  basicInfo: BasicInfoDto

  @ApiProperty({ type: [BundleServiceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BundleServiceDto)
  services: BundleServiceDto[]

  @ApiProperty({ example: "Booked in sequence" })
  @IsString()
  @IsNotEmpty()
  scheduleType: string

  @ApiProperty({ type: BundlePricingDto })
  @ValidateNested()
  @Type(() => BundlePricingDto)
  pricing: BundlePricingDto

  @ApiPropertyOptional({ type: BundleOnlineBookingDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BundleOnlineBookingDto)
  onlineBooking?: BundleOnlineBookingDto
}
