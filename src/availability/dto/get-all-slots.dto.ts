// src/modules/availability/dto/get-all-slots.dto.ts
import { IsOptional, IsString, IsDateString } from 'class-validator'

export class GetAllSlotsDto {
  @IsString()
  businessId?: string

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