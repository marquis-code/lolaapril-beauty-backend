import { IsString, IsOptional, IsEnum, IsEmail, IsUrl, IsNumber, IsBoolean, ValidateNested, IsArray, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetCommissionsDto {
  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  businessId?: string

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
