// src/modules/availability/dto/get-all-slots.dto.ts
import { IsOptional, IsString, IsDateString } from 'class-validator'
import { ApiPropertyOptional } from "@nestjs/swagger"

export class GetAllSlotsDto {
  @ApiPropertyOptional({ 
    description: 'Business ID (use either businessId or subdomain)' 
  })
  @IsOptional()  // ← Make sure this is here
  @IsString()
  businessId?: string

    @ApiPropertyOptional({ 
    description: 'Business subdomain (use either businessId or subdomain)',
    example: 'luxebeauty'
  })
  @IsOptional()
  @IsString()
  subdomain?: string

  @IsOptional()
  @IsDateString()
  startDate?: string // Optional: Filter from this date

  @IsOptional()
  @IsDateString()
  endDate?: string // Optional: Filter to this date

  @IsOptional()
  @IsString()
  staffId?: string // Optional: Filter by specific staff
}