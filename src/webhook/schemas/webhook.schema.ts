
// webhook/schemas/webhook.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WebhookDocument = Webhook & Document;

@Schema({ timestamps: true })
export class Webhook {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  businessId: Types.ObjectId;
  @Prop({ required: true })
  event: string; // 'payment.success', 'booking.created', etc.

  @Prop({ required: true })
  source: string; // 'paystack', 'stripe', 'internal', etc.

  @Prop({ type: Object, required: true })
  payload: any;

  @Prop({ required: true })
  status: string; // 'pending', 'processed', 'failed'

  @Prop({ type: [String], default: [] })
  processingLog: string[];

  @Prop()
  signature: string;

  @Prop({ default: 0 })
  retryCount: number;

  @Prop()
  processedAt: Date;

  @Prop()
  errorMessage: string;
}

export const WebhookSchema = SchemaFactory.createForClass(Webhook);