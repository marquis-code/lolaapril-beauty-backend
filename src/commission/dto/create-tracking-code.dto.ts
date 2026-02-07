// src/modules/commission/dto/create-tracking-code.dto.ts
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateTrackingCodeDto {
  @ApiProperty({ example: 'Summer Campaign QR Code' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ 
    enum: ['qr_code', 'direct_link', 'social_media', 'email_campaign'],
    example: 'qr_code'
  })
  @IsEnum(['qr_code', 'direct_link', 'social_media', 'email_campaign'])
  codeType: 'qr_code' | 'direct_link' | 'social_media' | 'email_campaign'

  @ApiPropertyOptional({ example: 'QR code for in-store posters' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date
}