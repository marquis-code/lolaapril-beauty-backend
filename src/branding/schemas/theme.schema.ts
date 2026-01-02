// ========================================
// BRANDING MODULE - White-Label & Customization
// ========================================

// schemas/theme.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ThemeDocument = Theme & Document;

@Schema({ timestamps: true })
export class Theme {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, unique: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Object })
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    error: string;
    success: string;
  };

  @Prop({ type: Object })
  typography: {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
  };

  @Prop({ type: Object })
  logo: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };

  @Prop({ type: Object })
  favicon: {
    url: string;
  };

  @Prop({ type: Object })
  customCss: {
    enabled: boolean;
    cssCode: string;
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const ThemeSchema = SchemaFactory.createForClass(Theme)