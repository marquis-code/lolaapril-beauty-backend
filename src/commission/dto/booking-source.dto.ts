// // src/commission/dto/booking-source.dto.ts
// import { IsString, IsOptional, IsEnum, IsEmail, IsUrl, IsNumber, IsBoolean, ValidateNested, IsArray, IsDateString, IsObject } from 'class-validator';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// export class BookingSourceDto {
//   @ApiProperty({
//     enum: ['marketplace', 'direct_link', 'qr_code', 'business_website', 
//            'google_search', 'social_media', 'referral', 'walk_in', 'phone'],
//     example: 'qr_code'
//   })
//   @IsEnum(['marketplace', 'direct_link', 'qr_code', 'business_website', 
//            'google_search', 'social_media', 'referral', 'walk_in', 'phone'])
//   sourceType: string

//   @ApiPropertyOptional({ example: 'QR-ABC123-XYZ' })
//   @IsOptional()
//   @IsString()
//   sourceIdentifier?: string

//   @ApiPropertyOptional({ example: 'TRACK-123456' })
//   @IsOptional()
//   @IsString()
//   trackingCode?: string

//   @ApiPropertyOptional({ example: 'REF-JOHN123' })
//   @IsOptional()
//   @IsString()
//   referralCode?: string

//   @ApiPropertyOptional({ example: 'google' })
//   @IsOptional()
//   @IsString()
//   utmSource?: string

//   @ApiPropertyOptional({ example: 'cpc' })
//   @IsOptional()
//   @IsString()
//   utmMedium?: string

//   @ApiPropertyOptional({ example: 'summer_sale' })
//   @IsOptional()
//   @IsString()
//   utmCampaign?: string

//   @ApiPropertyOptional({ example: '192.168.1.1' })
//   @IsOptional()
//   @IsString()
//   ipAddress?: string

//   @ApiPropertyOptional({ example: 'Mozilla/5.0...' })
//   @IsOptional()
//   @IsString()
//   userAgent?: string

//   @ApiPropertyOptional({ example: 'https://google.com' })
//   @IsOptional()
//   @IsString()
//   referrerUrl?: string
// }

import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class BookingSourceDto {
  // ✅ Make sourceType required with a default value approach
  @ApiProperty({
    enum: BookingSourceType,
    example: BookingSourceType.DIRECT_LINK,
    description: 'The source type of the booking'
  })
  @IsEnum(BookingSourceType)
  sourceType: BookingSourceType;  // ✅ Required, no optional operator

  @ApiPropertyOptional({ example: 'QR-ABC123-XYZ' })
  @IsOptional()
  @IsString()
  sourceIdentifier?: string;

  @ApiPropertyOptional({ example: 'TRACK-123456' })
  @IsOptional()
  @IsString()
  trackingCode?: string;

  @ApiPropertyOptional({ example: 'REF-JOHN123' })
  @IsOptional()
  @IsString()
  referralCode?: string;

  @ApiPropertyOptional({ example: 'CAMP-001' })
  @IsOptional()
  @IsString()
  campaignId?: string;

  @ApiPropertyOptional({ example: 'AFF-123' })
  @IsOptional()
  @IsString()
  affiliateId?: string;

  @ApiPropertyOptional({ example: 'google' })
  @IsOptional()
  @IsString()
  utmSource?: string;

  @ApiPropertyOptional({ example: 'cpc' })
  @IsOptional()
  @IsString()
  utmMedium?: string;

  @ApiPropertyOptional({ example: 'summer_sale' })
  @IsOptional()
  @IsString()
  utmCampaign?: string;

  @ApiPropertyOptional({ example: 'web' })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiPropertyOptional({ example: 'https://google.com' })
  @IsOptional()
  @IsString()
  referrer?: string;

  @ApiPropertyOptional({ example: 'https://google.com/search' })
  @IsOptional()
  @IsString()
  referrerUrl?: string;

  @ApiPropertyOptional({ example: '192.168.1.1' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0...' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}