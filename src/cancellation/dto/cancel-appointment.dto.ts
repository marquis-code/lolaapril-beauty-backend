import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CancelAppointmentDto {
  @ApiProperty({ example: 'Personal emergency' })
  @IsString()
  @IsNotEmpty()
  reason: string

  @ApiPropertyOptional({ 
    enum: ['client', 'business', 'system'],
    example: 'client'
  })
  @IsOptional()
  @IsEnum(['client', 'business', 'system'])
  cancelledBy?: string

  @ApiPropertyOptional({ example: '+2348012345678' })
  @IsOptional()
  @IsString()
  contactPhone?: string
}