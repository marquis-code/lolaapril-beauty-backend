import { IsString, IsNumber, IsDateString, IsOptional, IsEnum, IsArray, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import type { Types } from "mongoose"

export class CreateVoucherDto {
  @ApiProperty({ description: "Voucher code" })
  @IsString()
  code: string

  @ApiProperty({ description: "Voucher title" })
  @IsString()
  title: string

  @ApiProperty({ description: "Voucher description", required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: "Discount type", enum: ["percentage", "fixed"] })
  @IsEnum(["percentage", "fixed"])
  discountType: string

  @ApiProperty({ description: "Discount value" })
  @IsNumber()
  discountValue: number

  @ApiProperty({ description: "Minimum order amount", required: false })
  @IsOptional()
  @IsNumber()
  minOrderAmount?: number

  @ApiProperty({ description: "Maximum discount amount", required: false })
  @IsOptional()
  @IsNumber()
  maxDiscountAmount?: number

  @ApiProperty({ description: "Valid from date" })
  @IsDateString()
  validFrom: string

  @ApiProperty({ description: "Valid until date" })
  @IsDateString()
  validUntil: string

  @ApiProperty({ description: "Usage limit", required: false })
  @IsOptional()
  @IsNumber()
  usageLimit?: number

  @ApiProperty({ description: "Usage per client", required: false })
  @IsOptional()
  @IsNumber()
  usagePerClient?: number

  @ApiProperty({ description: "Applicable service IDs", type: [String], required: false })
  @IsOptional()
  @IsArray()
  applicableServices?: Types.ObjectId[]

  @ApiProperty({ description: "Applicable client IDs", type: [String], required: false })
  @IsOptional()
  @IsArray()
  applicableClients?: Types.ObjectId[]

  @ApiProperty({ description: "First time clients only", required: false })
  @IsOptional()
  @IsBoolean()
  isFirstTimeOnly?: boolean
}

export class ApplyVoucherDto {
  @ApiProperty({ description: "Voucher code" })
  @IsString()
  code: string

  @ApiProperty({ description: "Client ID" })
  @IsString()
  clientId: Types.ObjectId

  @ApiProperty({ description: "Order amount" })
  @IsNumber()
  orderAmount: number

  @ApiProperty({ description: "Service IDs", type: [String] })
  @IsArray()
  serviceIds: Types.ObjectId[]
}
