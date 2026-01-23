// src/modules/auth/auth.controller.ts
import { Controller, Post, UseGuards, Get, Req, Body, Res, Query, Patch, Delete } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { Response } from "express"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { BusinessRegisterDto, BusinessLoginDto, GoogleAuthDto } from "./dto/business-register.dto"
import { UpdateProfileDto, ChangePasswordDto, UpdateEmailDto, UserPreferencesDto } from "./dto/update-profile.dto"
import { ForgotPasswordDto, ResetPasswordDto, VerifyResetOTPDto } from "./dto/password-reset.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { GoogleAuthGuard } from "./guards/google-auth.guard"
import { RequestWithUser } from "./types/request-with-user.interface"
import { CurrentUser, BusinessContext, BusinessId } from "./decorators/business-context.decorator"
import type { BusinessContext as BusinessCtx } from "./decorators/business-context.decorator"
import { SwitchBusinessDto } from "./dto/switch-business.dto"
import { AddBusinessDto } from "./dto/add-business.dto"
import { Public } from '../auth'
import { FirebaseAuthDto } from "./dto/firebase-auth.dto"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ========== FIREBASE AUTHENTICATION ==========

  @Public()
  @Post("firebase")
  @ApiOperation({ summary: "Authenticate with Firebase ID token (Google, Facebook, etc.)" })
  @ApiResponse({ status: 200, description: "Firebase authentication successful" })
  @ApiResponse({ status: 401, description: "Invalid or expired Firebase token" })
  async firebaseAuth(@Body() firebaseAuthDto: FirebaseAuthDto) {
    return this.authService.authenticateWithFirebase(firebaseAuthDto)
  }

  // ========== GOOGLE OAUTH ROUTES (Legacy - kept for backward compatibility) ==========

  @Public()
  @Get("google")
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: "Initiate Google OAuth login (Legacy)" })
  @ApiResponse({ status: 302, description: "Redirects to Google login page" })
  async googleLogin() {
    // This route initiates the Google OAuth flow
    // The actual redirect is handled by the GoogleAuthGuard
  }

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: "Google OAuth callback" })
  @ApiResponse({ status: 200, description: "Google authentication successful" })
  async googleCallback(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Query('subdomain') subdomain?: string
  ) {
    try {
      // Process the Google user data
      const result = await this.authService.handleGoogleCallback(req.user, subdomain)
      
      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001'
      const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}&user=${encodeURIComponent(JSON.stringify(result.user))}`
      
      return res.redirect(redirectUrl)
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001'
      return res.redirect(`${frontendUrl}/auth/error?message=${encodeURIComponent(error.message)}`)
    }
  }

  @Post("google/token")
  @ApiOperation({ summary: "Authenticate with Google ID Token (for mobile/SPA)" })
  @ApiResponse({ status: 200, description: "Google authentication successful" })
  @ApiResponse({ status: 401, description: "Google authentication failed" })
  async googleTokenAuth(@Body() googleAuthDto: GoogleAuthDto) {
    return this.authService.googleAuth(googleAuthDto)
  }

  // ========== BUSINESS AUTHENTICATION ==========
  
    @Public()
  @Post("business/register")
  @ApiOperation({ summary: "Register a new business with owner account" })
  @ApiResponse({ status: 201, description: "Business registered successfully" })
  @ApiResponse({ status: 409, description: "Business subdomain or user email already exists" })
  async registerBusiness(@Body() registerDto: BusinessRegisterDto) {
    return this.authService.registerBusiness(registerDto)
  }

    @Public()
  @Post("business/login")
  @ApiOperation({ summary: "Login as business owner" })
  @ApiResponse({ status: 200, description: "Business login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async loginBusiness(@Body() loginDto: BusinessLoginDto) {
    return this.authService.loginBusiness(loginDto)
  }

  // ========== STANDARD USER AUTHENTICATION ==========

    @Public()
  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 409, description: "User already exists" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

    @Public()
  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "User logged in successfully" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  // ========== COMMON ENDPOINTS ==========

  @Public()
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout(@CurrentUser() user: RequestWithUser['user']) {
    return this.authService.logout(user.sub)
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@CurrentUser() user: RequestWithUser['user']) {
    const userProfile = await this.authService.validateUser(user.sub)
    
    const response: any = { user: userProfile }
    
    // Include business context if available
    if (user.businessId && user.subdomain) {
      response.businessContext = {
        businessId: user.businessId,
        subdomain: user.subdomain,
      }
    }
    
    return response
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshTokens(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken)
  }

  // ========== PROFILE MANAGEMENT ==========

  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @CurrentUser() user: RequestWithUser['user'],
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.authService.updateProfile(user.sub, updateProfileDto)
  }

  @Patch('preferences')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user preferences (language, timezone, notifications, etc.)' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatePreferences(
    @CurrentUser() user: RequestWithUser['user'],
    @Body() preferences: UserPreferencesDto
  ) {
    return this.authService.updatePreferences(user.sub, preferences)
  }

  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid password data' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect' })
  async changePassword(
    @CurrentUser() user: RequestWithUser['user'],
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.authService.changePassword(user.sub, changePasswordDto)
  }

  @Patch('email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user email address' })
  @ApiResponse({ status: 200, description: 'Email updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid email data' })
  @ApiResponse({ status: 401, description: 'Password is incorrect' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async updateEmail(
    @CurrentUser() user: RequestWithUser['user'],
    @Body() updateEmailDto: UpdateEmailDto
  ) {
    return this.authService.updateEmail(user.sub, updateEmailDto)
  }

  @Delete('account')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user account (soft delete)' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Password is incorrect or unauthorized' })
  async deleteAccount(
    @CurrentUser() user: RequestWithUser['user'],
    @Body() body: { password?: string }
  ) {
    return this.authService.deleteAccount(user.sub, body.password)
  }

  // ========== EXAMPLE: BUSINESS-SPECIFIC ENDPOINT ==========
  
  /**
   * Example endpoint showing how to use BusinessContext decorator
   * This endpoint requires business authentication
   */
  @Get('business/context')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get business context (example endpoint)' })
  @ApiResponse({ status: 200, description: 'Business context retrieved' })
  async getBusinessContext(@BusinessContext() context: BusinessCtx) {
    return {
      message: 'Business context retrieved successfully',
      businessId: context.businessId,
      subdomain: context.subdomain,
      userId: context.userId,
      userEmail: context.userEmail,
      userRole: context.userRole
    }
  }

  /**
   * Example endpoint using just BusinessId decorator
   */
  @Get('business/info')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get business info using BusinessId' })
  async getBusinessInfo(@BusinessId() businessId: string) {
    return {
      message: 'Business ID extracted',
      businessId
    }
  }

// ========== BUSINESS CONTEXT MANAGEMENT ==========

@Post('switch-business')
@ApiBearerAuth()
@ApiOperation({ 
  summary: 'Switch active business context',
  description: 'Change the current business context and get new tokens'
})
@ApiResponse({ status: 200, description: 'Business context switched successfully' })
@ApiResponse({ status: 403, description: 'Not authorized for this business' })
@ApiResponse({ status: 404, description: 'Business not found' })
async switchBusiness(
  @CurrentUser() user: RequestWithUser['user'],
  @Body() switchBusinessDto: SwitchBusinessDto
) {
  return this.authService.switchBusiness(user.sub, switchBusinessDto.businessId)
}

@Get('businesses')
@ApiBearerAuth()
@ApiOperation({ 
  summary: 'Get all businesses user has access to',
  description: 'Returns list of businesses where user is owner, admin, or staff'
})
@ApiResponse({ status: 200, description: 'Businesses retrieved successfully' })
async getUserBusinesses(@CurrentUser() user: RequestWithUser['user']) {
  return this.authService.getUserBusinesses(user.sub)
}

@Post('clear-business-context')
@ApiBearerAuth()
@ApiOperation({ 
  summary: 'Clear business context (switch to client mode)',
  description: 'Remove business context from session and get new tokens'
})
@ApiResponse({ status: 200, description: 'Business context cleared successfully' })
async clearBusinessContext(@CurrentUser() user: RequestWithUser['user']) {
  return this.authService.clearBusinessContext(user.sub)
}

@Post('business/add')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ 
  summary: 'Add a new business under existing user account',
  description: 'Allows authenticated user to create additional business without registering new account'
})
@ApiResponse({ status: 201, description: 'Business added successfully' })
@ApiResponse({ status: 409, description: 'Subdomain already taken' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async addBusiness(
  @CurrentUser() user: RequestWithUser['user'],
  @Body() addBusinessDto: AddBusinessDto
) {
  return this.authService.addBusinessToUser(user.sub, addBusinessDto)
}

  // ========== PASSWORD RESET ==========

  @Public()
  @Post('forgot-password')
  @ApiOperation({ 
    summary: 'Request password reset OTP',
    description: 'Sends a 6-digit OTP to the user\'s email if the account exists (valid for 15 minutes)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset OTP sent (or account not found)',
    schema: {
      example: {
        success: true,
        message: 'If an account with that email exists, a password reset OTP has been sent.'
      }
    }
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Post('verify-reset-otp')
  @ApiOperation({ 
    summary: 'Verify password reset OTP',
    description: 'Check if a 6-digit OTP is valid and not expired'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP validation result',
    schema: {
      example: {
        valid: true,
        message: 'OTP is valid'
      }
    }
  })
  async verifyResetOTP(@Body() verifyOTPDto: VerifyResetOTPDto) {
    return this.authService.verifyResetOTP(verifyOTPDto.email, verifyOTPDto.otp);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ 
    summary: 'Reset password with valid OTP',
    description: 'Updates the user\'s password using a valid 6-digit OTP'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset successful',
    schema: {
      example: {
        success: true,
        message: 'Password has been reset successfully. Please login with your new password.'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.otp,
      resetPasswordDto.newPassword
    );
  }
}
