import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ServiceService } from "../service/service.service"
import { ServiceController } from "../service/service.controller"
import { ServiceCategory, ServiceCategorySchema } from "../service/schemas/service-category.schema"
import { Service, ServiceSchema } from "../service/schemas/service.schema"
import { ServiceBundle, ServiceBundleSchema } from "../service/schemas/service-bundle.schema"
import { Business, BusinessSchema } from '../business/schemas/business.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceCategory.name, schema: ServiceCategorySchema },
      { name: Service.name, schema: ServiceSchema },
      { name: ServiceBundle.name, schema: ServiceBundleSchema },
      { name: Business.name, schema: BusinessSchema },
    ]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
