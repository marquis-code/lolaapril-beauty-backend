// dto/create-pricing-tier.dto.ts
import { IsString, IsNumber, IsBoolean, IsObject, Min, Max } from 'class-validator';

export class CreatePricingTierDto {
  @IsString()
  tierName: string;

  @IsNumber()
  @Min(1)
  tierLevel: number;

  @IsNumber()
  @Min(0)
  monthlyPrice: number;

  @IsNumber()
  @Min(0)
  yearlyPrice: number;

  @IsObject()
  features: {
    maxStaff: number;
    maxBookingsPerMonth: number;
    customBranding: boolean;
    analyticsAccess: boolean;
    prioritySupport: boolean;
    multiLocation: boolean;
    apiAccess: boolean;
  };

  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate: number;

  @IsString()
  description: string;
}
