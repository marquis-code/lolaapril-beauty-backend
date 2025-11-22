
// src/modules/tenant/tenant.module.ts
import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TenantController } from './tenant.controller'
import { TenantService } from './tenant.service'
import { Business, BusinessSchema } from './schemas/business.schema'
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema'
import { TenantConfig, TenantConfigSchema } from './schemas/tenant-config.schema'
import { User, UserSchema } from "../auth/schemas/user.schema"

@Global() // Make tenant services available globally
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: TenantConfig.name, schema: TenantConfigSchema },
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
export class TenantModule {}