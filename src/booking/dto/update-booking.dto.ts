// src/modules/booking/dto/update-booking-status.dto.ts
import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator'

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsIn(['pending', 'confirmed', 'cancelled', 'expired', 'payment_failed', 'slot_unavailable'])
  status: string

  @IsOptional()
  @IsString()
  reason?: string

  @IsOptional()
  @IsString()
  updatedBy?: string
}