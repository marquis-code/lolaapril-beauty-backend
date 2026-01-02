
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
// import { Document, Types } from "mongoose"

// @Schema({ timestamps: true })
// export class EmailTemplate {
//   @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
//   tenantId: Types.ObjectId;

//   @Prop({ required: true })
//   templateType: string; // 'booking_confirmation', 'reminder', 'cancellation', etc.

//   @Prop({ required: true })
//   subject: string;

//   @Prop({ required: true })
//   htmlContent: string;

//   @Prop()
//   textContent: string;

//   @Prop({ type: [String], default: [] })
//   variables: string[]; // Available template variables

//   @Prop({ default: false })
//   isCustom: boolean; // If false, uses system default

//   @Prop({ default: true })
//   isActive: boolean;
// }

// export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from "mongoose"

export type EmailTemplateDocument = EmailTemplate & Document;

@Schema({ timestamps: true })
export class EmailTemplate {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  templateType: string; // 'booking_confirmation', 'reminder', 'cancellation', etc.

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  htmlContent: string;

  @Prop()
  textContent: string;

  @Prop({ type: [String], default: [] })
  variables: string[]; // Available template variables

  @Prop({ default: false })
  isCustom: boolean; // If false, uses system default

  @Prop({ default: true })
  isActive: boolean;
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);