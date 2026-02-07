import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsMongoId,
  Min,
} from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class VoucherRestrictionsDto {
  @ApiPropertyOptional({
    type: [String],
    description: "Mongo ObjectIds of services",
    example: ["64b1234abc1234567890abcd", "64b1234abc1234567890abce"],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  applicableServices?: string[]

  @ApiPropertyOptional({
    type: [String],
    description: "Mongo ObjectIds of categories",
    example: ["64c1234abc1234567890cdef"],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  applicableCategories?: string[]

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumSpend?: number

  @ApiPropertyOptional({ example: 10000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maximumDiscount?: number

  @ApiPropertyOptional({
    type: [String],
    description: "Mongo ObjectIds of services to exclude",
    example: ["64d1234abc1234567890abcd"],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  excludedServices?: string[]

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  firstTimeClientsOnly?: boolean

  @ApiPropertyOptional({ type: [String], example: ["Monday", "Tuesday"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableDays?: string[]
}

export class CreateVoucherDto {
  @ApiProperty({ example: "WELCOME20" })
  @IsString()
  @IsNotEmpty()
  voucherCode: string

  @ApiProperty({ example: "Welcome Discount" })
  @IsString()
  @IsNotEmpty()
  voucherName: string

  @ApiProperty({ example: "20% discount for new clients" })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({
    example: "percentage",
    enum: ["percentage", "fixed_amount", "service_discount", "buy_one_get_one"],
  })
  @IsEnum(["percentage", "fixed_amount", "service_discount", "buy_one_get_one"])
  discountType: string

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  discountValue: number

  @ApiProperty({ example: "2025-01-01T00:00:00.000Z" })
  @IsDateString()
  validFrom: Date

  @ApiProperty({ example: "2025-12-31T23:59:59.999Z" })
  @IsDateString()
  validUntil: Date

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usagePerClient?: number

  @ApiPropertyOptional({ type: VoucherRestrictionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => VoucherRestrictionsDto)
  restrictions?: VoucherRestrictionsDto

  @ApiPropertyOptional({
    example: "active",
    enum: ["active", "inactive", "expired", "used_up"],
  })
  @IsOptional()
  @IsEnum(["active", "inactive", "expired", "used_up"])
  status?: string

  // @ApiProperty({ example: "507f1f77bcf86cd799439011" })
  // @IsString()
  // @IsNotEmpty()
  // @IsMongoId()
  // createdBy: string
}
