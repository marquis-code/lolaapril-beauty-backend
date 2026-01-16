

import { IsString, IsDateString, IsNumber, IsOptional, IsArray } from 'class-validator'
import { Type, Transform } from 'class-transformer'

export class CheckAvailabilityDto {
  @IsString()
  @IsOptional()
  businessId?: string

  @IsDateString()
  date: string

  @IsString()
  startTime: string

  // Make serviceId optional (for backward compatibility)
  @IsOptional()
  @IsString()
  serviceId?: string

  // Add serviceIds for multi-service support
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value]
    return Array.isArray(value) ? value : []
  })
  serviceIds?: string[]

  // Make duration optional (will be calculated from services)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bufferTime?: number

  @IsOptional()
  @IsString()
  bookingType?: 'sequential' | 'parallel'
}