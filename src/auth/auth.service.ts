// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import * as bcrypt from "bcryptjs"
import { User, UserDocument, UserRole } from "./schemas/user.schema"
import { Business, BusinessDocument } from "../tenant/schemas/business.schema"
import { Subscription, SubscriptionDocument } from "../tenant/schemas/subscription.schema"
import { TenantConfig, TenantConfigDocument } from "../tenant/schemas/tenant-config.schema"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { BusinessRegisterDto, BusinessLoginDto, GoogleAuthDto } from "./dto/business-register.dto"
import { OAuth2Client } from "google-auth-library"

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(TenantConfig.name) private tenantConfigModel: Model<TenantConfigDocument>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.googleClient = new OAuth2Client(this.configService.get<string>("GOOGLE_CLIENT_ID"))
  }

  // ==================== BUSINESS REGISTRATION ====================
  async registerBusiness(registerDto: BusinessRegisterDto) {
    const { owner, businessName, subdomain, businessType, businessDescription, address, contact } = registerDto

    // Check subdomain availability
    const existingBusiness = await this.businessModel.findOne({ subdomain })
    if (existingBusiness) {
      throw new ConflictException("Subdomain already taken")
    }

    // Check if user exists
    const existingUser = await this.userModel.findOne({ email: owner.email })
    if (existingUser) {
      throw new ConflictException("User with this email already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(owner.password, 12)

    // Create business owner user
    const user = new this.userModel({
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      phone: owner.phone,
      password: hashedPassword,
      role: UserRole.BUSINESS_OWNER,
      status: "active",
      authProvider: "local",
    })

    const savedUser = await user.save()

    // Create business
    const business = new this.businessModel({
      businessName,
      subdomain,
      businessType,
      businessDescription,
      address,
      contact,
      ownerId: savedUser._id,
      status: "trial",
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    })

    const savedBusiness = await business.save()

    // Update user with business ownership
    await this.userModel.findByIdAndUpdate(savedUser._id, {
      $push: { ownedBusinesses: savedBusiness._id },
      currentBusinessId: savedBusiness._id,
    })

    // Create trial subscription
    await this.createTrialSubscription(savedBusiness._id.toString())

    // Create default tenant config
    await this.createDefaultTenantConfig(savedBusiness._id.toString())

    // Generate tokens
    const tokens = await this.generateTokens(
      savedUser._id.toString(),
      savedUser.email,
      savedUser.role,
      savedBusiness._id.toString(),
      subdomain
    )

    // Update user with refresh token
    await this.userModel.findByIdAndUpdate(savedUser._id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
    })

    return {
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        status: savedUser.status,
      },
      business: {
        id: savedBusiness._id,
        businessName: savedBusiness.businessName,
        subdomain: savedBusiness.subdomain,
        businessType: savedBusiness.businessType,
        status: savedBusiness.status,
        trialEndsAt: savedBusiness.trialEndsAt,
      },
      ...tokens,
    }
  }

  // ==================== BUSINESS LOGIN ====================
  async loginBusiness(loginDto: BusinessLoginDto) {
    const { email, password, subdomain } = loginDto

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

    // Check if user is business owner or admin
    if (![UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN].includes(user.role)) {
      throw new UnauthorizedException("Not authorized to access business portal")
    }

    // Find businesses owned or managed by user
    const businesses = await this.businessModel
      .find({
        $or: [{ ownerId: user._id }, { adminIds: user._id }],
      })
      .populate("activeSubscription")

    if (businesses.length === 0) {
      throw new UnauthorizedException("No business account found for this user")
    }

    // If subdomain provided, find specific business
    let business: BusinessDocument
    if (subdomain) {
      business = businesses.find((b) => b.subdomain === subdomain)
      if (!business) {
        throw new UnauthorizedException("Business not found or access denied")
      }
    } else {
      business = businesses[0]
    }

    // Check business status
    if (business.status === "suspended") {
      throw new UnauthorizedException("Business account is suspended")
    }

    if (business.status === "expired") {
      throw new UnauthorizedException("Business subscription has expired")
    }

    // Update user's current business context
    await this.userModel.findByIdAndUpdate(user._id, {
      currentBusinessId: business._id,
    })

    // Generate tokens
    const tokens = await this.generateTokens(
      user._id.toString(),
      user.email,
      user.role,
      business._id.toString(),
      business.subdomain
    )

    // Update user
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
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
      business: {
        id: business._id,
        businessName: business.businessName,
        subdomain: business.subdomain,
        businessType: business.businessType,
        status: business.status,
        trialEndsAt: business.trialEndsAt,
        subscription: business.activeSubscription,
      },
      businesses: businesses.map((b) => ({
        id: b._id,
        businessName: b.businessName,
        subdomain: b.subdomain,
        status: b.status,
      })),
      ...tokens,
    }
  }

  // ==================== GOOGLE OAUTH ====================
  async googleAuth(googleAuthDto: GoogleAuthDto) {
    const { idToken, subdomain } = googleAuthDto

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>("GOOGLE_CLIENT_ID"),
      })

      const payload = ticket.getPayload()
      if (!payload) {
        throw new UnauthorizedException("Invalid Google token")
      }

      const { email, given_name, family_name, picture, sub: googleId } = payload

      // Find or create user
      let user = await this.userModel.findOne({ $or: [{ email }, { googleId }] })

      if (!user) {
        // Create new user
        user = new this.userModel({
          firstName: given_name || "User",
          lastName: family_name || "",
          email,
          password: await bcrypt.hash(Math.random().toString(36), 12),
          role: UserRole.CLIENT, // Default to client
          status: "active",
          profileImage: picture,
          emailVerified: true,
          googleId,
          authProvider: "google",
        })
        await user.save()
      } else if (!user.googleId) {
        // Link Google account to existing user
        await this.userModel.findByIdAndUpdate(user._id, {
          googleId,
          profileImage: picture || user.profileImage,
          emailVerified: true,
        })
      }

      // Find businesses for this user
      const businesses = await this.businessModel.find({
        $or: [{ ownerId: user._id }, { adminIds: user._id }],
      })

      let business: BusinessDocument | null = null
      if (subdomain && businesses.length > 0) {
        business = businesses.find((b) => b.subdomain === subdomain)
      } else if (businesses.length > 0) {
        business = businesses[0]
      }

      // Generate tokens
      const tokens = await this.generateTokens(
        user._id.toString(),
        user.email,
        user.role,
        business?._id.toString(),
        business?.subdomain
      )

      // Update user
      await this.userModel.findByIdAndUpdate(user._id, {
        refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        lastLogin: new Date(),
        profileImage: picture || user.profileImage,
        currentBusinessId: business?._id,
      })

      const response: any = {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          profileImage: user.profileImage,
        },
        ...tokens,
      }

      if (business) {
        response.business = {
          id: business._id,
          businessName: business.businessName,
          subdomain: business.subdomain,
          businessType: business.businessType,
          status: business.status,
        }
      }

      if (businesses.length > 0) {
        response.businesses = businesses.map((b) => ({
          id: b._id,
          businessName: b.businessName,
          subdomain: b.subdomain,
          status: b.status,
        }))
      }

      return response
    } catch (error) {
      throw new UnauthorizedException("Google authentication failed")
    }
  }

  // ==================== STANDARD USER AUTH ====================
  async register(registerDto: RegisterDto) {
    const { email, password, ...userData } = registerDto

    const existingUser = await this.userModel.findOne({ email })
    if (existingUser) {
      throw new ConflictException("User with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new this.userModel({
      ...userData,
      email,
      password: hashedPassword,
      authProvider: "local",
    })

    await user.save()

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role)

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
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

    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    if (user.status !== "active") {
      throw new UnauthorizedException("Account is not active")
    }

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role)

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
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

  // ==================== TOKEN MANAGEMENT ====================
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userModel.findById(userId)
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException("Access denied")
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!refreshTokenMatches) {
      throw new UnauthorizedException("Access denied")
    }

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role)

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
    })

    return tokens
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    })
    return { message: "Logged out successfully" }
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    businessId?: string,
    subdomain?: string
  ) {
    const payload: any = { sub: userId, email, role }

    if (businessId) {
      payload.businessId = businessId
    }

    if (subdomain) {
      payload.subdomain = subdomain
    }

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

    return { accessToken, refreshToken }
  }

  async validateUser(userId: string) {
    return await this.userModel.findById(userId).select("-password -refreshToken")
  }

  // ==================== HELPER METHODS ====================
  private async createTrialSubscription(businessId: string): Promise<void> {
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000)

    const subscription = new this.subscriptionModel({
      businessId: new Types.ObjectId(businessId),
      planType: "trial",
      planName: "Trial Plan",
      monthlyPrice: 0,
      yearlyPrice: 0,
      billingCycle: "monthly",
      startDate,
      endDate,
      nextBillingDate: endDate,
      status: "active",
      limits: {
        maxStaff: 3,
        maxServices: 10,
        maxAppointmentsPerMonth: 100,
        maxStorageGB: 1,
        features: {
          onlineBooking: true,
          analytics: false,
          marketing: false,
          inventory: false,
          multiLocation: false,
          apiAccess: false,
          customBranding: false,
          advancedReports: false,
        },
      },
      trialDays: 14,
    })

    const savedSubscription = await subscription.save()

    await this.businessModel.findByIdAndUpdate(businessId, {
      activeSubscription: savedSubscription._id,
    })
  }

  private async createDefaultTenantConfig(businessId: string): Promise<void> {
    const config = new this.tenantConfigModel({
      businessId: new Types.ObjectId(businessId),
      brandColors: {
        primary: "#007bff",
        secondary: "#6c757d",
        accent: "#28a745",
        background: "#ffffff",
        text: "#333333",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        headerFont: "Inter, sans-serif",
      },
      customization: {
        showBusinessLogo: true,
        showPoweredBy: true,
      },
      integrations: {
        emailProvider: "smtp",
        smsProvider: "twilio",
        paymentProvider: "paystack",
      },
    })

    await config.save()
  }
}