// src/modules/booking/dto/confirm-booking.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsMongoId, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class StaffServiceAssignmentDto {
  @ApiProperty({ 
    description: 'Staff member ID',
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId()
  staffId: string

  @ApiProperty({ 
    description: 'Service ID this staff will handle',
    example: '507f1f77bcf86cd799439012'
  })
  @IsMongoId()
  serviceId: string

  @ApiPropertyOptional({ 
    description: 'Staff member name (optional)',
    example: 'John Doe'
  })
  @IsOptional()
  @IsString()
  staffName?: string
}

export class ConfirmBookingDto {
  @ApiPropertyOptional({ 
    description: 'Single staff ID (deprecated - use staffAssignments instead)',
    example: '507f1f77bcf86cd799439011'
  })
  @IsOptional()
  @IsMongoId()
  staffId?: string

  @ApiPropertyOptional({ 
    description: 'Multiple staff assignments per service',
    type: [StaffServiceAssignmentDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StaffServiceAssignmentDto)
  staffAssignments?: StaffServiceAssignmentDto[]

  @ApiPropertyOptional({ 
    description: 'Additional notes for the confirmation',
    example: 'Client prefers window seat'
  })
  @IsOptional()
  @IsString()
  notes?: string
}

// Response interface for staff assignments
export interface StaffAssignmentResult {
  staffId: string
  serviceId: string
  staffName?: string
  assignedAt: Date
  status: 'assigned' | 'pending' | 'confirmed'
}