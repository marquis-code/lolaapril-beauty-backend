import { IsOptional, IsString, IsDateString, IsEnum } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { PaginationDto } from "../../../common/dto/pagination.dto"

export class VoucherQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: "Filter by voucher status" })
  @IsOptional()
  @IsEnum(["active", "inactive", "expired", "used_up"])
  status?: string

  @ApiPropertyOptional({ description: "Filter by discount type" })
  @IsOptional()
  @IsEnum(["percentage", "fixed_amount", "service_discount", "buy_one_get_one"])
  discountType?: string

  @ApiPropertyOptional({ description: "Filter by valid from date" })
  @IsOptional()
  @IsDateString()
  validFrom?: string

  @ApiPropertyOptional({ description: "Filter by valid until date" })
  @IsOptional()
  @IsDateString()
  validUntil?: string

  @ApiPropertyOptional({ description: "Search by voucher code or name" })
  @IsOptional()
  @IsString()
  search?: string
}
