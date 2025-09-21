import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, IsEnum, Min } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateClientMembershipDto {
  @ApiProperty({ example: "507f1f77bcf86cd799439011" })
  @IsString()
  @IsNotEmpty()
  clientId: string

  @ApiProperty({ example: "507f1f77bcf86cd799439012" })
  @IsString()
  @IsNotEmpty()
  membershipId: string

  @ApiProperty({ example: "MEM2025001" })
  @IsString()
  @IsNotEmpty()
  membershipNumber: string

  @ApiProperty({ example: "2025-01-01T00:00:00.000Z" })
  @IsDateString()
  joinDate: Date

  @ApiPropertyOptional({ example: "2025-12-31T23:59:59.999Z" })
  @IsOptional()
  @IsDateString()
  expiryDate?: Date

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPoints?: number

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalSpent?: number

  @ApiPropertyOptional({ example: "Bronze" })
  @IsOptional()
  @IsString()
  currentTier?: string

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tierProgress?: number

  @ApiPropertyOptional({
    example: "active",
    enum: ["active", "inactive", "expired", "suspended"],
  })
  @IsOptional()
  @IsEnum(["active", "inactive", "expired", "suspended"])
  status?: string
}
