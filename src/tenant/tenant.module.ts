// // src/modules/tenant/tenant.module.ts
// import { Module, Global } from '@nestjs/common'
// import { MongooseModule } from '@nestjs/mongoose'
// import { TenantController } from './tenant.controller'
// import { TenantService } from './tenant.service'
// import { TenantMiddleware } from './middleware/tenant.middleware'
// import { TenantGuard } from './guards/tenant.guard'
// import { BusinessOwnerGuard } from './guards/business-owner.guard'
// import { SubscriptionFeatureGuard } from './guards/subscription-feature.guard'
// import { Business, BusinessSchema } from './schemas/business.schema'
// import { Subscription, SubscriptionSchema } from './schemas/subscription.schema'
// import { TenantConfig, TenantConfigSchema } from './schemas/tenant-config.schema'

// @Global() // Make tenant services available globally
// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Business.name, schema: BusinessSchema },
//       { name: Subscription.name, schema: SubscriptionSchema },
//       { name: TenantConfig.name, schema: TenantConfigSchema },
//     ]),
//   ],
//   controllers: [TenantController],
//   providers: [
//     TenantService,
//     TenantMiddleware,
//     TenantGuard,
//     BusinessOwnerGuard,
//     SubscriptionFeatureGuard,
//   ],
//   exports: [
//     TenantService,
//     TenantMiddleware,
//     TenantGuard,
//     BusinessOwnerGuard,
//     SubscriptionFeatureGuard,
//   ],
// })
// export class TenantModule {}

// src/modules/tenant/tenant.module.ts
import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TenantController } from './tenant.controller'
import { TenantService } from './tenant.service'
import { Business, BusinessSchema } from './schemas/business.schema'
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema'
import { TenantConfig, TenantConfigSchema } from './schemas/tenant-config.schema'

@Global() // Make tenant services available globally
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: TenantConfig.name, schema: TenantConfigSchema },
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