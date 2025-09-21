import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsArray, IsNumber, IsEnum, Min } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class PaymentItemDto {
  @ApiProperty({ example: "service", enum: ["service", "product", "bundle"] })
  @IsEnum(["service", "product", "bundle"])
  itemType: string

  @ApiProperty({ example: "service_001" })
  @IsString()
  @IsNotEmpty()
  itemId: string

  @ApiProperty({ example: "Hair Cut" })
  @IsString()
  @IsNotEmpty()
  itemName: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  unitPrice: number

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  totalPrice: number

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number

  @ApiPropertyOptional({ example: 375 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number
}

export class CreatePaymentDto {
  @ApiProperty({ example: "507f1f77bcf86cd799439011" })
  @IsString()
  @IsNotEmpty()
  clientId: string

  @ApiPropertyOptional({ example: "507f1f77bcf86cd799439012" })
  @IsOptional()
  @IsString()
  appointmentId?: string

  @ApiPropertyOptional({ example: "507f1f77bcf86cd799439013" })
  @IsOptional()
  @IsString()
  bookingId?: string

  @ApiProperty({ example: "PAY_2025_001" })
  @IsString()
  @IsNotEmpty()
  paymentReference: string

  @ApiProperty({ type: [PaymentItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  items: PaymentItemDto[]

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  subtotal: number

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalDiscount?: number

  @ApiPropertyOptional({ example: 375 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalTax?: number

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  serviceCharge?: number

  @ApiProperty({ example: 5075 })
  @IsNumber()
  @Min(0)
  totalAmount: number

  @ApiProperty({
    example: "cash",
    enum: ["cash", "card", "bank_transfer", "mobile_money", "online"],
  })
  @IsEnum(["cash", "card", "bank_transfer", "mobile_money", "online"])
  paymentMethod: string

  @ApiPropertyOptional({
    example: "pending",
    enum: ["pending", "processing", "completed", "failed", "refunded", "partially_refunded"],
  })
  @IsOptional()
  @IsEnum(["pending", "processing", "completed", "failed", "refunded", "partially_refunded"])
  status?: string

  @ApiPropertyOptional({ example: "TXN_123456789" })
  @IsOptional()
  @IsString()
  transactionId?: string

  @ApiPropertyOptional({ example: "507f1f77bcf86cd799439014" })
  @IsOptional()
  @IsString()
  processedBy?: string

  @ApiPropertyOptional({ example: "Payment processed successfully" })
  @IsOptional()
  @IsString()
  notes?: string
}
