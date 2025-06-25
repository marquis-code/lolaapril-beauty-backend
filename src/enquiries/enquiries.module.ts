import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { EnquiriesService } from "./enquiries.service"
import { EnquiriesController } from "./enquiries.controller"
import { Enquiry, EnquirySchema } from "./schemas/enquiry.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: Enquiry.name, schema: EnquirySchema }])],
  providers: [EnquiriesService],
  controllers: [EnquiriesController],
})
export class EnquiriesModule {}
