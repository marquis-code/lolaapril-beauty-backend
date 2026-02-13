// src/modules/booking/dto/update-booking-status.dto.ts
import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator'

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsIn(['pending', 'confirmed', 'completed', 'cancelled', 'expired', 'payment_failed', 'slot_unavailable', 'rejected', 'deposit_paid'])
  status: string

  @IsOptional()
  @IsString()
  reason?: string

  @IsOptional()
  @IsString()
  updatedBy?: string
}