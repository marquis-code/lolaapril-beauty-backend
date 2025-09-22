import { IsOptional, IsString, IsDateString, IsEnum } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { PaginationDto } from "../../common/dto/pagination.dto"

export class BookingQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: "Filter by client ID" })
  @IsOptional()
  @IsString()
  clientId?: string

  @ApiPropertyOptional({ description: "Filter by booking status" })
  @IsOptional()
  @IsEnum(["pending", "confirmed", "in_progress", "completed", "cancelled", "no_show"])
  status?: string

  @ApiPropertyOptional({ description: "Filter by booking source" })
  @IsOptional()
  @IsEnum(["online", "phone", "walk_in", "admin"])
  bookingSource?: string

  @ApiPropertyOptional({ description: "Filter by date (YYYY-MM-DD)" })
  @IsOptional()
  @IsString()
  date?: string

  @ApiPropertyOptional({ description: "Filter by date range start" })
  @IsOptional()
  @IsDateString()
  startDate?: string

  @ApiPropertyOptional({ description: "Filter by date range end" })
  @IsOptional()
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({ description: "Search by service name or client name" })
  @IsOptional()
  @IsString()
  search?: string
}
