import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, Max, IsBoolean, IsArray, IsEnum, Min, ValidateNested, } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from 'class-transformer';

class PolicyRuleDto {
  @ApiProperty({ example: 48 })
  @IsNumber()
  @Min(0)
  hoursBeforeAppointment: number

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  refundPercentage: number

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  penaltyPercentage: number

  @ApiPropertyOptional({ example: 'Full refund for early cancellations' })
  @IsOptional()
  @IsString()
  description?: string
}

export class CreateCancellationPolicyDto {
  @ApiProperty({ example: 'Standard Cancellation Policy' })
  @IsString()
  @IsNotEmpty()
  policyName: string

  @ApiProperty({ example: true })
  @IsBoolean()
  requiresDeposit: boolean

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  @Max(100)
  depositPercentage: number

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumDepositAmount?: number

  @ApiProperty({ example: 24 })
  @IsNumber()
  @Min(0)
  cancellationWindowHours: number

  @ApiProperty({ type: [PolicyRuleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PolicyRuleDto)
  rules: PolicyRuleDto[]

  @ApiProperty({ example: true })
  @IsBoolean()
  allowSameDayCancellation: boolean

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  sameDayRefundPercentage: number

  @ApiPropertyOptional({ example: [24, 4, 1] })
  @IsOptional()
  @IsArray()
  reminderHours?: number[]

  @ApiPropertyOptional({ example: 'Policy applies to all services' })
  @IsOptional()
  @IsString()
  description?: string
}