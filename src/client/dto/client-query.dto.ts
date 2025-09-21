import { IsOptional, IsString, IsBoolean } from "class-validator"
import { Type } from "class-transformer"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { PaginationDto } from "../../../common/dto/pagination.dto"

export class ClientQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: "Search by name, email, or phone" })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ description: "Filter by client source" })
  @IsOptional()
  @IsString()
  clientSource?: string

  @ApiPropertyOptional({ description: "Filter by gender" })
  @IsOptional()
  @IsString()
  gender?: string

  @ApiPropertyOptional({ description: "Filter by active status" })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean

  @ApiPropertyOptional({ description: "Filter by country" })
  @IsOptional()
  @IsString()
  country?: string
}
