// src/modules/auth/auth.module.ts
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { PassportModule } from "@nestjs/passport"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { Business, BusinessSchema } from "../tenant/schemas/business.schema"
import { Subscription, SubscriptionSchema } from "../tenant/schemas/subscription.schema"
import { TenantConfig, TenantConfigSchema } from "../tenant/schemas/tenant-config.schema"
import { User, UserSchema } from "./schemas/user.schema"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { GoogleStrategy } from "./strategies/google.strategy"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Business.name, schema: BusinessSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: TenantConfig.name, schema: TenantConfigSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}