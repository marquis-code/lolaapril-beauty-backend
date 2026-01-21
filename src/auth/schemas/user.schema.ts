// src/modules/auth/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
import { ApiProperty } from "@nestjs/swagger"

export type UserDocument = User & Document

export enum UserRole {
  SUPER_ADMIN = "super_admin",        // Platform administrator
  BUSINESS_OWNER = "business_owner",  // Owns one or more businesses
  BUSINESS_ADMIN = "business_admin",  // Manages business operations
  STAFF = "staff",                    // Business employees (stylists, etc.)
  CLIENT = "client",                  // End customers
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING_VERIFICATION = "pending_verification",
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
  // ✅ FIXED: Password is now optional for OAuth users
  @Prop({ 
    required: function(this: User) {
      // Password required only for local auth provider
      return this.authProvider === 'local';
    }
  })
  password?: string

  @ApiProperty({ description: "User role", enum: UserRole })
  @Prop({ type: String, enum: UserRole, default: UserRole.CLIENT })
  role: UserRole

  @ApiProperty({ description: "User status", enum: UserStatus })
  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus

  // ========== BUSINESS ASSOCIATIONS ==========
  @ApiProperty({ description: "Businesses owned by this user" })
  @Prop({ type: [Types.ObjectId], ref: "Business", default: [] })
  ownedBusinesses: Types.ObjectId[]

  @ApiProperty({ description: "Businesses where user is admin" })
  @Prop({ type: [Types.ObjectId], ref: "Business", default: [] })
  adminBusinesses: Types.ObjectId[]

  @ApiProperty({ description: "Business where user is staff member" })
  @Prop({ type: Types.ObjectId, ref: "Business" })
  staffBusinessId?: Types.ObjectId

  @ApiProperty({ description: "Current active business context" })
  @Prop({ type: Types.ObjectId, ref: "Business" })
  currentBusinessId?: Types.ObjectId

  // ========== PROFILE INFORMATION ==========
  @ApiProperty({ description: "Profile image URL" })
  @Prop()
  profileImage?: string

  @ApiProperty({ description: "User bio/description" })
  @Prop()
  bio?: string

  @ApiProperty({ description: "User date of birth" })
  @Prop()
  dateOfBirth?: Date

  @ApiProperty({ description: "User gender" })
  @Prop({ enum: ["male", "female", "other", "prefer_not_to_say"] })
  gender?: string

  // ========== AUTHENTICATION ==========
  @ApiProperty({ description: "Last login timestamp" })
  @Prop()
  lastLogin?: Date

  @ApiProperty({ description: "Email verification status" })
  @Prop({ default: false })
  emailVerified: boolean

  @ApiProperty({ description: "Phone verification status" })
  @Prop({ default: false })
  phoneVerified: boolean

  @ApiProperty({ description: "Email verification token" })
  @Prop()
  emailVerificationToken?: string

  @ApiProperty({ description: "Password reset OTP (6 digits)" })
  @Prop()
  resetPasswordOTP?: string

  @ApiProperty({ description: "Password reset OTP expiry" })
  @Prop()
  resetPasswordOTPExpires?: Date

  @ApiProperty({ description: "Refresh token for JWT" })
  @Prop()
  refreshToken?: string

  // ========== OAUTH ==========
  @ApiProperty({ description: "Google OAuth ID" })
  @Prop({ unique: true, sparse: true }) // ✅ Added unique constraint with sparse index
  googleId?: string

  @ApiProperty({ description: "Facebook OAuth ID" })
  @Prop({ unique: true, sparse: true }) // ✅ Added unique constraint with sparse index
  facebookId?: string

  @ApiProperty({ description: "OAuth provider" })
  @Prop({ enum: ["local", "google", "facebook"], default: "local" })
  authProvider: string

  // ========== PREFERENCES ==========
  @Prop({
    type: {
      language: { type: String, default: "en" },
      timezone: { type: String, default: "Africa/Lagos" },
      currency: { type: String, default: "NGN" },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
    },
    default: {},
  })
  preferences: {
    language: string
    timezone: string
    currency: string
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

// ✅ IMPROVED: Better indexes for performance and uniqueness
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ role: 1 })
UserSchema.index({ status: 1 })
UserSchema.index({ ownedBusinesses: 1 })
UserSchema.index({ adminBusinesses: 1 })
UserSchema.index({ staffBusinessId: 1 })
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true })
UserSchema.index({ facebookId: 1 }, { unique: true, sparse: true })
UserSchema.index({ authProvider: 1 })

// ✅ ADDED: Pre-save hook to validate password for local auth
UserSchema.pre('save', function(next) {
  if (this.authProvider === 'local' && !this.password) {
    next(new Error('Password is required for local authentication'));
  } else {
    next();
  }
});