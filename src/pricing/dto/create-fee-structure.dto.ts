import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomRulesDto {
  @ApiPropertyOptional({ example: 5000, description: 'No-show fee amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  noShowFee?: number;

  @ApiPropertyOptional({ example: 2000, description: 'Cancellation fee amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cancellationFee?: number;

  @ApiPropertyOptional({ example: 1000, description: 'Minimum booking amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minBookingAmount?: number;
}

export class CreateFeeStructureDto {
  @ApiPropertyOptional({ example: '674e1d77a83f982823675034', description: 'Pricing tier ID (optional)' })
  @IsOptional()
  @IsString()
  pricingTierId?: string;

  @ApiProperty({ example: 2.5, description: 'Platform fee percentage (e.g., 2.5 for 2.5%)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  platformFeePercentage: number;

  @ApiPropertyOptional({ example: 100, description: 'Fixed platform fee amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  platformFeeFixed?: number;

  @ApiPropertyOptional({ example: '2026-01-20T00:00:00.000Z', description: 'Effective from date (ISO format)' })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional({ example: '2027-01-20T00:00:00.000Z', description: 'Effective until date (ISO format)' })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @ApiPropertyOptional({ example: false, description: 'Whether this is a grandfathered pricing' })
  @IsOptional()
  @IsBoolean()
  isGrandfathered?: boolean;

  @ApiPropertyOptional({ type: CustomRulesDto, description: 'Custom fee rules' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomRulesDto)
  customRules?: CustomRulesDto;
}
