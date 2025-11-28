import { Controller, Post, UseGuards, Get, Req, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { BusinessRegisterDto, BusinessLoginDto, GoogleAuthDto } from "./dto/business-register.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

interface RequestWithUser extends Request {
  user: {
    sub: string
    email: string
    role: string
    businessId?: string
    subdomain?: string
    [key: string]: any
  }
}

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post("google")
  @ApiOperation({ summary: "Authenticate with Google OAuth" })
  @ApiResponse({ status: 200, description: "Google authentication successful" })
  @ApiResponse({ status: 401, description: "Google authentication failed" })
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    return this.authService.googleAuth(googleAuthDto)
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
    
    // If user has business context in token, include it
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
}