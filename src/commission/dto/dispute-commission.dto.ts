import { IsString, IsOptional, IsEnum, IsEmail, IsUrl, IsNotEmpty, IsNumber, IsBoolean, ValidateNested, IsArray, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DisputeCommissionDto {
  @ApiProperty({ example: 'Client was acquired through our own Google Ads' })
  @IsString()
  @IsNotEmpty()
  reason: string

  @ApiProperty({ example: 'Business owner ID' })
  @IsString()
  @IsNotEmpty()
  disputedBy: string
}