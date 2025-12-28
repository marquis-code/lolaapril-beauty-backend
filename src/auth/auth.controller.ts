import { Controller, Post, UseGuards, Get, Req, Body, Res, Query, Patch, Delete } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { Response } from "express"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { BusinessRegisterDto, BusinessLoginDto, GoogleAuthDto } from "./dto/business-register.dto"
import { UpdateProfileDto, ChangePasswordDto, UpdateEmailDto, UserPreferencesDto } from "./dto/update-profile.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { GoogleAuthGuard } from "./guards/google-auth.guard"

interface RequestWithUser extends Request {
  user: {
    sub: string
    email: string
    role: string
    businessId?: string
    subdomain?: string
    googleId?: string
    firstName?: string
    lastName?: string
    picture?: string
    [key: string]: any
  }
}

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ========== GOOGLE OAUTH ROUTES ==========

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: "Initiate Google OAuth login" })
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
  
  @Post("business/register")
  @ApiOperation({ summary: "Register a new business with owner account" })
  @ApiResponse({ status: 201, description: "Business registered successfully" })
  @ApiResponse({ status: 409, description: "Business subdomain or user email already exists" })
  async registerBusiness(@Body() registerDto: BusinessRegisterDto) {
    return this.authService.registerBusiness(registerDto)
  }

  @Post("business/login")
  @ApiOperation({ summary: "Login as business owner" })
  @ApiResponse({ status: 200, description: "Business login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async loginBusiness(@Body() loginDto: BusinessLoginDto) {
    return this.authService.loginBusiness(loginDto)
  }

  // ========== STANDARD USER AUTHENTICATION ==========

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 409, description: "User already exists" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "User logged in successfully" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  // ========== COMMON ENDPOINTS ==========

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.sub)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@Req() req: RequestWithUser) {
    const user = await this.authService.validateUser(req.user.sub)
    
    const response: any = { user }
    
    if (req.user.businessId) {
      response.businessContext = {
        businessId: req.user.businessId,
        subdomain: req.user.subdomain,
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



 @Patch('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Update user profile' })
@ApiResponse({ status: 200, description: 'Profile updated successfully' })
@ApiResponse({ status: 400, description: 'Invalid update data' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async updateProfile(
  @Req() req: RequestWithUser,
  @Body() updateProfileDto: UpdateProfileDto
) {
  return this.authService.updateProfile(req.user.sub, updateProfileDto)
}

@Patch('preferences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Update user preferences (language, timezone, notifications, etc.)' })
@ApiResponse({ status: 200, description: 'Preferences updated successfully' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async updatePreferences(
  @Req() req: RequestWithUser,
  @Body() preferences: UserPreferencesDto
) {
  return this.authService.updatePreferences(req.user.sub, preferences)
}

@Post('change-password')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Change user password' })
@ApiResponse({ status: 200, description: 'Password changed successfully' })
@ApiResponse({ status: 400, description: 'Invalid password data' })
@ApiResponse({ status: 401, description: 'Current password is incorrect' })
async changePassword(
  @Req() req: RequestWithUser,
  @Body() changePasswordDto: ChangePasswordDto
) {
  return this.authService.changePassword(req.user.sub, changePasswordDto)
}

@Patch('email')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Update user email address' })
@ApiResponse({ status: 200, description: 'Email updated successfully' })
@ApiResponse({ status: 400, description: 'Invalid email data' })
@ApiResponse({ status: 401, description: 'Password is incorrect' })
@ApiResponse({ status: 409, description: 'Email already in use' })
async updateEmail(
  @Req() req: RequestWithUser,
  @Body() updateEmailDto: UpdateEmailDto
) {
  return this.authService.updateEmail(req.user.sub, updateEmailDto)
}

@Delete('account')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Delete user account (soft delete)' })
@ApiResponse({ status: 200, description: 'Account deleted successfully' })
@ApiResponse({ status: 401, description: 'Password is incorrect or unauthorized' })
async deleteAccount(
  @Req() req: RequestWithUser,
  @Body() body: { password?: string }
) {
  return this.authService.deleteAccount(req.user.sub, body.password)
}
}