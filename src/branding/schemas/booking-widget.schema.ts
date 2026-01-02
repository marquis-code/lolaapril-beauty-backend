// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
// import { Document, Types } from "mongoose"

// @Schema({ timestamps: true })
// export class BookingWidget {
//   @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
//   tenantId: Types.ObjectId;

//   @Prop({ required: true, unique: true })
//   widgetId: string;

//   @Prop({ type: Object })
//   configuration: {
//     displayType: string; // 'modal', 'inline', 'popup'
//     buttonText: string;
//     buttonColor: string;
//     showBranding: boolean;
//     allowedOrigins: string[];
//   };

//   @Prop({ type: Object })
//   styling: {
//     theme: string; // 'light', 'dark', 'custom'
//     primaryColor: string;
//     borderRadius: string;
//     fontSize: string;
//   };

//   @Prop()
//   embedCode: string; // Generated HTML/JS code

//   @Prop({ default: 0 })
//   impressions: number;

//   @Prop({ default: 0 })
//   conversions: number;

//   @Prop({ default: true })
//   isActive: boolean;
// }

// export const BookingWidgetSchema = SchemaFactory.createForClass(BookingWidget);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from "mongoose"

export type BookingWidgetDocument = BookingWidget & Document;

@Schema({ timestamps: true })
export class BookingWidget {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  widgetId: string;

  @Prop({ type: Object })
  configuration: {
    displayType: string; // 'modal', 'inline', 'popup'
    buttonText: string;
    buttonColor: string;
    showBranding: boolean;
    allowedOrigins: string[];
  };

  @Prop({ type: Object })
  styling: {
    theme: string; // 'light', 'dark', 'custom'
    primaryColor: string;
    borderRadius: string;
    fontSize: string;
  };

  @Prop()
  embedCode: string; // Generated HTML/JS code

  @Prop({ default: 0 })
  impressions: number;

  @Prop({ default: 0 })
  conversions: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const BookingWidgetSchema = SchemaFactory.createForClass(BookingWidget);