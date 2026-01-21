// src/booking/dto/reschedule-booking.dto.ts
import { IsString, IsDateString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RescheduleBookingDto {
  @ApiProperty({
    example: '2026-01-25',
    description: 'New preferred date for the booking (YYYY-MM-DD)'
  })
  @IsDateString()
  newPreferredDate: string

  @ApiProperty({
    example: '10:00',
    description: 'New preferred start time (HH:mm format)'
  })
  @IsString()
  newPreferredStartTime: string

  @ApiPropertyOptional({
    example: 'Client requested different time',
    description: 'Reason for rescheduling (optional)'
  })
  @IsOptional()
  @IsString()
  reason?: string
}
