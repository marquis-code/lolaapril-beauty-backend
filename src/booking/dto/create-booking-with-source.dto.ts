// src/booking/dto/create-booking-with-source.dto.ts
import { IsString, IsOptional, IsEnum, IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CreateBookingDto } from './create-booking.dto'

export enum BookingSourceType {
  MARKETPLACE = 'marketplace',
  DIRECT_LINK = 'direct_link',
  QR_CODE = 'qr_code',
  BUSINESS_WEBSITE = 'business_website',
  GOOGLE_SEARCH = 'google_search',
  SOCIAL_MEDIA = 'social_media',
  REFERRAL = 'referral',
  WALK_IN = 'walk_in',
  PHONE = 'phone'
}

/**
 * BookingSourceDto - Tracks the source/origin of a booking
 * Note: sourceType is now REQUIRED to ensure proper commission tracking
 */
export class BookingSourceDto {
  @ApiProperty({
    enum: BookingSourceType,
    example: BookingSourceType.DIRECT_LINK,
    description: 'The source type of the booking (REQUIRED for commission tracking)'
  })
  @IsEnum(BookingSourceType)
  sourceType: BookingSourceType; // ✅ REQUIRED - No optional operator

  @ApiPropertyOptional({
    example: 'web',
    description: 'The channel through which booking was made'
  })
  @IsOptional()
  @IsString()
  channel?: string; // 'web', 'mobile', 'api', 'widget', etc.

  @ApiPropertyOptional({
    example: 'https://google.com',
    description: 'The referrer URL'
  })
  @IsOptional()
  @IsString()
  referrer?: string;

  @ApiPropertyOptional({
    example: 'https://google.com/search',
    description: 'The full referrer URL'
  })
  @IsOptional()
  @IsString()
  referrerUrl?: string;

  @ApiPropertyOptional({
    example: 'TRACK-123456',
    description: 'Tracking code for analytics'
  })
  @IsOptional()
  @IsString()
  trackingCode?: string;

  @ApiPropertyOptional({
    example: 'CAMP-001',
    description: 'Campaign identifier'
  })
  @IsOptional()
  @IsString()
  campaignId?: string;

  @ApiPropertyOptional({
    example: 'AFF-123',
    description: 'Affiliate identifier'
  })
  @IsOptional()
  @IsString()
  affiliateId?: string;

  @ApiPropertyOptional({
    example: 'QR-ABC123-XYZ',
    description: 'QR code ID, tracking link ID, etc.'
  })
  @IsOptional()
  @IsString()
  sourceIdentifier?: string;

  @ApiPropertyOptional({
    example: 'REF-JOHN123',
    description: 'Referral code'
  })
  @IsOptional()
  @IsString()
  referralCode?: string;

  @ApiPropertyOptional({
    example: 'google',
    description: 'UTM source parameter'
  })
  @IsOptional()
  @IsString()
  utmSource?: string;

  @ApiPropertyOptional({
    example: 'cpc',
    description: 'UTM medium parameter'
  })
  @IsOptional()
  @IsString()
  utmMedium?: string;

  @ApiPropertyOptional({
    example: 'summer_sale',
    description: 'UTM campaign parameter'
  })
  @IsOptional()
  @IsString()
  utmCampaign?: string;

  @ApiPropertyOptional({
    example: '192.168.1.1',
    description: 'Client IP address'
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({
    example: 'Mozilla/5.0...',
    description: 'Client user agent string'
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for tracking'
  })
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * CreateBookingWithSourceDto - Extended booking DTO with source tracking
 * Includes legacy field support for backward compatibility
 */
export class CreateBookingWithSourceDto extends CreateBookingDto {
  @ApiProperty({
    type: BookingSourceDto,
    description: 'Booking source information for tracking and commission calculation'
  })
  @IsObject()
  @ValidateNested()
  @Type(() => BookingSourceDto)
  bookingSource: BookingSourceDto;

  // ============================================
  // LEGACY SUPPORT FIELDS
  // These fields are maintained for backward compatibility
  // They will be mapped to the bookingSource object
  // ============================================

  @ApiPropertyOptional({
    enum: BookingSourceType,
    example: BookingSourceType.DIRECT_LINK,
    description: 'DEPRECATED: Use bookingSource.sourceType instead'
  })
  @IsOptional()
  @IsEnum(BookingSourceType)
  sourceType?: BookingSourceType;

  @ApiPropertyOptional({
    example: 'QR-ABC123-XYZ',
    description: 'DEPRECATED: Use bookingSource.sourceIdentifier instead'
  })
  @IsOptional()
  @IsString()
  sourceIdentifier?: string;

  @ApiPropertyOptional({
    example: 'REF-JOHN123',
    description: 'DEPRECATED: Use bookingSource.referralCode instead'
  })
  @IsOptional()
  @IsString()
  referralCode?: string;

  @ApiPropertyOptional({
    example: 'google',
    description: 'DEPRECATED: Use bookingSource.utmSource instead'
  })
  @IsOptional()
  @IsString()
  utmSource?: string;

  @ApiPropertyOptional({
    example: 'cpc',
    description: 'DEPRECATED: Use bookingSource.utmMedium instead'
  })
  @IsOptional()
  @IsString()
  utmMedium?: string;

  @ApiPropertyOptional({
    example: 'summer_sale',
    description: 'DEPRECATED: Use bookingSource.utmCampaign instead'
  })
  @IsOptional()
  @IsString()
  utmCampaign?: string;
}