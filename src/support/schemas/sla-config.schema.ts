// schemas/sla-config.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

export type SLAConfigDocument = SLAConfig & Document;

@Schema({ timestamps: true })
export class SLAConfig {
  @Prop({ type: Types.ObjectId, ref: 'Tenant' })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  priority: string;

  @Prop({ required: true })
  firstResponseTime: number; // In minutes

  @Prop({ required: true })
  resolutionTime: number; // In minutes

  @Prop({ type: Object })
  businessHours: {
    enabled: boolean;
    timezone: string;
    schedule: {
      monday: { start: string; end: string };
      tuesday: { start: string; end: string };
      wednesday: { start: string; end: string };
      thursday: { start: string; end: string };
      friday: { start: string; end: string };
      saturday: { start: string; end: string };
      sunday: { start: string; end: string };
    };
  };

  @Prop({ type: [String] })
  escalationEmails: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const SLAConfigSchema = SchemaFactory.createForClass(SLAConfig);