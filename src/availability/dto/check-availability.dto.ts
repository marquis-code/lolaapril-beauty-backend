// src/modules/availability/dto/check-availability.dto.ts
import { IsNotEmpty, IsDateString, IsString, IsNumber } from 'class-validator'

export class CheckAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  businessId: string

  @IsNotEmpty()
  @IsString()
  serviceId: string

  @IsNotEmpty()
  @IsDateString()
  date: Date

  @IsNotEmpty()
  @IsString()
  startTime: string

  @IsNotEmpty()
  @IsNumber()
  duration: number
}
