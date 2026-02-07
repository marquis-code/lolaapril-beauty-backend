
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmailTemplateDocument = EmailTemplate & Document;

@Schema({ timestamps: true })
export class EmailTemplate {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  templateType: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true, type: String })
  htmlContent: string;

  @Prop({ type: String })
  textContent?: string;

  @Prop({ type: [String], default: [] })
  variables: string[];

  @Prop({ default: false })
  isCustom: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);

// Indexes
EmailTemplateSchema.index({ tenantId: 1, templateType: 1 });
EmailTemplateSchema.index({ tenantId: 1, isActive: 1 });
