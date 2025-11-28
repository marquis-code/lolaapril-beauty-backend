// src/modules/tenant/tenant.module.ts
import { Module, Global, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TenantController } from './tenant.controller'
import { TenantService } from './tenant.service'
import { TenantMiddleware } from './middleware/tenant.middleware'
import { TenantRateLimitMiddleware } from './middleware/rate-limit.middleware'
import { Business, BusinessSchema } from './schemas/business.schema'
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema'
import { TenantConfig, TenantConfigSchema } from './schemas/tenant-config.schema'
import { Booking, BookingSchema } from '../booking/schemas/booking.schema'
import { User, UserSchema } from "../auth/schemas/user.schema"

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: TenantConfig.name, schema: TenantConfigSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TenantController],
  providers: [
    TenantService,
  ],
  exports: [
    TenantService,
    MongooseModule,
  ],
})
export class TenantModule {
  configure(consumer: MiddlewareConsumer) {
    // First apply tenant middleware
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'api/tenant/check-subdomain', method: RequestMethod.GET },
        { path: 'api/auth/(.*)', method: RequestMethod.ALL },
        { path: 'health', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })

    // Then apply rate limiting middleware (runs after tenant middleware)
    consumer
      .apply(TenantRateLimitMiddleware)
      .exclude(
        { path: 'api/tenant/check-subdomain', method: RequestMethod.GET },
        { path: 'api/auth/(.*)', method: RequestMethod.ALL },
        { path: 'health', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}