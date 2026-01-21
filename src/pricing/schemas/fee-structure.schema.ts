// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type FeeStructureDocument = FeeStructure & Document;

// @Schema({ timestamps: true })
// export class FeeStructure {
//   @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
//   tenantId: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'PricingTier', required: true })
//   pricingTierId: Types.ObjectId;

//   @Prop({ required: true })
//   effectiveFrom: Date;

//   @Prop()
//   effectiveTo: Date;

//   @Prop({ required: true })
//   platformFeePercentage: number;

//   @Prop({ default: 0 })
//   platformFeeFixed: number; // Fixed fee per transaction

//   @Prop({ default: false })
//   isGrandfathered: boolean; // Legacy pricing protection

//   @Prop({ type: Object })
//   customRules: {
//     noShowFee?: number;
//     cancellationFee?: number;
//     minBookingAmount?: number;
//   };
// }

// export const FeeStructureSchema = SchemaFactory.createForClass(FeeStructure);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
export type FeeStructureDocument = FeeStructure & Document
@Schema({ timestamps: true })
export class FeeStructure {
// ✅ CHANGED: tenant → business
@Prop({ type: Types.ObjectId, ref: 'Business', required: true })
businessId: Types.ObjectId
@Prop({ type: Types.ObjectId, ref: 'PricingTier', required: false })
pricingTierId: Types.ObjectId
@Prop({ required: true })
effectiveFrom: Date
@Prop()
effectiveTo: Date
@Prop({ required: true })
platformFeePercentage: number
@Prop({ default: 0 })
platformFeeFixed: number
@Prop({ default: false })
isGrandfathered: boolean
@Prop({ type: Object })
customRules: {
noShowFee?: number
cancellationFee?: number
minBookingAmount?: number
}
}
export const FeeStructureSchema = SchemaFactory.createForClass(FeeStructure)