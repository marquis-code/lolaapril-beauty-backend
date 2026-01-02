// ========================================
// PRICING MODULE - Fee Transparency & Grandfathered Plans
// ========================================

// schemas/pricing-tier.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PricingTierDocument = PricingTier & Document;

@Schema({ timestamps: true })
export class PricingTier {
  @Prop({ required: true, unique: true })
  tierName: string;

  @Prop({ required: true })
  tierLevel: number; // 1=basic, 2=pro, 3=enterprise

  @Prop({ required: true })
  monthlyPrice: number;

  @Prop({ required: true })
  yearlyPrice: number;

  @Prop({ type: Object })
  features: {
    maxStaff: number;
    maxBookingsPerMonth: number;
    customBranding: boolean;
    analyticsAccess: boolean;
    prioritySupport: boolean;
    multiLocation: boolean;
    apiAccess: boolean;
  };

  @Prop({ required: true })
  commissionRate: number; // Percentage (e.g., 5 = 5%)

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  description: string;
}

export const PricingTierSchema = SchemaFactory.createForClass(PricingTier);