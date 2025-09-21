import { IsOptional, IsString, IsDateString, IsEnum } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { PaginationDto } from "../../../common/dto/pagination.dto"

export class AppointmentQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: "Filter by client ID" })
  @IsOptional()
  @IsString()
  clientId?: string

  @ApiPropertyOptional({ description: "Filter by appointment status" })
  @IsOptional()
  @IsEnum(["pending_confirmation", "confirmed", "in_progress", "completed", "cancelled", "no_show"])
  status?: string

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

  @ApiPropertyOptional({ description: "Filter by assigned staff" })
  @IsOptional()
  @IsString()
  assignedStaff?: string

  @ApiPropertyOptional({ description: "Search by service name or client name" })
  @IsOptional()
  @IsString()
  search?: string
}
