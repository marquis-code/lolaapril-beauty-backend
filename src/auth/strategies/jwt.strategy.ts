

// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ExtractJwt, Strategy } from "passport-jwt"
import { User, type UserDocument } from "../schemas/user.schema"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: any) {
    console.log('🔐 JWT Payload:', payload)
    
    const user = await this.userModel.findById(payload.sub)
    
    console.log('👤 User found:', user ? `${user._id} - ${user.email}` : 'NOT FOUND')
    
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    
    const result = { 
      userId: payload.sub,              // ✅ For AuditInterceptor
      sub: payload.sub,                 // For compatibility
      email: payload.email, 
      role: payload.role,
      businessId: payload.businessId,   // Include business context
      subdomain: payload.subdomain      // Include subdomain
    }
    
    console.log('✅ Validated user:', result)
    
    return result
  }
}