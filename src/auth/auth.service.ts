// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import * as bcrypt from "bcryptjs"
import { User, UserDocument, UserRole, UserStatus } from "./schemas/user.schema"
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


  // Add this method to your AuthService class (auth.service.ts)

// ==================== GOOGLE OAUTH CALLBACK HANDLER ====================
async handleGoogleCallback(googleUser: any, subdomain?: string) {
  const { googleId, email, firstName, lastName, picture } = googleUser

  if (!email) {
    throw new UnauthorizedException("Email not provided by Google")
  }

  // Find user by email or googleId
  let user: any = await this.userModel.findOne({ 
    $or: [{ email }, { googleId }] 
  })

  if (!user) {
    // Create new user
    const newUser = new this.userModel()
    newUser.firstName = firstName || "User"
    newUser.lastName = lastName || ""
    newUser.email = email
    newUser.role = UserRole.CLIENT
    newUser.status = UserStatus.ACTIVE
    newUser.profileImage = picture
    newUser.emailVerified = true
    newUser.googleId = googleId
    newUser.authProvider = "google"
    
    user = await newUser.save()
  } else {
    // Update existing user with Google info
    const updateData: any = {
      lastLogin: new Date(),
    }

    if (!user.googleId) {
      updateData.googleId = googleId
      updateData.emailVerified = true
    }

    if (picture && !user.profileImage) {
      updateData.profileImage = picture
    }

    await this.userModel.findByIdAndUpdate(user._id, updateData)
    user = await this.userModel.findById(user._id)
  }

  // Find businesses for this user
  const businesses: any[] = await this.businessModel.find({
    $or: [{ ownerId: user._id }, { adminIds: user._id }],
  }) as any

  let business: any = null
  
  if (subdomain && businesses.length > 0) {
    const found = businesses.find((b) => b.subdomain === subdomain)
    if (found) {
      business = found
    } else {
      throw new UnauthorizedException("Business not found or access denied")
    }
  } else if (businesses.length > 0) {
    business = businesses[0]
  }

  // Generate tokens
  const tokens = await this.generateTokens(
    user._id.toString(),
    user.email,
    user.role,
    business?._id?.toString(),
    business?.subdomain
  )

  // Update user with refresh token
  await this.userModel.findByIdAndUpdate(user._id, {
    refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
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
      emailVerified: user.emailVerified,
      authProvider: user.authProvider,
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
      trialEndsAt: business.trialEndsAt,
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
        secret: process.env.JWT_SECRET,
        expiresIn: "15m",
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
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

  // Updated sections of auth.service.ts

// // ==================== GOOGLE OAUTH ====================
// async googleAuth(googleAuthDto: GoogleAuthDto) {
//   const { idToken, subdomain } = googleAuthDto

//   try {
//     const ticket = await this.googleClient.verifyIdToken({
//       idToken,
//       audience: this.configService.get<string>("GOOGLE_CLIENT_ID"),
//     })

//     const payload = ticket.getPayload()
//     if (!payload) {
//       throw new UnauthorizedException("Invalid Google token")
//     }

//     const { email, given_name, family_name, picture, sub: googleId } = payload

//     if (!email) {
//       throw new UnauthorizedException("Email not provided by Google")
//     }

//     // Find user by email or googleId
//     let user = await this.userModel.findOne({ 
//       $or: [{ email }, { googleId }] 
//     })

//     if (!user) {
//       // ✅ CREATE NEW USER - No password for Google OAuth users
//       user = new this.userModel({
//         firstName: given_name || "User",
//         lastName: family_name || "",
//         email,
//         // ✅ NO PASSWORD FIELD - It's optional for OAuth users
//         role: UserRole.CLIENT,
//         status: "active",
//         profileImage: picture,
//         emailVerified: true, // Google emails are pre-verified
//         googleId,
//         authProvider: "google",
//       })
//       await user.save()
//     } else {
//       // USER EXISTS - Link Google account if not already linked
//       const updateData: any = {
//         lastLogin: new Date(),
//       }

//       // Link Google account to existing user
//       if (!user.googleId) {
//         updateData.googleId = googleId
//         updateData.emailVerified = true
        
//         // ✅ If user was local auth, now they can use both
//         if (user.authProvider === 'local') {
//           updateData.authProvider = 'google' // or keep as 'local' if you want dual login
//         }
//       }

//       // Update profile image if user doesn't have one
//       if (picture && !user.profileImage) {
//         updateData.profileImage = picture
//       }

//       await this.userModel.findByIdAndUpdate(user._id, updateData)
      
//       // Refresh user object
//       user = await this.userModel.findById(user._id)
//     }

//     // Find businesses for this user
//     const businesses = await this.businessModel.find({
//       $or: [{ ownerId: user._id }, { adminIds: user._id }],
//     })

//     let business: BusinessDocument | null = null
//     if (subdomain && businesses.length > 0) {
//       business = businesses.find((b) => b.subdomain === subdomain) || null
//       if (subdomain && !business) {
//         throw new UnauthorizedException("Business not found or access denied")
//       }
//     } else if (businesses.length > 0) {
//       business = businesses[0]
//     }

//     // Generate tokens
//     const tokens = await this.generateTokens(
//       user._id.toString(),
//       user.email,
//       user.role,
//       business?._id.toString(),
//       business?.subdomain
//     )

//     // Update user with refresh token
//     await this.userModel.findByIdAndUpdate(user._id, {
//       refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
//       currentBusinessId: business?._id,
//     })

//     const response: any = {
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         status: user.status,
//         profileImage: user.profileImage,
//         emailVerified: user.emailVerified,
//         authProvider: user.authProvider,
//       },
//       ...tokens,
//     }

//     if (business) {
//       response.business = {
//         id: business._id,
//         businessName: business.businessName,
//         subdomain: business.subdomain,
//         businessType: business.businessType,
//         status: business.status,
//         trialEndsAt: business.trialEndsAt,
//       }
//     }

//     if (businesses.length > 0) {
//       response.businesses = businesses.map((b) => ({
//         id: b._id,
//         businessName: b.businessName,
//         subdomain: b.subdomain,
//         status: b.status,
//       }))
//     }

//     return response
//   } catch (error) {
//     if (error instanceof UnauthorizedException) {
//       throw error
//     }
    
//     console.error("Google authentication error:", error)
//     throw new UnauthorizedException("Google authentication failed")
//   }
// }



// ==================== STANDARD USER LOGIN ====================
// ✅ UPDATED: Add check for OAuth users trying to login with password
async login(loginDto: LoginDto) {
  const { email, password } = loginDto

  const user = await this.userModel.findOne({ email })
  if (!user) {
    throw new UnauthorizedException("Invalid credentials")
  }

  // ✅ Check if user registered with OAuth
  if (user.authProvider !== 'local' && !user.password) {
    throw new UnauthorizedException(
      `This account uses ${user.authProvider} authentication. Please sign in with ${user.authProvider}.`
    )
  }

  // Check password
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
      authProvider: user.authProvider,
    },
    ...tokens,
  }
}

// ==================== BUSINESS LOGIN ====================
// ✅ UPDATED: Add OAuth check here too
// async loginBusiness(loginDto: BusinessLoginDto) {
//   const { email, password, subdomain } = loginDto

//   const user = await this.userModel.findOne({ email })
//   if (!user) {
//     throw new UnauthorizedException("Invalid credentials")
//   }

//   // ✅ Check if user registered with OAuth
//   if (user.authProvider !== 'local' && !user.password) {
//     throw new UnauthorizedException(
//       `This account uses ${user.authProvider} authentication. Please sign in with ${user.authProvider}.`
//     )
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password)
//   if (!isPasswordValid) {
//     throw new UnauthorizedException("Invalid credentials")
//   }

//   if (user.status !== "active") {
//     throw new UnauthorizedException("Account is not active")
//   }

//   if (![UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN].includes(user.role)) {
//     throw new UnauthorizedException("Not authorized to access business portal")
//   }

//   const businesses: any[] = await this.businessModel
//     .find({
//       $or: [{ ownerId: user._id }, { adminIds: user._id }],
//     })
//     .populate("activeSubscription")
//     .lean()
//     .exec()

//   if (!businesses || businesses.length === 0) {
//     throw new UnauthorizedException("No business account found for this user")
//   }

//   let business: any
//   if (subdomain) {
//     business = businesses.find((b) => b.subdomain === subdomain)
//     if (!business) {
//       throw new UnauthorizedException("Business not found or access denied")
//     }
//   } else {
//     business = businesses[0]
//   }

//   if (business.status === "suspended") {
//     throw new UnauthorizedException("Business account is suspended")
//   }

//   if (business.status === "expired") {
//     throw new UnauthorizedException("Business subscription has expired")
//   }

//   await this.userModel.findByIdAndUpdate(user._id, {
//     currentBusinessId: business._id,
//   })

//   const tokens = await this.generateTokens(
//     user._id.toString(),
//     user.email,
//     user.role,
//     business._id.toString(),
//     business.subdomain
//   )

//   await this.userModel.findByIdAndUpdate(user._id, {
//     refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
//     lastLogin: new Date(),
//   })

//   return {
//     user: {
//       id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       role: user.role,
//       status: user.status,
//       authProvider: user.authProvider,
//     },
//     business: {
//       id: business._id,
//       businessName: business.businessName,
//       subdomain: business.subdomain,
//       businessType: business.businessType,
//       status: business.status,
//       trialEndsAt: business.trialEndsAt,
//       subscription: business.activeSubscription,
//     },
//     businesses: businesses.map((b) => ({
//       id: b._id,
//       businessName: b.businessName,
//       subdomain: b.subdomain,
//       status: b.status,
//     })),
//     ...tokens,
//   }
// }
// ==================== GOOGLE OAUTH - COMPLETE FIXED VERSION ====================
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

    if (!email) {
      throw new UnauthorizedException("Email not provided by Google")
    }

    // Find user by email or googleId
    let user: any = await this.userModel.findOne({ 
      $or: [{ email }, { googleId }] 
    })

    if (!user) {
      // Create new user
      const newUser = new this.userModel()
      newUser.firstName = given_name || "User"
      newUser.lastName = family_name || ""
      newUser.email = email
      newUser.role = UserRole.CLIENT
      newUser.status = UserStatus.ACTIVE  // ✅ FIXED: Use enum value
      newUser.profileImage = picture
      newUser.emailVerified = true
      newUser.googleId = googleId
      newUser.authProvider = "google"
      
      user = await newUser.save()
    } else {
      // USER EXISTS - Update Google info
      const updateData: any = {
        lastLogin: new Date(),
      }

      if (!user.googleId) {
        updateData.googleId = googleId
        updateData.emailVerified = true
      }

      if (picture && !user.profileImage) {
        updateData.profileImage = picture
      }

      await this.userModel.findByIdAndUpdate(user._id, updateData)
      user = await this.userModel.findById(user._id)
    }

    // ✅ NUCLEAR FIX: Cast to any
    const businesses: any[] = await this.businessModel.find({
      $or: [{ ownerId: user._id }, { adminIds: user._id }],
    }) as any

    let business: any = null
    
    if (subdomain && businesses.length > 0) {
      const found = businesses.find((b) => b.subdomain === subdomain)
      if (found) {
        business = found
      } else {
        throw new UnauthorizedException("Business not found or access denied")
      }
    } else if (businesses.length > 0) {
      business = businesses[0]
    }

    // Generate tokens
    const tokens = await this.generateTokens(
      user._id.toString(),
      user.email,
      user.role,
      business?._id?.toString(),
      business?.subdomain
    )

    // Update user with refresh token
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
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
        emailVerified: user.emailVerified,
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
        trialEndsAt: business.trialEndsAt,
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
    if (error instanceof UnauthorizedException) {
      throw error
    }
    
    console.error("Google authentication error:", error)
    throw new UnauthorizedException("Google authentication failed")
  }
}

// ==================== BUSINESS LOGIN - FIXED VERSION ====================
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

  // ✅ FIXED: Cast entire query to any
  const businesses: any[] = await this.businessModel
    .find({
      $or: [{ ownerId: user._id }, { adminIds: user._id }],
    })
    .populate("activeSubscription") as any

  if (!businesses || businesses.length === 0) {
    throw new UnauthorizedException("No business account found for this user")
  }

  // If subdomain provided, find specific business
  let business: any
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
}