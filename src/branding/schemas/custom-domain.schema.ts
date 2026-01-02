// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
// import { Document, Types } from "mongoose"

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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from "mongoose"

export type CustomDomainDocument = CustomDomain & Document;

@Schema({ timestamps: true })
export class CustomDomain {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  domain: string;

  @Prop({ required: true })
  subdomain: string; // e.g., "luxuryspa" from luxuryspa.yourbookingapp.com

  @Prop({ default: 'pending' })
  verificationStatus: string; // 'pending', 'verified', 'failed'

  @Prop()
  sslStatus: string; // 'pending', 'active', 'failed'

  @Prop({ type: Object })
  dnsRecords: {
    type: string;
    name: string;
    value: string;
    verified: boolean;
  }[];

  @Prop()
  verifiedAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const CustomDomainSchema = SchemaFactory.createForClass(CustomDomain);