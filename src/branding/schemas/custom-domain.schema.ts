

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
// import { Document, Types } from "mongoose"

// export type CustomDomainDocument = CustomDomain & Document;

// @Schema({ timestamps: true })
// export class CustomDomain {
//   @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
//   tenantId: Types.ObjectId;

//   @Prop({ required: true, unique: true })
//   domain: string;

//   @Prop({ required: true })
//   subdomain: string; // e.g., "luxuryspa" from luxuryspa.yourbookingapp.com

//   @Prop({ default: 'pending' })
//   verificationStatus: string; // 'pending', 'verified', 'failed'

//   @Prop()
//   sslStatus: string; // 'pending', 'active', 'failed'

//   @Prop({ type: Object })
//   dnsRecords: {
//     type: string;
//     name: string;
//     value: string;
//     verified: boolean;
//   }[];

//   @Prop()
//   verifiedAt: Date;

//   @Prop({ default: true })
//   isActive: boolean;
// }

// export const CustomDomainSchema = SchemaFactory.createForClass(CustomDomain);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CustomDomainDocument = CustomDomain & Document;

@Schema({ timestamps: true })
export class CustomDomain {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  domain: string;

  @Prop({ required: true })
  subdomain: string;

  @Prop({ 
    type: String,
    enum: ['pending', 'verified', 'failed'],
    default: 'pending'
  })
  verificationStatus: string;

  @Prop({ 
    type: String,
    enum: ['pending', 'active', 'failed', 'expired'],
    default: 'pending'
  })
  sslStatus: string;

  @Prop({
    type: [{
      type: { type: String, required: true },
      name: { type: String, required: true },
      value: { type: String, required: true },
      verified: { type: Boolean, default: false },
    }],
    default: []
  })
  dnsRecords: Array<{
    type: string;
    name: string;
    value: string;
    verified: boolean;
  }>;

  @Prop()
  verifiedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  requestedBy?: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CustomDomainSchema = SchemaFactory.createForClass(CustomDomain);

// Indexes
CustomDomainSchema.index({ tenantId: 1 });
CustomDomainSchema.index({ domain: 1 }, { unique: true });
CustomDomainSchema.index({ verificationStatus: 1 });
