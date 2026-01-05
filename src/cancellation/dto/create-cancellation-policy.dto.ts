
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  Max, 
  IsBoolean, 
  IsArray, 
  Min, 
  ValidateNested 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class PolicyRuleDto {
  @ApiProperty({ 
    example: 48,
    description: 'Hours before appointment this rule applies'
  })
  @IsNumber()
  @Min(0)
  hoursBeforeAppointment: number;

  @ApiProperty({ 
    example: 100,
    description: 'Percentage of refund (0-100)'
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  refundPercentage: number;

  @ApiProperty({ 
    example: 0,
    description: 'Penalty percentage (0-100)'
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  penaltyPercentage: number;

  @ApiPropertyOptional({ 
    example: 'Full refund for early cancellations',
    description: 'Description of this rule'
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateCancellationPolicyDto {
  @ApiProperty({ 
    example: 'Standard Cancellation Policy',
    description: 'Name of the policy'
  })
  @IsString()
  @IsNotEmpty()
  policyName: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether deposits are required'
  })
  @IsBoolean()
  requiresDeposit: boolean;

  @ApiProperty({ 
    example: 20,
    description: 'Deposit percentage (0-100)'
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  depositPercentage: number;

  @ApiPropertyOptional({ 
    example: 1000,
    description: 'Minimum deposit amount in currency'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumDepositAmount?: number;

  @ApiProperty({ 
    example: 24,
    description: 'Minimum hours before appointment for free cancellation'
  })
  @IsNumber()
  @Min(0)
  cancellationWindowHours: number;

  @ApiProperty({ 
    type: [PolicyRuleDto],
    description: 'Cancellation rules based on notice period'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PolicyRuleDto)
  rules: PolicyRuleDto[];

  @ApiProperty({ 
    example: true,
    description: 'Allow same-day cancellations'
  })
  @IsBoolean()
  allowSameDayCancellation: boolean;

  @ApiProperty({ 
    example: 0,
    description: 'Refund percentage for same-day cancellations'
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  sameDayRefundPercentage: number;

  @ApiPropertyOptional({ 
    example: [24, 4, 1],
    description: 'Hours before appointment to send reminders'
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  reminderHours?: number[];

  @ApiPropertyOptional({ 
    example: 3,
    description: 'Max no-shows before requiring deposits'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxNoShowsBeforeDeposit?: number;

  @ApiPropertyOptional({ 
    example: 'Policy applies to all services',
    description: 'Policy description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    example: ['507f1f77bcf86cd799439011'],
    description: 'Service IDs this policy applies to (empty = all services)'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableServices?: string[];
}

export class UpdateCancellationPolicyDto extends PartialType(CreateCancellationPolicyDto) {}