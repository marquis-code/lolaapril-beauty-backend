import { IsOptional, IsString, IsBoolean, IsMongoId } from "class-validator"
import { Type } from "class-transformer"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { PaginationDto } from "../../common/dto/pagination.dto"

export class ServiceQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: "Search by service name or description" })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ 
    description: "Filter by category ObjectId",
    example: "64a1b2c3d4e5f6789012345a"
  })
  @IsOptional()
  @IsMongoId()
  category?: string

  @ApiPropertyOptional({ description: "Filter by service type" })
  @IsOptional()
  @IsString()
  serviceType?: string

  @ApiPropertyOptional({ description: "Filter by price type" })
  @IsOptional()
  @IsString()
  priceType?: string

  @ApiPropertyOptional({ description: "Filter by active status" })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean

  @ApiPropertyOptional({ description: "Filter by online booking availability" })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlineBookingEnabled?: boolean
}