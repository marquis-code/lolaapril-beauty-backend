import { IsOptional, IsString, IsDateString, IsEnum } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { PaginationDto } from "../../../common/dto/pagination.dto"

export class SalesQueryDto extends PaginationDto {
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

  @ApiPropertyOptional({ description: "Filter by sale status" })
  @IsOptional()
  @IsEnum(["draft", "confirmed", "completed", "cancelled"])
  status?: string

  @ApiPropertyOptional({ description: "Filter by payment status" })
  @IsOptional()
  @IsEnum(["pending", "paid", "partially_paid", "overdue", "cancelled"])
  paymentStatus?: string

  @ApiPropertyOptional({ description: "Filter by staff member" })
  @IsOptional()
  @IsString()
  staffId?: string

  @ApiPropertyOptional({ description: "Filter by date range start" })
  @IsOptional()
  @IsDateString()
  startDate?: string

  @ApiPropertyOptional({ description: "Filter by date range end" })
  @IsOptional()
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({ description: "Search by sale number or client name" })
  @IsOptional()
  @IsString()
  search?: string
}
