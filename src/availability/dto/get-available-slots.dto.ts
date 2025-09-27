// src/modules/availability/dto/get-available-slots.dto.ts
import { IsNotEmpty, IsDateString, IsString, IsNumber } from 'class-validator'

export class GetAvailableSlotsDto {
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
  @IsNumber()
  duration: number
}