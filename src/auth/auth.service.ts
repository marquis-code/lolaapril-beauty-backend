// import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common"
// import { Model } from "mongoose"
// import { JwtService } from "@nestjs/jwt"
// import * as bcrypt from "bcryptjs"
// import { UserDocument } from "./schemas/user.schema"
// import { RegisterDto } from "./dto/register.dto"
// import { LoginDto } from "./dto/login.dto"

// @Injectable()
// export class AuthService {
//   private userModel: Model<UserDocument>
//   private jwtService: JwtService

//   constructor(
//     userModel: Model<UserDocument>, jwtService: JwtService) {
//     this.userModel = userModel
//     this.jwtService = jwtService
//   }

//   async register(registerDto: RegisterDto) {
//     const { email, password, ...userData } = registerDto

//     // Check if user already exists
//     const existingUser = await this.userModel.findOne({ email })
//     if (existingUser) {
//       throw new ConflictException("User with this email already exists")
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12)

//     // Create user
//     const user = new this.userModel({
//       ...userData,
//       email,
//       password: hashedPassword,
//     })

//     await user.save()

//     // Generate tokens
//     const tokens = await this.generateTokens(user._id, user.email, user.role)

//     // Update user with refresh token
//     await this.userModel.findByIdAndUpdate(user._id, {
//       refreshToken: tokens.refreshToken,
//     })

//     return {
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         status: user.status,
//       },
//       ...tokens,
//     }
//   }

//   async login(loginDto: LoginDto) {
//     const { email, password } = loginDto

//     // Find user
//     const user = await this.userModel.findOne({ email })
//     if (!user) {
//       throw new UnauthorizedException("Invalid credentials")
//     }

//     // Check password
//     const isPasswordValid = await bcrypt.compare(password, user.password)
//     if (!isPasswordValid) {
//       throw new UnauthorizedException("Invalid credentials")
//     }

//     // Check if user is active
//     if (user.status !== "active") {
//       throw new UnauthorizedException("Account is not active")
//     }

//     // Generate tokens
//     const tokens = await this.generateTokens(user._id, user.email, user.role)

//     // Update user with refresh token and last login
//     await this.userModel.findByIdAndUpdate(user._id, {
//       refreshToken: tokens.refreshToken,
//       lastLogin: new Date(),
//     })

//     return {
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         status: user.status,
//       },
//       ...tokens,
//     }
//   }

//   async refreshTokens(userId: string, refreshToken: string) {
//     const user = await this.userModel.findById(userId)
//     if (!user || !user.refreshToken) {
//       throw new UnauthorizedException("Access denied")
//     }

//     const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken)
//     if (!refreshTokenMatches) {
//       throw new UnauthorizedException("Access denied")
//     }

//     const tokens = await this.generateTokens(user._id, user.email, user.role)

//     await this.userModel.findByIdAndUpdate(user._id, {
//       refreshToken: tokens.refreshToken,
//     })

//     return tokens
//   }

//   async logout(userId: string) {
//     await this.userModel.findByIdAndUpdate(userId, {
//       refreshToken: null,
//     })
//     return { message: "Logged out successfully" }
//   }

//   private async generateTokens(userId: any, email: string, role: string) {
//     const payload = { sub: userId, email, role }

//     const [accessToken, refreshToken] = await Promise.all([
//       this.jwtService.signAsync(payload, {
//         secret: process.env.JWT_ACCESS_SECRET || "access-secret",
//         expiresIn: "15m",
//       }),
//       this.jwtService.signAsync(payload, {
//         secret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
//         expiresIn: "7d",
//       }),
//     ])

//     return {
//       accessToken,
//       refreshToken,
//     }
//   }

//   async validateUser(userId: string) {
//     return await this.userModel.findById(userId).select("-password -refreshToken")
//   }
// }


import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcryptjs"
import { User, UserDocument } from "./schemas/user.schema"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, ...userData } = registerDto

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email })
    if (existingUser) {
      throw new ConflictException("User with this email already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = new this.userModel({
      ...userData,
      email,
      password: hashedPassword,
    })

    await user.save()

    // Generate tokens
    const tokens = await this.generateTokens(user._id, user.email, user.role)

    // Update user with refresh token
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
    })

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      ...tokens,
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    // Find user
    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Check if user is active
    if (user.status !== "active") {
      throw new UnauthorizedException("Account is not active")
    }

    // Generate tokens
    const tokens = await this.generateTokens(user._id, user.email, user.role)

    // Update user with refresh token and last login
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
      lastLogin: new Date(),
    })

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      ...tokens,
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userModel.findById(userId)
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException("Access denied")
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!refreshTokenMatches) {
      throw new UnauthorizedException("Access denied")
    }

    const tokens = await this.generateTokens(user._id, user.email, user.role)

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
    })

    return tokens
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    })
    return { message: "Logged out successfully" }
  }

  private async generateTokens(userId: any, email: string, role: string) {
    const payload = { sub: userId, email, role }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || "access-secret",
        expiresIn: "15m",
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
        expiresIn: "7d",
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async validateUser(userId: string) {
    return await this.userModel.findById(userId).select("-password -refreshToken")
  }
}