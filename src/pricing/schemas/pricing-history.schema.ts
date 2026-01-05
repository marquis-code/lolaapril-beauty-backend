// // schemas/pricing-history.schema.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type PricingHistoryDocument = PricingHistory & Document;

// @Schema({ timestamps: true })
// export class PricingHistory {
//   @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
//   tenantId: Types.ObjectId;

//   @Prop({ required: true })
//   changeType: string; // 'upgrade', 'downgrade', 'commission_change'

//   @Prop({ type: Types.ObjectId, ref: 'PricingTier' })
//   oldTierId: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'PricingTier' })
//   newTierId: Types.ObjectId;

//   @Prop()
//   oldCommissionRate: number;

//   @Prop()
//   newCommissionRate: number;

//   @Prop({ required: true })
//   effectiveDate: Date;

//   @Prop()
//   reason: string;

//   @Prop({ type: Types.ObjectId, ref: 'User' })
//   changedBy: Types.ObjectId;
// }

// export const PricingHistorySchema = SchemaFactory.createForClass(PricingHistory);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
export type PricingHistoryDocument = PricingHistory & Document
@Schema({ timestamps: true })
export class PricingHistory {
// ✅ CHANGED: tenant → business
@Prop({ type: Types.ObjectId, ref: 'Business', required: true })
businessId: Types.ObjectId
@Prop({ required: true })
changeType: string
@Prop({ type: Types.ObjectId, ref: 'PricingTier' })
oldTierId: Types.ObjectId
@Prop({ type: Types.ObjectId, ref: 'PricingTier' })
newTierId: Types.ObjectId
@Prop()
oldCommissionRate: number
@Prop()
newCommissionRate: number
@Prop({ required: true })
effectiveDate: Date
@Prop()
reason: string
@Prop({ type: Types.ObjectId, ref: 'User' })
changedBy: Types.ObjectId
}
export const PricingHistorySchema = SchemaFactory.createForClass(PricingHistory)