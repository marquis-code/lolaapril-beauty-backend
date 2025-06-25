import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { AuditAction } from "../../common/enums"

export type AuditLogDocument = AuditLog & Document

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ required: true })
  userId: string

  @Prop({ enum: AuditAction, required: true })
  action: AuditAction

  @Prop({ required: true })
  resource: string

  @Prop()
  resourceId?: string

  @Prop({ type: Object })
  metadata?: Record<string, any>

  @Prop()
  ip?: string

  @Prop()
  userAgent?: string

  createdAt: Date
  updatedAt: Date
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog)
