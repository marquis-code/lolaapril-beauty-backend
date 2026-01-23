// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, ForbiddenException, BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import * as bcrypt from "bcryptjs"
import { User, UserDocument, UserRole, UserStatus } from "./schemas/user.schema"
import { Business, BusinessDocument } from "../business/schemas/business.schema"
import { Subscription, SubscriptionDocument } from "../business/schemas/subscription.schema"
import { RegisterDto } from "./dto/register.dto"
import { UpdateEmailDto } from "./dto/update-profile.dto"
import { LoginDto } from "./dto/login.dto"
import { UpdateProfileDto, ChangePasswordDto } from "./dto/update-profile.dto"
import { BusinessRegisterDto, BusinessLoginDto, GoogleAuthDto } from "./dto/business-register.dto"
import { OAuth2Client } from "google-auth-library"
import { AddBusinessDto } from "./dto/add-business.dto"
import { FirebaseService } from "./services/firebase.service"
import { FirebaseAuthDto } from "./dto/firebase-auth.dto"

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private firebaseService: FirebaseService,
  ) {
    this.googleClient = new OAuth2Client(this.configService.get<string>("GOOGLE_CLIENT_ID"))
  }

  // ==================== BUSINESS REGISTRATION ====================
  // async registerBusiness(registerDto: BusinessRegisterDto) {
  //   const { owner, businessName, subdomain, businessType, businessDescription, address, contact } = registerDto

  //   // Check subdomain availability
  //   const existingBusiness = await this.businessModel.findOne({ subdomain })
  //   if (existingBusiness) {
  //     throw new ConflictException("Subdomain already taken")
  //   }

  //   // Check if user exists
  //   const existingUser = await this.userModel.findOne({ email: owner.email })
  //   if (existingUser) {
  //     throw new ConflictException("User with this email already exists")
  //   }

  //   // Hash password
  //   const hashedPassword = await bcrypt.hash(owner.password, 12)

  //   // Create business owner user
  //   const user = new this.userModel({
  //     firstName: owner.firstName,
  //     lastName: owner.lastName,
  //     email: owner.email,
  //     phone: owner.phone,
  //     password: hashedPassword,
  //     role: UserRole.BUSINESS_OWNER,
  //     status: "active",
  //     authProvider: "local",
  //   })

  //   const savedUser = await user.save()

  //   // Create business
  //   const business = new this.businessModel({
  //     businessName,
  //     subdomain,
  //     businessType,
  //     businessDescription,
  //     address,
  //     contact,
  //     ownerId: savedUser._id,
  //     status: "trial",
  //     trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
  //   })

  //   const savedBusiness = await business.save()

  //   // Update user with business ownership
  //   await this.userModel.findByIdAndUpdate(savedUser._id, {
  //     $push: { ownedBusinesses: savedBusiness._id },
  //     currentBusinessId: savedBusiness._id,
  //   })

  //   // Create trial subscription
  //   await this.createTrialSubscription(savedBusiness._id.toString())

  //   // Create default tenant config
  //   await this.createDefaultTenantConfig(savedBusiness._id.toString())

  //   // Generate tokens
  //   const tokens = await this.generateTokens(
  //     savedUser._id.toString(),
  //     savedUser.email,
  //     savedUser.role,
  //     savedBusiness._id.toString(),
  //     subdomain
  //   )

  //   // Update user with refresh token
  //   await this.userModel.findByIdAndUpdate(savedUser._id, {
  //     refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
  //   })

  //   return {
  //     user: {
  //       id: savedUser._id,
  //       firstName: savedUser.firstName,
  //       lastName: savedUser.lastName,
  //       email: savedUser.email,
  //       role: savedUser.role,
  //       status: savedUser.status,
  //     },
  //     business: {
  //       id: savedBusiness._id,
  //       businessName: savedBusiness.businessName,
  //       subdomain: savedBusiness.subdomain,
  //       businessType: savedBusiness.businessType,
  //       status: savedBusiness.status,
  //       trialEndsAt: savedBusiness.trialEndsAt,
  //     },
  //     ...tokens,
  //   }
  // }


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
        status: UserStatus.ACTIVE,
        authProvider: "local",
      })
  
      const savedUser = await user.save()
  
      // Create business with default settings
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
        // ✅ Default settings are now defined in the Business schema
        settings: {
          timezone: "Africa/Lagos",
          currency: "NGN",
          language: "en",
          defaultAppointmentDuration: 30,
          bufferTimeBetweenAppointments: 15,
          cancellationPolicyHours: 24,
          advanceBookingDays: 7,
          allowOnlineBooking: true,
          requireEmailVerification: true,
          requirePhoneVerification: false,
          taxRate: 10,
          serviceCharge: 0,
          notificationSettings: {
            booking_confirmation: true,
            payment_reminders: true,
            appointment_reminders: true,
            marketing: false,
          },
        },
      })
  
      const savedBusiness = await business.save()
  
      // Update user with business ownership
      await this.userModel.findByIdAndUpdate(savedUser._id, {
        $push: { ownedBusinesses: savedBusiness._id },
        currentBusinessId: savedBusiness._id,
      })
  
      // Create trial subscription
      await this.createTrialSubscription(savedBusiness._id.toString())
  
      // ✅ REMOVED: createDefaultTenantConfig call
  
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

      // Get user without sensitive fields
      const userResponse = JSON.parse(JSON.stringify(savedUser));
      delete userResponse.password;
      delete userResponse.refreshToken;
      delete userResponse.resetPasswordOTP;
      delete userResponse.resetPasswordOTPExpires;
      delete userResponse.emailVerificationToken;
  
      return {
        user: {
          ...userResponse,
          id: savedUser._id,
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

    // Get user without sensitive fields
    const userResponse = JSON.parse(JSON.stringify(user));
    delete userResponse.password;
    delete userResponse.refreshToken;
    delete userResponse.resetPasswordOTP;
    delete userResponse.resetPasswordOTPExpires;
    delete userResponse.emailVerificationToken;

    return {
      user: {
        ...userResponse,
        id: user._id,
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

  // Get user without sensitive fields
  const userResponse = JSON.parse(JSON.stringify(user));
  delete userResponse.password;
  delete userResponse.refreshToken;
  delete userResponse.resetPasswordOTP;
  delete userResponse.resetPasswordOTPExpires;
  delete userResponse.emailVerificationToken;

  const response: any = {
    user: {
      ...userResponse,
      id: user._id,
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

// ==================== FIREBASE AUTHENTICATION ====================
/**
 * Authenticate user with Firebase ID token
 * Supports Google, Facebook, and other Firebase providers
 */
async authenticateWithFirebase(firebaseAuthDto: FirebaseAuthDto) {
  try {
    console.log('🔥 Firebase authentication started')
    
    // Verify the Firebase ID token
    const decodedToken = await this.firebaseService.verifyIdToken(firebaseAuthDto.idToken)
    
    // Extract user information
    const userInfo = this.firebaseService.extractUserInfo(decodedToken)
    const authProvider = this.firebaseService.getAuthProvider(decodedToken)
    const providerId = this.firebaseService.getProviderId(decodedToken, authProvider)
    
    console.log('📋 Firebase user info:', {
      uid: userInfo.uid,
      email: userInfo.email,
      provider: authProvider,
    })

    if (!userInfo.email) {
      throw new UnauthorizedException('Email not provided by authentication provider')
    }

    // Find user by email or provider ID
    const query: any = { email: userInfo.email }
    
    if (authProvider === 'google' && providerId) {
      query.$or = [{ email: userInfo.email }, { googleId: providerId }]
    } else if (authProvider === 'facebook' && providerId) {
      query.$or = [{ email: userInfo.email }, { facebookId: providerId }]
    }

    let user = await this.userModel.findOne(query)

    if (!user) {
      // Create new user
      console.log('👤 Creating new user from Firebase')
      
      const nameParts = (userInfo.name || '').split(' ')
      const firstName = nameParts[0] || 'User'
      const lastName = nameParts.slice(1).join(' ') || ''

      const newUser = new this.userModel({
        firstName,
        lastName,
        email: userInfo.email,
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
        profileImage: userInfo.picture,
        emailVerified: userInfo.emailVerified || true,
        authProvider,
      })

      // Set provider-specific ID
      if (authProvider === 'google' && providerId) {
        newUser.googleId = providerId
      } else if (authProvider === 'facebook' && providerId) {
        newUser.facebookId = providerId
      }

      user = await newUser.save()
      console.log('✅ New user created:', user._id)
    } else {
      // Update existing user
      console.log('🔄 Updating existing user:', user._id)
      
      const updateData: any = {
        lastLogin: new Date(),
        emailVerified: true,
      }

      // Update provider ID if not set
      if (authProvider === 'google' && providerId && !user.googleId) {
        updateData.googleId = providerId
      } else if (authProvider === 'facebook' && providerId && !user.facebookId) {
        updateData.facebookId = providerId
      }

      // Update profile image if not set
      if (userInfo.picture && !user.profileImage) {
        updateData.profileImage = userInfo.picture
      }

      if (Object.keys(updateData).length > 0) {
        await this.userModel.findByIdAndUpdate(user._id, updateData)
        user = await this.userModel.findById(user._id)
      }
    }

    // Find businesses for this user
    const businesses: any[] = await (this.businessModel as any).find({
      $or: [{ ownerId: user._id }, { adminIds: user._id }],
    }).lean().exec() as any[]

    let business: any = null

    if (firebaseAuthDto.subdomain && businesses.length > 0) {
      const found = businesses.find((b: any) => b.subdomain === firebaseAuthDto.subdomain)
      if (found) {
        business = found
      }
    } else if (businesses.length > 0) {
      business = businesses[0]
    }

    // Generate JWT tokens
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

    // Prepare user response (remove sensitive fields)
    const userResponse = (user as any).toObject()
    delete userResponse.password
    delete userResponse.refreshToken
    delete userResponse.resetPasswordOTP
    delete userResponse.resetPasswordOTPExpires
    delete userResponse.emailVerificationToken

    const response: any = {
      success: true,
      message: 'Firebase authentication successful',
      user: {
        ...userResponse,
        id: user._id,
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

    console.log('✅ Firebase authentication completed successfully')
    return response
  } catch (error) {
    console.error('❌ Firebase authentication failed:', error.message)
    throw error
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

  // private async createDefaultTenantConfig(businessId: string): Promise<void> {
  //   const config = new this.tenantConfigModel({
  //     businessId: new Types.ObjectId(businessId),
  //     brandColors: {
  //       primary: "#007bff",
  //       secondary: "#6c757d",
  //       accent: "#28a745",
  //       background: "#ffffff",
  //       text: "#333333",
  //     },
  //     typography: {
  //       fontFamily: "Inter, sans-serif",
  //       fontSize: "14px",
  //       headerFont: "Inter, sans-serif",
  //     },
  //     customization: {
  //       showBusinessLogo: true,
  //       showPoweredBy: true,
  //     },
  //     integrations: {
  //       emailProvider: "smtp",
  //       smsProvider: "twilio",
  //       paymentProvider: "paystack",
  //     },
  //   })

  //   await config.save()
  // }

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

  // Get updated user without sensitive fields
  const userResponse = JSON.parse(JSON.stringify(user));
  delete userResponse.password;
  delete userResponse.refreshToken;
  delete userResponse.resetPasswordOTP;
  delete userResponse.resetPasswordOTPExpires;
  delete userResponse.emailVerificationToken;

  return {
    user: {
      ...userResponse,
      id: user._id,
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

  // Get user without sensitive fields
  const userResponse = JSON.parse(JSON.stringify(user));
  delete userResponse.password;
  delete userResponse.refreshToken;
  delete userResponse.resetPasswordOTP;
  delete userResponse.resetPasswordOTPExpires;
  delete userResponse.emailVerificationToken;

  return {
    user: {
      ...userResponse,
      id: user._id,
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



// Add these methods to your AuthService class (auth.service.ts)

// ==================== PROFILE MANAGEMENT ====================

/**
 * Update user profile information
 */
async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
  try {
    const user = await this.userModel.findById(userId)
    
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Fields that can be updated
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'profileImage', 'bio', 'dateOfBirth', 'gender', 'preferences']
    const updates: any = {}

    // Only include fields that are provided and allowed
    Object.keys(updateProfileDto).forEach(key => {
      if (allowedUpdates.includes(key) && updateProfileDto[key] !== undefined) {
        // Convert dateOfBirth string to Date object
        if (key === 'dateOfBirth' && updateProfileDto[key]) {
          updates[key] = new Date(updateProfileDto[key])
        } else {
          updates[key] = updateProfileDto[key]
        }
      }
    })

    if (Object.keys(updates).length === 0) {
      throw new BadRequestException('No valid fields to update')
    }

    // Update user
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password -refreshToken')

    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        status: updatedUser.status,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        emailVerified: updatedUser.emailVerified,
        phoneVerified: updatedUser.phoneVerified,
        authProvider: updatedUser.authProvider,
        preferences: updatedUser.preferences,
      }
    }
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error
    }
    console.error('Profile update error:', error)
    throw new BadRequestException('Failed to update profile')
  }
}

/**
 * Update user preferences
 */
async updatePreferences(userId: string, preferences: any) {
  try {
    const user = await this.userModel.findById(userId)
    
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { 
        preferences: { ...user.preferences, ...preferences },
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    ).select('-password -refreshToken')

    return {
      success: true,
      message: 'Preferences updated successfully',
      preferences: updatedUser.preferences
    }
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error
    }
    console.error('Preferences update error:', error)
    throw new BadRequestException('Failed to update preferences')
  }
}

/**
 * Change user password
 */
async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
  try {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto

    // Validate new password matches confirmation
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirmation do not match')
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      throw new BadRequestException('New password must be different from current password')
    }

    const user = await this.userModel.findById(userId)
    
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Check if user registered with OAuth (no password)
    if (user.authProvider !== 'local' && !user.password) {
      throw new BadRequestException(
        `Cannot change password for ${user.authProvider} authenticated accounts`
      )
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      updatedAt: new Date()
    })

    // Invalidate all refresh tokens for security
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null
    })

    return {
      success: true,
      message: 'Password changed successfully. Please login again with your new password.'
    }
  } catch (error) {
    if (error instanceof NotFoundException || 
        error instanceof BadRequestException || 
        error instanceof UnauthorizedException) {
      throw error
    }
    console.error('Password change error:', error)
    throw new BadRequestException('Failed to change password')
  }
}

/**
 * Update user email
 */
async updateEmail(userId: string, updateEmailDto: UpdateEmailDto) {
  try {
    const { newEmail, password } = updateEmailDto

    const user = await this.userModel.findById(userId)
    
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Check if user registered with OAuth
    if (user.authProvider !== 'local' && !user.password) {
      throw new BadRequestException(
        `Cannot change email for ${user.authProvider} authenticated accounts. Please contact support.`
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect')
    }

    // Check if email is already in use
    const existingUser = await this.userModel.findOne({ email: newEmail })
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ConflictException('Email is already in use by another account')
    }

    // Check if email is same as current
    if (user.email === newEmail) {
      throw new BadRequestException('New email must be different from current email')
    }

    // Update email and set emailVerified to false
    await this.userModel.findByIdAndUpdate(userId, {
      email: newEmail,
      emailVerified: false, // Require re-verification
      updatedAt: new Date()
    })

    // Invalidate refresh token for security
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null
    })

    return {
      success: true,
      message: 'Email updated successfully. Please verify your new email address and login again.',
      newEmail
    }
  } catch (error) {
    if (error instanceof NotFoundException || 
        error instanceof BadRequestException || 
        error instanceof UnauthorizedException ||
        error instanceof ConflictException) {
      throw error
    }
    console.error('Email update error:', error)
    throw new BadRequestException('Failed to update email')
  }
}

/**
 * Delete user account (soft delete)
 */
async deleteAccount(userId: string, password?: string) {
  try {
    const user = await this.userModel.findById(userId)
    
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // For local auth users, verify password
    if (user.authProvider === 'local' && user.password) {
      if (!password) {
        throw new BadRequestException('Password is required to delete account')
      }
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        throw new UnauthorizedException('Password is incorrect')
      }
    }

    // Soft delete: Update status to inactive
    await this.userModel.findByIdAndUpdate(userId, {
      status: UserStatus.INACTIVE,
      refreshToken: null,
      updatedAt: new Date()
    })

    return {
      success: true,
      message: 'Account deleted successfully'
    }
  } catch (error) {
    if (error instanceof NotFoundException || 
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException) {
      throw error
    }
    console.error('Account deletion error:', error)
    throw new BadRequestException('Failed to delete account')
  }
}

// Add after the existing methods

// ==================== BUSINESS CONTEXT MANAGEMENT ====================

/**
 * Switch user's active business context
 * Issues new JWT tokens with updated business context
 */
async switchBusiness(userId: string, businessId: string) {
  const user = await this.userModel.findById(userId)
  
  if (!user) {
    throw new NotFoundException('User not found')
  }

  // Verify user has access to this business
  const hasAccess = 
    user.ownedBusinesses.some(id => id.toString() === businessId) ||
    user.adminBusinesses.some(id => id.toString() === businessId) ||
    user.staffBusinessId?.toString() === businessId

  if (!hasAccess) {
    throw new ForbiddenException('You do not have access to this business')
  }

  // Get business details
  const business = await this.businessModel.findById(businessId)
  
  if (!business) {
    throw new NotFoundException('Business not found')
  }

  if (business.status === 'suspended') {
    throw new UnauthorizedException('Business account is suspended')
  }

  if (business.status === 'expired') {
    throw new UnauthorizedException('Business subscription has expired')
  }

  // Update user's current business in database
  await this.userModel.findByIdAndUpdate(userId, {
    currentBusinessId: business._id,
  })

  // Generate new tokens with updated business context
  const tokens = await this.generateTokens(
    user._id.toString(),
    user.email,
    user.role,
    business._id.toString(),
    business.subdomain
  )

  // Update refresh token
  await this.userModel.findByIdAndUpdate(userId, {
    refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
  })

  return {
    success: true,
    message: 'Business context switched successfully',
    business: {
      id: business._id,
      businessName: business.businessName,
      subdomain: business.subdomain,
      businessType: business.businessType,
      status: business.status,
    },
    ...tokens,
  }
}

/**
 * Get all businesses user has access to
 */
// async getUserBusinesses(userId: string) {
//   const user = await this.userModel.findById(userId)
  
//   if (!user) {
//     throw new NotFoundException('User not found')
//   }

//   // Collect all business IDs user has access to
//   const businessIds = [
//     ...user.ownedBusinesses,
//     ...user.adminBusinesses,
//   ]

//   if (user.staffBusinessId) {
//     businessIds.push(user.staffBusinessId)
//   }

//   // Remove duplicates
//   const uniqueBusinessIds = [...new Set(businessIds.map(id => id.toString()))]

//   const businesses = await this.businessModel
//     .find({ _id: { $in: uniqueBusinessIds } })
//     .select('businessName subdomain businessType status trialEndsAt ownerId')
//     .lean()

//   return {
//     businesses: businesses.map(b => ({
//       id: b._id,
//       businessName: b.businessName,
//       subdomain: b.subdomain,
//       businessType: b.businessType,
//       status: b.status,
//       trialEndsAt: b.trialEndsAt,
//       isOwner: b.ownerId.toString() === userId,
//       isCurrent: b._id.toString() === user.currentBusinessId?.toString(),
//     })),
//     currentBusinessId: user.currentBusinessId,
//   }
// }

/**
 * Get all businesses user has access to
 */
async getUserBusinesses(userId: string) {
  const user = await this.userModel.findById(userId)
  
  if (!user) {
    throw new NotFoundException('User not found')
  }

  // Collect all business IDs user has access to
  const businessIds = [
    ...user.ownedBusinesses,
    ...user.adminBusinesses,
  ]

  if (user.staffBusinessId) {
    businessIds.push(user.staffBusinessId)
  }

  // Remove duplicates
  const uniqueBusinessIds = [...new Set(businessIds.map(id => id.toString()))]

  // ✅ ULTIMATE FIX: Use Model.find().exec() pattern with explicit any cast
  const businesses = await this.businessModel
    .find({ _id: { $in: uniqueBusinessIds } })
    .select('businessName subdomain businessType status trialEndsAt ownerId')
    .exec()
    .then((docs: any) => docs.map((doc: any) => doc.toObject())) as any[]

  return {
    businesses: businesses.map((b: any) => ({
      id: b._id,
      businessName: b.businessName,
      subdomain: b.subdomain,
      businessType: b.businessType,
      status: b.status,
      trialEndsAt: b.trialEndsAt,
      isOwner: b.ownerId?.toString() === userId,
      isCurrent: b._id?.toString() === user.currentBusinessId?.toString(),
    })),
    currentBusinessId: user.currentBusinessId,
  }
}

/**
 * Clear business context (for switching to client mode)
 */
async clearBusinessContext(userId: string) {
  const user = await this.userModel.findById(userId)
  
  if (!user) {
    throw new NotFoundException('User not found')
  }

  // Update user to remove current business
  await this.userModel.findByIdAndUpdate(userId, {
    currentBusinessId: null,
  })

  // Generate new tokens without business context
  const tokens = await this.generateTokens(
    user._id.toString(),
    user.email,
    user.role
  )

  // Update refresh token
  await this.userModel.findByIdAndUpdate(userId, {
    refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
  })

  return {
    success: true,
    message: 'Business context cleared successfully',
    ...tokens,
  }
}


async addBusinessToUser(userId: string, addBusinessDto: AddBusinessDto) {
  const { businessName, subdomain, businessType, businessDescription, address, contact } = addBusinessDto

  // Verify user exists and get user details
  const user = await this.userModel.findById(userId)
  if (!user) {
    throw new NotFoundException('User not found')
  }

  // Check subdomain availability
  const existingBusiness = await this.businessModel.findOne({ subdomain })
  if (existingBusiness) {
    throw new ConflictException('Subdomain already taken')
  }

  // Create new business with user as owner
  const business = new this.businessModel({
    businessName,
    subdomain,
    businessType,
    businessDescription,
    address,
    contact,
    ownerId: user._id,
    status: 'trial',
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
    settings: {
      timezone: 'Africa/Lagos',
      currency: 'NGN',
      language: 'en',
      defaultAppointmentDuration: 30,
      bufferTimeBetweenAppointments: 15,
      cancellationPolicyHours: 24,
      advanceBookingDays: 7,
      allowOnlineBooking: true,
      requireEmailVerification: true,
      requirePhoneVerification: false,
      taxRate: 10,
      serviceCharge: 0,
      notificationSettings: {
        booking_confirmation: true,
        payment_reminders: true,
        appointment_reminders: true,
        marketing: false,
      },
    },
  })

  const savedBusiness = await business.save()

  // Update user's owned businesses
  await this.userModel.findByIdAndUpdate(userId, {
    $push: { ownedBusinesses: savedBusiness._id },
  })

  // Create trial subscription for new business
  await this.createTrialSubscription(savedBusiness._id.toString())

  // Generate new tokens with business context
  const tokens = await this.generateTokens(
    user._id.toString(),
    user.email,
    user.role,
    savedBusiness._id.toString(),
    subdomain
  )

  // Update user with new current business and refresh token
  await this.userModel.findByIdAndUpdate(userId, {
    refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
    currentBusinessId: savedBusiness._id,
  })

  return {
    success: true,
    message: 'Business added successfully',
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

  // ==================== PASSWORD RESET ====================
  
  /**
   * Generate random 6-digit OTP
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate and send password reset OTP
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    
    if (!user) {
      // Don't reveal if user exists for security
      return {
        success: true,
        message: 'If an account with that email exists, a password reset OTP has been sent.',
      };
    }

    // Generate 6-digit OTP
    const otp = this.generateOTP();

    // Hash the OTP before storing
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Save OTP and expiry to user (valid for 15 minutes)
    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordOTPExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // TODO: Send OTP via email/SMS
    // await this.notificationService.sendPasswordResetOTP(user.email, otp);

    console.log('🔐 Password reset OTP generated:', {
      email: user.email,
      otp: otp, // Remove this in production - only for development
      expiresAt: user.resetPasswordOTPExpires,
    });

    return {
      success: true,
      message: 'If an account with that email exists, a password reset OTP has been sent.',
    };
  }

  /**
   * Verify if OTP is valid
   */
  async verifyResetOTP(email: string, otp: string): Promise<{ valid: boolean; message: string }> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return { valid: false, message: 'Invalid or expired OTP' };
    }

    // Check if OTP has expired
    if (user.resetPasswordOTPExpires < new Date()) {
      return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }

    // Verify the OTP matches
    const otpMatches = await bcrypt.compare(otp, user.resetPasswordOTP);
    
    if (!otpMatches) {
      return { valid: false, message: 'Invalid OTP' };
    }

    return {
      valid: true,
      message: 'OTP is valid',
    };
  }

  /**
   * Reset password using valid OTP
   */
  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Check if OTP has expired
    if (user.resetPasswordOTPExpires < new Date()) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Verify the OTP matches
    const otpMatches = await bcrypt.compare(otp, user.resetPasswordOTP);
    
    if (!otpMatches) {
      throw new BadRequestException('Invalid OTP');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    user.refreshToken = undefined; // Invalidate all sessions
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    // TODO: Send confirmation email
    // await this.notificationService.sendPasswordResetConfirmation(user.email);

    return {
      success: true,
      message: 'Password has been reset successfully. Please login with your new password.',
    };
  }
}
