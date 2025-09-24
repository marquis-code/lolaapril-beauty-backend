import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"

export type AuditLogDocument = AuditLog & Document

export enum AuditAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LOGIN = "login",
  LOGOUT = "logout",
  VIEW = "view",
  EXPORT = "export",
  IMPORT = "import",
}

export enum AuditEntity {
  USER = "user",
  CLIENT = "client",
  APPOINTMENT = "appointment",
  BOOKING = "booking",
  SERVICE = "service",
  PAYMENT = "payment",
  SALE = "sale",
  VOUCHER = "voucher",
  MEMBERSHIP = "membership",
  CLIENT_MEMBERSHIP = "client_membership", // Added this missing enum value
  TEAM_MEMBER = "team_member",
  SETTINGS = "settings",
}

@Schema({ timestamps: true })
export class AuditLog {
  @ApiProperty({ description: "User who performed the action" })
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId

  @ApiProperty({ description: "Action performed", enum: AuditAction })
  @Prop({ type: String, enum: AuditAction, required: true })
  action: AuditAction

  @ApiProperty({ description: "Entity affected", enum: AuditEntity })
  @Prop({ type: String, enum: AuditEntity, required: true })
  entity: AuditEntity

  @ApiProperty({ description: "ID of the affected entity" })
  @Prop({ required: true })
  entityId: string

  @ApiProperty({ description: "Description of the action" })
  @Prop({ required: true })
  description: string

  @ApiProperty({ description: "Previous data before change" })
  @Prop({ type: Object })
  previousData?: any

  @ApiProperty({ description: "New data after change" })
  @Prop({ type: Object })
  newData?: any

  @ApiProperty({ description: "IP address of the user" })
  @Prop()
  ipAddress?: string

  @ApiProperty({ description: "User agent string" })
  @Prop()
  userAgent?: string

  @ApiProperty({ description: "Additional metadata" })
  @Prop({ type: Object })
  metadata?: any
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog)

// Indexes for better performance
AuditLogSchema.index({ userId: 1, createdAt: -1 })
AuditLogSchema.index({ entity: 1, entityId: 1 })
AuditLogSchema.index({ action: 1 })
AuditLogSchema.index({ createdAt: -1 })