import { IsOptional, IsString, IsDateString, IsEnum } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { PaginationDto } from "../../common/dto/pagination.dto"

export class PaymentQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: "Filter by business ID" })
  @IsOptional()
  @IsString()
  businessId?: string

  @ApiPropertyOptional({ description: "Filter by client ID" })
  @IsOptional()
  @IsString()
  clientId?: string

  @ApiPropertyOptional({ description: "Filter by appointment ID" })
  @IsOptional()
  @IsString()
  appointmentId?: string

  @ApiPropertyOptional({ description: "Filter by booking ID" })
  @IsOptional()
  @IsString()
  bookingId?: string

  @ApiPropertyOptional({ description: "Filter by payment status" })
  @IsOptional()
  @IsEnum(["pending", "processing", "completed", "failed", "refunded", "partially_refunded"])
  status?: string

  @ApiPropertyOptional({ description: "Filter by payment method" })
  @IsOptional()
  @IsEnum(["cash", "card", "bank_transfer", "mobile_money", "online"])
  paymentMethod?: string

  @ApiPropertyOptional({ description: "Filter by date range start" })
  @IsOptional()
  @IsDateString()
  startDate?: string

  @ApiPropertyOptional({ description: "Filter by date range end" })
  @IsOptional()
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({ description: "Search by payment reference or transaction ID" })
  @IsOptional()
  @IsString()
  search?: string
}
