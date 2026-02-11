// src/modules/auth/auth.module.ts
import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { User, UserSchema } from './schemas/user.schema'
import { Business, BusinessSchema } from '../business/schemas/business.schema'
import { Subscription, SubscriptionSchema } from '../business/schemas/subscription.schema'
// ✅ REMOVED: TenantConfig import

import { JwtStrategy } from './strategies/jwt.strategy'
import { GoogleStrategy } from './strategies/google.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { ValidateBusinessAccessGuard } from './guards/validate-business-access.guard'
import { BusinessAuthGuard, BusinessRolesGuard } from './guards/business-auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { OptionalAuthGuard } from './guards/optional-auth.guard'
import { FirebaseService } from './services/firebase.service'

/**
 * AuthModule - Made Global
 * 
 * This module is now global (@Global() decorator) so that:
 * 1. Guards can be used in APP_GUARD (app.module.ts)
 * 2. Decorators and guards are available in all modules
 * 3. No need to import AuthModule in every feature module
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Business.name, schema: BusinessSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      // ✅ REMOVED: TenantConfig schema registration
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Services
    AuthService,
    FirebaseService,

    // Strategies
    JwtStrategy,
    GoogleStrategy,

    // Guards
    JwtAuthGuard,
    ValidateBusinessAccessGuard,
    BusinessAuthGuard,
    BusinessRolesGuard,
    RolesGuard,
    OptionalAuthGuard,

    // Reflector for guards
    Reflector,
  ],
  exports: [
    // Export service for other modules
    AuthService,
    FirebaseService,

    // Export guards for manual use if needed
    JwtAuthGuard,
    ValidateBusinessAccessGuard,
    BusinessAuthGuard,
    BusinessRolesGuard,
    RolesGuard,
    OptionalAuthGuard,
  ],
})
export class AuthModule { }