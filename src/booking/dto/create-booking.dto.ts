// // src/modules/booking/dto/create-booking.dto.ts
// import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber, Min, ValidateNested } from 'class-validator'
// import { Type } from 'class-transformer'
// import { BookingSourceDto } from '../../commission/dto/booking-source.dto'

// export class ServiceBookingDto {
//   @IsString()
//   @IsNotEmpty()
//   serviceId: string

//   @IsNumber()
//   @IsOptional()
//   @Min(0)
//   bufferTime?: number // Optional buffer time for this service
// }

// export class CreateBookingDto {
//   @IsString()
//   @IsNotEmpty()
//   businessId: string

//   @IsString()
//   @IsNotEmpty()
//   clientId: string

//   @IsArray()
//   @IsNotEmpty()
//   services: ServiceBookingDto[] // Updated to include buffer time

//   @IsString()
//   @IsNotEmpty()
//   preferredDate: string

//   @IsString()
//   @IsNotEmpty()
//   preferredStartTime: string

//   @IsString()
//   @IsNotEmpty()
//   clientName: string

//   @IsString()
//   @IsNotEmpty()
//   clientEmail: string

//   @IsString()
//   @IsNotEmpty()
//   clientPhone: string

//   @IsString()
//   @IsOptional()
//   specialRequests?: string

//   @IsNumber()
//   @IsOptional()
//   @Min(0)
//   additionalBufferTime?: number // Optional additional buffer time
// }

// export class CreateBookingWithSourceDto {
//   @IsString()
//   @IsNotEmpty()
//   businessId: string

//   @IsString()
//   @IsNotEmpty()
//   clientId: string

//   @IsArray()
//   @IsNotEmpty()
//   services: ServiceBookingDto[]

//   @IsString()
//   @IsNotEmpty()
//   preferredDate: string

//   @IsString()
//   @IsNotEmpty()
//   preferredStartTime: string

//   @IsString()
//   @IsNotEmpty()
//   clientName: string

//   @IsString()
//   @IsNotEmpty()
//   clientEmail: string

//   @IsString()
//   @IsNotEmpty()
//   clientPhone: string

//   @IsOptional()
//   @IsString()
//   specialRequests?: string

//   // NEW: Source tracking
//   @ValidateNested()
//   @Type(() => BookingSourceDto)
//   bookingSource: BookingSourceDto
// }


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

  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  @IsNotEmpty()
  clientPhone: string

  @ApiPropertyOptional({ example: 'Please use the side entrance' })
  @IsString()
  @IsOptional()
  specialRequests?: string
}

// Extended DTO with source tracking
export class CreateBookingWithSourceDto extends CreateBookingDto {
  @ApiProperty({ type: BookingSourceDto })
  @ValidateNested()
  @Type(() => BookingSourceDto)
  bookingSource: BookingSourceDto
}
