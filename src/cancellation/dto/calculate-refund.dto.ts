import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalculateRefundDto {
  @ApiProperty({ 
    example: '2024-12-25T14:00:00Z',
    description: 'Appointment date and time (ISO format)'
  })
  @IsString()
  appointmentDate: string;

  @ApiProperty({ 
    example: 5000,
    description: 'Total amount paid for the appointment'
  })
  @IsNumber()
  @Min(0)
  paidAmount: number;

  @ApiPropertyOptional({ 
    example: 1000,
    description: 'Deposit amount paid (if any)'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;
}