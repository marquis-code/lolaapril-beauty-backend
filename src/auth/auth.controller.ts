// import { Controller, Post, UseGuards, Get, Req } from "@nestjs/common"
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
// import type { AuthService } from "./auth.service"
// import type { RegisterDto } from "./dto/register.dto"
// import type { LoginDto } from "./dto/login.dto"
// import { JwtAuthGuard } from "./guards/jwt-auth.guard"
// import type { Request } from "express"

// @ApiTags("Authentication")
// @Controller("auth")
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post("register")
//   @ApiOperation({ summary: "Register a new user" })
//   @ApiResponse({ status: 201, description: "User registered successfully" })
//   @ApiResponse({ status: 409, description: "User already exists" })
//   async register(registerDto: RegisterDto) {
//     return this.authService.register(registerDto)
//   }

//   @Post("login")
//   @ApiOperation({ summary: "Login user" })
//   @ApiResponse({ status: 200, description: "User logged in successfully" })
//   @ApiResponse({ status: 401, description: "Invalid credentials" })
//   async login(loginDto: LoginDto) {
//     return this.authService.login(loginDto)
//   }

//   @Post('logout')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Logout user' })
//   @ApiResponse({ status: 200, description: 'User logged out successfully' })
//   async logout(@Req() req: Request) {
//     return this.authService.logout(req.user['sub'])
//   }

//   @Get('profile')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Get user profile' })
//   @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
//   async getProfile(@Req() req: Request) {
//     return this.authService.validateUser(req.user['sub'])
//   }
// }


import { Controller, Post, UseGuards, Get, Req, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { AuthService } from "./auth.service"
import type { RegisterDto } from "./dto/register.dto"
import type { LoginDto } from "./dto/login.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

// Extend the Request interface to include user property
interface RequestWithUser extends Request {
  user: {
    sub: string
    email: string
    role: string
    [key: string]: any
  }
}

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return this.authService.validateUser(req.user.sub)
  }
}