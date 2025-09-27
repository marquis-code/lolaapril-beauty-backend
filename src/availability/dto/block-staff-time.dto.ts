// src/modules/availability/dto/block-staff-time.dto.ts
import { IsNotEmpty, IsDateString, IsString } from 'class-validator'

export class BlockStaffTimeDto {
  @IsNotEmpty()
  @IsString()
  staffId: string

  @IsNotEmpty()
  @IsDateString()
  date: Date

  @IsNotEmpty()
  @IsString()
  startTime: string

  @IsNotEmpty()
  @IsString()
  endTime: string

  @IsNotEmpty()
  @IsString()
  reason: string
}