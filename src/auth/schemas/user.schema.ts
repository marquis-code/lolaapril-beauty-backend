import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"

export type UserDocument = User & Document

export enum UserRole {
  ADMIN = "admin",
  STAFF = "staff",
  CLIENT = "client",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: "User first name" })
  @Prop({ required: true, trim: true })
  firstName: string

  @ApiProperty({ description: "User last name" })
  @Prop({ required: true, trim: true })
  lastName: string

  @ApiProperty({ description: "User email address", uniqueItems: true })
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string

  @ApiProperty({ description: "User phone number" })
  @Prop({ trim: true })
  phone?: string

  @ApiProperty({ description: "Hashed password" })
  @Prop({ required: true })
  password: string

  @ApiProperty({ description: "User role", enum: UserRole })
  @Prop({ type: String, enum: UserRole, default: UserRole.CLIENT })
  role: UserRole

  @ApiProperty({ description: "User status", enum: UserStatus })
  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus

  @ApiProperty({ description: "Profile image URL" })
  @Prop()
  profileImage?: string

  @ApiProperty({ description: "Last login timestamp" })
  @Prop()
  lastLogin?: Date

  @ApiProperty({ description: "Email verification status" })
  @Prop({ default: false })
  emailVerified: boolean

  @ApiProperty({ description: "Password reset token" })
  @Prop()
  resetPasswordToken?: string

  @ApiProperty({ description: "Password reset token expiry" })
  @Prop()
  resetPasswordExpires?: Date

  @ApiProperty({ description: "Refresh token for JWT" })
  @Prop()
  refreshToken?: string
}

export const UserSchema = SchemaFactory.createForClass(User)

// Indexes for better performance
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ status: 1 })
