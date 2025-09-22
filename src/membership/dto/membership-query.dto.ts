import { IsOptional, IsString, IsEnum, IsBoolean } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { PaginationDto } from "../../common/dto/pagination.dto"

export class MembershipQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: "Filter by membership type" })
  @IsOptional()
  @IsEnum(["points_based", "tier_based", "subscription", "prepaid"])
  membershipType?: string

  @ApiPropertyOptional({ description: "Filter by active status" })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiPropertyOptional({ description: "Search by membership name" })
  @IsOptional()
  @IsString()
  search?: string
}
