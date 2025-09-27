// src/modules/tenant/schemas/tenant-config.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type TenantConfigDocument = TenantConfig & Document

@Schema({ timestamps: true })
export class TenantConfig {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, unique: true })
  businessId: Types.ObjectId

  @Prop({
    type: {
      primary: String,
      secondary: String,
      accent: String,
      background: String,
      text: String
    },
    default: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745',
      background: '#ffffff',
      text: '#333333'
    }
  })
  brandColors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }

  @Prop({
    type: {
      fontFamily: String,
      fontSize: String,
      headerFont: String
    },
    default: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      headerFont: 'Inter, sans-serif'
    }
  })
  typography: {
    fontFamily: string
    fontSize: string
    headerFont: string
  }

  @Prop({
    type: {
      showBusinessLogo: { type: Boolean, default: true },
      showPoweredBy: { type: Boolean, default: true },
      customCSS: String,
      favicon: String
    },
    default: {}
  })
  customization: {
    showBusinessLogo: boolean
    showPoweredBy: boolean
    customCSS?: string
    favicon?: string
  }

  @Prop({
    type: {
      emailProvider: {
        type: String,
        enum: ['sendgrid', 'mailgun', 'ses', 'smtp'],
        default: 'smtp'
      },
      emailConfig: {
        apiKey: String,
        host: String,
        port: Number,
        username: String,
        password: String,
        fromEmail: String,
        fromName: String
      },
      smsProvider: {
        type: String,
        enum: ['twilio', 'nexmo', 'africas_talking', 'custom'],
        default: 'twilio'
      },
      smsConfig: {
        apiKey: String,
        apiSecret: String,
        senderId: String
      },
      paymentProvider: {
        type: String,
        enum: ['paystack', 'flutterwave', 'stripe', 'razorpay'],
        default: 'paystack'
      },
      paymentConfig: {
        publicKey: String,
        secretKey: String,
        webhookSecret: String
      }
    },
    default: {}
  })
  integrations: {
    emailProvider: string
    emailConfig?: {
      apiKey?: string
      host?: string
      port?: number
      username?: string
      password?: string
      fromEmail?: string
      fromName?: string
    }
    smsProvider: string
    smsConfig?: {
      apiKey?: string
      apiSecret?: string
      senderId?: string
    }
    paymentProvider: string
    paymentConfig?: {
      publicKey?: string
      secretKey?: string
      webhookSecret?: string
    }
  }

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const TenantConfigSchema = SchemaFactory.createForClass(TenantConfig)

// Add indexes
TenantConfigSchema.index({ businessId: 1 })