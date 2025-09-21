import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type UserDocument = User & Document

export enum UserRole {
  CUSTOMER = "customer",
  STAFF = "staff",
  ADMIN = "admin",
}

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop()
  password?: string

  @Prop()
  phone?: string

  @Prop()
  avatar?: string

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole

  @Prop({ type: String, enum: AuthProvider, default: AuthProvider.LOCAL })
  authProvider: AuthProvider

  @Prop()
  googleId?: string

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  dateOfBirth?: Date

  @Prop()
  address?: string

  @Prop({ default: Date.now })
  lastLogin?: Date

  @Prop({ default: false })
  emailVerified: boolean

  @Prop()
  emailVerificationToken?: string

  @Prop()
  resetPasswordToken?: string

  @Prop()
  resetPasswordExpires?: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
