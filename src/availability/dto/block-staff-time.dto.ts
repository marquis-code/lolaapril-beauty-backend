// src/modules/availability/dto/block-staff-time.dto.ts
import { IsString, IsDateString, IsOptional } from 'class-validator'

export class BlockStaffTimeDto {
  @IsString()
  staffId: string

  @IsString()
  @IsOptional()
  businessId?: string

  @IsDateString()
  date: string // Keep as string

  @IsString()
  startTime: string

  @IsString()
  endTime: string

  @IsString()
  @IsOptional()
  reason?: string
}