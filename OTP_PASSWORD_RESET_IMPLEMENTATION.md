# Password Reset Implementation - OTP Based

## Overview
Successfully fixed role validation errors and implemented a 6-digit OTP-based password reset system to replace the JWT token-based approach.

## Issues Fixed

### 1. Role Validation Error
**Problem**: 3 users in the database had invalid `role: 'admin'` which caused validation errors since the enum only allows: `['client', 'staff', 'business_admin', 'business_owner', 'super_admin']`

**Solution**:
- Created migration to update all users with `role: 'admin'` to `role: 'super_admin'`
- Successfully updated 3 users:
  - alice.johnson@example.com
  - marquis@admin.com
  - lolaapril@gmal.com

**Files Modified**:
- `src/migrations/fix-admin-role.migration.ts` (created)

---

## Password Reset Implementation - OTP System

### 2. OTP-Based Password Reset
**Previous**: JWT token-based reset with 1-hour expiry
**New**: 6-digit numeric OTP with 15-minute expiry

### Architecture Changes

#### User Schema Updates
**File**: `src/auth/schemas/user.schema.ts`

**Removed**:
```typescript
resetPasswordToken?: string
resetPasswordExpires?: Date
```

**Added**:
```typescript
resetPasswordOTP?: string
resetPasswordOTPExpires?: Date
```

#### DTO Updates
**File**: `src/auth/dto/password-reset.dto.ts`

**Three DTOs**:
1. `ForgotPasswordDto` - Request OTP
   - Field: `email` (required)

2. `VerifyResetOTPDto` - Verify OTP (optional step)
   - Fields: `email`, `otp` (6 digits)

3. `ResetPasswordDto` - Reset password with OTP
   - Fields: `email`, `otp` (6 digits), `newPassword`

**Validations**:
- OTP must be exactly 6 digits (`@Length(6, 6)`)
- OTP must contain only numbers (`@Matches(/^\d{6}$/)`)
- Password must have uppercase, lowercase, number, and special character

#### Service Implementation
**File**: `src/auth/auth.service.ts`

**New Methods**:

1. **`generateOTP()`** (private)
   ```typescript
   private generateOTP(): string {
     return Math.floor(100000 + Math.random() * 900000).toString();
   }
   ```
   - Generates random 6-digit number
   - Range: 100000 - 999999

2. **`forgotPassword(email: string)`**
   - Generates 6-digit OTP
   - Hashes OTP before storage (bcrypt with 10 rounds)
   - Stores hashed OTP and expiry (15 minutes)
   - Logs OTP to console (for development only)
   - Returns success message without revealing user existence

3. **`verifyResetOTP(email: string, otp: string)`**
   - Validates email exists
   - Checks OTP exists and not expired
   - Verifies OTP matches using bcrypt.compare()
   - Returns validation result

4. **`resetPassword(email: string, otp: string, newPassword: string)`**
   - Validates OTP as in verifyResetOTP
   - Hashes new password (bcrypt with 12 rounds)
   - Updates password
   - Clears OTP and expiry
   - Invalidates all refresh tokens (logout all sessions)
   - Returns success message

#### Controller Implementation
**File**: `src/auth/auth.controller.ts`

**API Endpoints**:

1. **POST `/auth/forgot-password`**
   - Body: `{ email }`
   - Returns: `{ success: true, message: '...' }`
   - Public endpoint (no authentication required)

2. **POST `/auth/verify-reset-otp`**
   - Body: `{ email, otp }`
   - Returns: `{ valid: boolean, message: '...' }`
   - Public endpoint
   - Optional step for frontend validation before password reset

3. **POST `/auth/reset-password`**
   - Body: `{ email, otp, newPassword }`
   - Returns: `{ success: true, message: '...' }`
   - Public endpoint
   - Validates OTP and resets password in one step

---

## Security Features

### 1. OTP Security
- **Hashed Storage**: OTP is hashed using bcrypt before storing in database
- **Time-Limited**: OTP expires after 15 minutes
- **Single Use**: OTP is cleared after successful password reset
- **No User Enumeration**: Same success message returned whether user exists or not

### 2. Password Security
- **Strong Hashing**: Passwords hashed with bcrypt (12 rounds)
- **Password Requirements**: 
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (@$!%*?&#)

### 3. Session Management
- **Logout All Sessions**: `refreshToken` cleared on password reset
- **Forced Re-authentication**: User must login again with new password

---

## Testing Guide

### Test Flow

#### 1. Request Password Reset
```bash
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset OTP has been sent."
}
```

**Console Output** (Development):
```
🔐 Password reset OTP generated: {
  email: 'user@example.com',
  otp: '234567',
  expiresAt: 2024-01-15T10:45:00.000Z
}
```

#### 2. Verify OTP (Optional)
```bash
POST /auth/verify-reset-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "234567"
}
```

**Response**:
```json
{
  "valid": true,
  "message": "OTP is valid"
}
```

#### 3. Reset Password
```bash
POST /auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "234567",
  "newPassword": "NewSecure123!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password has been reset successfully. Please login with your new password."
}
```

---

## TODO / Next Steps

### 1. Email/SMS Integration
Currently OTP is only logged to console. Need to integrate:

**Option A: Email Service**
```typescript
// In forgotPassword()
await this.notificationService.sendPasswordResetOTP({
  to: user.email,
  otp: otp,
  expiresIn: '15 minutes'
});
```

**Option B: SMS Service (Recommended for OTP)**
```typescript
// Using Termii, Twilio, or similar
await this.smsService.sendOTP({
  phone: user.phone,
  otp: otp,
  message: `Your Lola April password reset OTP is: ${otp}. Valid for 15 minutes.`
});
```

### 2. Rate Limiting
Implement rate limiting to prevent OTP spam:
```typescript
// In forgotPassword()
// Max 3 requests per email per hour
const recentRequests = await this.checkOTPRequestRate(email);
if (recentRequests >= 3) {
  throw new TooManyRequestsException('Too many reset requests. Please try again later.');
}
```

### 3. OTP Attempt Limiting
Limit OTP verification attempts:
```typescript
// In verifyResetOTP() and resetPassword()
// Max 5 attempts per OTP
if (user.otpAttempts >= 5) {
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;
  await user.save();
  throw new BadRequestException('Too many failed attempts. Please request a new OTP.');
}
user.otpAttempts++;
await user.save();
```

### 4. Notification Templates
Create notification templates for:
- OTP email/SMS
- Password reset confirmation
- Failed password reset attempts (security alert)

### 5. Audit Logging
Log password reset activities:
```typescript
await this.auditService.log({
  action: 'PASSWORD_RESET_REQUESTED',
  userId: user._id,
  email: user.email,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});
```

---

## Migration Notes

### Database Changes
No schema migration required for existing data. The schema changes are:
- Renamed field: `resetPasswordToken` → `resetPasswordOTP`
- Renamed field: `resetPasswordExpires` → `resetPasswordOTPExpires`

MongoDB will handle the field additions automatically. Old token fields will remain unused.

### Optional: Clean Up Old Fields
To remove old password reset token fields:
```javascript
// Run this script once
db.users.updateMany(
  {},
  { 
    $unset: { 
      resetPasswordToken: "",
      resetPasswordExpires: ""
    }
  }
);
```

---

## Benefits of OTP System

### 1. User Experience
- ✅ Simpler for users (6 digits vs long token)
- ✅ Easier to type on mobile devices
- ✅ Shorter expiry encourages immediate action (15 min vs 1 hour)
- ✅ Can be sent via SMS for non-email users

### 2. Security
- ✅ Shorter validity window reduces attack window
- ✅ Numeric-only format reduces brute force space (but still 1M combinations)
- ✅ Can implement attempt limiting more easily
- ✅ More familiar pattern for users (like 2FA codes)

### 3. Implementation
- ✅ No JWT dependency for password reset
- ✅ Simpler to understand and debug
- ✅ Easier to integrate with SMS providers
- ✅ Better mobile UX (numeric keyboard)

### 4. Scalability
- ✅ No token decoding overhead
- ✅ Direct database lookup by email
- ✅ Can be cached for rate limiting
- ✅ Easier to implement across microservices

---

## Error Handling

### Common Error Scenarios

1. **Invalid Email**
   - Returns success message (no user enumeration)
   - No OTP generated

2. **Expired OTP**
   - Status: 400
   - Message: "OTP has expired. Please request a new one."

3. **Invalid OTP**
   - Status: 400
   - Message: "Invalid OTP"

4. **Weak Password**
   - Status: 400
   - Message: "Password must contain at least one uppercase letter..."

5. **OTP Format Error**
   - Status: 400
   - Message: "OTP must be exactly 6 digits" or "OTP must contain only numbers"

---

## API Documentation

All endpoints are documented in Swagger at `/api/docs` (when server running):

### Swagger Tags
- **Authentication** → Password Reset endpoints

### Example Swagger URLs
- Development: `http://localhost:3000/api/docs#/Authentication/AuthController_forgotPassword`
- Production: `https://api.lolaapril.com/api/docs#/Authentication/AuthController_forgotPassword`

---

## Environment Variables

No new environment variables required. Existing variables used:
- `MONGO_URL` - Database connection
- `JWT_SECRET` - For main authentication (not used for OTP)
- `FRONTEND_URL` - For any reset confirmation links (optional)

---

## Summary

✅ **Fixed**: Role validation error (3 users updated from 'admin' to 'super_admin')
✅ **Implemented**: 6-digit OTP password reset system
✅ **Expiry**: 15 minutes (vs 1 hour for tokens)
✅ **Security**: Hashed OTP storage, strong password validation, session invalidation
✅ **API**: 3 endpoints - forgot-password, verify-reset-otp, reset-password
✅ **Build**: Successfully compiled with no errors

**Next**: Integrate email/SMS service to actually send OTP to users!
