
// src/modules/availability/dto/get-available-slots.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, Min, IsDateString } from 'class-validator'
import { Type, Transform } from 'class-transformer'

export class GetAvailableSlotsDto {
  @IsOptional()
  @IsString()
  businessId?: string

  @IsDateString()
  @IsNotEmpty()
  date: string

  @IsNotEmpty({ message: 'At least one service must be selected' })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value]
    return Array.isArray(value) ? value : []
  })
  serviceIds: string[]

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
  durationOverride?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @Transform(({ value }) => value ? parseInt(value, 10) : 0)
  bufferTime?: number = 0

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || 'sequential')
  bookingType?: 'sequential' | 'parallel' = 'sequential'
}