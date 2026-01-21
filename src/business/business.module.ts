import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BusinessController } from './business.controller'
import { BusinessService } from './business.service'
import { Business, BusinessSchema } from './schemas/business.schema'
import { User, UserSchema } from '../auth/schemas/user.schema'
import { IntegrationModule } from '../integration/integration.module'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: User.name, schema: UserSchema }
    ]),
    IntegrationModule,
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService, MongooseModule]
})
export class BusinessModule {}
