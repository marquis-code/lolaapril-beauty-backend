// src/modules/booking/dto/get-bookings.dto.ts
import { IsOptional, IsString, IsDateString, IsIn } from 'class-validator'

export class GetBookingsDto {
  @IsOptional()
  @IsString()
  businessId?: string

  @IsOptional()
  @IsString()
  clientId?: string

  @IsOptional()
  @IsIn(['pending', 'confirmed', 'cancelled', 'expired', 'payment_failed'])
  status?: string

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