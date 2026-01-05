// // ========================================
// // BRANDING MODULE - White-Label & Customization
// // ========================================

// // schemas/theme.schema.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type ThemeDocument = Theme & Document;

// @Schema({ timestamps: true })
// export class Theme {
//   @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, unique: true })
//   tenantId: Types.ObjectId;

//   @Prop({ type: Object })
//   colors: {
//     primary: string;
//     secondary: string;
//     accent: string;
//     background: string;
//     text: string;
//     error: string;
//     success: string;
//   };

//   @Prop({ type: Object })
//   typography: {
//     fontFamily: string;
//     headingFont: string;
//     bodyFont: string;
//   };

//   @Prop({ type: Object })
//   logo: {
//     url: string;
//     width: number;
//     height: number;
//     alt: string;
//   };

//   @Prop({ type: Object })
//   favicon: {
//     url: string;
//   };

//   @Prop({ type: Object })
//   customCss: {
//     enabled: boolean;
//     cssCode: string;
//   };

//   @Prop({ default: true })
//   isActive: boolean;
// }

// export const ThemeSchema = SchemaFactory.createForClass(Theme)

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ThemeDocument = Theme & Document;

@Schema({ timestamps: true })
export class Theme {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({
    type: {
      primary: { type: String, required: true },
      secondary: { type: String, required: true },
      accent: { type: String, required: true },
      background: { type: String, required: true },
      text: { type: String, required: true },
      error: { type: String, required: true },
      success: { type: String, required: true },
    },
    required: true
  })
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    error: string;
    success: string;
  };

  @Prop({
    type: {
      fontFamily: { type: String, required: true },
      headingFont: { type: String, required: true },
      bodyFont: { type: String, required: true },
    },
    required: true
  })
  typography: {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
  };

  @Prop({
    type: {
      url: String,
      width: Number,
      height: Number,
      alt: String,
    }
  })
  logo?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };

  @Prop({
    type: {
      url: String,
    }
  })
  favicon?: {
    url: string;
  };

  @Prop({
    type: {
      enabled: { type: Boolean, default: false },
      cssCode: { type: String, default: '' },
    },
    default: { enabled: false, cssCode: '' }
  })
  customCss: {
    enabled: boolean;
    cssCode: string;
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);

// Indexes
ThemeSchema.index({ tenantId: 1 }, { unique: true });