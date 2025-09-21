import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsArray, IsNumber, IsEnum, Min } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class SaleItemDto {
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

  @ApiPropertyOptional({ example: "staff_001" })
  @IsOptional()
  @IsString()
  staffId?: string

  @ApiPropertyOptional({ example: "John Doe" })
  @IsOptional()
  @IsString()
  staffName?: string

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  commission?: number
}

export class CreateSaleDto {
  @ApiProperty({ example: "SALE_2025_001" })
  @IsString()
  @IsNotEmpty()
  saleNumber: string

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

  @ApiProperty({ type: [SaleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[]

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

  @ApiProperty({ example: 5075 })
  @IsNumber()
  @Min(0)
  amountPaid: number

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amountDue?: number

  @ApiPropertyOptional({
    example: "pending",
    enum: ["pending", "paid", "partially_paid", "overdue", "cancelled"],
  })
  @IsOptional()
  @IsEnum(["pending", "paid", "partially_paid", "overdue", "cancelled"])
  paymentStatus?: string

  @ApiPropertyOptional({
    example: "draft",
    enum: ["draft", "confirmed", "completed", "cancelled"],
  })
  @IsOptional()
  @IsEnum(["draft", "confirmed", "completed", "cancelled"])
  status?: string

  @ApiProperty({ example: "507f1f77bcf86cd799439014" })
  @IsString()
  @IsNotEmpty()
  createdBy: string

  @ApiPropertyOptional({ example: "Sale completed successfully" })
  @IsOptional()
  @IsString()
  notes?: string
}
