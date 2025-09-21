import { IsString, IsNotEmpty, ValidateNested, IsOptional } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class VariantPricingDto {
  @ApiProperty({ example: "Fixed" })
  @IsString()
  @IsNotEmpty()
  priceType: string

  @ApiProperty({
    type: "object",
    properties: {
      currency: { type: "string", example: "NGN" },
      amount: { type: "number", example: 4000 },
    },
  })
  @ValidateNested()
  @Type(() => Object)
  price: {
    currency: string
    amount: number
  }

  @ApiProperty({
    type: "object",
    properties: {
      value: { type: "number", example: 45 },
      unit: { type: "string", example: "min" },
    },
  })
  @ValidateNested()
  @Type(() => Object)
  duration: {
    value: number
    unit: string
  }
}

export class VariantSettingsDto {
  @ApiPropertyOptional({ example: "HC-SH-001" })
  @IsOptional()
  @IsString()
  sku?: string
}

export class CreateServiceVariantDto {
  @ApiProperty({ example: "Short Hair" })
  @IsString()
  @IsNotEmpty()
  variantName: string

  @ApiProperty({ example: "Specialized haircut service for clients with short to medium length hair." })
  @IsString()
  @IsNotEmpty()
  variantDescription: string

  @ApiProperty({ type: VariantPricingDto })
  @ValidateNested()
  @Type(() => VariantPricingDto)
  pricing: VariantPricingDto

  @ApiPropertyOptional({ type: VariantSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => VariantSettingsDto)
  settings?: VariantSettingsDto
}
