// import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, Min } from 'class-validator'
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

// export class UpgradePlanDto {
//   @ApiProperty({ 
//     description: 'Plan type to upgrade to',
//     enum: ['basic', 'standard', 'premium', 'enterprise']
//   })
//   @IsString()
//   @IsEnum(['basic', 'standard', 'premium', 'enterprise'])
//   planType: string

//   @ApiPropertyOptional({ description: 'Billing cycle' })
//   @IsOptional()
//   @IsEnum(['monthly', 'yearly'])
//   billingCycle?: string
// }

// export class CancelSubscriptionDto {
//   @ApiProperty({ description: 'Reason for cancellation' })
//   @IsString()
//   reason: string

//   @ApiPropertyOptional({ description: 'Immediate cancellation or at period end' })
//   @IsOptional()
//   @IsBoolean()
//   immediate?: boolean
// }

// export class CheckLimitDto {
//   @ApiPropertyOptional({ 
//     description: 'Context to check limits for',
//     enum: ['booking', 'staff', 'service']
//   })
//   @IsOptional()
//   @IsEnum(['booking', 'staff', 'service'])
//   context?: 'booking' | 'staff' | 'service'
// }



import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpgradePlanDto {
  @ApiProperty({ 
    description: 'Plan type to upgrade to',
    enum: ['basic', 'standard', 'premium', 'enterprise']
  })
  @IsString()
  @IsEnum(['basic', 'standard', 'premium', 'enterprise'])
  planType: string

  @ApiPropertyOptional({ description: 'Billing cycle' })
  @IsOptional()
  @IsEnum(['monthly', 'yearly'])
  billingCycle?: 'monthly' | 'yearly'  // Changed from string to literal union type
}

export class CancelSubscriptionDto {
  @ApiProperty({ description: 'Reason for cancellation' })
  @IsString()
  reason: string

  @ApiPropertyOptional({ description: 'Immediate cancellation or at period end' })
  @IsOptional()
  @IsBoolean()
  immediate?: boolean
}

export class CheckLimitDto {
  @ApiPropertyOptional({ 
    description: 'Context to check limits for',
    enum: ['booking', 'staff', 'service']
  })
  @IsOptional()
  @IsEnum(['booking', 'staff', 'service'])
  context?: 'booking' | 'staff' | 'service'
}