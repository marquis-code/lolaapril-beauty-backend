// schemas/quality-metric.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QualityMetricDocument = QualityMetric & Document;

@Schema({ timestamps: true })
export class QualityMetric {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  metricType: string; // 'response_time', 'completion_rate', 'cancellation_rate'

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  period: string; // 'daily', 'weekly', 'monthly'

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Object })
  details: any;
}

export const QualityMetricSchema = SchemaFactory.createForClass(QualityMetric);