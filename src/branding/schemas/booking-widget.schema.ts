
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingWidgetDocument = BookingWidget & Document;

@Schema({ timestamps: true })
export class BookingWidget {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  widgetId: string;

  @Prop({ default: 'Default Widget' })
  name: string;

  @Prop({
    type: {
      displayType: { type: String, required: true },
      buttonText: { type: String, required: true },
      buttonColor: { type: String, required: true },
      showBranding: { type: Boolean, default: true },
      allowedOrigins: { type: [String], default: [] },
    },
    required: true
  })
  configuration: {
    displayType: string;
    buttonText: string;
    buttonColor: string;
    showBranding: boolean;
    allowedOrigins: string[];
  };

  @Prop({
    type: {
      theme: { type: String, required: true },
      primaryColor: { type: String, required: true },
      borderRadius: { type: String, required: true },
      fontSize: { type: String, required: true },
    },
    required: true
  })
  styling: {
    theme: string;
    primaryColor: string;
    borderRadius: string;
    fontSize: string;
  };

  @Prop({ required: true, type: String })
  embedCode: string;

  @Prop({ default: 0 })
  impressions: number;

  @Prop({ default: 0 })
  conversions: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BookingWidgetSchema = SchemaFactory.createForClass(BookingWidget);

// Indexes
BookingWidgetSchema.index({ tenantId: 1 });
BookingWidgetSchema.index({ widgetId: 1 }, { unique: true });
BookingWidgetSchema.index({ tenantId: 1, isActive: 1 });