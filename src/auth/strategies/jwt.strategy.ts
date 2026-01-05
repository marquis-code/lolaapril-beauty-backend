

// // src/modules/auth/strategies/jwt.strategy.ts
// import { Injectable, UnauthorizedException } from "@nestjs/common"
// import { PassportStrategy } from "@nestjs/passport"
// import { InjectModel } from "@nestjs/mongoose"
// import { Model } from "mongoose"
// import { ExtractJwt, Strategy } from "passport-jwt"
// import { User, type UserDocument } from "../schemas/user.schema"

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET,
//     })
//   }

//   async validate(payload: any) {
//     console.log('🔐 JWT Payload:', payload)
    
//     const user = await this.userModel.findById(payload.sub)
    
//     console.log('👤 User found:', user ? `${user._id} - ${user.email}` : 'NOT FOUND')
    
//     if (!user) {
//       throw new UnauthorizedException('User not found')
//     }
    
//     const result = { 
//       userId: payload.sub,              // ✅ For AuditInterceptor
//       sub: payload.sub,                 // For compatibility
//       email: payload.email, 
//       role: payload.role,
//       businessId: payload.businessId,   // Include business context
//       subdomain: payload.subdomain      // Include subdomain
//     }
    
//     console.log('✅ Validated user:', result)
    
//     return result
//   }
// }

// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ExtractJwt, Strategy } from "passport-jwt"
import { User, type UserDocument } from "../schemas/user.schema"
import { JwtPayload } from "../types/request-with-user.interface"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: any): Promise<JwtPayload> {
    console.log('🔐 JWT Payload received:', payload)
    
    // Verify user exists
    const user = await this.userModel.findById(payload.sub)
    
    if (!user) {
      console.error('❌ User not found for ID:', payload.sub)
      throw new UnauthorizedException('User not found')
    }

    // Check if user is active
    if (user.status !== 'active') {
      console.error('❌ User account is not active:', user.status)
      throw new UnauthorizedException('Account is not active')
    }
    
    console.log('👤 User validated:', {
      id: user._id,
      email: user.email,
      role: user.role
    })
    
    // Build the JWT payload that will be attached to req.user
    const validatedPayload: JwtPayload = {
      sub: payload.sub,
      userId: payload.sub, // Duplicate for compatibility with different patterns
      email: payload.email,
      role: payload.role,
    }

    // Include business context if present in the token
    if (payload.businessId) {
      validatedPayload.businessId = payload.businessId
      console.log('🏢 Business context included:', {
        businessId: payload.businessId,
        subdomain: payload.subdomain
      })
    }

    if (payload.subdomain) {
      validatedPayload.subdomain = payload.subdomain
    }
    
    console.log('✅ Final validated payload:', validatedPayload)
    
    return validatedPayload
  }
}