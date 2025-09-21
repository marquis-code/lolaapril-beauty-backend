import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { ExtractJwt, Strategy } from "passport-jwt"
import { User, type UserDocument } from "../schemas/user.schema"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'access-secret',
    })
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub)
    if (!user) {
      throw new UnauthorizedException()
    }
    return { userId: payload.sub, email: payload.email, role: payload.role }
  }
}
