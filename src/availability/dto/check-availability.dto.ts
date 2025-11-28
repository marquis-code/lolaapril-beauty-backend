// src/modules/availability/dto/check-availability.dto.ts
import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class CheckAvailabilityDto {
  @IsString()
  @IsOptional()
  businessId?: string

  @IsString()
  serviceId: string

  @IsDateString()
  date: string // Keep as string

  @IsString()
  startTime: string

  @IsNumber()
  @Type(() => Number)
  duration: number
}