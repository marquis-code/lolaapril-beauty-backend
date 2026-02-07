import { Module, Global, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BusinessController } from './business.controller'
import { BusinessService } from './business.service'
import { Business, BusinessSchema } from './schemas/business.schema'
import { User, UserSchema } from '../auth/schemas/user.schema'
import { IntegrationModule } from '../integration/integration.module'
import { BrandingModule } from '../branding/branding.module'
import { ServiceModule } from '../service/service.module'
import { StaffModule } from '../staff/staff.module'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: User.name, schema: UserSchema }
    ]),
    IntegrationModule,
    forwardRef(() => BrandingModule),
    forwardRef(() => ServiceModule),
    forwardRef(() => StaffModule),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService, MongooseModule]
})
export class BusinessModule {}
