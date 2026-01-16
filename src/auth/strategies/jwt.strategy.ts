

// // src/modules/auth/strategies/jwt.strategy.ts
// import { Injectable, UnauthorizedException } from "@nestjs/common"
// import { PassportStrategy } from "@nestjs/passport"
// import { InjectModel } from "@nestjs/mongoose"
// import { Model } from "mongoose"
// import { ExtractJwt, Strategy } from "passport-jwt"
// import { User, type UserDocument } from "../schemas/user.schema"
// import { JwtPayload } from "../types/request-with-user.interface"

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET,
//     })
//   }

//   async validate(payload: any): Promise<JwtPayload> {
//     console.log('🔐 JWT Payload received:', payload)
    
//     // Verify user exists
//     const user = await this.userModel.findById(payload.sub)
    
//     if (!user) {
//       console.error('❌ User not found for ID:', payload.sub)
//       throw new UnauthorizedException('User not found')
//     }

//     // Check if user is active
//     if (user.status !== 'active') {
//       console.error('❌ User account is not active:', user.status)
//       throw new UnauthorizedException('Account is not active')
//     }
    
//     console.log('👤 User validated:', {
//       id: user._id,
//       email: user.email,
//       role: user.role
//     })
    
//     // Build the JWT payload that will be attached to req.user
//     const validatedPayload: JwtPayload = {
//       sub: payload.sub,
//       userId: payload.sub, // Duplicate for compatibility with different patterns
//       email: payload.email,
//       role: payload.role,
//     }

//     // Include business context if present in the token
//     if (payload.businessId) {
//       validatedPayload.businessId = payload.businessId
//       console.log('🏢 Business context included:', {
//         businessId: payload.businessId,
//         subdomain: payload.subdomain
//       })
//     }

//     if (payload.subdomain) {
//       validatedPayload.subdomain = payload.subdomain
//     }
    
//     console.log('✅ Final validated payload:', validatedPayload)
    
//     return validatedPayload
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
    console.log('🔐 JWT Strategy - Raw payload:', JSON.stringify(payload, null, 2))
    
    // Verify user exists
    const user = await this.userModel.findById(payload.sub)
    
    if (!user) {
      console.error('❌ JWT Strategy - User not found for ID:', payload.sub)
      throw new UnauthorizedException('User not found')
    }

    // Check if user is active
    if (user.status !== 'active') {
      console.error('❌ JWT Strategy - User account is not active:', user.status)
      throw new UnauthorizedException('Account is not active')
    }
    
    console.log('👤 JWT Strategy - User validated:', {
      id: user._id,
      email: user.email,
      role: user.role
    })
    
    // Build the JWT payload that will be attached to req.user
    const validatedPayload: JwtPayload = {
      sub: payload.sub,
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    }

    // Include business context if present in the token
    if (payload.businessId) {
      validatedPayload.businessId = payload.businessId
      console.log('🏢 JWT Strategy - Business context found:', {
        businessId: payload.businessId,
        subdomain: payload.subdomain
      })
    } else {
      console.log('ℹ️  JWT Strategy - No business context in token')
    }

    if (payload.subdomain) {
      validatedPayload.subdomain = payload.subdomain
    }
    
    console.log('✅ JWT Strategy - Final payload:', JSON.stringify(validatedPayload, null, 2))
    
    return validatedPayload
  }
}