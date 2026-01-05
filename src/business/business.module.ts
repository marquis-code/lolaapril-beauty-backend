import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BusinessController } from './business.controller'
import { BusinessService } from './business.service'
import { Business, BusinessSchema } from './schemas/business.schema'
import { User, UserSchema } from '../auth/schemas/user.schema'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService, MongooseModule]
})
export class BusinessModule {}
