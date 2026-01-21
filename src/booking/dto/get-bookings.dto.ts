// src/modules/booking/dto/get-bookings.dto.ts
import { IsOptional, IsString, IsDateString, IsIn, IsArray } from 'class-validator'

export class GetBookingsDto {
  @IsOptional()
  @IsString()
  businessId?: string

  @IsOptional()
  @IsString()
  clientId?: string

  @IsOptional()
  status?: string | string[]

  @IsOptional()
  @IsDateString()
  startDate?: Date

  @IsOptional()
  @IsDateString()
  endDate?: Date

  @IsOptional()
  @IsString()
  limit?: string

  @IsOptional()
  @IsString()
  offset?: string
}