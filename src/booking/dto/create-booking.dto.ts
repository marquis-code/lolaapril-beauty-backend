
import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ServiceBookingDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  serviceId: string

  @ApiPropertyOptional({ example: 15 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  bufferTime?: number

  @ApiPropertyOptional({ description: 'Number of people for this service', example: 2 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number
}

export class BookingSourceDto {
  @ApiProperty({
    enum: ['marketplace', 'direct_link', 'qr_code', 'business_website',
      'google_search', 'social_media', 'referral', 'walk_in', 'phone'],
    example: 'qr_code'
  })
  @IsString()
  @IsNotEmpty()
  sourceType: string

  @ApiPropertyOptional({ example: 'QR-ABC123-XYZ' })
  @IsOptional()
  @IsString()
  sourceIdentifier?: string

  @ApiPropertyOptional({ example: 'TRACK-123456' })
  @IsOptional()
  @IsString()
  trackingCode?: string

  @ApiPropertyOptional({ example: 'REF-JOHN123' })
  @IsOptional()
  @IsString()
  referralCode?: string

  @ApiPropertyOptional({ example: 'google' })
  @IsOptional()
  @IsString()
  utmSource?: string

  @ApiPropertyOptional({ example: 'cpc' })
  @IsOptional()
  @IsString()
  utmMedium?: string

  @ApiPropertyOptional({ example: 'summer_sale' })
  @IsOptional()
  @IsString()
  utmCampaign?: string

  @ApiPropertyOptional({ example: '192.168.1.1' })
  @IsOptional()
  @IsString()
  ipAddress?: string

  @ApiPropertyOptional({ example: 'Mozilla/5.0...' })
  @IsOptional()
  @IsString()
  userAgent?: string

  @ApiPropertyOptional({ example: 'https://google.com' })
  @IsOptional()
  @IsString()
  referrerUrl?: string
}

// Base DTO (for backward compatibility)
export class CreateBookingDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  businessId: string

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsNotEmpty()
  clientId: string

  @ApiProperty({ type: [ServiceBookingDto] })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ServiceBookingDto)
  services: ServiceBookingDto[]

  @ApiProperty({ example: '2024-12-25' })
  @IsString()
  @IsNotEmpty()
  preferredDate: string

  @ApiProperty({ example: '14:00' })
  @IsString()
  @IsNotEmpty()
  preferredStartTime: string

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  clientName: string

  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  @IsNotEmpty()
  clientEmail: string

  @ApiPropertyOptional({ example: '+2348012345678' })
  @IsString()
  @IsOptional()
  clientPhone?: string

  @ApiPropertyOptional({ example: 'Please use the side entrance' })
  @IsString()
  @IsOptional()
  specialRequests?: string

  @ApiPropertyOptional({ example: 'Client prefers a quiet appointment' })
  @IsString()
  @IsOptional()
  bookingNotes?: string
}

// Extended DTO with source tracking
export class CreateBookingWithSourceDto extends CreateBookingDto {
  @ApiProperty({ type: BookingSourceDto })
  @ValidateNested()
  @Type(() => BookingSourceDto)
  bookingSource: BookingSourceDto
}
