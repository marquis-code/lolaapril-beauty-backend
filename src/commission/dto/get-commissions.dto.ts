// src/modules/commission/dto/get-commissions.dto.ts
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class GetCommissionsDto {
  @ApiPropertyOptional({ 
    enum: ['pending', 'calculated', 'approved', 'paid', 'disputed', 'waived']
  })
  @IsOptional()
  @IsEnum(['pending', 'calculated', 'approved', 'paid', 'disputed', 'waived'])
  status?: string

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({ example: '50' })
  @IsOptional()
  @IsString()
  limit?: string

  @ApiPropertyOptional({ example: '0' })
  @IsOptional()
  @IsString()
  offset?: string
}