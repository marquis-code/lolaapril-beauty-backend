import { IsOptional, IsEnum, IsBoolean, IsNumber, IsString, Min } from "class-validator"
import { Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { ServiceCategory } from "../../schemas/service.schema"

export class ServiceFilterDto {
  @ApiProperty({ required: false, enum: ServiceCategory })
  @IsOptional()
  @IsEnum(ServiceCategory)
  category?: ServiceCategory

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number.parseFloat(value))
  @IsNumber()
  @Min(0)
  minPrice?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number.parseFloat(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  minDuration?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  maxDuration?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: string

  @ApiProperty({ required: false, enum: ["asc", "desc"] })
  @IsOptional()
  @IsEnum(["asc", "desc"])
  sortOrder?: "asc" | "desc"

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number
}
