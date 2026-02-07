// src/modules/commission/dto/dispute-commission.dto.ts
import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

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