// src/modules/availability/dto/get-available-slots.dto.ts
import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class GetAvailableSlotsDto {
  @IsString()
  @IsOptional() // Make optional since middleware will set it
  businessId?: string

  @IsString()
  serviceId: string

  @IsDateString()
  date: string

  @IsNumber()
  @Type(() => Number)
  duration: number
}