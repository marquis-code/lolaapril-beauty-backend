import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ServiceService } from "./service.service"
import { ServiceController } from "./service.controller"
import { ServiceCategory, ServiceCategorySchema } from "./schemas/service-category.schema"
import { Service, ServiceSchema } from "./schemas/service.schema"
import { ServiceBundle, ServiceBundleSchema } from "./schemas/service-bundle.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceCategory.name, schema: ServiceCategorySchema },
      { name: Service.name, schema: ServiceSchema },
      { name: ServiceBundle.name, schema: ServiceBundleSchema },
    ]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
