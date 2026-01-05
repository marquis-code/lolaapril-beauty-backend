import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema'
import { Business, BusinessSchema } from '../business/schemas/business.schema'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Business.name, schema: BusinessSchema }
    ])
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService, MongooseModule]
})
export class SubscriptionModule {}